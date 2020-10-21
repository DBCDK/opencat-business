/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.rest;

import dk.dbc.common.records.MarcConverter;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.opencat.OpenCatException;
import dk.dbc.opencat.dao.RecordService;
import dk.dbc.opencat.transformation.MetaCompassHandler;
import dk.dbc.opencat.transformation.PreProcessingHandler;
import dk.dbc.opencat.xml.MarcXChangeXmlTransformer;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import dk.dbc.rawrepo.RecordServiceConnectorException;
import dk.dbc.util.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.UnsupportedEncodingException;

@Stateless
@Path("/api")
public class TransformationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransformationService.class);
    private static final RecordService recordService = new RecordService();
    private static final PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
    private static final MetaCompassHandler metaCompassHandler = new MetaCompassHandler(recordService);
    private static final MarcXChangeXmlTransformer transformer = new MarcXChangeXmlTransformer();

    @POST
    @Path("v1/preprocess")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response preProcess(RecordRequestDTO recordRequestDTO) {
        try {
            LOGGER.info("preProcess incoming request:{}", recordRequestDTO);
            final MarcRecord record = MarcConverter.convertFromMarcXChange(recordRequestDTO.getRecord());
            preProcessingHandler.preProcess(record);
            final String recordAsString = transformer.convertDocumentToString(MarcConverter.convertToMarcXChangeAsDocument(record));
            final RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(recordAsString);
            LOGGER.info("preProcess result:{}", recordResponseDTO);

            return Response.ok().entity(recordResponseDTO).build();
        } catch (OpenCatException e) {
            LOGGER.error("Validation error in preProcess.", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build();
        } catch (RecordServiceConnectorException | UnsupportedEncodingException | JAXBException | ParserConfigurationException | TransformerException e) {
            LOGGER.error("Error in preProcess.", e);
            return Response.serverError().build();
        }
    }

    @POST
    @Path("v1/metacompass")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response metaCompass(RecordRequestDTO recordRequestDTO) {
        try {
            LOGGER.info("metaCompass incoming request:{}", recordRequestDTO);
            final MarcRecord record = MarcConverter.convertFromMarcXChange(recordRequestDTO.getRecord());
            final MarcRecord result = metaCompassHandler.enrichMetaCompassRecord(record);
            final String recordAsString = transformer.convertDocumentToString(MarcConverter.convertToMarcXChangeAsDocument(result));
            final RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(recordAsString);

            LOGGER.info("metaCompass result:{}", recordResponseDTO);
            return Response.ok().entity(recordResponseDTO).build();
        } catch (OpenCatException e) {
            LOGGER.error("Validation error in metaCompass.", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build();
        } catch (RecordServiceConnectorException | UnsupportedEncodingException | JAXBException | ParserConfigurationException | TransformerException e) {
            LOGGER.error("Error in metaCompass.", e);
            return Response.serverError().build();
        }
    }

}
