package dk.dbc.opencat.transformation;

import dk.dbc.common.records.CatalogExtractionCode;
import dk.dbc.common.records.MarcRecordReader;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.marc.binding.DataField;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.binding.SubField;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.opencat.OpenCatException;
import dk.dbc.opencat.dao.RecordService;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class MetaCompassHandler {
    private static final XLogger logger = XLoggerFactory.getXLogger(MetaCompassHandler.class);
    private static final List<Character> metakompasSubFieldsToCopy = Arrays.asList('e', 'p');
    private final RecordService recordService;

    public MetaCompassHandler(RecordService recordService) {
        this.recordService = recordService;
    }

    /**
     * This function handles the situation where metakompas sends a minimal record to updateservice
     * <p>
     * The metakompas templates only allow fields 001, 004 and 665. The template is used only by the metakompas application.
     * <p>
     * When metakompas template is used we need to load the existing record and then use that with replaced 665 field from the input
     * <p>
     * Additionally, certain 665 subfields are copied to 666 subfields.
     *
     * @param minimalMetaCompassRecord The record to process
     * @return The record to be used for the rest if the execution
     * @throws UnsupportedEncodingException    Thrown if the record has wrong encoding
     * @throws OpenCatException                Thrown when the record doesn't exist - don't expect it to happen because the
     *                                         enrichMetakompasRecord function will catch this too.
     * @throws RecordServiceConnectorException Thrown if unexpected exception in RecordServiceConnector
     */
    public MarcRecord enrichMetaCompassRecord(MarcRecord minimalMetaCompassRecord) throws UnsupportedEncodingException, OpenCatException, RecordServiceConnectorException, MarcReaderException {
        logger.info("Got metakompas template so updated the request record.");
        logger.info("Input metakompas record: \n{}", minimalMetaCompassRecord);

        final MarcRecordReader reader = new MarcRecordReader(minimalMetaCompassRecord);

        if (!recordService.recordExists(reader.getRecordId(), reader.getAgencyIdAsInt())) {
            throw new OpenCatException(String.format("Posten %s:%s findes ikke eller er slettet", reader.getRecordId(), reader.getAgencyId()));
        }
        final MarcRecord fullMetakompassRecord = recordService.fetchMergedDBCRecord(reader.getRecordId(), RecordService.DBC_ENRICHMENT);
        final MarcRecordWriter fullMetakompassRecordWriter = new MarcRecordWriter(fullMetakompassRecord);

        final List<DataField> fields664 = reader.getFieldAll("664");
        final List<DataField> fields665 = reader.getFieldAll("665");

        if (!fields664.isEmpty()) {
            fullMetakompassRecordWriter.removeField("664");
            fullMetakompassRecord.getFields().addAll(fields664);
        }
        if (!fields665.isEmpty()) {
            fullMetakompassRecordWriter.removeField("665");
            fullMetakompassRecord.getFields().addAll(fields665);
        }

        boolean hasAdded666SubField = false;
        /*
         * If the record is not yet published and the record is sent from metakompas then copy relevant 665 subfields to 666.
         *
         * Note that in order to be able manually edit the copied 666 subfields the copy only happens when using the
         * metakompas schema.
         */
        if (!CatalogExtractionCode.isPublished(fullMetakompassRecord)) {
            hasAdded666SubField = copyMetakompasFields(fullMetakompassRecord);
        }

        // If no 666 subfields are updated (either because there was no change or because the record is published) then
        // we must add *z98 Minus korrekturprint to suppress unnecessary proof printing
        if (!hasAdded666SubField) {
            addMinusProofPrinting(fullMetakompassRecord);
        }

        fullMetakompassRecordWriter.sort();

        logger.info("Output metakompas record: \n{}", fullMetakompassRecord);

        return fullMetakompassRecord;
    }

    /**
     * If the record is still under production then all 665 *q, *e, *i and *g subfields must be copied to 666
     */
    static boolean copyMetakompasFields(MarcRecord record) {
        boolean hasAdded666SubField = false;
        final List<SubField> subfieldsToCopy = new ArrayList<>();
        final List<DataField> fields665 = record.getFields(DataField.class).stream().
                filter(field -> "665".equals(field.getTag())).
                collect(Collectors.toList());

        for (DataField field : fields665) {
            if (field.getSubFields().stream().
                    anyMatch(subfield -> '&' == subfield.getCode() && "LEKTOR".equalsIgnoreCase(subfield.getData()))) {
                for (SubField subfield : field.getSubFields()) {
                    // 665 *q -> 666 *q
                    if ('q' == subfield.getCode()) {
                        subfieldsToCopy.add(new SubField('q', subfield.getData()));
                    }

                    // 665 *i -> 666 *i is year interval, otherwise *i -> *s
                    if ('i' == subfield.getCode()) {
                        if (isYearInterval(subfield.getData())) {
                            subfieldsToCopy.add(new SubField('i', subfield.getData()));
                        } else {
                            subfieldsToCopy.add(new SubField('s', subfield.getData()));
                        }
                    }

                    // 665 *e/*p -> 666 *s
                    if (metakompasSubFieldsToCopy.contains(subfield.getCode())) {
                        subfieldsToCopy.add(new SubField('s', subfield.getData()));
                    }

                    // 665 *g -> 666 *o
                    if ('g' == subfield.getCode()) {
                        subfieldsToCopy.add(new SubField('o', subfield.getData()));
                    }

                    // 665 *v -> 666 *h
                    if ('v' == subfield.getCode()) {
                        subfieldsToCopy.add(new SubField('h', subfield.getData()));
                    }
                }
            }
        }

        if (!subfieldsToCopy.isEmpty()) {
            logger.info("Found {} number of 665 subfield to copy", subfieldsToCopy);
            final List<DataField> fields666 = record.getFields(DataField.class).stream().
                    filter(field -> "666".equals(field.getTag())).
                    collect(Collectors.toList());

            for (SubField subfieldToCopy : subfieldsToCopy) {
                boolean hasSubField = false;
                for (DataField field666 : fields666) {
                    if (field666.getSubFields().contains(subfieldToCopy)) {
                        hasSubField = true;
                        break;
                    }
                }

                if (!hasSubField) {
                    record.getFields().add(new DataField("666", "00").addAllSubFields(Collections.singletonList(subfieldToCopy)));
                    hasAdded666SubField = true;
                }
            }
        }

        return hasAdded666SubField;
    }

    static void addMinusProofPrinting(MarcRecord record) {
        new MarcRecordWriter(record).addOrReplaceSubField("z98", 'a', "Minus korrekturprint");
    }

    /**
     * Check if a string matches the year interval pattern
     *
     * @param value The string to check
     * @return True if the pattern matches otherwise False
     */
    static boolean isYearInterval(String value) {
        return value.matches("\\d+-\\d+");
    }

}
