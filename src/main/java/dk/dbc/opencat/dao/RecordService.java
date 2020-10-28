/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.dao;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.rawrepo.record.RecordServiceConnector;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;
import dk.dbc.rawrepo.record.RecordServiceConnectorFactory;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import java.io.UnsupportedEncodingException;

public class RecordService {
    private static final XLogger logger = XLoggerFactory.getXLogger(RecordService.class);
    private final RecordServiceConnector recordServiceConnector =
            RecordServiceConnectorFactory.create(System.getenv("RAWREPO_RECORD_SERVICE_URL"));

    public static final Integer DBC_ENRICHMENT = 191919;
    public static final Integer COMMON_AGENCY = 870970;

    public static final String MARCXCHANGE = "text/marcxchange";

    public boolean recordExists(String bibliographicRecordId, int agencyId) throws RecordServiceConnectorException {
        logger.entry(bibliographicRecordId, agencyId);
        boolean result;
        final RecordServiceConnector.Params params = new RecordServiceConnector.Params()
                .withAllowDeleted(false);
        final StopWatch watch = new Log4JStopWatch("RecordService.recordExists");
        result = recordServiceConnector.recordExists(agencyId, bibliographicRecordId, params);
        watch.stop();
        logger.exit(result);
        return result;
    }

    public boolean recordExistsMaybeDeleted(String bibliographicRecordId, int agencyId) throws RecordServiceConnectorException {
        logger.entry(bibliographicRecordId, agencyId);
        boolean result;
        final RecordServiceConnector.Params params = new RecordServiceConnector.Params()
                .withAllowDeleted(true);
        final StopWatch watch = new Log4JStopWatch("RecordService.recordExistsMaybeDeleted");
        result = recordServiceConnector.recordExists(agencyId, bibliographicRecordId, params);
        watch.stop();
        logger.exit(result);
        return result;
    }

    public MarcRecord fetchRecord(String bibliographicRecordId, int agencyId) throws RecordServiceConnectorException, UnsupportedEncodingException {
        logger.entry(bibliographicRecordId, agencyId);
        final StopWatch watch = new Log4JStopWatch("RecordService.fetchRecord");
        MarcRecord result;
        final RecordServiceConnector.Params params = new RecordServiceConnector.Params()
                .withMode(RecordServiceConnector.Params.Mode.RAW)
                .withAllowDeleted(true);

        final byte[] content = recordServiceConnector.getRecordContent(agencyId, bibliographicRecordId, params);
        result = RecordContentTransformer.decodeRecord(content);
        watch.stop();
        logger.exit(result);
        return result;
    }

    public MarcRecord fetchMergedDBCRecord(String bibliographicRecordId, int agencyId) throws RecordServiceConnectorException, UnsupportedEncodingException {
        logger.entry(bibliographicRecordId, agencyId);
        final StopWatch watch = new Log4JStopWatch("RecordService.fetchMergedDBCRecord");
        MarcRecord result;
        final RecordServiceConnector.Params params = new RecordServiceConnector.Params()
                .withMode(RecordServiceConnector.Params.Mode.MERGED)
                .withUseParentAgency(true);

        final byte[] content = recordServiceConnector.getRecordContent(agencyId, bibliographicRecordId, params);
        result = RecordContentTransformer.decodeRecord(content);
        watch.stop();
        logger.exit(result);
        return result;
    }
}
