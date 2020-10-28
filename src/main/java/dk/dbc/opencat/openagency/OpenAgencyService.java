/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.openagency;

import dk.dbc.openagency.client.LibraryRuleHandler;
import dk.dbc.openagency.client.OpenAgencyException;
import dk.dbc.openagency.client.OpenAgencyServiceFromURL;
import dk.dbc.opencat.json.JsonMapper;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.inject.Inject;
import java.io.IOException;
import java.util.Set;

/**
 * EJB to access the OpenAgency web service.
 */
@Singleton
public class OpenAgencyService {
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(OpenAgencyService.class);

    private OpenAgencyServiceFromURL service;

    @Inject
    @ConfigProperty(name = "OPENAGENCY_CONNECT_TIMEOUT", defaultValue = "60000") // 60 seconds
    private String OPENAGENCY_CONNECT_TIMEOUT;

    @Inject
    @ConfigProperty(name = "OPENAGENCY_REQUEST_TIMEOUT", defaultValue = "180000") // 180 seconds
    private String OPENAGENCY_REQUEST_TIMEOUT;

    @Inject
    @ConfigProperty(name = "OPENAGENCY_CACHE_AGE", defaultValue = "8") // 8 hours
    private String OPENAGENCY_CACHE_AGE;

    @Inject
    @ConfigProperty(name = "OPENAGENCY_URL", defaultValue = "OPENAGENCY_URL not set")
    private String OPENAGENCY_URL;

    @PostConstruct
    public void init() {
        LOGGER.entry();
        StopWatch watch = new Log4JStopWatch("service.openagency.init");

        try {
            LOGGER.info("Initializing open agency with the following parameters:");
            LOGGER.info("OPENAGENCY_URL: {}", OPENAGENCY_URL);
            LOGGER.info("OPENAGENCY_CONNECT_TIMEOUT: {}", Integer.parseInt(OPENAGENCY_CONNECT_TIMEOUT));
            LOGGER.info("OPENAGENCY_REQUEST_TIMEOUT: {}", Integer.parseInt(OPENAGENCY_REQUEST_TIMEOUT));
            LOGGER.info("OPENAGENCY_CACHE_AGE: {}", Integer.parseInt(OPENAGENCY_CACHE_AGE));

            OpenAgencyServiceFromURL.Builder builder = OpenAgencyServiceFromURL.builder();
            builder = builder.connectTimeout(Integer.parseInt(OPENAGENCY_CONNECT_TIMEOUT)).
                    requestTimeout(Integer.parseInt(OPENAGENCY_REQUEST_TIMEOUT)).
                    setCacheAge(Integer.parseInt(OPENAGENCY_CACHE_AGE));
            service = builder.build(OPENAGENCY_URL);
        } finally {
            watch.stop();
            LOGGER.exit();
        }
    }

    public OpenAgencyServiceFromURL getService() {
        return service;
    }

    public boolean hasFeature(String agencyId, LibraryRuleHandler.Rule feature) throws OpenAgencyException {
        LOGGER.entry(agencyId, feature);
        StopWatch watch = new Log4JStopWatch("service.openagency.hasFeature");

        Boolean result = null;
        try {
            result = service.libraryRules().isAllowed(agencyId, feature);

            LOGGER.info("Agency '{}' is allowed to use feature '{}': {}", agencyId, feature, result);
            return result;
        } catch (OpenAgencyException ex) {
            LOGGER.error("Failed to read feature from OpenAgency for ['{}':'{}']: {}", agencyId, feature, ex.getMessage());
            try {
                if (ex.getRequest() != null) {
                    LOGGER.error("Request to OpenAgency:\n{}", JsonMapper.encodePretty(ex.getRequest()));
                }
                if (ex.getResponse() != null) {
                    LOGGER.error("Response from OpenAgency:\n{}", JsonMapper.encodePretty(ex.getResponse()));
                }
            } catch (IOException ioError) {
                LOGGER.error("Error with encoding request/response from OpenAgency: " + ioError.getMessage(), ioError);
            }

            throw ex;
        } finally {
            watch.stop();
            LOGGER.exit(result);
        }
    }

    public Set<String> getLokbibLibraries() throws OpenAgencyException {
        LOGGER.entry();
        Set<String> result = null;
        try {
            result = getLibrariesByCatalogingTemplateSet("lokbib");
            return result;
        } finally {
            LOGGER.exit(result);
        }
    }

    public Set<String> getPHLibraries() throws OpenAgencyException {
        LOGGER.entry();
        Set<String> result = null;
        try {
            result = getLibrariesByCatalogingTemplateSet("ph");
            return result;
        } finally {
            LOGGER.exit(result);
        }
    }

    public Set<String> getFFULibraries() throws OpenAgencyException {
        LOGGER.entry();
        Set<String> result = null;
        try {
            result = getLibrariesByCatalogingTemplateSet("ffu");
            return result;
        } finally {
            LOGGER.exit(result);
        }
    }

    public Set<String> getAllowedLibraryRules(String agencyId) throws OpenAgencyException {
        LOGGER.entry(agencyId);

        StopWatch watch = new Log4JStopWatch("service.openagency.getAllowedLibraryRules");

        Set<String> result = null;
        try {
            result = service.libraryRules().getAllowedLibraryRules(agencyId);

            return result;
        } catch (OpenAgencyException ex) {
            LOGGER.error("Failed to read set from OpenAgency: {}", ex.getMessage());
            try {
                if (ex.getRequest() != null) {
                    LOGGER.error("Request to OpenAgency:\n{}", JsonMapper.encodePretty(ex.getRequest()));
                }
                if (ex.getResponse() != null) {
                    LOGGER.error("Response from OpenAgency:\n{}", JsonMapper.encodePretty(ex.getResponse()));
                }
            } catch (IOException ioError) {
                LOGGER.error("Error with encoding request/response from OpenAgency: " + ioError.getMessage(), ioError);
            }

            throw ex;
        } finally {
            watch.stop();
            LOGGER.exit(result);
        }
    }

    private Set<String> getLibrariesByCatalogingTemplateSet(String catalogingTemplateSet) throws OpenAgencyException {
        LOGGER.entry(catalogingTemplateSet);

        StopWatch watch = new Log4JStopWatch("service.openagency.getLibrariesByCatalogingTemplateSet");

        Set<String> result = null;
        try {
            result = service.libraryRules().getLibrariesByCatalogingTemplateSet(catalogingTemplateSet);

            return result;
        } catch (OpenAgencyException ex) {
            LOGGER.error("Failed to read catalogingTemplateSet: {}", ex.getMessage());
            try {
                if (ex.getRequest() != null) {
                    LOGGER.error("Request to OpenAgency:\n{}", JsonMapper.encodePretty(ex.getRequest()));
                }
                if (ex.getResponse() != null) {
                    LOGGER.error("Response from OpenAgency:\n{}", JsonMapper.encodePretty(ex.getResponse()));
                }
            } catch (IOException ioError) {
                LOGGER.error("Error with encoding request/response from OpenAgency: " + ioError.getMessage(), ioError);
            }

            throw ex;
        } finally {
            watch.stop();
            LOGGER.exit(result);
        }
    }

}
