package dk.dbc.opencat.dao;

import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.binding.DataField;
import dk.dbc.marc.binding.SubField;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
This class is brutally stolen from commons where it replaced the :
import dk.dbc.common.records.utils.RecordContentTransformer;
Will die in a couple of years
 */
/**
 * @brief Implements a reader to read a marc record in line format to construct
 * a MarcRecord instance.
 */
public class MarcRecordFactory {
    public static final String FIELD_PATTERN = "((\\d|\\w){3})\\s((\\s|\\d){2}).*";

    private MarcRecordFactory() {
    }

    public static MarcRecord readRecord(String str) {
        String[] list = str.split("\n");
        ArrayList<DataField> fields = new ArrayList<>();
        for (String s : list) {
            s = s.trim();
            if (s.matches(FIELD_PATTERN)) {
                fields.add(readField(s));
            }
        }
        MarcRecord returnRecord = new MarcRecord();
        returnRecord.addAllFields(fields);
        return returnRecord;
    }

    public static DataField readField(String str) {
        if (str == null) {
            return null;
        }

        Pattern p = Pattern.compile(FIELD_PATTERN);
        Matcher m = p.matcher(str);

        if (!m.matches()) {
            return null;
        }

        int index = str.indexOf('*');
        if (index == -1) {
            return new DataField(m.group(1), m.group(3));
        }

        ArrayList<SubField> subfields = new ArrayList<>();
        String[] list = str.substring(index).split("(?=(\\*[^\\*@]))");
        for (String s : list) {
            s = s.trim();
            if (s.startsWith("*")) {
                subfields.add(readSubField(s));
            }
        }
        DataField returnField = new DataField(m.group(1), m.group(3));
        returnField.addAllSubFields(subfields);
        return returnField;
    }

    public static SubField readSubField(String str) {
        if (str == null) {
            return null;
        }
        if (str.length() < 2) {
            return null;
        }
        return new SubField(str.charAt(1), str.substring(2).replace("@*", "*").trim());
    }
}

