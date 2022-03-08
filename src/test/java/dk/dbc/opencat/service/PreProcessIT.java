package dk.dbc.opencat.service;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import org.junit.Test;

import javax.ws.rs.core.Response;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PreProcessIT extends AbstractOpencatBusinessContainerTest {

    @Test
    public void preProcessTest() throws Exception {
        RecordRequestDTO recordRequestDTO = new RecordRequestDTO();
        recordRequestDTO.setRecord(actualRecordString);

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/preprocess")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(recordRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        RecordResponseDTO recordResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), RecordResponseDTO.class);
        MarcRecord expected = RecordContentTransformer.decodeRecord(expectedRecordString.getBytes());
        MarcRecord actual = RecordContentTransformer.decodeRecord(recordResponseDTO.getRecord().getBytes());
        assertThat("Returned preprocessed record is as expected", actual, is(expected));
    }

    private RecordResponseDTO getExpectedResponse() {
        RecordResponseDTO recordResponseDTO = new RecordResponseDTO();
        recordResponseDTO.setRecord(expectedRecordString);

        return recordResponseDTO;
    }

    private final String actualRecordString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
            "  <leader>00000     22000000 4500 </leader>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
            "    <subfield code=\"a\">5 279 335 1</subfield>\n" +
            "    <subfield code=\"b\">870970</subfield>\n" +
            "    <subfield code=\"c\">20170111180146</subfield>\n" +
            "    <subfield code=\"d\">20161130</subfield>\n" +
            "    <subfield code=\"f\">a</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
            "    <subfield code=\"r\">n</subfield>\n" +
            "    <subfield code=\"a\">b</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
            "    <subfield code=\"t\">m</subfield>\n" +
            "    <subfield code=\"u\">f</subfield>\n" +
            "    <subfield code=\"o\">s</subfield>\n" +
            "    <subfield code=\"x\">02</subfield>\n" +
            "    <subfield code=\"v\">0</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"014\">\n" +
            "    <subfield code=\"a\">5 284 764 8</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
            "    <subfield code=\"e\">9788771299311</subfield>\n" +
            "    <subfield code=\"c\">ib.</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
            "    <subfield code=\"x\">ACC201648</subfield>\n" +
            "    <subfield code=\"a\">DBF201703</subfield>\n" +
            "    <subfield code=\"x\">BKM201703</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
            "    <subfield code=\"a\">42 aktiviteter, du selv kan lave</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
            "    <subfield code=\"a\">1. udgave</subfield>\n" +
            "    <subfield code=\"b\">$-</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
            "    <subfield code=\"a\">171 sider</subfield>\n" +
            "    <subfield code=\"b\">ill. i farver</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
            "    <subfield code=\"&amp;\">1</subfield>\n" +
            "    <subfield code=\"a\">Aktivitetsbog med 42 aktiviteter, opdelt i 40 kapitler, som knytter sig til danmarkshistorien. Aktiviteterne er en blanding af madopskrifter, lege, spil og ting. Alle med illustreret trin for trin guide og materialeliste</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
            "    <subfield code=\"b\">1. oplag</subfield>\n" +
            "    <subfield code=\"c\">2016</subfield>\n" +
            "    <subfield code=\"k\">Specialtrykkeriet, Viborg</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"o\">idebøger</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">for 9-10 år</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
            "    <subfield code=\"o\">Ida Mary Walker Larsen</subfield>\n" +
            "    <subfield code=\"4\">ill</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
            "    <subfield code=\"o\">Dennis Hornhave Jacobsen</subfield>\n" +
            "    <subfield code=\"4\">ill</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
            "    <subfield code=\"o\">201703</subfield>\n" +
            "    <subfield code=\"b\">l</subfield>\n" +
            "    <subfield code=\"b\">b</subfield>\n" +
            "    <subfield code=\"b\">s</subfield>\n" +
            "    <subfield code=\"u\">nt</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
            "    <subfield code=\"a\">DBC</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"d08\">\n" +
            "    <subfield code=\"o\">hni</subfield>\n" +
            "    <subfield code=\"o\">bjo</subfield>\n" +
            "    <subfield code=\"k\">pbh</subfield>\n" +
            "    <subfield code=\"r\">crp</subfield>\n" +
            "    <subfield code=\"a\">tilf. alder (pga. b- og s-afmærkning)</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"f06\">\n" +
            "    <subfield code=\"b\">l</subfield>\n" +
            "    <subfield code=\"b\">b</subfield>\n" +
            "    <subfield code=\"b\">s</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"n51\">\n" +
            "    <subfield code=\"a\">20170111</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"s12\">\n" +
            "    <subfield code=\"t\">TeamBMV201651</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"z98\">\n" +
            "    <subfield code=\"a\">Minus korrekturprint</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"z99\">\n" +
            "    <subfield code=\"a\">crp</subfield>\n" +
            "  </datafield>\n" +
            "</record>\n";

    private final String expectedRecordString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
            "  <leader>00000     22000000 4500 </leader>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
            "    <subfield code=\"a\">5 279 335 1</subfield>\n" +
            "    <subfield code=\"b\">870970</subfield>\n" +
            "    <subfield code=\"c\">20170111180146</subfield>\n" +
            "    <subfield code=\"d\">20161130</subfield>\n" +
            "    <subfield code=\"f\">a</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
            "    <subfield code=\"r\">n</subfield>\n" +
            "    <subfield code=\"a\">b</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
            "    <subfield code=\"t\">m</subfield>\n" +
            "    <subfield code=\"u\">f</subfield>\n" +
            "    <subfield code=\"o\">s</subfield>\n" +
            "    <subfield code=\"x\">02</subfield>\n" +
            "    <subfield code=\"v\">0</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"014\">\n" +
            "    <subfield code=\"a\">5 284 764 8</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
            "    <subfield code=\"e\">9788771299311</subfield>\n" +
            "    <subfield code=\"c\">ib.</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
            "    <subfield code=\"x\">ACC201648</subfield>\n" +
            "    <subfield code=\"a\">DBF201703</subfield>\n" +
            "    <subfield code=\"x\">BKM201703</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
            "    <subfield code=\"a\">42 aktiviteter, du selv kan lave</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
            "    <subfield code=\"a\">1. udgave</subfield>\n" +
            "    <subfield code=\"b\">$-</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
            "    <subfield code=\"a\">171 sider</subfield>\n" +
            "    <subfield code=\"b\">ill. i farver</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
            "    <subfield code=\"&amp;\">1</subfield>\n" +
            "    <subfield code=\"a\">Aktivitetsbog med 42 aktiviteter, opdelt i 40 kapitler, som knytter sig til danmarkshistorien. Aktiviteterne er en blanding af madopskrifter, lege, spil og ting. Alle med illustreret trin for trin guide og materialeliste</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
            "    <subfield code=\"b\">1. oplag</subfield>\n" +
            "    <subfield code=\"c\">2016</subfield>\n" +
            "    <subfield code=\"k\">Specialtrykkeriet, Viborg</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"o\">idebøger</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">for 9 år</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">for 10 år</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
            "    <subfield code=\"o\">Ida Mary Walker Larsen</subfield>\n" +
            "    <subfield code=\"4\">ill</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
            "    <subfield code=\"o\">Dennis Hornhave Jacobsen</subfield>\n" +
            "    <subfield code=\"4\">ill</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
            "    <subfield code=\"o\">201703</subfield>\n" +
            "    <subfield code=\"b\">l</subfield>\n" +
            "    <subfield code=\"b\">b</subfield>\n" +
            "    <subfield code=\"b\">s</subfield>\n" +
            "    <subfield code=\"u\">nt</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
            "    <subfield code=\"a\">DBC</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"d08\">\n" +
            "    <subfield code=\"o\">hni</subfield>\n" +
            "    <subfield code=\"o\">bjo</subfield>\n" +
            "    <subfield code=\"k\">pbh</subfield>\n" +
            "    <subfield code=\"r\">crp</subfield>\n" +
            "    <subfield code=\"a\">tilf. alder (pga. b- og s-afmærkning)</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"f06\">\n" +
            "    <subfield code=\"b\">l</subfield>\n" +
            "    <subfield code=\"b\">b</subfield>\n" +
            "    <subfield code=\"b\">s</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"n51\">\n" +
            "    <subfield code=\"a\">20170111</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"s12\">\n" +
            "    <subfield code=\"t\">TeamBMV201651</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"z98\">\n" +
            "    <subfield code=\"a\">Minus korrekturprint</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"z99\">\n" +
            "    <subfield code=\"a\">crp</subfield>\n" +
            "  </datafield>\n" +
            "</record>\n";
}
