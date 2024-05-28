package dk.dbc.opencat.transformation;

import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.marc.binding.DataField;
import dk.dbc.marc.binding.Leader;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.binding.SubField;
import dk.dbc.marc.reader.DanMarc2LineFormatReader;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.opencat.dao.RecordService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;

import static dk.dbc.marc.reader.DanMarc2LineFormatReader.DEFAULT_LEADER;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.when;

public class MetaCompassHandlerTest {

    @Mock
    RecordService recordService;

    @Before
    public void before() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testEnrichMetaCompassRecord_NoExistingFields() throws Exception {
        final String bibliographicRecordId = "134798769";
        final int agencyId = 870970;
        final MarcRecord existing = loadRecord("enrich-metacompass-1-existing.marc");
        final MarcRecord expected = loadRecord("enrich-metacompass-1-expected.marc");
        final MarcRecord input = loadRecord("enrich-metacompass-1-input.marc");

        final MetaCompassHandler metaCompassHandler = new MetaCompassHandler(recordService);
        when(recordService.recordExists(bibliographicRecordId, agencyId)).thenReturn(true);
        when(recordService.fetchMergedDBCRecord(bibliographicRecordId, RecordService.DBC_ENRICHMENT)).thenReturn(existing);

        final MarcRecord actual = metaCompassHandler.enrichMetaCompassRecord(input);

        assertThat(actual, is(expected));
    }

    @Test
    public void testMetaCompassCopy_New() throws Exception {
        MarcRecord actual = loadRecord("metacompass-copy-test-1-input.marc");
        MarcRecord expected = loadRecord("metacompass-copy-test-1-expected.marc");

        MetaCompassHandler.copyMetakompasFields(actual);

        new MarcRecordWriter(actual).sort();

        assertThat(actual, is(expected));
    }

    @Test
    public void testMetaCompassCopy_Update() throws Exception {
        MarcRecord actual = loadRecord("metacompass-copy-test-2-input.marc");
        MarcRecord expected = loadRecord("metacompass-copy-test-2-expected.marc");

        MetaCompassHandler.copyMetakompasFields(actual);

        new MarcRecordWriter(actual).sort();

        assertThat(actual, is(expected));
    }

    @Test
    public void testMetaCompassCopy_ACC() throws Exception {
        MarcRecord actual = loadRecord("metacompass-copy-test-3-input.marc");
        MarcRecord expected = loadRecord("metacompass-copy-test-3-expected.marc");

        MetaCompassHandler.copyMetakompasFields(actual);

        new MarcRecordWriter(actual).sort();

        assertThat(actual, is(expected));
    }

    @Test
    public void test_isYearInterval() {
        assertThat(MetaCompassHandler.isYearInterval("999-0"), is(true));
        assertThat(MetaCompassHandler.isYearInterval("0-10"), is(true));
        assertThat(MetaCompassHandler.isYearInterval("10-90"), is(true));
        assertThat(MetaCompassHandler.isYearInterval("500-600"), is(true));
        assertThat(MetaCompassHandler.isYearInterval("1990-2000"), is(true));
        assertThat(MetaCompassHandler.isYearInterval("9990-10000"), is(true));

        assertThat(MetaCompassHandler.isYearInterval("2400 BC - 23500"), is(false));
        assertThat(MetaCompassHandler.isYearInterval("år 1900 til år 2000"), is(false));
        assertThat(MetaCompassHandler.isYearInterval(""), is(false));
        assertThat(MetaCompassHandler.isYearInterval("-"), is(false));
        assertThat(MetaCompassHandler.isYearInterval("1942-"), is(false));
        assertThat(MetaCompassHandler.isYearInterval("not a year interval"), is(false));
    }

    @Test
    public void test_addMinusProofPrinting() {
        DataField field = new DataField("001", "00").addAllSubFields(Arrays.asList(
                new SubField('a', "12345678"),
                new SubField('b', "870970")));
        MarcRecord record = new MarcRecord()
                .addAllFields(Collections.singletonList(field))
                .setLeader(new Leader().setData(DEFAULT_LEADER));

        MarcRecord actual = new MarcRecord(record);
        MarcRecord expected = new MarcRecord(record);
        new MarcRecordWriter(expected).addOrReplaceSubField("z98", 'a', "Minus korrekturprint");

        MetaCompassHandler.addMinusProofPrinting(actual);

        assertThat(actual, is(expected));
    }

    private static MarcRecord loadRecord(String filename) throws MarcReaderException, FileNotFoundException {
        final ClassLoader classLoader = MetaCompassHandlerTest.class.getClassLoader();
        final File file = new File(Objects.requireNonNull(classLoader.getResource("dk/dbc/opencat/transformation/metacompass/" + filename)).getFile());
        final InputStream is = new FileInputStream(file);

        final DanMarc2LineFormatReader lineFormatReader = new DanMarc2LineFormatReader(is, StandardCharsets.UTF_8);

        return lineFormatReader.read();
    }
}
