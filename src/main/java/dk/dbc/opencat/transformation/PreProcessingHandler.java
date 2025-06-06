package dk.dbc.opencat.transformation;

import dk.dbc.common.records.CatalogExtractionCode;
import dk.dbc.common.records.MarcRecordReader;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.marc.binding.DataField;
import dk.dbc.marc.binding.Field;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.binding.SubField;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.opencat.OpenCatException;
import dk.dbc.opencat.dao.RecordService;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class PreProcessingHandler {
    private static final Pattern AGE_INTERVAL_PATTERN = Pattern.compile("^(For|for) ([0-9]+)-([0-9]+) (år)");
    private static final List<String> LIST_OF_CATALOG_CODES_WITHOUT_DBF =
            CatalogExtractionCode.listOfCatalogCodes.stream().filter(v -> !v.equals("DBF")).collect(Collectors.toList());

    private final RecordService recordService;

    public PreProcessingHandler(RecordService recordService) {
        this.recordService = recordService;
    }

    public void preProcess(MarcRecord record) throws UnsupportedEncodingException, OpenCatException, RecordServiceConnectorException, MarcReaderException {
        final MarcRecordReader reader = new MarcRecordReader(record);

        // Pre-processing should only be performed on 870970 records owned by DBC
        if (RecordService.COMMON_AGENCY == reader.getAgencyIdAsInt() && reader.hasValue("996", 'a', "DBC")) {
            processAgeInterval(record, reader);
            processCodeForEBooks(record, reader);
            processISBNFromPreviousEdition(record, reader);
            processSupplierRelations(record, reader);

            new MarcRecordWriter(record).sort();
        }
    }

    /**
     * This function expands/writes out the age interval in 666 *u
     * <p>
     * Rule:
     * If there is a 666 *u subfield that matches 'For x-y år' then
     * 1) Remove all 666 *u subfields
     * 2)add new '666 00 *u For z år' subfield for each year between x and y (including both)
     * <p>
     * If there is no matching subfield then nothing is done to the record
     *
     * @param record The record to be processed
     * @param reader Reader for record
     */
    private void processAgeInterval(MarcRecord record, MarcRecordReader reader) {
        final List<Matcher> matchers = reader.getSubfieldValueMatchers("666", 'u', AGE_INTERVAL_PATTERN);

        if (!matchers.isEmpty()) {
            // First remove all 666 *u subfields that are in the matchers - there are a large number of 666*u that has content
            // not containing year information. Now, it will be the users' responsibility to clean up existing year fields (cleared with LJL)
            remove666UFields(record, matchers);
        }

        for (Matcher m : matchers) {
            final String forString = m.group(1);
            int year = Integer.parseInt(m.group(2));
            final int endYear = Integer.parseInt(m.group(3));
            final String yearString = m.group(4);

            while (year <= endYear) {
                // The message could have been 'For %s år' instead of '%s %s %s' however the capitalization of
                // 'for' in the age subfield must be the same as in the original 666 *u subfield,
                // so we reuse text from the input instead
                record.getFields().add(getNewMarcField666(String.format("%s %s %s", forString, year, yearString)));
                year++;
            }
        }
    }

    /**
     * This function adds a code (008 *w1) to mark the record is an e-book, if it is an e-book
     * <p>
     * Rule:
     * Must be a 870790 record
     * The record is not a volume or section record
     * It is an e-book
     * The record is not already marked as an e-book
     * <p>
     * If the conditions are not met or 008 *w1 already exists then nothing is done to the record
     *
     * @param record The record to be processed
     * @param reader Reader for record
     */
    private void processCodeForEBooks(MarcRecord record, MarcRecordReader reader) {
        // This pre-processing action can only add 008 *w1 - so if the subfield already exists then there is no point in continuing
        if (reader.hasValue("008", 'w', "1")) {
            return;
        }

        // This pre-processing is not applicable to volume or section records
        final String bibliographicRecordType = reader.getValue("004", 'a');
        if ("b".equals(bibliographicRecordType) || "s".equals(bibliographicRecordType)) {
            return;
        }

        // 009 *aa = text
        // 009 *gxe = online
        // 008 *tp = periodica
        // 008 *uo = not complete periodica
        if ("a".equals(reader.getValue("009", 'a')) && "xe".equals(reader.getValue("009", 'g')) &&
                !"p".equals(reader.getValue("008", 't')) && !"o".equals(reader.getValue("008", 'u'))) {
            final MarcRecordWriter writer = new MarcRecordWriter(record);
            writer.addOrReplaceSubField("008", 'w', "1");
        }
    }

    /**
     * All text (009 *a a) and sound (009 *a r) must be pre-processed so ISBN from previous records (520 *n or 526 *n) are written
     * to this record as well. If a previous edition is found in 520*n or 526*n then all values from 021*a and *e must be copied
     * from the previous record.
     * <p>
     * A couple of things to note:
     * Field 520 and 526 are repeatable
     * Subfield 520*n and 526*n are repeatable
     * Subfield 021*a and *e are repeatable
     *
     * @param record The record to be processed
     * @param reader Reader for record
     * @throws OpenCatException             If rawrepo throws exception
     */
    private void processISBNFromPreviousEdition(MarcRecord record, MarcRecordReader reader) throws OpenCatException, RecordServiceConnectorException, MarcReaderException {
        // This record has field 520 or 526 which means it might be a text or sound record
        if (reader.hasSubfield("520", 'n') || reader.hasSubfield("526", 'n')) {
            // This record is indeed a text or sound record
            if (reader.hasValue("009", 'a', "a") || reader.hasValue("009", 'a', "r")) {
                updateWithISBNFromPreviousEdition(record, reader);
            } else if (reader.hasValue("004", 'a', "b")) {
                // If the record has a head volume and that head volume is text or sound, then process the 520 and 526 field anyway
                final MarcRecordReader parentReader = getHeadVolumeId(reader);

                if (parentReader != null && (parentReader.hasValue("009", 'a', "a") || parentReader.hasValue("009", 'a', "r"))) {
                    updateWithISBNFromPreviousEdition(record, reader);
                }
            }
        }
    }

    /**
     * This function attempts to find the parent head volume. If there is no parent or the top parent isn't a head volume
     * then null is returned.
     *
     * @param reader MarcRecordReader of the record to find the parent for
     * @return MarcRecord if there is a head volume in the top parent hierarchy else null
     * @throws OpenCatException             If rawrepo throws exception
     */
    private MarcRecordReader getHeadVolumeId(MarcRecordReader reader) throws OpenCatException, RecordServiceConnectorException, MarcReaderException {
        // Check if input record even has a parent
        if (reader.getParentRecordId() == null) {
            return null;
        }

        if (!recordService.recordExists(reader.getParentRecordId(), RecordService.COMMON_AGENCY)) {
            final String message = String.format("Den overliggende post (%s:%s) findes ikke", reader.getParentRecordId(), RecordService.COMMON_AGENCY);
            throw new OpenCatException(message);
        }

        final MarcRecord parent = recordService.fetchRecord(reader.getParentRecordId(), RecordService.COMMON_AGENCY);
        final MarcRecordReader parentReader = new MarcRecordReader(parent);

        if (parentReader.hasValue("004", 'a', "h")) { // Parent is a head volume - so return that
            return parentReader;
        } else if (parentReader.hasValue("004", 'a', "s")) {
            if (parentReader.getParentRecordId() == null) { // Parent is a section volume - check if that record has a parent
                // No parent to the section volume - it shouldn't really happen, but it might
                return null;
            } else {
                // Parent to the section volume is found - we assume it is a head volume
                final MarcRecord nextParent = recordService.fetchRecord(parentReader.getParentRecordId(), RecordService.COMMON_AGENCY);

                return new MarcRecordReader(nextParent);
            }
        }

        return null;
    }

    /**
     * This function loops over all 520 and 526 fields in the input record and add *r subfield to those field for each ISBN found in the
     * records in 520/526 *n references
     *
     * @param record The record to update
     * @param reader MarcRecordReader of the record
     * @throws OpenCatException             If rawrepo throws exception
     */
    private void updateWithISBNFromPreviousEdition(MarcRecord record, MarcRecordReader reader) throws OpenCatException, RecordServiceConnectorException, MarcReaderException {
        final List<DataField> newMarcFieldList = new ArrayList<>();
        final List<DataField> originalMarcFieldList = new ArrayList<>();
        originalMarcFieldList.addAll(reader.getFieldAll("520"));
        originalMarcFieldList.addAll(reader.getFieldAll("526"));

        for (DataField originalMarcField : originalMarcFieldList) {
            final DataField newMarcField = new DataField(originalMarcField); // Clone the field so we can manipulate it while looping
            for (SubField subField : originalMarcField.getSubFields()) {
                if ('n' == subField.getCode() && recordService.recordExists(subField.getData(), RecordService.COMMON_AGENCY)) {
                    final List<String> isbnFromCommonRecord = getISBNFromCommonRecord(subField.getData());
                    for (String isbn : isbnFromCommonRecord) {
                        final SubField subfieldR = new SubField('r', isbn);
                        if (!originalMarcField.getSubFields().contains(subfieldR)) {
                            newMarcField.getSubFields().add(subfieldR);
                        }
                    }
                }
            }
            newMarcFieldList.add(newMarcField);
        }

        new MarcRecordWriter(record).removeField("520");
        new MarcRecordWriter(record).removeField("526");
        record.getFields().addAll(newMarcFieldList);
    }

    /**
     * Given a bibliographicRecordId this function retrieves that record from agency 870970 and returns a list of
     * subfield 021 *a and *e values.
     *
     * @param bibliographicRecordId The id of the record to find
     * @return List of values from subfield 021 *a and *e
     * @throws OpenCatException             If rawrepo throws exception
     */
    private List<String> getISBNFromCommonRecord(String bibliographicRecordId) throws OpenCatException, RecordServiceConnectorException, MarcReaderException {
        final List<String> result = new ArrayList<>();
        final MarcRecord marcRecord = recordService.fetchRecord(bibliographicRecordId, RecordService.COMMON_AGENCY);
        final MarcRecordReader marcRecordReader = new MarcRecordReader(marcRecord);

        // If this record has the ISBN fields then get ISBN from this record
        if (marcRecordReader.hasSubfield("021", 'a') || marcRecordReader.hasSubfield("021", 'e')) {
            return getISBNsFromRecord(marcRecordReader);
        } else if (marcRecordReader.hasValue("004", 'a', "b")) {
            // If this record doesn't have ISBN field, and it is a volume record then look at the parent head volume
            final MarcRecordReader parentReader = getHeadVolumeId(marcRecordReader);

            if (parentReader != null && (parentReader.hasSubfield("021", 'a') || parentReader.hasSubfield("021", 'e'))) {
                return getISBNsFromRecord(parentReader);
            }
        }

        return result;
    }

    /**
     * Given a MarcRecordReader this function returns a list of all values from subfield 021 *a and *e from that record
     *
     * @param reader MarcRecordReader of the record to find the subfields in
     * @return List of values from subfield 021 *a and *e. List is empty if no subfield is found
     */
    private List<String> getISBNsFromRecord(MarcRecordReader reader) {
        final List<String> result = new ArrayList<>();
        for (DataField field21 : reader.getFieldAll("021")) {
            for (SubField subField21 : field21.getSubFields()) {
                if ('a' == subField21.getCode() || 'e' == subField21.getCode()) {
                    final String previousISBN = subField21.getData();
                    result.add(previousISBN);
                }
            }
        }

        return result;
    }

    private void remove666UFields(MarcRecord record, List<Matcher> matchers) {
        final List<DataField> fieldsToRemove = new ArrayList<>();

        for (DataField field : record.getFields(DataField.class)) {
            if ("666".equals(field.getTag()) && field.hasSubField(DataField.hasSubFieldCode('u'))) {
                    String subFieldValue = field.getSubField(DataField.hasSubFieldCode('u')).orElseThrow().getData();
                    for (Matcher matcher : matchers) {
                        if (subFieldValue.equalsIgnoreCase(matcher.group(1) + " " + matcher.group(2) + "-" + matcher.group(3) + " " + matcher.group(4))) {
                            fieldsToRemove.add(field);
                            break;
                        }
                    }
                }

        }

        record.getFields().removeAll(fieldsToRemove);
    }

    private Field getNewMarcField666(String value) {
        final SubField subfieldU = new SubField('u', value);

        final List<SubField> subfields = new ArrayList<>();
        subfields.add(subfieldU);

        return new DataField("666", "00").addAllSubFields(subfields);
    }

    private String getSubfieldValue008(MarcRecordReader reader, char subfield) throws RecordServiceConnectorException, MarcReaderException, OpenCatException {
        String subfield008Content = reader.getValue("008", subfield);
        if (subfield008Content == null) {
            MarcRecordReader parentReader = getHeadVolumeId(reader);
            if (parentReader != null) {
                subfield008Content = parentReader.getValue("008", subfield);
            }
        }
        return subfield008Content;

    }

    /**
     * Collect *b from 990 fields and add them to a new d90 - the 990 fields are removed
     * @param reader a reader to the record
     * @param record the marc record
     * @param newSubfields collector for subfields *b
     */
    private void cleanUp990(MarcRecordReader reader, MarcRecord record, List<SubField> newSubfields) {
        // Combine all 990 fields without *r into one single 990 field with all *b subfields
        for (DataField field990Original : findField990(reader)) {
            // Add new d90 field
            DataField fieldd90 = new DataField(field990Original); // Clone field
            fieldd90.setTag("d90");
            record.getFields().add(fieldd90);

            for (SubField subField : field990Original.getSubFields()) {
                if ('b' == subField.getCode() && !newSubfields.contains(subField)) {
                    newSubfields.add(new SubField(subField));
                }
            }
            record.getFields().remove(field990Original);
        }

    }

    /**
     * Processes the content of 008 *p *u modifying the 990 field and moving earlier 990 fields to d90 historic
     * @param record the record to handle
     * @param reader a nice little reader
     * @throws OpenCatException                If rawrepo throws exception
     * @throws RecordServiceConnectorException No connection to recordservice
     * @throws MarcReaderException             Problems reading from therecord
     */
    private void processSupplierRelations(MarcRecord record, MarcRecordReader reader) throws OpenCatException, RecordServiceConnectorException, MarcReaderException {
        if (reader.hasSubfield("990", 'b') &&
                CatalogExtractionCode.isUnderProduction(record, LIST_OF_CATALOG_CODES_WITHOUT_DBF)) {
            final MarcRecordWriter writer = new MarcRecordWriter(record);
            String subfield008u = getSubfieldValue008(reader, 'u');
            // We need to do the following :
            // if there is a *pr all is good, and we can set f008pIsr to true
            // if not, then we have to look for a *pr and set f008pIsr to true or false
            // if subfield 008p is null we must look after it in parent as usual
            // Life isn't easy - there can be both a *u and a *p. If u is f and no p, then add nt -
            // u is f and p is r (only allowed value) then add op.

            // The Line has exclaimed that if a 008p exists, it will forever only contain an r.
            if(getSubfieldValue008(reader, 'p') != null) {
                List<SubField> newSubfields = new ArrayList<>();
                if (reader.hasValue("990", '&', "1")) {
                    writer.removeSubfield("990", '&');
                } else {
                    cleanUp990(reader, record, newSubfields);
                    newSubfields.add(new SubField('u', "op"));
                    record.getFields().add(new DataField("990", "00").addAllSubFields(newSubfields));
                }
            } else {
                if (Arrays.asList("f", "c", "d", "o").contains(subfield008u)) {
                    writer.addOrReplaceSubField("990", 'u', "nt"); // First edition
                } else if ("u".equals(subfield008u)) {
                    if (reader.hasValue("990", '&', "1")) {
                        writer.removeSubfield("990", '&');
                    } else {
                        writer.addOrReplaceSubField("990", 'u', "nu"); // New edition
                    }
                }
            }
        }
    }

    /**
     * This function returns the first 990 field which doesn't have subfield *r.
     * <p>
     * *r indicated a correction of the field, so the field 990 without *r is probably the original field 990
     *
     * @param reader MarcRecordReader object
     * @return MarcField if conditions are met otherwise null
     */
    private List<DataField> findField990(MarcRecordReader reader) {
        final List<DataField> result = new ArrayList<>();
        for (DataField field : reader.getFieldAll("990")) {
            if (!field.hasSubField(DataField.hasSubFieldCode('r'))) {
                result.add(new DataField(field));
            }
        }

        return result;
    }
}
