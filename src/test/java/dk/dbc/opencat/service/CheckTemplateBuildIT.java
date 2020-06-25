package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import javax.ws.rs.core.Response;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CheckTemplateBuildIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void checkTemplateBuild_OK() throws JSONBException {
        final String templateName = "allowall";

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplateBuild")
                        .build())
                .withJsonData(templateName);

        Response response = httpClient.execute(httpPost);
        boolean actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), Boolean.class);

        assertThat("Response code", response.getStatus(), is(200));
        assertThat("Template exists", actual, is(true));
    }

    @Test
    public void checkTemplateBuild_noExists() throws JSONBException {
        final String templateName = "DO_NOT_EXIST";

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkTemplateBuild")
                        .build())
                .withJsonData(templateName);

        Response response = httpClient.execute(httpPost);
        boolean actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), Boolean.class);

        assertThat("Response code", response.getStatus(), is(200));
        assertThat("Template do not exist", actual, is(false));
    }
}
