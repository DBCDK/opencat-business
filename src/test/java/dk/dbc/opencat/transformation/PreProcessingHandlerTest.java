package dk.dbc.opencat.transformation;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.MarcRecordFactory;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.common.records.utils.IOUtils;
import dk.dbc.opencat.dao.RecordService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.io.InputStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class PreProcessingHandlerTest {

    @Mock
    RecordService recordService;

    @Before
    public void before() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testIgnore1() throws Exception {
        testExample("ignore/ignore-1.marc",
                "ignore/ignore-1.marc");
    }

    @Test
    public void testIgnore2() throws Exception {
        testExample("ignore/ignore-2.marc",
                "ignore/ignore-2.marc");
    }

    @Test
    public void testIgnore3() throws Exception {
        testExample("ignore/ignore-3.marc",
                "ignore/ignore-3.marc");
    }

    @Test
    public void testIgnore4() throws Exception {
        testExample("ignore/ignore-4.marc",
                "ignore/ignore-4.marc");
    }

    @Test
    public void testEbook1() throws Exception {
        testExample("ebook/ebook-1-input.marc",
                "ebook/ebook-1-output.marc");
    }

    @Test
    public void testEbook2() throws Exception {
        testExample("ebook/ebook-2-input.marc",
                "ebook/ebook-2-output.marc");
    }

    @Test
    public void testEbook3() throws Exception {
        testExample("ebook/ebook-3-input.marc",
                "ebook/ebook-3-output.marc");
    }

    @Test
    public void testEbook4() throws Exception {
        testExample("ebook/ebook-4-input.marc",
                "ebook/ebook-4-output.marc");
    }

    @Test
    public void testEbook5() throws Exception {
        testExample("ebook/ebook-5-input.marc",
                "ebook/ebook-5-output.marc");
    }

    @Test
    public void testEbook6() throws Exception {
        testExample("ebook/ebook-6-input.marc",
                "ebook/ebook-6-output.marc");
    }

    @Test
    public void testEbook7() throws Exception {
        testExample("ebook/ebook-7-input.marc",
                "ebook/ebook-7-output.marc");
    }

    @Test
    public void testEbook8() throws Exception {
        testExample("ebook/ebook-8-input.marc",
                "ebook/ebook-8-output.marc");
    }

    @Test
    public void testEbook9() throws Exception {
        testExample("ebook/ebook-9-input.marc",
                "ebook/ebook-9-output.marc");
    }

    @Test
    public void testEbook10() throws Exception {
        testExample("ebook/ebook-10-input.marc",
                "ebook/ebook-10-output.marc");
    }

    @Test
    public void testEbook11() throws Exception {
        testExample("ebook/ebook-11-input.marc",
                "ebook/ebook-11-output.marc");
    }

    @Test
    public void testEbook12() throws Exception {
        testExample("ebook/ebook-12-input.marc",
                "ebook/ebook-12-output.marc");
    }

    @Test
    public void testEbook13() throws Exception {
        testExample("ebook/ebook-13-input.marc",
                "ebook/ebook-13-output.marc");
    }

    @Test
    public void testEbook14() throws Exception {
        testExample("ebook/ebook-14-input.marc",
                "ebook/ebook-14-output.marc");
    }

    @Test
    public void testFirstEdition1() throws Exception {
        testExampleNotExistingRecord("first-edition/first-edition-1-input.marc",
                "first-edition/first-edition-1-output.marc");
    }

    @Test
    public void testFirstEdition2() throws Exception {
        testExampleNotExistingRecord("first-edition/first-edition-2-input.marc",
                "first-edition/first-edition-2-output.marc");
    }

    @Test
    public void testNewEdition1() throws Exception {
        testExample("new-edition/new-edition-1-input.marc",
                "new-edition/new-edition-1-output.marc",
                "new-edition/new-edition-1-existing.marc");
    }

    @Test
    public void testNewEdition2() throws Exception {
        testExample("new-edition/new-edition-2-input.marc",
                "new-edition/new-edition-2-output.marc",
                "new-edition/new-edition-2-existing.marc");
    }

    @Test
    public void testNewEdition3() throws Exception {
        testExample("new-edition/new-edition-3-input.marc",
                "new-edition/new-edition-3-output.marc",
                "new-edition/new-edition-3-existing.marc");
    }

    @Test
    public void testNewEdition4() throws Exception {
        testExample("new-edition/new-edition-4-input.marc",
                "new-edition/new-edition-4-output.marc",
                "new-edition/new-edition-4-existing.marc");
    }

    @Test
    public void testNewEdition5() throws Exception {
        testExample("new-edition/new-edition-5-input.marc",
                "new-edition/new-edition-5-output.marc",
                "new-edition/new-edition-5-existing.marc");
    }

    @Test
    public void testNewEdition5Null() throws Exception {
        testExampleNotExistingRecord("new-edition/new-edition-5-input.marc",
                "new-edition/new-edition-5-input.marc");
    }

    @Test
    public void testAgeInterval1() throws Exception {
        testExample("age-interval/age-interval-1-input.marc",
                "age-interval/age-interval-1-output.marc");
    }

    @Test
    public void testAgeInterval2() throws Exception {
        testExample("age-interval/age-interval-2-input.marc",
                "age-interval/age-interval-2-output.marc");
    }

    @Test
    public void testAgeInterval3() throws Exception {
        testExample("age-interval/age-interval-3-input.marc",
                "age-interval/age-interval-3-output.marc");
    }

    @Test
    public void testAgeInterval4() throws Exception {
        testExample("age-interval/age-interval-4-input.marc",
                "age-interval/age-interval-4-output.marc");
    }

    @Test
    public void testAgeInterval5() throws Exception {
        testExample("age-interval/age-interval-5-input.marc",
                "age-interval/age-interval-5-output.marc");
    }

    @Test
    public void testAgeInterval6() throws Exception {
        testExample("age-interval/age-interval-6-input.marc",
                "age-interval/age-interval-6-output.marc");
    }

    @Test
    public void testAgeInterval7() throws Exception {
        testExample("age-interval/age-interval-7-input.marc",
                "age-interval/age-interval-7-output.marc");
    }

    @Test
    public void testAgeInterval8() throws Exception {
        testExample("age-interval/age-interval-8-input.marc",
                "age-interval/age-interval-8-output.marc");
    }

    @Test
    public void testSupplierRelations1() throws Exception {
        testExample("supplier-relations/test-1-input.marc",
                "supplier-relations/test-1-expected.marc");
    }

    @Test
    public void testSupplierRelations2() throws Exception {
        testExample("supplier-relations/test-2-input.marc",
                "supplier-relations/test-2-expected.marc");
    }

    @Test
    public void testSupplierRelations3() throws Exception {
        testExample("supplier-relations/test-3-input.marc",
                "supplier-relations/test-3-expected.marc");
    }

    @Test
    public void testSupplierRelations4() throws Exception {
        testExample("supplier-relations/test-4-input.marc",
                "supplier-relations/test-4-expected.marc");
    }

    @Test
    public void testSupplierRelations5() throws Exception {
        testExample("supplier-relations/test-5-input.marc",
                "supplier-relations/test-5-expected.marc");
    }

    @Test
    public void testSupplierRelations6() throws Exception {
        testExample("supplier-relations/test-6-input.marc",
                "supplier-relations/test-6-expected.marc");
    }

    @Test
    public void testSupplierRelations7() throws Exception {
        testExample("supplier-relations/test-7-input.marc",
                "supplier-relations/test-7-expected.marc");
    }

    @Test
    public void testSupplierRelations8() throws Exception {
        testExample("supplier-relations/test-8-input.marc",
                "supplier-relations/test-8-expected.marc");
    }

    @Test
    public void testSupplierRelations9() throws Exception {
        final MarcRecord head = loadRecord("supplier-relations/test-9-head.marc");
        final MarcRecord actual = loadRecord("supplier-relations/test-9-input.marc");
        final MarcRecord expected = loadRecord("supplier-relations/test-9-expected.marc");

        when(recordService.recordExists(anyString(), anyInt())).thenReturn(false);
        when(recordService.recordExists(eq("46079922"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("46079922"), eq(870970))).thenReturn(head);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(actual);

        new MarcRecordWriter(actual).sort();
        assertThat(actual, equalTo(expected));
    }

    @Test
    public void testSupplierRelations10() throws Exception {
        testExample("supplier-relations/test-10-input.marc",
                "supplier-relations/test-10-expected.marc");
    }

    @Test
    public void testSupplierRelations11() throws Exception {
        testExample("supplier-relations/test-11-input.marc",
                "supplier-relations/test-11-expected.marc");
    }

    @Test
    public void testSupplierRelations12() throws Exception {
        testExample("supplier-relations/test-12-input.marc",
                "supplier-relations/test-12-expected.marc");
    }

    @Test
    public void testPreviousISBN1() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-1-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-1-expected.marc");
        final MarcRecord previous = loadRecord("isbn-previous-version/test-1-rawrepo-29469237-870970.marc");

        when(recordService.recordExists(eq("29469237"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("29469237"), eq(870970))).thenReturn(previous);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN2() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-2-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-2-expected.marc");
        final MarcRecord previous1 = loadRecord("isbn-previous-version/test-2-rawrepo-52079020-870970.marc");
        final MarcRecord previous2 = loadRecord("isbn-previous-version/test-2-rawrepo-52106249-870970.marc");

        when(recordService.recordExists(eq("52079020"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("52079020"), eq(870970))).thenReturn(previous1);
        when(recordService.recordExists(eq("52106249"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("52106249"), eq(870970))).thenReturn(previous2);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN3_ParentIsHead() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-3-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-3-expected.marc");
        final MarcRecord previous = loadRecord("isbn-previous-version/test-3-rawrepo-05259282-870970.marc");
        final MarcRecord requestParent = loadRecord("isbn-previous-version/test-3-rawrepo-54948441-870970.marc");

        when(recordService.recordExists(eq("05259282"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("05259282"), eq(870970))).thenReturn(previous);
        when(recordService.recordExists(eq("54948441"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("54948441"), eq(870970))).thenReturn(requestParent);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN3_ParentIsSection() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-3-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-3-request.marc");
        final MarcRecord previous = loadRecord("isbn-previous-version/test-3-rawrepo-05259282-870970.marc");
        final MarcRecord requestParent = loadRecord("isbn-previous-version/test-3-rawrepo-54948441-870970-section.marc");

        when(recordService.recordExists(eq("05259282"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("05259282"), eq(870970))).thenReturn(previous);
        when(recordService.recordExists(eq("54948441"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("54948441"), eq(870970))).thenReturn(requestParent);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN4() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-4-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-4-expected.marc");
        final MarcRecord previous = loadRecord("isbn-previous-version/test-4-rawrepo-29469237-870970.marc");

        when(recordService.recordExists(eq("29469237"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("29469237"), eq(870970))).thenReturn(previous);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN5() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-5-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-5-expected.marc");
        final MarcRecord previous1 = loadRecord("isbn-previous-version/test-5-rawrepo-52079020-870970.marc");
        final MarcRecord previous2 = loadRecord("isbn-previous-version/test-5-rawrepo-52106249-870970.marc");

        when(recordService.recordExists(eq("52079020"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("52079020"), eq(870970))).thenReturn(previous1);
        when(recordService.recordExists(eq("52106249"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("52106249"), eq(870970))).thenReturn(previous2);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN6() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-6-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-6-request.marc");

        when(recordService.recordExists(eq("29469237"), eq(870970))).thenReturn(false);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    @Test
    public void testPreviousISBN7() throws Exception {
        final MarcRecord request = loadRecord("isbn-previous-version/test-7-request.marc");
        final MarcRecord expected = loadRecord("isbn-previous-version/test-7-expected.marc");
        final MarcRecord headVolume = loadRecord("isbn-previous-version/test-7-rawrepo-head-volume.marc");
        final MarcRecord sectionVolume = loadRecord("isbn-previous-version/test-7-rawrepo-section-volume.marc");
        final MarcRecord previous = loadRecord("isbn-previous-version/test-7-rawrepo-50953033-870970.marc");

        when(recordService.recordExists(eq("50953033"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("50953033"), eq(870970))).thenReturn(previous);
        when(recordService.recordExists(eq("27364500"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("27364500"), eq(870970))).thenReturn(headVolume);
        when(recordService.recordExists(eq("27430961"), eq(870970))).thenReturn(true);
        when(recordService.fetchRecord(eq("27430961"), eq(870970))).thenReturn(sectionVolume);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(request);

        new MarcRecordWriter(request).sort();
        assertThat(request, equalTo(expected));
    }

    private void testExample(String inputFileName, String expectedFileName) throws Exception {
        final MarcRecord actual = loadRecord(inputFileName);
        final MarcRecord expected = loadRecord(expectedFileName);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(actual);

        assertThat(actual, equalTo(expected));
    }

    private void testExample(String inputFileName, String expectedFileName, String existingFileName) throws Exception {
        final MarcRecord actual = loadRecord(inputFileName);
        final MarcRecord expected = loadRecord(expectedFileName);
        final MarcRecord existing = existingFileName != null ? loadRecord(existingFileName) : null;

        when(recordService.recordExistsMaybeDeleted(anyString(), anyInt())).thenReturn(existingFileName != null);
        when(recordService.fetchRecord(anyString(), anyInt())).thenReturn(existing);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(actual);

        assertThat(actual, equalTo(expected));
    }

    private void testExampleNotExistingRecord(String inputFileName, String expectedFileName) throws Exception {
        final MarcRecord actual = loadRecord(inputFileName);
        final MarcRecord expected = loadRecord(expectedFileName);

        when(recordService.recordExists(anyString(), anyInt())).thenReturn(false);

        PreProcessingHandler preProcessingHandler = new PreProcessingHandler(recordService);
        preProcessingHandler.preProcess(actual);

        assertThat(actual, equalTo(expected));
    }

    private static MarcRecord loadRecord(String filename) throws IOException {
        InputStream is = MetaCompassHandlerTest.class.getResourceAsStream("/dk/dbc/opencat/transformation/preprocessing/" + filename);
        return MarcRecordFactory.readRecord(IOUtils.readAll(is, "UTF-8"));
    }

}
