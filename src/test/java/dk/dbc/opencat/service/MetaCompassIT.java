package dk.dbc.opencat.service;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.utils.RecordContentTransformer;
import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.opencatbusiness.dto.RecordRequestDTO;
import dk.dbc.opencatbusiness.dto.RecordResponseDTO;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.ws.rs.core.Response;
import java.sql.Connection;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class MetaCompassIT extends AbstractOpencatBusinessContainerTest {

    @BeforeClass
    public static void initDB() throws Exception {
        final Connection rawrepoConnection = connectToRawrepoDb();
        resetRawrepoDb(rawrepoConnection);
        saveRecord(rawrepoConnection, "metacompass/records/51580761.870970.xml", MIMETYPE_MARCXCHANGE);
    }

    @Test
    public void metaCompassTest() throws Exception {
        RecordRequestDTO recordRequestDTO = new RecordRequestDTO();
        recordRequestDTO.setRecord(actualRecordString);

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/metacompass")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(recordRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));
        RecordResponseDTO recordResponseDTO = JSONB_CONTEXT.unmarshall(response.readEntity(String.class), RecordResponseDTO.class);
        MarcRecord expected = RecordContentTransformer.decodeRecord(expectedRecordString.getBytes());
        MarcRecord actual = RecordContentTransformer.decodeRecord(recordResponseDTO.getRecord().getBytes());
        assertThat("Returned preprocessed record is as expected", actual, is(expected));
    }

    private final String actualRecordString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
            "  <leader>00000     22000000 4500 </leader>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
            "    <subfield code=\"a\">51580761</subfield>\n" +
            "    <subfield code=\"b\">870970</subfield>\n" +
            "    <subfield code=\"c\">20150304180759</subfield>\n" +
            "    <subfield code=\"d\">20150209</subfield>\n" +
            "    <subfield code=\"f\">a</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
            "    <subfield code=\"r\">n</subfield>\n" +
            "    <subfield code=\"a\">e</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"e\">kvinder</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"e\">parforhold</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"e\">politiske forhold</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"i\">middelalderen</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"q\">Danmark</subfield>\n" +
            "    <subfield code=\"g\">slægtsromaner</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"q\">Europa</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"r\">jeg-fortæller</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">OVRIG</subfield>\n" +
            "    <subfield code=\"r\">skiftende synsvinkler</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"e\">døden</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"v\">Line</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"s\">kvinder</subfield>\n" +
            "  </datafield>\n" +
            "</record>\n";

    private final String expectedRecordString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
            "  <leader>00000     22000000 4500 </leader>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
            "    <subfield code=\"a\">51580761</subfield>\n" +
            "    <subfield code=\"b\">870970</subfield>\n" +
            "    <subfield code=\"c\">20181124060526</subfield>\n" +
            "    <subfield code=\"d\">20150209</subfield>\n" +
            "    <subfield code=\"f\">a</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
            "    <subfield code=\"r\">n</subfield>\n" +
            "    <subfield code=\"a\">e</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
            "    <subfield code=\"t\">m</subfield>\n" +
            "    <subfield code=\"u\">r</subfield>\n" +
            "    <subfield code=\"a\">2015</subfield>\n" +
            "    <subfield code=\"z\">2015</subfield>\n" +
            "    <subfield code=\"b\">dk</subfield>\n" +
            "    <subfield code=\"&amp;\">f</subfield>\n" +
            "    <subfield code=\"d\">å</subfield>\n" +
            "    <subfield code=\"d\">x</subfield>\n" +
            "    <subfield code=\"j\">f</subfield>\n" +
            "    <subfield code=\"l\">ger</subfield>\n" +
            "    <subfield code=\"o\">s</subfield>\n" +
            "    <subfield code=\"v\">0</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"009\">\n" +
            "    <subfield code=\"a\">a</subfield>\n" +
            "    <subfield code=\"g\">xx</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
            "    <subfield code=\"e\">9788771691078</subfield>\n" +
            "    <subfield code=\"c\">hf.</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
            "    <subfield code=\"e\">9788771690651</subfield>\n" +
            "    <subfield code=\"b\">bogpakken DigiLesen nybegyndertysk</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
            "    <subfield code=\"x\">ACC201507</subfield>\n" +
            "    <subfield code=\"a\">DBF201608</subfield>\n" +
            "    <subfield code=\"x\">BKM201608</subfield>\n" +
            "    <subfield code=\"x\">DAT991605</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"100\">\n" +
            "    <subfield code=\"5\">870979</subfield>\n" +
            "    <subfield code=\"6\">69341535</subfield>\n" +
            "    <subfield code=\"4\">aut</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
            "    <subfield code=\"a\">Lilly macht einen Ausflug</subfield>\n" +
            "    <subfield code=\"c\">QR bog</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
            "    <subfield code=\"a\">1. udgave</subfield>\n" +
            "    <subfield code=\"b\">÷</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"260\">\n" +
            "    <subfield code=\"&amp;\">1</subfield>\n" +
            "    <subfield code=\"a\">[Værløse]</subfield>\n" +
            "    <subfield code=\"b\">DigTea</subfield>\n" +
            "    <subfield code=\"c\">2015</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
            "    <subfield code=\"a\">23 sider</subfield>\n" +
            "    <subfield code=\"b\">alle ill. i farver</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"440\">\n" +
            "    <subfield code=\"0\">norm</subfield>\n" +
            "    <subfield code=\"å\">1</subfield>\n" +
            "    <subfield code=\"a\">Digilesen</subfield>\n" +
            "    <subfield code=\"o\">Lillys Leben - Niveau B</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"440\">\n" +
            "    <subfield code=\"å\">2</subfield>\n" +
            "    <subfield code=\"0\"/>\n" +
            "    <subfield code=\"a\">QR bog</subfield>\n" +
            "    <subfield code=\"V\">246</subfield>\n" +
            "    <subfield code=\"v\">nr. 246</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
            "    <subfield code=\"&amp;\">1</subfield>\n" +
            "    <subfield code=\"a\">Lilly og hendes far tager på udflugt, og hendes far bestemmer at de skal ud i naturen, men Lilly ville hellere have været på shoppetur i byen. Desværre forløber turen ikke helt som planlagt</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"512\">\n" +
            "    <subfield code=\"a\">På titelsiden: Hören und lesen</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"520\">\n" +
            "    <subfield code=\"&amp;\">1</subfield>\n" +
            "    <subfield code=\"a\">Originaludgave: 2015</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"520\">\n" +
            "    <subfield code=\"a\">Oplag også uden seriebetegnelsen: QR bog</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
            "    <subfield code=\"&amp;\">REX</subfield>\n" +
            "    <subfield code=\"a\">1. oplag</subfield>\n" +
            "    <subfield code=\"c\">2015</subfield>\n" +
            "    <subfield code=\"k\">Lasertryk</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
            "    <subfield code=\"a\">3. oplag</subfield>\n" +
            "    <subfield code=\"c\">2015</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
            "    <subfield code=\"b\">6. oplag</subfield>\n" +
            "    <subfield code=\"c\">2015</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"526\">\n" +
            "    <subfield code=\"a\">Heri QR-koder til bogens tekst indlæst</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
            "    <subfield code=\"n\">86.4</subfield>\n" +
            "    <subfield code=\"z\">096</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
            "    <subfield code=\"o\">84</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"e\">kvinder</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"e\">parforhold</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"e\">politiske forhold</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"i\">middelalderen</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"q\">Danmark</subfield>\n" +
            "    <subfield code=\"g\">slægtsromaner</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"q\">Europa</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"r\">jeg-fortæller</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">OVRIG</subfield>\n" +
            "    <subfield code=\"r\">skiftende synsvinkler</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"e\">døden</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"665\">\n" +
            "    <subfield code=\"&amp;\">LEKTOR</subfield>\n" +
            "    <subfield code=\"v\">Line</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"s\">udflugter</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">for 11 år</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">for 12 år</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
            "    <subfield code=\"u\">let at læse</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
            "    <subfield code=\"o\">Mette Bødker</subfield>\n" +
            "    <subfield code=\"4\">ill</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
            "    <subfield code=\"a\">Digi lesen</subfield>\n" +
            "    <subfield code=\"z\">440/1(a)</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
            "    <subfield code=\"a\">Lillys Leben - Niveau B</subfield>\n" +
            "    <subfield code=\"z\">440/1(a,o)</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
            "    <subfield code=\"a\">QRbog</subfield>\n" +
            "    <subfield code=\"z\">440/2(a)</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
            "    <subfield code=\"o\">201608</subfield>\n" +
            "    <subfield code=\"b\">b</subfield>\n" +
            "    <subfield code=\"b\">s</subfield>\n" +
            "    <subfield code=\"u\">op</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
            "    <subfield code=\"a\">DBC</subfield>\n" +
            "  </datafield>\n" +
            "  <datafield ind1=\"0\" ind2=\"0\" tag=\"z98\">\n" +
            "    <subfield code=\"a\">Minus korrekturprint</subfield>\n" +
            "  </datafield>\n" +
            "</record>\n";

}
