package dk.dbc.opencat.rest;

import dk.dbc.common.records.ExpandCommonMarcRecord;
import dk.dbc.common.records.MarcRecordReader;
import dk.dbc.common.records.RecordContentTransformer;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.marc.binding.DataField;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.opencat.MDCUtil;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.javascript.UpdaterRawRepo;
import dk.dbc.opencat.json.DataFieldDTO;
import dk.dbc.opencat.json.JsonMapper;
import dk.dbc.opencat.json.WrapperDataField;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.opencatbusiness.dto.BuildRecordRequestDTO;
import dk.dbc.opencatbusiness.dto.CheckTemplateBuildRequestDTO;
import dk.dbc.opencatbusiness.dto.CheckTemplateBuildResponseDTO;
import dk.dbc.opencatbusiness.dto.CheckTemplateRequestDTO;
import dk.dbc.opencatbusiness.dto.DoRecategorizationThingsRequestDTO;
import dk.dbc.opencatbusiness.dto.GetValidateSchemasRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import dk.dbc.opencatbusiness.dto.SortRecordRequestDTO;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;
import dk.dbc.updateservice.dto.DoubleRecordFrontendStatusDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.updateservice.dto.SchemaDTO;
import dk.dbc.util.Timed;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.HashMap;

import static dk.dbc.opencat.MDCUtil.MDC_TRACKING_ID_LOG_CONTEXT;

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
    @Path("v1/reloadjs")
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
        String result = "";
        try {
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(validateRecordRequestDTO.getTrackingId(), "validateRecord"));
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("validateRecord incoming request:{}", validateRecordRequestDTO);
            result = checkAuthRecordTypes(validateRecordRequestDTO.getRecord());
            if (result.isEmpty()) {
                result = (String) scripterEnvironment.callMethod("validateRecord",
                        validateRecordRequestDTO.getTemplateName(),
                        marcXMLtoJson(validateRecordRequestDTO.getRecord()),
                        settings);
            }
            sanityCheck(result, MessageEntryDTO[].class);
            LOGGER.debug("validateRecord result:{}", result);
            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException | MarcReaderException e) {
            LOGGER.error("Error in validateRecord.", e);
            return Response.serverError().build();

        } catch (RecordServiceConnectorException e) {
            LOGGER.error("Error in validateRecord when accessing rawrepo.", e);
            throw new RuntimeException(e);
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("validateRecord error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(recordRequestDTO.getTrackingId(), "checkDoubleRecord"));
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("checkDoubleRecord. Incoming request: {}", recordRequestDTO);
            scripterEnvironment.callMethod("checkDoubleRecord",
                    marcXMLtoJson(recordRequestDTO.getRecord()),
                    settings);

            return Response.ok().build();
        } catch (ScripterException | JSONBException | InterruptedException | MarcReaderException e) {
            LOGGER.error("checkDoubleRecord error", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("checkDoubleRecord error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(recordRequestDTO.getTrackingId(), "checkDoubleRecordFrontend"));
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("checkDoubleRecordFrontend. Incoming request: {}", recordRequestDTO);
            result = (String) scripterEnvironment.callMethod("checkDoubleRecordFrontend",
                    marcXMLtoJson(recordRequestDTO.getRecord()),
                    settings);
            sanityCheck(result, DoubleRecordFrontendStatusDTO.class);
            LOGGER.debug("checkDoubleRecordFrontend result:{}", result);

            return Response.ok().entity(result).build();
        } catch (ScripterException | JSONBException | InterruptedException | MarcReaderException e) {
            LOGGER.error("checkDoubleRecordFrontend error", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("checkDoubleRecordFrontend error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(checkTemplateRequestDTO.getTrackingId(), "checkTemplate"));
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
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("checkTemplate error", e);
                }
            }
            MDC.clear();
        }
    }

    @POST
    @Path("v1/doRecategorizationThings")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response doRecategorizationThings(DoRecategorizationThingsRequestDTO doRecategorizationThingsRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;

        String result;
        try {
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(doRecategorizationThingsRequestDTO.getTrackingId(), "doRecategorizationThings"));
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
        } catch (InterruptedException | ScripterException | JSONBException | MarcReaderException e) {
            LOGGER.error("doRecategorizationThings", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("doRecategorizationThings error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(recordRequestDTO.getTrackingId(), "recategorizationNoteFieldFactory"));
            scripterEnvironment = scripterPool.take();
            LOGGER.debug("recategorizationNoteFieldFactory. Incoming request: {}", recordRequestDTO);
            result = (String) scripterEnvironment.callMethod("recategorizationNoteFieldFactory",
                    marcXMLtoJson(recordRequestDTO.getRecord()));
            sanityCheck(result, DataFieldDTO.class);

            // This is a bit weird. We can't unmarshall to a DataField directly because the output json doesn't have the matching properties.
            // So we have to use an intermediate object to unmarshall to.
            // But because the opencat-business connector expected a slightly different DTO we have to map the DTO again.
            final DataFieldDTO dataFieldDTO = jsonbContext.unmarshall(result, DataFieldDTO.class);
            final WrapperDataField wrapperDataField = JsonMapper.wrapDataFieldDTO(dataFieldDTO);
            LOGGER.debug("recategorizationNoteFieldFactory result:{}", jsonbContext.marshall(wrapperDataField));

            return Response.ok().entity(wrapperDataField).build();
        } catch (InterruptedException | JSONBException | ScripterException | MarcReaderException e) {
            LOGGER.error("recategorizationNoteFieldFactory", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("recategorizationNoteFieldFactory error", e);
                }
            }
            MDC.clear();
        }
    }

    @POST
    @Path("v1/checkTemplateBuild")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response checkTemplateBuild(CheckTemplateBuildRequestDTO checkTemplateBuildRequestDTO) {
        ScripterEnvironment scripterEnvironment = null;
        boolean result;
        try {
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(checkTemplateBuildRequestDTO.getTrackingId(), "checkTemplateBuild"));
            scripterEnvironment = scripterPool.take();
            final String name = checkTemplateBuildRequestDTO.getName();
            LOGGER.debug("checkTemplateBuild. Incoming request:{}", checkTemplateBuildRequestDTO);
            result = (boolean) scripterEnvironment.callMethod("checkTemplateBuild", name, settings);
            final CheckTemplateBuildResponseDTO checkTemplateBuildResponseDTO = new CheckTemplateBuildResponseDTO();
            checkTemplateBuildResponseDTO.setResult(result);
            LOGGER.debug("checkTemplateBuild result:{}", checkTemplateBuildResponseDTO);
            return Response.ok().entity(checkTemplateBuildResponseDTO).build();
        } catch (InterruptedException | ScripterException e) {
            LOGGER.error("checkTemplateBuild", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("checkTemplateBuild error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(buildRecordRequestDTO.getTrackingId(), "buildRecord"));
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

        } catch (InterruptedException | JSONBException | ScripterException | MarcReaderException e) {
            LOGGER.error("buildRecord", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("buildRecord error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(sortRecordRequestDTO.getTrackingId(), "sortRecord"));
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
        } catch (InterruptedException | JSONBException | ScripterException | MarcReaderException e) {
            LOGGER.error("sortRecord", e);
            return Response.serverError().build();
        } finally {
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("sortRecord error", e);
                }
            }
            MDC.clear();
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
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(getValidateSchemasRequestDTO.getTrackingId(), "getValidateSchemas"));
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
            if (scripterPool != null) {
                try {
                    scripterPool.put(scripterEnvironment);
                } catch (InterruptedException e) {
                    LOGGER.error("getValidateSchemas error", e);
                }
            }
            MDC.clear();
        }
    }

    private String marcXMLtoJson(String marcxml) throws JSONBException, MarcReaderException {
        final String marcToConvert;
        if (marcxml == null || marcxml.isEmpty()) {
            marcToConvert = "<?xml version=\"1.0\" encoding=\"UTF-16\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1\">" +
                    "<leader>00000n    2200000   4500</leader></record>";
        } else {
            marcToConvert = marcxml;
        }

        final MarcRecord marcRecord = RecordContentTransformer.decodeRecord(marcToConvert.getBytes(StandardCharsets.UTF_8));
        return jsonbContext.marshall(marcRecord);
    }

    private void sanityCheck(String objectAsJson, Class t) throws JSONBException {
        jsonbContext.unmarshall(objectAsJson, t);
    }

    private String marcJsonToMarcXml(String marcJson) throws JSONBException {
        MarcRecord resultMarcRecord = jsonbContext.unmarshall(marcJson, MarcRecord.class);
        return new String(RecordContentTransformer.encodeRecord(resultMarcRecord), StandardCharsets.UTF_8);
    }

    private Map<String, String> getRelationTypes(List<MarcRecord> relations) {
        Map<String, String> relationMap = new HashMap<>();
        LOGGER.info("Relations : {}", relations);
        for (MarcRecord relation : relations) {
            MarcRecordReader relationReader = new MarcRecordReader(relation);
            String id = relationReader.getRecordId();
            if ("870979".equals(relationReader.getAgencyId())) {
                if (relationReader.getField("100") != null) relationMap.put(id, "100");
                else if (relationReader.getField("110") != null) relationMap.put(id, "110");
                else if (relationReader.getField("133") != null) relationMap.put(id, "133");
                else if (relationReader.getField("134") != null) relationMap.put(id, "134");
            }
        }
        LOGGER.info("Relation Map: {}", relationMap);
        return relationMap;
    }

    /**
     * To speed things up, we get all relations between the record and 870979 records. Then we go through the record and add
     * eventual missing relations, that is, new relations (we don't care about removed).
     * @param record the incoming record
     * @return either empty or a list of wrong A-record relations
     * @throws RecordServiceConnectorException record fetch fails
     * @throws MarcReaderException record is in bad shape
     */
    private String checkAuthRecordTypes(String record) throws RecordServiceConnectorException, MarcReaderException {
        LOGGER.info("checkAuthRecordTypes. Incoming request:{}", record);
        if (record == null || record.isEmpty()) {
            return "";
        }
        MarcRecord marcRecord = RecordContentTransformer.decodeRecord(record.getBytes());
        MarcRecordReader reader = new MarcRecordReader(marcRecord);
        List<MarcRecord> relations;
        relations = UpdaterRawRepo.getRelationsChildren(reader.getRecordId(), reader.getAgencyId());
        List<String> results = new ArrayList<>();
        Map<String, String> relationMap;
        relationMap = getRelationTypes(relations);
        ExpandCommonMarcRecord expandCommonMarcRecord = new ExpandCommonMarcRecord();
        for (DataField field : marcRecord.getFields(DataField.class)) {
            // Some records do have a subfield 5 but no subfield 6, so we check both
            if (field.hasSubField(DataField.hasSubFieldCode('5')) && field.hasSubField(DataField.hasSubFieldCode('6'))) {
                String aId = field.getSubField(DataField.hasSubFieldCode('6')).orElseThrow().getData().replace("(DK-870979)", "");
                if (!relationMap.containsKey(aId)) {
                    List<MarcRecord> oneRecord = new ArrayList<>();
                    Map<String, String> oneMap;
                    oneRecord.add(UpdaterRawRepo.fetchRecord(aId, "870979"));
                    oneMap = getRelationTypes(oneRecord);
                    relationMap.putAll(oneMap);
                }
                expandCommonMarcRecord.getModeRefAFieldName(field);
                String aKey = expandCommonMarcRecord.getAuthFieldName();
                String value = relationMap.get(aId);
                if (value != null) {
                    if (!aKey.equals(value)) {
                        String jString = "{\"type\": \"ERROR\", \"message\": \"Felt " + field.getTag() +
                                " værdi " + aId + " peger ikke på forventet A-record type\"}";
                        results.add(jString);
                    }
                }
            }
        }
        if (results.isEmpty()) {
            return "";
        }
        return "[" + String.join(",", results) + "]";

    }
}
