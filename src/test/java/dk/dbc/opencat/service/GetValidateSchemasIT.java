package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.opencatbusiness.dto.GetValidateSchemasRequestDTO;
import dk.dbc.updateservice.dto.SchemaDTO;
import java.util.Arrays;
import java.util.HashSet;
import javax.ws.rs.core.Response;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class GetValidateSchemasIT extends AbstractOpencatBusinessContainerTest {
    @Test
    public void getValidateSchemas_sanitytest() throws JSONBException {
        GetValidateSchemasRequestDTO getValidateSchemasRequestDTO = new GetValidateSchemasRequestDTO();
        getValidateSchemasRequestDTO.setTemplateGroup("dbc");
        getValidateSchemasRequestDTO.setAllowedLibraryRules(new HashSet<>(Arrays.asList("RecordRules.conflictingFields", "RecordRules.conflictingSubfields")));

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/getValidateSchemas")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(getValidateSchemasRequestDTO));

        Response response = httpClient.execute(httpPost);
        SchemaDTO[] actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), SchemaDTO[].class);
        assertThat("Response code", response.getStatus(), is(200));
        SchemaDTO[] expected = JSONB_CONTEXT.unmarshall(getExpectedResult(), SchemaDTO[].class);
        assertThat("Returned list of schemes is OK", actual, is(expected));
    }

    private String getExpectedResult() {
        return "[\n" +
                "  {\n" +
                "    \"schemaName\": \"allowall\",\n" +
                "    \"schemaInfo\": \"\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"delete\",\n" +
                "    \"schemaInfo\": \"Skabelon til sletteposter - alle post- og materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"metakompas\",\n" +
                "    \"schemaInfo\": \"Skabelon til indsendelse af metakompasdata til læsekompasset.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"delete\",\n" +
                "    \"schemaInfo\": \"Skabelon til sletteposter - alle post- og materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffu\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-singlepost - alle materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffuartikel\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-artikelpost (periodicaartikel og artikel i bog\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffubind\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-bindpost - alle materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffuhoved\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-singlepost - alle materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffumusik\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-singlepost - alle materialetyper.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffuperiodica\",\n" +
                "    \"schemaInfo\": \"Skabelon til periodicaposter fra ffu-biblioteker.\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"schemaName\": \"ffusektion\",\n" +
                "    \"schemaInfo\": \"Skabelon til optrettelse af ffu-sektionspost - alle materialetyper.\"\n" +
                "  }\n" +
                "]";
    }
}
