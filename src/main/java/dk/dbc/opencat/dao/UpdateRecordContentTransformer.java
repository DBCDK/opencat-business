package dk.dbc.opencat.dao;

import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.reader.DanMarc2LineFormatReader;
import dk.dbc.marc.reader.JsonReader;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.marc.reader.MarcXchangeV1Reader;
import dk.dbc.marc.writer.JsonLineWriter;
import dk.dbc.marc.writer.MarcWriterException;
import dk.dbc.marc.writer.MarcXchangeV1Writer;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.rest.JSRestPortal;
import jakarta.xml.bind.JAXBException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/*
This class is brutally stolen from updateservice where it replaced the :
import dk.dbc.common.records.utils.RecordContentTransformer;
Will die in a couple of years
 */
public class UpdateRecordContentTransformer {

    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);

    public static MarcRecord decodeRecord(byte[] content) throws ScripterException {
        final ByteArrayInputStream buf = new ByteArrayInputStream(content);
        final MarcXchangeV1Reader reader;
        try {
            reader = new MarcXchangeV1Reader(buf, StandardCharsets.UTF_8);

            return reader.read();
        } catch (MarcReaderException e) {
            throw new ScripterException(e.getMessage(), e);
        }
    }

    public static byte[] encodeRecord(MarcRecord marcRecord) {
        final MarcXchangeV1Writer marcXchangeV1Writer = new MarcXchangeV1Writer();
        return marcXchangeV1Writer.write(marcRecord, StandardCharsets.UTF_8);
    }

    public static byte[] encodeRecordToJson(MarcRecord marcRecord) throws ScripterException {
        final JsonLineWriter writer = new JsonLineWriter();
        try {
            return writer.write(marcRecord, StandardCharsets.UTF_8);
        } catch (MarcWriterException e) {
            throw new ScripterException(e.getMessage(), e);
        }
    }

    public static MarcRecord readRecordFromString(String line) throws ScripterException {
        final ByteArrayInputStream buf = new ByteArrayInputStream(line.getBytes());

        final DanMarc2LineFormatReader reader = new DanMarc2LineFormatReader(buf, StandardCharsets.UTF_8);

        try {
            return reader.read();
        } catch (MarcReaderException e) {
            throw new ScripterException(e.getMessage(), e);
        }
    }

    public static InputStream toStream(String s) {
        return new ByteArrayInputStream(s.getBytes(StandardCharsets.UTF_8));
    }

    public static String marcJsonToMarcXml(String marcJson) throws MarcReaderException {
        try {
            // TODO CLEANUP
            LOGGER.debug("INDI {}", marcJson);
            JsonReader reader = new JsonReader(toStream(marcJson));
            MarcRecord mm = reader.read();
            LOGGER.debug("JUHUU {}", mm.getFields().toString());
            return mm.getFields().toString();
        } catch (MarcReaderException ex) {
            LOGGER.debug("WTF", ex);
        }
        return "";
    }
}
