use("DanMarc2Converter");
use("GenericSettings");
use("RecordUtil");
use("ResourceBundle");
use("SafeAssert");
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
    var errorMsg = [{
        type: "ERROR",
        params: {
            param: [{
                key: "message",
                value: ResourceBundle.getStringFormat(bundle, "subfield.cannot.contain.value.rule.error", "c", "42")
            }, {
                key: "url",
                value: "TODO:fixurl"
            }, {
                key: "pid",
                value: "50984508:710100"
            }]
        }
    }];

    params = {values: []};
    SafeAssert.equal("1. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42"]};
    SafeAssert.equal("2. subfieldCannotContainValue with value that is not allowed", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: [42]};
    SafeAssert.equal("3. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["30", "x"]};
    SafeAssert.equal("4. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42", "x"]};
    SafeAssert.equal("5. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"]};
    SafeAssert.equal("6. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"]};
    SafeAssert.equal("7. subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values: ["42", "x"], notcondition: {subfield: "001b", value: "710100"}};
    SafeAssert.equal("8. subfieldCannotContainValue meet condition", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    params = {values: ["42", "x"], notcondition: {subfield: "001b", value: "870970"}};
    SafeAssert.equal("9. subfieldCannotContainValue does not meet condition", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);
});
