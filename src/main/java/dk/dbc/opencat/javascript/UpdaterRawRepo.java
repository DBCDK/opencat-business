/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.rawrepo.dto.RecordCollectionDTOv2;
import dk.dbc.rawrepo.dto.RecordDTO;
import dk.dbc.rawrepo.dto.RecordIdDTO;
import dk.dbc.rawrepo.record.RecordServiceConnector;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;
import dk.dbc.rawrepo.record.RecordServiceConnectorFactory;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
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
     * @throws RecordServiceConnectorException RecordServiceConnectorException
     */
    public static Boolean recordExists(String recordId, String libraryNo) throws RecordServiceConnectorException {
        logger.entry(recordId, libraryNo);
        final boolean result;
        final StopWatch watch = new Log4JStopWatch("rawrepo.recordExists");
        result = recordServiceConnector.recordExists(libraryNo, recordId);
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
     * @throws UnsupportedEncodingException    UnsupportedEncodingException
     */
    public static MarcRecord fetchRecord(String recordId, String libraryNo) throws UnsupportedEncodingException, RecordServiceConnectorException {
        logger.entry(recordId, libraryNo);
        final StopWatch watch = new Log4JStopWatch("rawrepo.fetchRecord");
        final MarcRecord result;
        if (recordExists(recordId, libraryNo)) {
            RecordServiceConnector.Params params = new RecordServiceConnector.Params();
            params.withMode(RecordServiceConnector.Params.Mode.RAW);
            final byte[] content = recordServiceConnector.getRecordContent(Integer.parseInt(libraryNo), recordId, params);
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
     * @param bibliographicRecordId String
     * @param agencyId              String
     * @return List of MarcRecords
     * @throws UnsupportedEncodingException    UnsupportedEncodingException
     * @throws RecordServiceConnectorException RecordServiceConnectorException
     */
    public static List<MarcRecord> getRelationsChildren(String bibliographicRecordId, String agencyId) throws RecordServiceConnectorException, UnsupportedEncodingException {
        logger.entry(bibliographicRecordId, agencyId);
        final StopWatch watch = new Log4JStopWatch("rawrepo.getRelationsChildren");
        final List<RecordIdDTO> recordIds = Arrays.asList(recordServiceConnector.getRecordChildren(agencyId, bibliographicRecordId));
        final List<MarcRecord> children = new ArrayList<>();

        final RecordCollectionDTOv2 recordCollectionDTO = recordServiceConnector.fetchRecordList(recordIds);
        for (RecordDTO recordDTO : recordCollectionDTO.getFound()) {
            children.add(RecordContentTransformer.decodeRecord(recordDTO.getContent()));
        }

        watch.stop();
        logger.exit(children);
        return children;
    }

}
