
package dk.dbc.opencat.transformation;

import dk.dbc.common.records.CatalogExtractionCode;
import dk.dbc.common.records.MarcField;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.MarcRecordReader;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.common.records.MarcSubField;
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
    private final static XLogger logger = XLoggerFactory.getXLogger(MetaCompassHandler.class);
    private final static List<String> metakompasSubFieldsToCopy = Arrays.asList("e", "p");
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
    public MarcRecord enrichMetaCompassRecord(MarcRecord minimalMetaCompassRecord) throws UnsupportedEncodingException, OpenCatException, RecordServiceConnectorException {
        logger.info("Got metakompas template so updated the request record.");
        logger.info("Input metakompas record: \n{}", minimalMetaCompassRecord);

        final MarcRecordReader reader = new MarcRecordReader(minimalMetaCompassRecord);

        if (!recordService.recordExists(reader.getRecordId(), reader.getAgencyIdAsInt())) {
            throw new OpenCatException(String.format("Posten %s:%s findes ikke eller er slettet", reader.getRecordId(), reader.getAgencyId()));
        }
        final MarcRecord fullMetakompassRecord = recordService.fetchMergedDBCRecord(reader.getRecordId(), RecordService.DBC_ENRICHMENT);
        final MarcRecordWriter fullMetakompassRecordWriter = new MarcRecordWriter(fullMetakompassRecord);

        final List<MarcField> fields664 = reader.getFieldAll("664");
        final List<MarcField> fields665 = reader.getFieldAll("665");

        if (!fields664.isEmpty()) {
            fullMetakompassRecordWriter.removeField("664");
            fullMetakompassRecord.getFields().addAll(fields664);
        }
        if (!fields665.isEmpty()) {
            fullMetakompassRecordWriter.removeField("665");
            fullMetakompassRecord.getFields().addAll(fields665);
        }

        boolean hasAdded666Subfield = false;
        /*
         * If the record is not yet published and the record is sent from metakompas then copy relevant 665 subfields to 666.
         *
         * Note that in order to be able manually edit the copied 666 subfields the copy only happens when using the
         * metakompas schema.
         */
        if (!CatalogExtractionCode.isPublished(fullMetakompassRecord)) {
            hasAdded666Subfield = copyMetakompasFields(fullMetakompassRecord);
        }

        // If no 666 subfields are updated (either because there was no change or because the record is published) then
        // we must add *z98 Minus korrekturprint to suppress unnecessary proof printing
        if (!hasAdded666Subfield) {
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
        boolean hasAdded666Subfield = false;
        final List<MarcSubField> subfieldsToCopy = new ArrayList<>();
        final List<MarcField> fields665 = record.getFields().stream().
                filter(field -> "665".equals(field.getName())).
                collect(Collectors.toList());

        for (MarcField field : fields665) {
            if (field.getSubfields().stream().
                    anyMatch(subfield -> "&".equals(subfield.getName()) && "LEKTOR".equalsIgnoreCase(subfield.getValue()))) {
                for (MarcSubField subfield : field.getSubfields()) {
                    // 665 *q -> 666 *q
                    if ("q".equals(subfield.getName())) {
                        subfieldsToCopy.add(new MarcSubField("q", subfield.getValue()));
                    }

                    // 665 *i -> 666 *i is year interval, otherwise *i -> *s
                    if ("i".equals(subfield.getName())) {
                        if (isYearInterval(subfield.getValue())) {
                            subfieldsToCopy.add(new MarcSubField("i", subfield.getValue()));
                        } else {
                            subfieldsToCopy.add(new MarcSubField("s", subfield.getValue()));
                        }
                    }

                    // 665 *e/*p -> 666 *s
                    if (metakompasSubFieldsToCopy.contains(subfield.getName())) {
                        subfieldsToCopy.add(new MarcSubField("s", subfield.getValue()));
                    }

                    // 665 *g -> 666 *o
                    if ("g".equals(subfield.getName())) {
                        subfieldsToCopy.add(new MarcSubField("o", subfield.getValue()));
                    }

                    // 665 *v -> 666 *h
                    if ("v".equals(subfield.getName())) {
                        subfieldsToCopy.add(new MarcSubField("h", subfield.getValue()));
                    }
                }
            }
        }

        if (subfieldsToCopy.size() > 0) {
            logger.info("Found {} number of 665 subfield to copy", subfieldsToCopy);
            final List<MarcField> fields666 = record.getFields().stream().
                    filter(field -> "666".equals(field.getName())).
                    collect(Collectors.toList());

            for (MarcSubField subfieldToCopy : subfieldsToCopy) {
                boolean hasSubfield = false;
                for (MarcField field666 : fields666) {
                    if (field666.getSubfields().contains(subfieldToCopy)) {
                        hasSubfield = true;
                        break;
                    }
                }

                if (!hasSubfield) {
                    record.getFields().add(new MarcField("666", "00", Collections.singletonList(subfieldToCopy)));
                    hasAdded666Subfield = true;
                }
            }
        }

        return hasAdded666Subfield;
    }

    static void addMinusProofPrinting(MarcRecord record) {
        new MarcRecordWriter(record).addOrReplaceSubfield("z98", "a", "Minus korrekturprint");
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
