/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.rawrepo.RecordId;
import dk.dbc.rawrepo.RecordServiceConnector;
import dk.dbc.rawrepo.RecordServiceConnectorException;
import dk.dbc.rawrepo.RecordServiceConnectorFactory;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * This class exports a RawRepo instance to the JavaScript environment.
 *
 * @author stp
 */
public class UpdaterRawRepo {
    private static final XLogger logger = XLoggerFactory.getXLogger(UpdaterRawRepo.class);
    private static final RecordServiceConnector recordServiceConnector =
            RecordServiceConnectorFactory.create(System.getenv("RAWREPO_RECORD_SERVICE_URL"));

    /**
     * Checks if a record exists in the rawrepo.
     *
     * @param recordId  The record id from 001a to identify the record.
     * @param libraryNo The library no from 001b to identify the record.
     * @return <code>true</code> if the record exists, <code>false</code>
     * otherwise.
     * @throws RecordServiceConnectorException  RecordServiceConnectorException
     */
    public static Boolean recordExists(String recordId, String libraryNo) throws RecordServiceConnectorException {
        logger.entry(recordId, libraryNo);
        boolean result;
        StopWatch watch = new Log4JStopWatch("rawrepo.recordExists");
        result =  recordServiceConnector.recordExists(libraryNo, recordId);
        watch.stop();
        logger.exit(result);
        return result;
    }

    /**
     * Fetch a record from the rawrepo.
     * <p>
     * If the record does not exist, it is created.
     *
     * @param recordId  The record id from 001a to identify the record.
     * @param libraryNo The library no from 001b to identify the record.
     * @return The record.
     * @throws RecordServiceConnectorException RecordServiceConnectorException
     * @throws UnsupportedEncodingException UnsupportedEncodingException
     */
    public static MarcRecord fetchRecord(String recordId, String libraryNo) throws UnsupportedEncodingException, RecordServiceConnectorException {
        logger.entry(recordId, libraryNo);
        StopWatch watch = new Log4JStopWatch("rawrepo.fetchRecord");
        MarcRecord result;
        if (recordExists(libraryNo, recordId)) {
            byte[] content  = recordServiceConnector.getRecordContent(Integer.parseInt(libraryNo), recordId);
            result = RecordContentTransformer.decodeRecord(content);
        } else {
            result = new MarcRecord();
        }
        watch.stop();
        logger.exit(result);
        return result;
    }

    /**
     * List of MarcRecords
     *
     * @param recordId  String
     * @param libraryNo String
     * @return List of MarcRecords
     * @throws UnsupportedEncodingException UnsupportedEncodingException
     * @throws RecordServiceConnectorException RecordServiceConnectorException
     */
    public static List<MarcRecord> getRelationsChildren(String recordId, String libraryNo) throws UnsupportedEncodingException, RecordServiceConnectorException {
        logger.entry(recordId, libraryNo);
        StopWatch watch = new Log4JStopWatch("rawrepo.getRelationsChildren");
        RecordId[] recordIds = recordServiceConnector.getRecordChildren(libraryNo, recordId);
        List<MarcRecord> children = new ArrayList<MarcRecord>();
        for (RecordId childRecordId: recordIds) {
            children.add(fetchRecord(childRecordId.getBibliographicRecordId(), String.valueOf(childRecordId.getAgencyId())));
        }
        watch.stop();
        logger.exit(children);
        return children;
    }
}
