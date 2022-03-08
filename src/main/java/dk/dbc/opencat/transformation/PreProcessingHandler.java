/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.transformation;

import dk.dbc.common.records.CatalogExtractionCode;
import dk.dbc.common.records.MarcField;
import dk.dbc.common.records.MarcFieldReader;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.MarcRecordReader;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.common.records.MarcSubField;
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

    public void preProcess(MarcRecord record) throws UnsupportedEncodingException, OpenCatException, RecordServiceConnectorException {
        final MarcRecordReader reader = new MarcRecordReader(record);

        // Pre-processing should only be performed on 870970 records owned by DBC
        if (RecordService.COMMON_AGENCY == reader.getAgencyIdAsInt() && reader.hasValue("996", "a", "DBC")) {
            processAgeInterval(record, reader);
            processCodeForEBooks(record, reader);
            processFirstOrNewEdition(record, reader);
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
        final List<Matcher> matchers = reader.getSubfieldValueMatchers("666", "u", AGE_INTERVAL_PATTERN);

        if (matchers.size() > 0) {
            // First remove all 666 *u subfields that are in the matchers - there are a large number of 666*u that has content
            // not containing year information. Not, it will be the users' responsibility to clean up existing year fields (cleared with LJL)
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
     * It is a e-book
     * The record is not already marked as an e-book
     * <p>
     * If the conditions are not met or 008 *w1 already exists then nothing is done to the record
     *
     * @param record The record to be processed
     * @param reader Reader for record
     */
    private void processCodeForEBooks(MarcRecord record, MarcRecordReader reader) {
        // This pre-processing action can only add 008 *w1 - so if the subfield already exists then there is no point in continuing
        if (reader.hasValue("008", "w", "1")) {
            return;
        }

        // This pre-processing is not applicable to volume or section records
        final String bibliographicRecordType = reader.getValue("004", "a");
        if ("b".equals(bibliographicRecordType) || "s".equals(bibliographicRecordType)) {
            return;
        }

        // 009 *aa = text
        // 009 *gxe = online
        // 008 *tp = periodica
        // 008 *uo = not complete periodica
        if ("a".equals(reader.getValue("009", "a")) && "xe".equals(reader.getValue("009", "g")) &&
                !"p".equals(reader.getValue("008", "t")) && !"o".equals(reader.getValue("008", "u"))) {
            final MarcRecordWriter writer = new MarcRecordWriter(record);
            writer.addOrReplaceSubfield("008", "w", "1");
        }
    }

    /**
     * When a record is created the specific type of edition is set in 008*u. However when the record is updated 008*u
     * can be set to the value 'r' which means updated. When the existing record is either a first edition or new edition that
     * indicator must remain visible on the record. This is done by adding 008*&.
     * <p>
     * Rule:
     * Must be a 870970 record
     * Record doesn't already have 008*&
     * Edition is updated (not new or first edition)
     * <p>
     * Note: The first edition indicator should be only be applied if the release status (008 *u) is no longer first edition.
     *
     * @param record The record to be processed
     * @param reader Reader for record
     */
    private void processFirstOrNewEdition(MarcRecord record, MarcRecordReader reader) throws UnsupportedEncodingException, RecordServiceConnectorException {
        // 008*u = Release status
        // r = updated but unchanged edition
        // u = new edition
        // f = first edition
        String subfield008u = reader.getValue("008", "u");
        // *& is repeatable and have different meaning so we have to match the specific values
        final boolean has008AmpersandF = reader.hasValue("008", "&", "f");
        final boolean has008AmpersandU = reader.hasValue("008", "&", "u");
        if ("r".equals(subfield008u) && // Update edition
                !(has008AmpersandF || has008AmpersandU) && // Doesn't already have indicator
                recordService.recordExistsMaybeDeleted(reader.getRecordId(), reader.getAgencyIdAsInt())) { // Record exists
            // Note that creating a new record with 008 *u = r must be handled manually
            final MarcRecord existingRecord = recordService.fetchRecord(reader.getRecordId(), reader.getAgencyIdAsInt());
            final MarcRecordReader existingReader = new MarcRecordReader(existingRecord);
            final String existingSubfield008u = existingReader.getValue("008", "u");
            final String existingSubfield250a = existingReader.getValue("250", "a"); // Edition description

            if ("f".equals(existingSubfield008u)) {
                update008AmpersandEdition(record, "f");
            } else if ("u".equals(existingSubfield008u)) {
                update008AmpersandEdition(record, "u");
            } else if ("r".equals(existingSubfield008u)) {
                if (existingSubfield250a == null) {
                    update008AmpersandEdition(record, "f");
                } else if (existingSubfield250a.contains("1.")) { // as in "1. edition"
                    // "i.e." means corrected edition description.
                    // It is therefor assumed that "1. edition" combined with "corrected edition" means the record is an edition update and not a first edition
                    // See http://praxis.dbc.dk/formatpraksis/px-for1862.html/#-250a-udgavebetegnelse for more details
                    if (existingSubfield250a.contains("i.e.")) {
                        update008AmpersandEdition(record, "u");
                    } else {
                        update008AmpersandEdition(record, "f");
                    }
                } else {
                    // Field 520 contains several subfield which can hold a lot of text
                    // So in order to look for a string "somewhere" in 520 we have to loop through all the subfields
                    final MarcField field520 = existingReader.getField("520");
                    if (field520 != null) {
                        for (MarcSubField subField : field520.getSubfields()) {
                            if (subField.getValue().contains("idligere")) {
                                update008AmpersandEdition(record, "u");
                                break;
                            }
                        }
                    }
                }
            }
            // If someone updates the a first edition record then 008 *u must be manually changed to the value u
            // And in that case the 008 *& should be changed to indicate new edition
        } else if ("u".equals(subfield008u) && reader.hasValue("008", "&", "f")) {
            update008AmpersandEdition(record, "u");
        }
    }

    /**
     * All text (009 *a a) and sound (009 a* r) must be pre-processed so ISBN from previous records (520 *n) are written
     * to this record as well. If a previous edition is found in 520*n then all values from 021*a and *e must be copied
     * from the previous record.
     * <p>
     * A couple of things to note:
     * Field 520 is repeatable
     * Subfield 520*n is repeatable
     * Subfield 021*a and *e are repeatable
     *
     * @param record The record to be processed
     * @param reader Reader for record
     * @throws OpenCatException             If rawrepo throws exception
     * @throws UnsupportedEncodingException If the previous record can't be decoded
     */
    private void processISBNFromPreviousEdition(MarcRecord record, MarcRecordReader reader) throws OpenCatException, UnsupportedEncodingException, RecordServiceConnectorException {
        // This record has field 520 which means it might be a text or sound record
        if (reader.hasSubfield("520", "n")) {
            // This record is indeed a text or sound record
            if (reader.hasValue("009", "a", "a") || reader.hasValue("009", "a", "r")) {
                update520WithISBNFromPreviousEdition(record, reader);
            } else if (reader.hasValue("004", "a", "b")) {
                // If the record has a head volume and that head volume is text or sound, then process the 520 field anyway
                final MarcRecordReader parentReader = getHeadVolumeId(reader);

                if (parentReader != null && (parentReader.hasValue("009", "a", "a") || parentReader.hasValue("009", "a", "r"))) {
                    update520WithISBNFromPreviousEdition(record, reader);
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
     * @throws UnsupportedEncodingException If the previous record can't be decoded
     */
    private MarcRecordReader getHeadVolumeId(MarcRecordReader reader) throws OpenCatException, UnsupportedEncodingException, RecordServiceConnectorException {
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

        if (parentReader.hasValue("004", "a", "h")) { // Parent is a head volume - so return that
            return parentReader;
        } else if (parentReader.hasValue("004", "a", "s")) {
            if (parentReader.getParentRecordId() == null) { // Parent is a section volume - check if that record has a parent
                // No parent to the section volume - it shouldn't really happen but it might
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
     * This function loops over all 520 field in the input record and add 520 *r subfield for each ISBN found in the
     * records in 520 *n references
     *
     * @param record The record to update
     * @param reader MarcRecordReader of the record
     * @throws OpenCatException             If rawrepo throws exception
     * @throws UnsupportedEncodingException If the previous record can't be decoded
     */
    private void update520WithISBNFromPreviousEdition(MarcRecord record, MarcRecordReader reader) throws OpenCatException, UnsupportedEncodingException, RecordServiceConnectorException {
        final List<MarcField> newSubfield520List = new ArrayList<>();
        for (MarcField field520 : reader.getFieldAll("520")) {
            final MarcField newSubfield520 = new MarcField(field520); // Clone the field so we can manipulate it while looping
            for (MarcSubField subField : field520.getSubfields()) {
                if ("n".equals(subField.getName()) && recordService.recordExists(subField.getValue(), RecordService.COMMON_AGENCY)) {
                    final List<String> isbnFromCommonRecord = getISBNFromCommonRecord(subField.getValue());
                    for (String isbn : isbnFromCommonRecord) {
                        final MarcSubField subfieldR = new MarcSubField("r", isbn);
                        if (!field520.getSubfields().contains(subfieldR)) {
                            newSubfield520.getSubfields().add(subfieldR);
                        }
                    }
                }
            }
            newSubfield520List.add(newSubfield520);
        }

        new MarcRecordWriter(record).removeField("520");
        record.getFields().addAll(newSubfield520List);
    }

    /**
     * Given a bibliographicRecordId this function retrieves that record from agency 870970 and returns a list of
     * subfield 021 *a and *e values.
     *
     * @param bibliographicRecordId The id of the record to find
     * @return List of values from subfield 021 *a and *e
     * @throws OpenCatException             If rawrepo throws exception
     * @throws UnsupportedEncodingException If the previous record can't be decoded
     */
    private List<String> getISBNFromCommonRecord(String bibliographicRecordId) throws OpenCatException, UnsupportedEncodingException, RecordServiceConnectorException {
        final List<String> result = new ArrayList<>();
        final MarcRecord record520 = recordService.fetchRecord(bibliographicRecordId, RecordService.COMMON_AGENCY);
        final MarcRecordReader record520Reader = new MarcRecordReader(record520);

        // If this record has the ISBN fields then get ISBN from this record
        if (record520Reader.hasSubfield("021", "a") || record520Reader.hasSubfield("021", "e")) {
            return getISBNsFromRecord(record520Reader);
        } else if (record520Reader.hasValue("004", "a", "b")) {
            // If this record doesn't have ISBN field and it is a volume record then look at the parent head volume
            final MarcRecordReader parentReader = getHeadVolumeId(record520Reader);

            if (parentReader != null && (parentReader.hasSubfield("021", "a") || parentReader.hasSubfield("021", "e"))) {
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
        for (MarcField field21 : reader.getFieldAll("021")) {
            for (MarcSubField subField21 : field21.getSubfields()) {
                if ("a".equals(subField21.getName()) || "e".equals(subField21.getName())) {
                    final String previousISBN = subField21.getValue();
                    result.add(previousISBN);
                }
            }
        }

        return result;
    }

    /**
     * Field 008 can have up to three different *& subfields which all have different meaning.
     * So in order to change between "first edition" and "new edition" we have to either update the existing *& with the
     * opposite value or add a new *&.
     * Simply using addOrReplace will lead to bad things
     *
     * @param record The record which should be updated
     * @param value  The new value for *&
     */
    private void update008AmpersandEdition(MarcRecord record, String value) {
        final MarcRecordReader reader = new MarcRecordReader(record);
        // There is no reason to continue if the field already has the correct value
        if (!reader.hasValue("008", "&", value)) {
            final MarcField field = reader.getField("008");
            // Here we know that there isn't a 008 *& with the input value
            // However there might be a *& with the opposite value (u <> f)
            final String oppositeValue = "u".equals(value) ? "f" : "u";
            if (reader.hasValue("008", "&", oppositeValue)) {
                for (MarcSubField subField : field.getSubfields()) {
                    if ("&".equals(subField.getName()) && oppositeValue.equals(subField.getValue())) {
                        subField.setValue(value);
                        break;
                    }
                }
            } else {
                // If there isn't a *& for either value or opposite value then just add a new *& subfield
                field.getSubfields().add(new MarcSubField("&", value));
            }
        }
    }

    private void remove666UFields(MarcRecord record, List<Matcher> matchers) {
        final List<MarcField> fieldsToRemove = new ArrayList<>();

        for (MarcField field : record.getFields()) {
            if ("666".equals(field.getName())) {
                MarcFieldReader fieldReader = new MarcFieldReader(field);
                if (fieldReader.hasSubfield("u")) {
                    String subFieldValue = fieldReader.getValue("u");
                    for (Matcher matcher : matchers) {
                        if (subFieldValue.equalsIgnoreCase(matcher.group(1) + " " + matcher.group(2) + "-"+ matcher.group(3) + " " + matcher.group(4))) {
                            fieldsToRemove.add(field);
                            break;
                        }
                    }
                }
            }
        }

        record.getFields().removeAll(fieldsToRemove);
    }

    private MarcField getNewMarcField666(String value) {
        final MarcSubField subfieldU = new MarcSubField("u", value);

        final List<MarcSubField> subfields = new ArrayList<>();
        subfields.add(subfieldU);

        return new MarcField("666", "00", subfields);
    }

    private void processSupplierRelations(MarcRecord record, MarcRecordReader reader) throws OpenCatException, UnsupportedEncodingException, RecordServiceConnectorException {
        if (reader.hasSubfield("990", "b") &&
                CatalogExtractionCode.isUnderProduction(record, LIST_OF_CATALOG_CODES_WITHOUT_DBF)) {
            final MarcRecordWriter writer = new MarcRecordWriter(record);
            String subfield008u = reader.getValue("008", "u");
            // If this record doesn't have 008 *u then see if there is on the parent head volume
            if (subfield008u == null) {
                MarcRecordReader parentReader = getHeadVolumeId(reader);
                if (parentReader != null) {
                    subfield008u = parentReader.getValue("008", "u");
                }
            }
            if (Arrays.asList("f", "c", "d", "o").contains(subfield008u) && !reader.hasSubfield("990", "i")) {
                writer.addOrReplaceSubfield("990", "u", "nt"); // First edition
            } else if ("u".equals(subfield008u) && !reader.hasSubfield("990", "i")) {
                if (reader.hasValue("990", "&", "1")) {
                    writer.removeSubfield("990", "&");
                } else {
                    writer.addOrReplaceSubfield("990", "u", "nu"); // New edition
                }
            } else if ("r".equals(subfield008u) && !reader.hasSubfield("990", "i")) {
                if (reader.hasValue("990", "&", "1")) {
                    writer.removeSubfield("990", "&");
                } else {
                    List<MarcSubField> newSubfields = new ArrayList<>();

                    // Combine all 990 fields without *r into one single 990 field with all *b subfields
                    for (MarcField field990Original : findField990(reader)) {
                        // Add new d90 field
                        MarcField fieldd90 = new MarcField(field990Original); // Clone field
                        fieldd90.setName("d90");
                        record.getFields().add(fieldd90);

                        for (MarcSubField subField : field990Original.getSubfields()) {
                            if ("b".equals(subField.getName()) && !newSubfields.contains(subField)) {
                                newSubfields.add(new MarcSubField(subField));
                            }
                        }

                        record.getFields().remove(field990Original);
                    }

                    newSubfields.add(new MarcSubField("u", "op"));
                    record.getFields().add(new MarcField("990", "00", newSubfields));
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
    private List<MarcField> findField990(MarcRecordReader reader) {
        final List<MarcField> result = new ArrayList<>();
        for (MarcField field : reader.getFieldAll("990")) {
            MarcFieldReader fieldReader = new MarcFieldReader(field);
            if (!fieldReader.hasSubfield("r")) {
                result.add(new MarcField(field));
            }
        }

        return result;
    }
}
