package dk.dbc.opencat.rest;

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
import dk.dbc.opencatbusiness.dto.CheckTemplateRequestDTO;
import dk.dbc.opencatbusiness.dto.DoRecategorizationThingsRequestDTO;
import dk.dbc.opencatbusiness.dto.GetValidateSchemasRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import dk.dbc.opencatbusiness.dto.SortRecordRequestDTO;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.updateservice.dto.DoubleRecordFrontendStatusDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.updateservice.dto.SchemaDTO;
import dk.dbc.util.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import java.io.UnsupportedEncodingException;
import java.util.Properties;

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
            LOGGER.debug("validateRecord incoming request:{}", validateRecordRequestDTO);
            result = (String) scripterEnvironment.callMethod("validateRecord",
                    validateRecordRequestDTO.getTemplateName(),
                    marcXMLtoJson(validateRecordRequestDTO.getRecord()),
                    settings);
            sanityCheck(result, MessageEntryDTO[].class);
            LOGGER.debug("validateRecord result:{}", result);
            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException | UnsupportedEncodingException e) {
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
    @Path("v1/checkDoubleRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkDoubleRecord(RecordRequestDTO recordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("checkDoubleRecord. Incoming request: {}", recordRequestDTO);
            scripterEnvironment.callMethod("checkDoubleRecord",
                    marcXMLtoJson(recordRequestDTO.getRecord()),
                    settings);

            return Response.ok().build();
        } catch (ScripterException | JSONBException | InterruptedException | UnsupportedEncodingException e) {
            LOGGER.error("checkDoubleRecord error", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("checkDoubleRecord error", e);
            }
        }
    }

    @POST
    @Path("v1/checkDoubleRecordFrontend")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkDoubleRecordFrontend(RecordRequestDTO recordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("checkDoubleRecordFrontend. Incoming request: {}", recordRequestDTO);
            result = (String) scripterEnvironment.callMethod("checkDoubleRecordFrontend",
                    marcXMLtoJson(recordRequestDTO.getRecord()),
                    settings);
            sanityCheck(result, DoubleRecordFrontendStatusDTO.class);
            LOGGER.debug("checkDoubleRecordFrontend result:{}", result);

            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException | UnsupportedEncodingException e) {
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
            LOGGER.debug("checkTemplate. Incoming request: {}", checkTemplateRequestDTO);
            result = (boolean) scripterEnvironment.callMethod("checkTemplate",
                    checkTemplateRequestDTO.getName(),
                    checkTemplateRequestDTO.getGroupId(),
                    checkTemplateRequestDTO.getLibraryType(),
                    settings);
            LOGGER.debug("checkTemplate result:{}", result);
            return Response.ok().entity(result).build();
        } catch (InterruptedException | ScripterException e) {
            LOGGER.error("checkTemplate", e);
            return Response.serverError().build();
        } finally {
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
            LOGGER.debug("doRecategorizationThings. Incoming request:{}", doRecategorizationThingsRequestDTO);
            result = (String) scripterEnvironment.callMethod("doRecategorizationThings",
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getCurrentRecord()),
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getUpdateRecord()),
                    marcXMLtoJson(doRecategorizationThingsRequestDTO.getNewRecord()));
            String resultMarcXChange = marcJsonToMarcXml(result);
            RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(resultMarcXChange);
            LOGGER.debug("doRecategorizationThings result:{}", recordResponseDTO);
            return Response.ok().entity(jsonbContext.marshall(recordResponseDTO)).build();
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
    public Response recategorizationNoteFieldFactory(RecordRequestDTO recordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;

        String result;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("recategorizationNoteFieldFactory. Incoming request:{}", recordRequestDTO);
            result = (String) scripterEnvironment.callMethod("recategorizationNoteFieldFactory",
                    marcXMLtoJson(recordRequestDTO.getRecord()));
            sanityCheck(result, MarcField.class);
            LOGGER.debug("recategorizationNoteFieldFactory result:{}", result);
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
            LOGGER.debug("checkTemplateBuild. Incoming request:{}", name);
            result = (boolean) scripterEnvironment.callMethod("checkTemplateBuild", name, settings);
            LOGGER.debug("checkTemplateBuild result:{}", result);
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
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response buildRecord(BuildRecordRequestDTO buildRecordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String record = null;
        String result;
        String marcXml;
        try {
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("buildRecord. Incoming request:{}", buildRecordRequestDTO);
            if (buildRecordRequestDTO.getRecord() != null) {
                record = marcXMLtoJson(buildRecordRequestDTO.getRecord());
            }
            result = (String) scripterEnvironment.callMethod("buildRecord",
                    buildRecordRequestDTO.getTemplateName(),
                    record,
                    settings);
            marcXml = marcJsonToMarcXml(result);
            RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(marcXml);
            LOGGER.debug("buildRecord result:{}", recordResponseDTO);
            return Response.ok().entity(jsonbContext.marshall(recordResponseDTO)).build();

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

    @POST
    @Path("v1/sortRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response sortRecord(SortRecordRequestDTO sortRecordRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String result;
        String marcXml;
        LOGGER.debug("sortRecord. Incoming request:{}", sortRecordRequestDTO);
        try {
            scripterEnvironment = scripterPool.take();
            result = (String) scripterEnvironment.callMethod("sortRecord",
                    sortRecordRequestDTO.getTemplateProvider(),
                    marcXMLtoJson(sortRecordRequestDTO.getRecord()),
                    settings);
            marcXml = marcJsonToMarcXml(result);
            RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(marcXml);
            LOGGER.debug("sortRecord result:{}", recordResponseDTO);
            return Response.ok().entity(jsonbContext.marshall(recordResponseDTO)).build();
        } catch (InterruptedException | UnsupportedEncodingException | JSONBException | ScripterException | JAXBException e) {
            LOGGER.error("sortRecord", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("sortError", e);
            }
        }
    }

    @POST
    @Path("v1/getValidateSchemas")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getValidateSchemas(GetValidateSchemasRequestDTO getValidateSchemasRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        String result;
        LOGGER.debug("getValidateSchemas. Incoming request:{}", getValidateSchemasRequestDTO);
        try {
            scripterEnvironment = scripterPool.take();
            result = (String) scripterEnvironment.callMethod("getValidateSchemas",
                    getValidateSchemasRequestDTO.getTemplateGroup(),
                    getValidateSchemasRequestDTO.getAllowedLibraryRules());
            sanityCheck(result, SchemaDTO[].class);
            LOGGER.debug("getValidateSchemas result:{}", result);
            return Response.ok().entity(result).build();
        } catch (InterruptedException | ScripterException | JSONBException e) {
            LOGGER.error("getValidateSchemas", e);
            return Response.serverError().build();
        } finally {
            try {
                scripterPool.put(scripterEnvironment);
            } catch (InterruptedException e) {
                LOGGER.error("getValidateSchemas", e);
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

    private String marcJsonToMarcXml(String marcJson) throws JSONBException, JAXBException, UnsupportedEncodingException {
        MarcRecord resultMarcRecord = jsonbContext.unmarshall(marcJson, MarcRecord.class);
        return new String(RecordContentTransformer.encodeRecord(resultMarcRecord));
    }
}