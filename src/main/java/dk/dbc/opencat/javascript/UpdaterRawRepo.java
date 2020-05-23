/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.rawrepo.RawRepoDAO;
import dk.dbc.rawrepo.RawRepoException;
import dk.dbc.rawrepo.Record;
import dk.dbc.rawrepo.RecordId;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * This class exports a RawRepo instance to the JavaScript environment.
 *
 * @author stp
 */
public class UpdaterRawRepo {
    private static final XLogger logger = XLoggerFactory.getXLogger(UpdaterRawRepo.class);

    /**
     * Fetch a record from the rawrepo.
     * <p>
     * If the record does not exist, it is created.
     *
     * @param recordId  The record id from 001a to identify the record.
     * @param libraryNo The library no from 001b to identify the record.
     * @return The record.
     * @throws NamingException              NamingException
     * @throws SQLException                 SQLException
     * @throws RawRepoException             RawRepoException
     * @throws UnsupportedEncodingException UnsupportedEncodingException
     */
    public static MarcRecord fetchRecord(String recordId, String libraryNo) throws SQLException, NamingException, RawRepoException, UnsupportedEncodingException {
        logger.entry(recordId, libraryNo);
        StopWatch watch = new Log4JStopWatch("rawrepo.fetchRecord");
        MarcRecord result = null;
        try (Connection con = getConnection()) {
            RawRepoDAO rawRepoDAO = RawRepoDAO.builder(con).build();
            Record record = rawRepoDAO.fetchRecord(recordId, Integer.valueOf(libraryNo));
            if (record.getContent() == null) {
                result = new MarcRecord();
            } else {
                result = RecordContentTransformer.decodeRecord(record.getContent());
            }
            return result;
        } finally {
            watch.stop();
            logger.exit(result);
        }
    }

    /**
     * Checks if a record exists in the rawrepo.
     *
     * @param recordId  The record id from 001a to identify the record.
     * @param libraryNo The library no from 001b to identify the record.
     * @return <code>true</code> if the record exists, <code>false</code>
     * otherwise.
     * @throws NamingException  NamingException
     * @throws SQLException     SQLException
     * @throws RawRepoException RawRepoException
     */
    public static Boolean recordExists(String recordId, String libraryNo) throws SQLException, NamingException, RawRepoException {
        logger.entry(recordId, libraryNo);
        StopWatch watch = new Log4JStopWatch("rawrepo.recordExists");
        boolean result = false;
        try (Connection con = getConnection()) {
            RawRepoDAO rawRepoDAO = RawRepoDAO.builder(con).build();
            result = rawRepoDAO.recordExists(recordId, Integer.valueOf(libraryNo));
            return result;
        } finally {
            watch.stop();
            logger.exit(result);
        }
    }

    /**
     * List of MarcRecords
     *
     * @param recordId  String
     * @param libraryNo String
     * @return List of MarcRecords
     * @throws SQLException                 SQLException
     * @throws NamingException              NamingException
     * @throws RawRepoException             RawRepoException
     * @throws UnsupportedEncodingException UnsupportedEncodingException
     */
    public static List<MarcRecord> getRelationsChildren(String recordId, String libraryNo) throws SQLException, NamingException, RawRepoException, UnsupportedEncodingException {
        logger.entry(recordId, libraryNo);
        StopWatch watch = new Log4JStopWatch("rawrepo.getRelationsChildren");
        List<MarcRecord> result = null;
        try (Connection con = getConnection()) {
            result = new ArrayList<>();
            RawRepoDAO rawRepoDAO = RawRepoDAO.builder(con).build();
            Set<RecordId> records = rawRepoDAO.getRelationsChildren(new RecordId(recordId, Integer.valueOf(libraryNo)));
            for (RecordId rawRepoRecordId : records) {
                result.add(fetchRecord(rawRepoRecordId.getBibliographicRecordId(), String.valueOf(rawRepoRecordId.getAgencyId())));
            }
            return result;
        } finally {
            watch.stop();
            logger.exit(result);
        }
    }

    /**
     * Lookup a sql connection for the rawrepo database from the Java EE container.
     * <p>
     * Remember to close the connection, when you are done using it.
     *
     * @return The SQL connection.
     * @throws NamingException Throwned if the datasource can not be looked up in
     *                         the container.
     * @throws SQLException    Throwned if the datasource can not open a connection.
     */
    private static Connection getConnection() throws NamingException, SQLException {
        InitialContext ctx = new InitialContext();
        DataSource ds = (DataSource) ctx.lookup("jdbc/rawrepo");
        return ds.getConnection();
    }
}
