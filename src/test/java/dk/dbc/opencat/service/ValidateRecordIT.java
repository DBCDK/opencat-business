package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpPost;
import dk.dbc.httpclient.PathBuilder;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.updateservice.dto.TypeEnumDTO;
import java.sql.Connection;
import java.util.Arrays;
import javax.ws.rs.core.Response;
import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class ValidateRecordIT extends AbstractOpencatBusinessContainerTest {
    private static final Logger LOGGGER = LoggerFactory.getLogger(ValidateRecordIT.class);

    @BeforeClass
    public static void initDB() throws Exception {
        final Connection rawrepoConnection = connectToRawrepoDb();
        resetRawrepoDb(rawrepoConnection);

        saveRecord(rawrepoConnection, "validateRecord/records/51580761.xml", MIMETYPE_MARCXCHANGE);
    }

    @Test
    public void validateRecord_OK() throws JSONBException {
        ValidateRecordRequestDTO validateRecordRequestDTO = new ValidateRecordRequestDTO();
        String record = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
                "    <leader>00000     22000000 4500 </leader>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
                "        <subfield code=\"a\">5 158 076 1</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\">20150304180759</subfield>\n" +
                "        <subfield code=\"d\">20150209</subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
                "        <subfield code=\"r\">n</subfield>\n" +
                "        <subfield code=\"a\">e</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
                "        <subfield code=\"t\">m</subfield>\n" +
                "        <subfield code=\"u\">f</subfield>\n" +
                "        <subfield code=\"a\">2015</subfield>\n" +
                "        <subfield code=\"b\">dk</subfield>\n" +
                "        <subfield code=\"d\">å</subfield>\n" +
                "        <subfield code=\"d\">x</subfield>\n" +
                "        <subfield code=\"j\">f</subfield>\n" +
                "        <subfield code=\"l\">ger</subfield>\n" +
                "        <subfield code=\"o\">s</subfield>\n" +
                "        <subfield code=\"v\">0</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"009\">\n" +
                "        <subfield code=\"a\">a</subfield>\n" +
                "        <subfield code=\"g\">xx</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"e\">9788771691078</subfield>\n" +
                "        <subfield code=\"c\">hf.</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"e\">9788771690651</subfield>\n" +
                "        <subfield code=\"b\">bogpakken DigiLesen nybegyndertysk</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
                "        <subfield code=\"a\">DBF201511</subfield>\n" +
                "        <subfield code=\"x\">BKM201511</subfield>\n" +
                "        <subfield code=\"a\">DBF</subfield>\n" +
                "        <subfield code=\"x\">BKM</subfield>\n" +
                "        <subfield code=\"x\">SKO</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"100\">\n" +
                "        <subfield code=\"a\">Møller</subfield>\n" +
                "        <subfield code=\"h\">Karl Henrik</subfield>\n" +
                "        <subfield code=\"4\">aut</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
                "        <subfield code=\"a\">Lilly macht einen Ausflug</subfield>\n" +
                "        <subfield code=\"c\">QR bog</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
                "        <subfield code=\"a\">1. udgave</subfield>\n" +
                "        <subfield code=\"b\">÷</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"260\">\n" +
                "        <subfield code=\"a\">[Værløse]</subfield>\n" +
                "        <subfield code=\"b\">DigTea</subfield>\n" +
                "        <subfield code=\"c\">2015</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
                "        <subfield code=\"a\">23 sider</subfield>\n" +
                "        <subfield code=\"b\">alle ill. i farver</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"440\">\n" +
                "        <subfield code=\"0\">norm</subfield>\n" +
                "        <subfield code=\"a\">Digilesen</subfield>\n" +
                "        <subfield code=\"o\">Lillys Leben - Niveau B</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
                "        <subfield code=\"a\">Lilly og hendes far tager på udflugt, og hendes far bestemmer at de skal ud i naturen, men Lilly ville hellere have været på shoppetur i byen. Desværre forløber turen ikke helt som planlagt</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"512\">\n" +
                "        <subfield code=\"a\">På titelsiden: Hören und lesen</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"520\">\n" +
                "        <subfield code=\"a\">Originaludgave: 2015</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
                "        <subfield code=\"b\">1. oplag</subfield>\n" +
                "        <subfield code=\"c\">2015</subfield>\n" +
                "        <subfield code=\"k\">Lasertryk</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"526\">\n" +
                "        <subfield code=\"a\">Heri QR-koder til bogens tekst indlæst</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"n\">86.4</subfield>\n" +
                "        <subfield code=\"z\">096</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"o\">84</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"s\">udflugter</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">for 11 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">for 12 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">let at læse</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
                "        <subfield code=\"o\">Mette Bødker</subfield>\n" +
                "        <subfield code=\"4\">ill</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
                "        <subfield code=\"a\">Digi lesen</subfield>\n" +
                "        <subfield code=\"x\">se</subfield>\n" +
                "        <subfield code=\"z\">440(a)</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
                "        <subfield code=\"a\">Lillys Leben - Niveau B</subfield>\n" +
                "        <subfield code=\"x\">se</subfield>\n" +
                "        <subfield code=\"z\">440(a,o)</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
                "        <subfield code=\"o\">201511</subfield>\n" +
                "        <subfield code=\"b\">b</subfield>\n" +
                "        <subfield code=\"b\">s</subfield>\n" +
                "        <subfield code=\"u\">nt</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
                "        <subfield code=\"a\">DBC</subfield>\n" +
                "    </datafield>\n" +
                "</record>\n";
        validateRecordRequestDTO.setRecord(record);
        validateRecordRequestDTO.setTemplateName("dbcsingle");
        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/validateRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(validateRecordRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));

        MessageEntryDTO[] actual =
                JSONB_CONTEXT.unmarshall(response.readEntity(String.class), MessageEntryDTO[].class);
        assertThat("List of messages is empty", actual.length, is(0));
    }

    @Test
    public void validateRecord_returns_changed_004_subfield() throws JSONBException {
        ValidateRecordRequestDTO validateRecordRequestDTO = new ValidateRecordRequestDTO();
        validateRecordRequestDTO.setTemplateName("dbcsingle");
        String record = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><record xmlns=\"info:lc/xmlns/marcxchange-v1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"info:lc/xmlns/marcxchange-v1 http://www.loc.gov/standards/iso25577/marcxchange-1-1.xsd\">\n" +
                "    <leader>00000     22000000 4500 </leader>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"001\">\n" +
                "        <subfield code=\"a\">5 158 076 1</subfield>\n" +
                "        <subfield code=\"b\">870970</subfield>\n" +
                "        <subfield code=\"c\">20150304180759</subfield>\n" +
                "        <subfield code=\"d\">20150209</subfield>\n" +
                "        <subfield code=\"f\">a</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"004\">\n" +
                "        <subfield code=\"r\">n</subfield>\n" +
                "        <subfield code=\"a\">e</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"008\">\n" +
                "        <subfield code=\"t\">m</subfield>\n" +
                "        <subfield code=\"u\">f</subfield>\n" +
                "        <subfield code=\"a\">2015</subfield>\n" +
                "        <subfield code=\"b\">dk</subfield>\n" +
                "        <subfield code=\"d\">å</subfield>\n" +
                "        <subfield code=\"d\">x</subfield>\n" +
                "        <subfield code=\"j\">f</subfield>\n" +
                "        <subfield code=\"l\">ger</subfield>\n" +
                "        <subfield code=\"o\"/>\n" +
                "        <subfield code=\"v\">0</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"009\">\n" +
                "        <subfield code=\"a\">a</subfield>\n" +
                "        <subfield code=\"g\">xx</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"e\">9788771691078</subfield>\n" +
                "        <subfield code=\"c\">hf.</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"021\">\n" +
                "        <subfield code=\"e\">9788771690651</subfield>\n" +
                "        <subfield code=\"b\">bogpakken DigiLesen nybegyndertysk</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"032\">\n" +
                "        <subfield code=\"a\">DBF201511</subfield>\n" +
                "        <subfield code=\"x\">BKM201511</subfield>\n" +
                "        <subfield code=\"a\">DBF</subfield>\n" +
                "        <subfield code=\"x\">BKM</subfield>\n" +
                "        <subfield code=\"x\">SKO</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"100\">\n" +
                "        <subfield code=\"a\">Møller</subfield>\n" +
                "        <subfield code=\"h\">Karl Henrik</subfield>\n" +
                "        <subfield code=\"4\">aut</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"245\">\n" +
                "        <subfield code=\"a\">Lilly macht einen Ausflug</subfield>\n" +
                "        <subfield code=\"c\">QR bog</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"250\">\n" +
                "        <subfield code=\"a\">1. udgave</subfield>\n" +
                "        <subfield code=\"b\">÷</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"260\">\n" +
                "        <subfield code=\"a\">[Værløse]</subfield>\n" +
                "        <subfield code=\"b\">DigTea</subfield>\n" +
                "        <subfield code=\"c\">2015</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"300\">\n" +
                "        <subfield code=\"a\">23 sider</subfield>\n" +
                "        <subfield code=\"b\">alle ill. i farver</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"440\">\n" +
                "        <subfield code=\"0\">norm</subfield>\n" +
                "        <subfield code=\"a\">Digilesen</subfield>\n" +
                "        <subfield code=\"o\">Lillys Leben - Niveau B</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"504\">\n" +
                "        <subfield code=\"a\">Lilly og hendes far tager på udflugt, og hendes far bestemmer at de skal ud i naturen, men Lilly ville hellere have været på shoppetur i byen. Desværre forløber turen ikke helt som planlagt</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"512\">\n" +
                "        <subfield code=\"a\">På titelsiden: Hören und lesen</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"520\">\n" +
                "        <subfield code=\"a\">Originaludgave: 2015</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"521\">\n" +
                "        <subfield code=\"b\">1. oplag</subfield>\n" +
                "        <subfield code=\"c\">2015</subfield>\n" +
                "        <subfield code=\"k\">Lasertryk</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"526\">\n" +
                "        <subfield code=\"a\">Heri QR-koder til bogens tekst indlæst</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"n\">86.4</subfield>\n" +
                "        <subfield code=\"z\">096</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"652\">\n" +
                "        <subfield code=\"o\">84</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"s\">udflugter</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">for 11 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">for 12 år</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"666\">\n" +
                "        <subfield code=\"u\">let at læse</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"720\">\n" +
                "        <subfield code=\"o\">Mette Bødker</subfield>\n" +
                "        <subfield code=\"4\">ill</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
                "        <subfield code=\"a\">Digi lesen</subfield>\n" +
                "        <subfield code=\"x\">se</subfield>\n" +
                "        <subfield code=\"z\">440(a)</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"945\">\n" +
                "        <subfield code=\"a\">Lillys Leben - Niveau B</subfield>\n" +
                "        <subfield code=\"x\">se</subfield>\n" +
                "        <subfield code=\"z\">440(a,o)</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"990\">\n" +
                "        <subfield code=\"o\">201511</subfield>\n" +
                "        <subfield code=\"b\">b</subfield>\n" +
                "        <subfield code=\"b\">s</subfield>\n" +
                "        <subfield code=\"u\">nt</subfield>\n" +
                "    </datafield>\n" +
                "    <datafield ind1=\"0\" ind2=\"0\" tag=\"996\">\n" +
                "        <subfield code=\"a\">DBC</subfield>\n" +
                "    </datafield>\n" +
                "</record>\n";

        validateRecordRequestDTO.setRecord(record);

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/validateRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(validateRecordRequestDTO));

        Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));

        MessageEntryDTO[] actual =
                JSONB_CONTEXT.unmarshall(response.readEntity(String.class), MessageEntryDTO[].class);
        assertThat("List of messages is one", actual.length, is(1));

        MessageEntryDTO expected = new MessageEntryDTO();
        expected.setType(TypeEnumDTO.ERROR);
        expected.setMessage("Delfelt '008o' må ikke være tomt.");
        expected.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.9.htm");
        expected.setOrdinalPositionOfField(2);
        expected.setOrdinalPositionOfSubfield(8);

        assertThat("Structured error message is correct", actual[0], is(expected));
    }

    @Test
    public void validateRecord_empty_record() throws JSONBException {
        final ValidateRecordRequestDTO validateRecordRequestDTO = new ValidateRecordRequestDTO();
        validateRecordRequestDTO.setTemplateName("dbcsingle");
        validateRecordRequestDTO.setRecord(null);

        final HttpPost httpPost = new HttpPost(httpClient)
                .withBaseUrl(openCatBusinessBaseURL)
                .withPathElements(new PathBuilder("/api/v1/validateRecord")
                        .build())
                .withJsonData(JSONB_CONTEXT.marshall(validateRecordRequestDTO));

        final Response response = httpClient.execute(httpPost);
        assertThat("Response code", response.getStatus(), is(200));

        final MessageEntryDTO[] actual =
                JSONB_CONTEXT.unmarshall(response.readEntity(String.class), MessageEntryDTO[].class);
        assertThat("List of messages is five", actual.length, is(5));

        LOGGGER.info("Actual: {}", Arrays.asList(actual));

        final MessageEntryDTO expected001 = new MessageEntryDTO();
        expected001.setType(TypeEnumDTO.ERROR);
        expected001.setMessage("Felt '001' mangler i posten");
        expected001.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.5.htm");

        final MessageEntryDTO expected004 = new MessageEntryDTO();
        expected004.setType(TypeEnumDTO.ERROR);
        expected004.setMessage("Felt '004' mangler i posten");
        expected004.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.7.htm");

        final MessageEntryDTO expected008 = new MessageEntryDTO();
        expected008.setType(TypeEnumDTO.ERROR);
        expected008.setMessage("Felt '008' mangler i posten");
        expected008.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.9.htm");

        final MessageEntryDTO expected009 = new MessageEntryDTO();
        expected009.setType(TypeEnumDTO.ERROR);
        expected009.setMessage("Felt '009' mangler i posten");
        expected009.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.a.htm");

        final MessageEntryDTO expected245 = new MessageEntryDTO();
        expected245.setType(TypeEnumDTO.ERROR);
        expected245.setMessage("Felt '245' mangler i posten");
        expected245.setUrlForDocumentation("http://www.kat-format.dk/danMARC2/Danmarc2.3a.htm");

        assertThat("Structured error message is correct", actual[0], is(expected001));
        assertThat("Structured error message is correct", actual[1], is(expected004));
        assertThat("Structured error message is correct", actual[2], is(expected008));
        assertThat("Structured error message is correct", actual[3], is(expected009));
        assertThat("Structured error message is correct", actual[4], is(expected245));
    }
}



