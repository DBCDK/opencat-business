package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.ws.rs.core.Response;
import java.sql.Connection;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CheckDoubleRecordIT extends AbstractOpencatBusinessContainerTest {

    @BeforeClass
    public static void initDB() throws Exception {
        final Connection rawrepoConnection = connectToRawrepoDb();
        resetRawrepoDb(rawrepoConnection);
        saveRecord(rawrepoConnection, "checkdoublerecordfrontend/records/50938409.xml", MIMETYPE_MARCXCHANGE);
    }

    @Test
    public void checkDoubleRecordFront_OK() throws JSONBException {
        final RecordRequestDTO checkDoubleRecordFrontendRequestDTO = new RecordRequestDTO();
        String marcRecord = "<?xml version=\"1.0\" encoding=\"UTF-16\"?>\n" +
                "<record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
                "    <leader>00000n    2200000   4500</leader>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
                "        <subfield code=\"a\">50938409</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\">20191218013539</subfield>\n" +
                "        <subfield code=\"d\">20140131</subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
                "        <subfield code=\"r\">n</subfield>\n" +
                "        <subfield code=\"a\">e</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
                "        <subfield code=\"t\">m</subfield>\n" +
                "        <subfield code=\"u\">f</subfield>\n" +
                "        <subfield code=\"a\">2014</subfield>\n" +
                "        <subfield code=\"b\">dk</subfield>\n" +
                "        <subfield code=\"d\">2</subfield>\n" +
                "        <subfield code=\"d\">å</subfield>\n" +
                "        <subfield code=\"d\">x</subfield>\n" +
                "        <subfield code=\"l\">dan</subfield>\n" +
                "        <subfield code=\"o\">b</subfield>\n" +
                "        <subfield code=\"v\">0</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"009\">\n" +
                "        <subfield code=\"a\">a</subfield>\n" +
                "        <subfield code=\"g\">xx</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"c\">ib.</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
                "        <subfield code=\"a\">DBF201409</subfield>\n" +
                "        <subfield code=\"x\">BKM201409</subfield>\n" +
                "        <subfield code=\"x\">ACC201405</subfield>\n" +
                "        <subfield code=\"x\">DAT991605</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"038\">\n" +
                "        <subfield code=\"a\">bi</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"041\">\n" +
                "        <subfield code=\"a\">dan</subfield>\n" +
                "        <subfield code=\"c\">nor</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"100\">\n" +
                "        <subfield code=\"5\">870979</subfield>\n" +
                "        <subfield code=\"6\">69208045</subfield>\n" +
                "        <subfield code=\"4\">aut</subfield>\n" +
                "        <subfield code=\"4\">art</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"241\">\n" +
                "        <subfield code=\"a\">Odd er et egg</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
                "        <subfield code=\"a\">Ib er et æggehoved</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
                "        <subfield code=\"a\">1. udgave</subfield>\n" +
                "        <subfield code=\"b\">÷</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"260\">\n" +
                "        <subfield code=\"&amp;\">1</subfield>\n" +
                "        <subfield code=\"a\">Hedehusene</subfield>\n" +
                "        <subfield code=\"b\">Torgard</subfield>\n" +
                "        <subfield code=\"c\">2014</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
                "        <subfield code=\"a\">[36] sider</subfield>\n" +
                "        <subfield code=\"b\">alle ill. i farver</subfield>\n" +
                "        <subfield code=\"c\">28 cm</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
                "        <subfield code=\"&amp;\">1</subfield>\n" +
                "        <subfield code=\"a\">Billedbog. Hver morgen pakker Ib sit hoved ind i håndklæder og en tehætte. Hans hoved er nemlig et æg, og han skal hele tiden passe på, at det ikke går i stykker. Men så møder han Sif. Hun passer ikke på noget</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
                "        <subfield code=\"&amp;\">REX</subfield>\n" +
                "        <subfield code=\"b\">1. oplag</subfield>\n" +
                "        <subfield code=\"c\">2014</subfield>\n" +
                "        <subfield code=\"k\">Arcorounborg</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"n\">85</subfield>\n" +
                "        <subfield code=\"z\">296</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"o\">sk</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">alene</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">ensomhed</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">venskab</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">kærlighed</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">tapperhed</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"s\">mod</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"u\">for 4 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"u\">for 5 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"u\">for 6 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"0\"/>\n" +
                "        <subfield code=\"u\">for 7 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
                "        <subfield code=\"o\">Hugin Eide</subfield>\n" +
                "        <subfield code=\"4\">trl</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
                "        <subfield code=\"o\">201409</subfield>\n" +
                "        <subfield code=\"b\">l</subfield>\n" +
                "        <subfield code=\"b\">b</subfield>\n" +
                "        <subfield code=\"b\">s</subfield>\n" +
                "        <subfield code=\"u\">nt</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
                "        <subfield code=\"a\">DBC</subfield>\n" +
                "    </datafield>\n" +
                "</record>\n";
        checkDoubleRecordFrontendRequestDTO.setRecord(marcRecord);
        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/checkDoubleRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(checkDoubleRecordFrontendRequestDTO));

        Response response = httpClient.execute(httpPost);

        assertThat("Response code", response.getStatus(), is(200));
    }
}
