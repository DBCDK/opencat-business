use("DanMarc2Converter");
use("GenericSettings");
use("RecordUtil");
use("ResourceBundle");
use("SubfieldCannotContainValue");
use("UnitTest");

UnitTest.addFixture("SubfieldCannotContainValue.validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(SubfieldCannotContainValue.__BUNDLE_NAME);
    var record;
    var field;
    var subfield;
    var error;
    var params;

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c 42"));
    field = record.fields[0];
    subfield = field.subfields[2];
    var errorMsg = [{type: "ERROR", urlForDocumentation: "TODO:fixurl", message: ResourceBundle.getStringFormat(bundle, "subfield.cannot.contain.value.rule.error", "c", "42")}];

    params = {values: []};
    Assert.equalValue("1. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42"]};
    Assert.equalValue("2. subfieldCannotContainValue with value that is not allowed", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: [42]};
    Assert.equalValue("3. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["30", "x"]};
    Assert.equalValue("4. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42", "x"]};
    Assert.equalValue("5. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"]};
    Assert.equalValue("6. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"]};
    Assert.equalValue("7. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"], notcondition: {subfield: "001b", value: "710100"}};
    Assert.equalValue("8. subfieldCannotContainValue meet condition", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42", "x"], notcondition: {subfield: "001b", value: "870970"}};
    Assert.equalValue("9. subfieldCannotContainValue does not meet condition", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);
});
