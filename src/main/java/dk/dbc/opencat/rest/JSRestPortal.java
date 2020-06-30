package dk.dbc.opencat.rest;

import dk.dbc.common.records.MarcConverter;
import dk.dbc.common.records.MarcField;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.opencatbusiness.dto.BuildRecordRequestDTO;
import dk.dbc.opencatbusiness.dto.CheckDoubleRecordFrontendRequestDTO;
import dk.dbc.opencatbusiness.dto.CheckTemplateRequestDTO;
import dk.dbc.opencatbusiness.dto.DoRecategorizationThingsRequestDTO;
import dk.dbc.opencatbusiness.dto.RecategorizationNoteFieldFactoryRequestDTO;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.updateservice.dto.DoubleRecordFrontendStatusDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.util.Timed;
import java.io.UnsupportedEncodingException;
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
import javax.xml.bind.JAXBException;
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
    public Response checkDoubleRecordFrontend(CheckDoubleRecordFrontendRequestDTO checkDoubleRecordFrontendRequestDTO) {
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

    @POST
    @Path("v1/checkTemplate")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkTemplate(CheckTemplateRequestDTO checkTemplateRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        boolean result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("checkTemplate. Incoming request: {}", checkTemplateRequestDTO);
            result = (boolean) scripterEnvironment.callMethod("checkTemplate",
                    checkTemplateRequestDTO.getName(),
                    checkTemplateRequestDTO.getGroupId(),
                    checkTemplateRequestDTO.getLibraryType(),
                    settings);
            LOGGER.info("checkTemplate result:{}", result);
            return Response.ok().entity(result).build();
        } catch (InterruptedException | ScripterException e) {
            LOGGER.error("checkTemplate", e);
            return Response.serverError().build();
        }
        finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("checkTemplate", e);
            }
        }
    }

    @POST
    @Path("v1/doRecategorizationThings")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_XML})
    @Timed
    public Response doRecategorizationThings(DoRecategorizationThingsRequestDTO doRecategorizationThingsRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;

        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("doRecategorizationThings. Incoming request:{}", doRecategorizationThingsRequestDTO);
            result = (String) scripterEnvironment.callMethod( "doRecategorizationThings",
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getCurrentRecord()),
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getUpdateRecord()),
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getNewRecord()));
            String resultMarcXChange = marcJsonToMarcXml(result);
            LOGGER.info("doRecategorizationThings result:{}", resultMarcXChange);
            return Response.ok().entity(resultMarcXChange).build();
        } catch (InterruptedException | ScripterException | JSONBException | UnsupportedEncodingException | JAXBException e) {
            LOGGER.error("doRecategorizationThings", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("doRecategorizationThings", e);
            }
        }
    }

    @POST
    @Path("v1/recategorizationNoteFieldFactory")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response recategorizationNoteFieldFactory(RecategorizationNoteFieldFactoryRequestDTO recategorizationNoteFieldFactoryRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;

        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("recategorizationNoteFieldFactory. Incoming request:{}", recategorizationNoteFieldFactoryRequestDTO);
            result = (String) scripterEnvironment.callMethod("recategorizationNoteFieldFactory",
                    marcXMLtoJson(recategorizationNoteFieldFactoryRequestDTO.getRecord()));
            sanityCheck(result, MarcField.class);
            LOGGER.info("recategorizationNoteFieldFactory result:{}", result);
            return Response.ok().entity(result).build();

        } catch (InterruptedException | UnsupportedEncodingException | JSONBException | ScripterException e) {
            LOGGER.error("recategorizationNoteFieldFactory", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("recategorizationNoteFieldFactory", e);
            }
        }
    }

    @POST
    @Path("v1/checkTemplateBuild")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkTemplateBuild(String name) {
        ScripterEnvironment scripterEnvironment = null;
        boolean result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("checkTemplateBuild. Incoming request:{}", name);
            result = (boolean) scripterEnvironment.callMethod("checkTemplateBuild", name, settings);
            LOGGER.info("checkTemplateBuild result:{}", result);
            return Response.ok().entity(result).build();
        } catch (InterruptedException | ScripterException e) {
            LOGGER.error("checkTemplateBuild", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("checkTemplateBuild", e);
            }
        }
    }

    @POST
    @Path("v1/buildRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_XML})
    @Timed
    public Response buildRecord(BuildRecordRequestDTO buildRecordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String record = null;
        String result;
        String marcXml;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.info("buildRecord. Incoming request:{}", buildRecordRequestDTO);
            if (buildRecordRequestDTO.getRecord() != null) {
                record = marcXMLtoJson(buildRecordRequestDTO.getRecord());
            }
            result = (String) scripterEnvironment.callMethod("buildRecord",
                    buildRecordRequestDTO.getTemplateName(),
                    record,
                    settings);
            marcXml = marcJsonToMarcXml(result);
            LOGGER.info("buildRecord result:{}", marcXml);
            return Response.ok().entity(marcXml).build();

        } catch (InterruptedException | UnsupportedEncodingException | JSONBException | ScripterException | JAXBException e) {
            LOGGER.error("buildRecord", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("buildRecord", e);
            }
        }
    }

    private String marcXMLtoJson(String marcxml) throws UnsupportedEncodingException, JSONBException {
        MarcRecord marcRecord = RecordContentTransformer.decodeRecord(marcxml.getBytes());
        return jsonbContext.marshall(marcRecord);
    }

    private void sanityCheck(String objectAsJson, Class t) throws JSONBException {
        jsonbContext.unmarshall(objectAsJson, t);
    }

    private String marcJsonToMarcXml( String marcJson) throws JSONBException, JAXBException, UnsupportedEncodingException {
        MarcRecord resultMarcRecord = jsonbContext.unmarshall(marcJson, MarcRecord.class);
        return new String(RecordContentTransformer.encodeRecord(resultMarcRecord));
    }
}
