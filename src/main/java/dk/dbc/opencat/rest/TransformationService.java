package dk.dbc.opencat.rest;

import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.marc.reader.MarcXchangeV1Reader;
import dk.dbc.marc.writer.MarcXchangeV1Writer;
import dk.dbc.opencat.MDCUtil;
import dk.dbc.opencat.OpenCatException;
import dk.dbc.opencat.dao.RecordService;
import dk.dbc.opencat.transformation.MetaCompassHandler;
import dk.dbc.opencat.transformation.PreProcessingHandler;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import dk.dbc.rawrepo.record.RecordServiceConnectorException;
import dk.dbc.util.Timed;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import javax.annotation.PostConstruct;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import static dk.dbc.opencat.MDCUtil.MDC_TRACKING_ID_LOG_CONTEXT;

@Stateless
@Path("/api")
public class TransformationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransformationService.class);
    private static final RecordService recordService = new RecordService();
    private static final PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
    private static final MetaCompassHandler metaCompassHandler = new MetaCompassHandler(recordService);

    /*
        Here be thread unsafe dragons!
        Every function on Transformer and TransformerFactory objects should be assumed to be not thread safe.
        Because of this each instance of TransformationService will get its own Transformer object but initialization
        should be done synchronized across all instances of TransformationService.

        A @Stateless bean will only execute a single thread at a time so the later transformer.transform call does not
        have to explicitly synchronized
     */
    private Transformer transformer;

    @PostConstruct
    public void postConstruct() {
        try {
            synchronized (this) {
                final TransformerFactory transformerFactory = TransformerFactory.newInstance();
                transformer = transformerFactory.newTransformer();
            }
        } catch (TransformerConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    @POST
    @Path("v1/preprocess")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response preProcess(RecordRequestDTO recordRequestDTO) {
        try {
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(recordRequestDTO.getTrackingId(), "preProcess"));
            LOGGER.debug("preProcess incoming request: {}", recordRequestDTO);
            final MarcXchangeV1Reader reader = new MarcXchangeV1Reader(new ByteArrayInputStream(recordRequestDTO.getRecord().getBytes()), StandardCharsets.UTF_8);
            final MarcRecord record = reader.read();
            preProcessingHandler.preProcess(record);
            final MarcXchangeV1Writer writer = new MarcXchangeV1Writer();
            final String recordAsString = new String(writer.writeRecord(record, StandardCharsets.UTF_8));
            final RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(recordAsString);
            LOGGER.debug("preProcess result: {}", recordResponseDTO);

            return Response.ok().entity(recordResponseDTO).build();
        } catch (OpenCatException e) {
            LOGGER.error("Validation error in preProcess.", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build();
        } catch (RecordServiceConnectorException | UnsupportedEncodingException | MarcReaderException e) {
            LOGGER.error("Error in preProcess.", e);
            return Response.serverError().build();
        } finally {
            MDC.clear();
        }
    }

    @POST
    @Path("v1/metacompass")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response metaCompass(RecordRequestDTO recordRequestDTO) {
        try {
            MDC.put(MDC_TRACKING_ID_LOG_CONTEXT, MDCUtil.getTrackingId(recordRequestDTO.getTrackingId(), "metacompass"));
            LOGGER.debug("metaCompass incoming request: {}", recordRequestDTO);
            final MarcXchangeV1Reader reader = new MarcXchangeV1Reader(new ByteArrayInputStream(recordRequestDTO.getRecord().getBytes()), StandardCharsets.UTF_8);
            final MarcRecord record = reader.read();
            final MarcRecord result = metaCompassHandler.enrichMetaCompassRecord(record);
            final MarcXchangeV1Writer writer = new MarcXchangeV1Writer();
            final String recordAsString = new String(writer.writeRecord(result, StandardCharsets.UTF_8));
            final RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
            recordResponseDTO.setRecord(recordAsString);

            LOGGER.debug("metaCompass result: {}", recordResponseDTO);
            return Response.ok().entity(recordResponseDTO).build();
        } catch (OpenCatException e) {
            LOGGER.error("Validation error in metaCompass.", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build();
        } catch (RecordServiceConnectorException | UnsupportedEncodingException | MarcReaderException e) {
            LOGGER.error("Error in metaCompass.", e);
            return Response.serverError().build();
        } finally {
            MDC.clear();
        }
    }

}
