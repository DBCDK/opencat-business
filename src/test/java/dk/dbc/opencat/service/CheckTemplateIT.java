package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.opencatbusiness.dto.CheckTemplateRequestDTO;
import javax.ws.rs.core.Response;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CheckTemplateIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void checkTemplate_OK() throws JSONBException {
        CheckTemplateRequestDTO checkTemplateRequestDTO = getRequest("netlydbog");
        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplate")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(checkTemplateRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        boolean actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), Boolean.class);
        assertThat("Did find template", actual, is(true));
    }

    @Test
    public void checkTemplate_not_allowed() throws JSONBException {
        CheckTemplateRequestDTO checkTemplateRequestDTO = getRequest("dbcsingle");

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplate")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(checkTemplateRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        boolean actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), Boolean.class);
        assertThat("Template not found", actual, is(false));
    }

    private CheckTemplateRequestDTO getRequest(String templateName) {
        CheckTemplateRequestDTO checkTemplateRequestDTO = new CheckTemplateRequestDTO();
        checkTemplateRequestDTO.setGroupId("710100");
        checkTemplateRequestDTO.setLibraryType("fbs");
        checkTemplateRequestDTO.setName(templateName);
        return checkTemplateRequestDTO;
    }
}
