/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.openagency;

import dk.dbc.vipcore.exception.VipCoreException;
import dk.dbc.vipcore.libraryrules.VipCoreLibraryRulesConnector;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ejb.Singleton;
import javax.inject.Inject;

/**
 * EJB to access the OpenAgency web service.
 */
@Singleton
public class OpenAgencyService {
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(OpenAgencyService.class);

    @Inject
    private VipCoreLibraryRulesConnector vipCoreLibraryRulesConnector;

    public boolean hasFeature(String agencyId, VipCoreLibraryRulesConnector.Rule feature) throws VipCoreException {
        LOGGER.entry(agencyId, feature);
        StopWatch watch = new Log4JStopWatch("service.openagency.hasFeature");

        Boolean result = null;
        try {
            result = vipCoreLibraryRulesConnector.hasFeature(agencyId, feature);

            LOGGER.info("Agency '{}' is allowed to use feature '{}': {}", agencyId, feature, result);
            return result;
        } catch (VipCoreException ex) {
            LOGGER.error("Failed to read feature from VipCore for ['{}':'{}']: {}", agencyId, feature, ex.getMessage());

            throw ex;
        } finally {
            watch.stop();
            LOGGER.exit(result);
        }
    }

}
