package dk.dbc.opencat.service;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.opencatbusiness.dto.BuildRecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import java.io.UnsupportedEncodingException;
import javax.ws.rs.core.Response;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BuildRecordIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void test_that_a_record_is_built_with_another_record_as_template() throws JSONBException, UnsupportedEncodingException {
        BuildRecordRequestDTO buildRecordRequestDTO = new BuildRecordRequestDTO();
        buildRecordRequestDTO.setTemplateName("dbcsingle");
        buildRecordRequestDTO.setRecord(getRequest());

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/buildRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(buildRecordRequestDTO));

        Response response = httpClient.execute(httpPost);
        RecordResponseDTO recordResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), RecordResponseDTO.class);
        MarcRecord expected = RecordContentTransformer.decodeRecord(getExpectedResultFromFirstTest().getBytes());
        MarcRecord actual = RecordContentTransformer.decodeRecord(recordResponseDTO.getRecord().getBytes());
        assertThat("Response code", response.getStatus(), is(200));
        assertThat("New record as expected", actual, is(expected));
    }

    @Test
    public void test_that_a_record_is_built_from_scratch() throws UnsupportedEncodingException, JSONBException {
        BuildRecordRequestDTO buildRecordRequestDTO = new BuildRecordRequestDTO();
        buildRecordRequestDTO.setTemplateName("dbcsingle");

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/buildRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(buildRecordRequestDTO));

        Response response = httpClient.execute(httpPost);
        RecordResponseDTO recordResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), RecordResponseDTO.class);
        MarcRecord expected = RecordContentTransformer.decodeRecord(getExpectedResultFromSecondTest().getBytes());
        MarcRecord actual = RecordContentTransformer.decodeRecord(recordResponseDTO.getRecord().getBytes());
        assertThat("Response code", response.getStatus(), is(200));
        assertThat("New record as expected", actual, is(expected));
    }

    private String getRequest() {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
                "    <leader>00000     22000000 4500 </leader>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
                "        <subfield code=\"a\">43645676</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\">20070726122101</subfield>\n" +
                "        <subfield code=\"d\">20070726</subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"002\">\n" +
                "        <subfield code=\"b\">721700</subfield>\n" +
                "        <subfield code=\"c\">95487653</subfield>\n" +
                "        <subfield code=\"x\">72170095487653</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
                "        <subfield code=\"r\">c</subfield>\n" +
                "        <subfield code=\"a\">e</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
                "        <subfield code=\"t\">m</subfield>\n" +
                "        <subfield code=\"u\">f</subfield>\n" +
                "        <subfield code=\"a\">2003</subfield>\n" +
                "        <subfield code=\"b\">us</subfield>\n" +
                "        <subfield code=\"l\">eng</subfield>\n" +
                "        <subfield code=\"v\">0</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"009\">\n" +
                "        <subfield code=\"a\">a</subfield>\n" +
                "        <subfield code=\"g\">xx</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"a\">1-56971-998-5</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"100\">\n" +
                "        <subfield code=\"a\">Powell</subfield>\n" +
                "        <subfield code=\"h\">Eric</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
                "        <subfield code=\"a\">The ¤Goon, nothin' but misery</subfield>\n" +
                "        <subfield code=\"e\">by Eric Powell</subfield>\n" +
                "        <subfield code=\"f\">colors by Eric and Robin Powell</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"260\">\n" +
                "        <subfield code=\"a\">Milwaukie</subfield>\n" +
                "        <subfield code=\"b\">Dark Horse</subfield>\n" +
                "        <subfield code=\"c\">2003</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
                "        <subfield code=\"a\">1 bind</subfield>\n" +
                "        <subfield code=\"b\">ill. i farver</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"440\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"a\">The ¤Goon</subfield>\n" +
                "        <subfield code=\"V\">1</subfield>\n" +
                "        <subfield code=\"v\">Volume 1</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"505\">\n" +
                "        <subfield code=\"a\">Tegneserie</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"520\">\n" +
                "        <subfield code=\"a\">Tidligere udgivet som enkelthæfter</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"m\">83.8</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"745\">\n" +
                "        <subfield code=\"a\">Nothing but misery</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
                "        <subfield code=\"a\">710100</subfield>\n" +
                "    </datafield>\n" +
                "</record>\n";
    }

    private String getExpectedResultFromFirstTest() {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
                "<record xsi:schemaLocation=\"http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\"\n" +
                "        xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
                "    <leader>00000n 2200000 4500</leader>\n" +
                "    <datafield tag=\"001\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">126900201</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\">20070726122101</subfield>\n" +
                "        <subfield code=\"d\">20070726</subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"002\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"b\">721700</subfield>\n" +
                "        <subfield code=\"c\">95487653</subfield>\n" +
                "        <subfield code=\"x\">72170095487653</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"004\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"r\">c</subfield>\n" +
                "        <subfield code=\"a\">e</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"008\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"t\">m</subfield>\n" +
                "        <subfield code=\"u\">f</subfield>\n" +
                "        <subfield code=\"a\">2003</subfield>\n" +
                "        <subfield code=\"b\">us</subfield>\n" +
                "        <subfield code=\"l\">eng</subfield>\n" +
                "        <subfield code=\"v\">0</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"009\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">a</subfield>\n" +
                "        <subfield code=\"g\">xx</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"021\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">1-56971-998-5</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"100\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">Powell</subfield>\n" +
                "        <subfield code=\"h\">Eric</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"245\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">The ¤Goon, nothin' but misery</subfield>\n" +
                "        <subfield code=\"e\">by Eric Powell</subfield>\n" +
                "        <subfield code=\"f\">colors by Eric and Robin Powell</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"260\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">Milwaukie</subfield>\n" +
                "        <subfield code=\"b\">Dark Horse</subfield>\n" +
                "        <subfield code=\"c\">2003</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"300\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">1 bind</subfield>\n" +
                "        <subfield code=\"b\">ill. i farver</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"440\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"0\"></subfield>\n" +
                "        <subfield code=\"a\">The ¤Goon</subfield>\n" +
                "        <subfield code=\"v\">Volume 1</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"505\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">Tegneserie</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"520\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">Tidligere udgivet som enkelthæfter</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"652\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"m\">83.8</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"745\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">Nothing but misery</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"996\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">710100</subfield>\n" +
                "    </datafield>\n" +
                "</record>";
    }

    private String getExpectedResultFromSecondTest() {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
                "<record xsi:schemaLocation=\"http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\"\n" +
                "        xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
                "    <leader>00000n 2200000 4500</leader>\n" +
                "    <datafield tag=\"001\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\">126900201</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\"></subfield>\n" +
                "        <subfield code=\"d\"></subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"004\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"r\"></subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"008\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"v\"></subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"009\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\"></subfield>\n" +
                "        <subfield code=\"g\"></subfield>\n" +
                "    </datafield>\n" +
                "    <datafield tag=\"245\" ind1=\"0\" ind2=\"0\">\n" +
                "        <subfield code=\"a\"></subfield>\n" +
                "    </datafield>\n" +
                "</record>";
    }
}