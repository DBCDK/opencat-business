package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import javax.ws.rs.core.Response;

import dk.dbc.opencatbusiness.dto.CheckTemplateBuildRequestDTO;
import dk.dbc.opencatbusiness.dto.CheckTemplateBuildResponseDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CheckTemplateBuildIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void checkTemplateBuild_OK() throws JSONBException {
        final CheckTemplateBuildRequestDTO checkTemplateBuildRequestDTO = new CheckTemplateBuildRequestDTO();
        checkTemplateBuildRequestDTO.setName("allowall");

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplateBuild")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(checkTemplateBuildRequestDTO));


        final Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        final CheckTemplateBuildResponseDTO checkTemplateBuildResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), CheckTemplateBuildResponseDTO.class);
        assertThat("Template exists", checkTemplateBuildResponseDTO.isResult(), is(true));
    }

    @Test
    public void checkTemplateBuild_noExists() throws JSONBException {
        final CheckTemplateBuildRequestDTO checkTemplateBuildRequestDTO = new CheckTemplateBuildRequestDTO();
        checkTemplateBuildRequestDTO.setName("DO_NOT_EXIST");

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplateBuild")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(checkTemplateBuildRequestDTO));

        final Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        final CheckTemplateBuildResponseDTO checkTemplateBuildResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), CheckTemplateBuildResponseDTO.class);
        assertThat("Template exists", checkTemplateBuildResponseDTO.isResult(), is(false));
    }
}
