use("CheckFaust");
use("DanMarc2Converter");
use("GenericSettings");
use("RecordUtil");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckFaust.validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(CheckFaust.__BUNDLE_NAME);
    var record;
    var field;
    var subfield;
    var error;
    var params = undefined;

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("1 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 43640224 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("2 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984507 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.faust.error", subfield.name, subfield.value))];
    Assert.equalValue("3 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), error);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508A *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.faust.digit.error", subfield.name))];
    Assert.equalValue("4 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), error);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 42 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.faust.length.error", subfield.name, 8))];
    Assert.equalValue("5 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), error);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 5098 4508 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("6 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a  5 0 9 8  4 5 0 8   *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("7 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 22438980 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("8 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 497290236 *b 710100"));
    field = record.fields[0];
    subfield = field.subfields[0];
    Assert.equalValue("9 CheckFaust.validateSubfield with valid faust number with 9 digits", CheckFaust.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 497290236 *b 870970"));
    field = record.fields[0];
    subfield = field.subfields[0];
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.faust.common.records.length.error", subfield.name))];
    Assert.equalValue("10 CheckFaust.validateSubfield with failed faust number with 9 digits for common records", CheckFaust.validateSubfield(record, field, subfield, params), error);
});