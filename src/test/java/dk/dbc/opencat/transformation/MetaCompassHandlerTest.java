/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.transformation;

import dk.dbc.common.records.MarcField;
import dk.dbc.common.records.MarcRecord;
import dk.dbc.common.records.MarcRecordFactory;
import dk.dbc.common.records.MarcRecordWriter;
import dk.dbc.common.records.MarcSubField;
import dk.dbc.common.records.utils.IOUtils;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class MetaCompassHandlerTest {

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
        MarcField field = new MarcField("001", "00", Arrays.asList(
                new MarcSubField("a", "12345678"),
                new MarcSubField("b", "870970")));
        MarcRecord record = new MarcRecord(Collections.singletonList(field));

        MarcRecord actual = new MarcRecord(record);
        MarcRecord expected = new MarcRecord(record);
        new MarcRecordWriter(expected).addOrReplaceSubfield("z98", "a", "Minus korrekturprint");

        MetaCompassHandler.addMinusProofPrinting(actual);

        assertThat(actual, is(expected));
    }

    private static MarcRecord loadRecord(String filename) throws IOException {
        InputStream is = MetaCompassHandlerTest.class.getResourceAsStream("/dk/dbc/opencat/transformation/metacompass/" + filename);
        return MarcRecordFactory.readRecord(IOUtils.readAll(is, "UTF-8"));
    }
}
