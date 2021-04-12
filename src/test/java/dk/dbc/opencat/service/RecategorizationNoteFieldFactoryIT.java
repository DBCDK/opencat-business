package dk.dbc.opencat.service;

import dk.dbc.common.records.MarcField;
import dk.dbc.common.records.MarcSubField;
import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;

import java.util.Arrays;
import javax.ws.rs.core.Response;

import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class RecategorizationNoteFieldFactoryIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void recategorizationNoteFieldFactory_sanitytest() throws JSONBException {
        final RecordRequestDTO recordRequestDTO = new RecordRequestDTO();
        recordRequestDTO.setRecord(getRecord());

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/recategorizationNoteFieldFactory")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(recordRequestDTO));
        MarcField expected = new MarcField();
        expected.setName("512");
        expected.setIndicator("00");
        expected.setSubfields(Arrays.asList(
                new MarcSubField("i", "Materialet er opstillet under"),
                new MarcSubField("d", "Powell, Eric"),
                new MarcSubField("t", "The ¤Goon, nothin' but misery"),
                new MarcSubField("b", "# (DK5 83.8), materialekoder [a (xx)]. Postens opstilling ændret på grund af omkatalogisering")));

        Response response = httpClient.execute(httpPost);

        assertThat("Response code", response.getStatus(), is(200));
        MarcField actual = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), MarcField.class);
        assertThat("Marcfield is returned properly", actual, is(expected));

    }

    private String getRecord() {
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
}
