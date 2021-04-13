package dk.dbc.opencat.rest;

import dk.dbc.httpclient.FailSafeHttpClient;
import dk.dbc.httpclient.HttpClient;
import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBContext;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import net.jodah.failsafe.RetryPolicy;
import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ws.rs.ProcessingException;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

public class OpencatBusinessWarmup {
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(OpencatBusinessWarmup.class);
    private static final String BASE_URL = "http://localhost:8080";
    private static final String PATH_PREPROCESS = "/api/v1/preprocess";
    private static final String PATH_RECATEGORIZATION_NOTE_FIELD_FACTORY = "/api/v1/recategorizationNoteFieldFactory";
    private static final RetryPolicy RETRY_POLICY = new RetryPolicy()
            .retryOn(Collections.singletonList(ProcessingException.class))
            .retryIf((Response response) -> response.getStatus() == 404)
            .withDelay(10, TimeUnit.SECONDS)
            .withMaxRetries(1);

    private static final JSONBContext jsonbContext = new JSONBContext();

    private static boolean isReady;
    private static boolean isPreProcessReady;
    private static boolean isRecategorizationNoteFieldFactoryReady;

    public boolean isReady() {
        try {
            if (!isReady) {
                if (!isPreProcessReady) {
                    LOGGER.debug("!isPreProcessReady - calling callEndpoint({})", PATH_PREPROCESS);
                    synchronized (this) {
                        isPreProcessReady = callEndpoint(PATH_PREPROCESS);
                    }
                }

                if (!isRecategorizationNoteFieldFactoryReady) {
                    LOGGER.debug("!isRecategorizationNoteFieldFactoryReady - calling callEndpoint({})", PATH_RECATEGORIZATION_NOTE_FIELD_FACTORY);
                    synchronized (this) {
                        isRecategorizationNoteFieldFactoryReady = callEndpoint(PATH_RECATEGORIZATION_NOTE_FIELD_FACTORY);
                    }
                }

                isReady = isPreProcessReady && isRecategorizationNoteFieldFactoryReady;
            }

            return isReady;
        } catch (Exception e) {
            LOGGER.error("Caught exception during UpdateServiceClient", e);
            return false;
        }
    }

    private boolean callEndpoint(String path) {
        try {
            final URL commonRecord = OpencatBusinessWarmup.class.getResource("/warmup/commonRecord.xml");
            final String COMMON_RECORD = new String(Files.readAllBytes(new File(commonRecord.toURI()).toPath()), StandardCharsets.UTF_8);

            final Client client = HttpClient.newClient(new ClientConfig().register(new JacksonFeature()));
            final FailSafeHttpClient failSafeHttpClient = FailSafeHttpClient.create(client, RETRY_POLICY);
            final PathBuilder pathBuilder = new PathBuilder(path);

            final RecordRequestDTO recordRequestDTO = new RecordRequestDTO();
            recordRequestDTO.setRecord(COMMON_RECORD);
            recordRequestDTO.setTrackingId("warmup");

            final HttpPost post = new HttpPost(failSafeHttpClient)
                    .withBaseUrl(BASE_URL)
                    .withData(jsonbContext.marshall(recordRequestDTO), "application/json")
                    .withHeader("Accept", "application/json")
                    .withPathElements(pathBuilder.build());

            final Response response = post.execute();
            assertResponseStatus(response);

            return true;
        } catch (Exception e) {
            LOGGER.error(String.format("Caught exception when calling callEndpoint(%s)", path),e);
            return false;
        }
    }

    private void assertResponseStatus(Response response)
            throws Exception {
        final Response.Status actualStatus =
                Response.Status.fromStatusCode(response.getStatus());
        if (actualStatus != Response.Status.OK) {
            throw new Exception(
                    String.format("Update returned with '%s' status code: %s",
                            actualStatus,
                            actualStatus.getStatusCode()));
        }
    }
}
