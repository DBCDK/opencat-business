package dk.dbc.opencat.rest;

import dk.dbc.common.records.MarcConverter;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.opencatbusiness.dto.CheckDoubleRecordFrontendRequestDTO;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.updateservice.dto.DoubleRecordFrontendStatusDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.util.Timed;
import java.util.Properties;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/api")
public class JSRestPortal {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);
    private final Properties settings = JNDIResources.getProperties();
    private static final JSONBContext jsonbContext = new JSONBContext();

    @EJB
    ScripterPool scripterPool;

    // REMOVE!
    // CONVENIENCE METHOD FOR RELOADING JS ENVIRONMENT IN DEBUG
    @GET
    @Path(("v1/reloadjs"))
    public Response reloadJS() {
        scripterPool.destroyAllEnvironments();
        scripterPool.postConstruct();
        return Response.ok().build();
    }
    // END REMOVE

    @POST
    @Path("v1/validateRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response validateRecord(ValidateRecordRequestDTO validateRecordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("validateRecord incoming request:{}",validateRecordRequestDTO);
            MarcRecord record = MarcConverter.convertFromMarcXChange(validateRecordRequestDTO.getRecord());

            result = (String) scripterEnvironment.callMethod("validateRecord",
                    validateRecordRequestDTO.getTemplateName(),
                    jsonbContext.marshall(record),
                    settings);
            sanityCheck(result, MessageEntryDTO[].class);
            LOGGER.info("validateRecord result:{}", result);
            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException e) {
            LOGGER.error("Error in validateRecord.", e);
            return Response.serverError().build();

        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (Exception e) {
                LOGGER.error("validateRecord", e);
            }
        }
    }

    @POST
    @Path("v1/checkDoubleRecordFrontend")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkDoubleRecordFrontend(CheckDoubleRecordFrontendRequestDTO checkDoubleRecordFrontendRequestDTO) throws OCBException {
        ScripterEnvironment scripterEnvironment = null;
        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("checkDoubleRecordFrontend. Incoming request: {}", checkDoubleRecordFrontendRequestDTO);
            MarcRecord record = MarcConverter.convertFromMarcXChange(checkDoubleRecordFrontendRequestDTO.getRecord());
            result = (String) scripterEnvironment.callMethod("checkDoubleRecordFrontend",
                    jsonbContext.marshall(record),
                    settings);
            sanityCheck(result, DoubleRecordFrontendStatusDTO.class);
            LOGGER.info("checkDoubleRecordFrontend result:{}", result);

            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException e) {
            LOGGER.error("checkDoubleRecordFrontend error", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("checkDoubleRecordFrontend error", e);
            }
        }
    }

    private void sanityCheck(String objectAsJson, Class t) throws JSONBException {
        jsonbContext.unmarshall(objectAsJson, t);
    }
}
