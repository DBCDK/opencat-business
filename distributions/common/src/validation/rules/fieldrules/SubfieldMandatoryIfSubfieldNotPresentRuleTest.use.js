
use("StringUtil");
use("SubfieldMandatoryIfSubfieldNotPresentRule");
use("UnitTest");

UnitTest.addFixture("SubfieldMandatoryIfSubfieldNotPresentRule.validateField", function () {
    var bundle = ResourceBundleFactory.getBundle(SubfieldMandatoryIfSubfieldNotPresentRule.__BUNDLE_NAME);

/***************
 * US2139 For now we comment out the test of validateField
 * a more general solution of these exception asserts should be found
    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            }
        ]
    };
    fieldArg = recordArg.fields[0];
    Assert.exception("params is null", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), "null"));
    Assert.exception("params is undefined", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), "undefined"));
    paramsArg = {};
    Assert.exception("params is empty object", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
    paramsArg = {not_presented_subfield: "652m"};
    Assert.exception("params.subfield is undefined", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
    paramsArg = {subfield: 45, not_presented_subfield: ["652m"]};
    Assert.exception("params.subfield is not string", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
    paramsArg = {subfield: "m"};
    Assert.exception("params.not_presented_subfield is undefined", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
    paramsArg = {subfield: "m", not_presented_subfield: 47};
    Assert.exception("params.not_presented_subfield is not array", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
    paramsArg = {subfield: "m", not_presented_subfield: ["042"]};
    Assert.exception("params.not_presented_subfield is not field/subfield", StringUtil.sprintf(exceptCallFormat, JSON.stringify(recordArg), JSON.stringify(fieldArg), JSON.stringify(paramsArg)));
 **************/

    var recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            }
        ]
    };
    var fieldArg = recordArg.fields[0];
    var paramsArg = {subfield: "a", not_presented_subfield: ["001b"], context: {}};
    Assert.equalValue("001a: Mandatory without 001b", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);
    paramsArg = {subfield: "m", not_presented_subfield: ["001a"], context: {}};
    Assert.equalValue("001m: Not mandatory with 001a", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);
    paramsArg = {subfield: "m", not_presented_subfield: ["001b"], context: {}};
    var msg = ResourceBundle.getStringFormat(bundle, "mandatory.subfields.rule.error", "m", "001");
    Assert.equalValue("001m: Mandatory without 001b", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg),
        [ValidateErrors.fieldError("TODO:url", msg)]);

    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            },
            {
                name: "002", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            },
            {
                name: "003", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            }
        ]
    };
    fieldArg = recordArg.fields[0];
    paramsArg = {subfield: "a", not_presented_subfield: ["042abc", "002z", "001b"], context: {}};
    Assert.equalValue("Test 1", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);

    paramsArg = {subfield: "m", not_presented_subfield: ["042abc", "002z", "001a"], context: {}};
    Assert.equalValue("Test 2", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);

    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            },
            {
                name: "002", indicator: "00",
                subfields: [{name: "p", value: "xx"}]
            },
            {
                name: "002", indicator: "00",
                subfields: [{name: "m", value: "xx"}]
            },
            {
                name: "003", indicator: "00",
                subfields: [{name: "a", value: "xx"}]
            }
        ]
    };
    paramsArg = {subfield: "m", not_presented_subfield: ["002o"], context: {}};
    fieldArg = recordArg.fields[1];
    Assert.equalValue("Test 3", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);

    paramsArg = {subfield: "o", not_presented_subfield: ["002m"], context: {}};
    fieldArg = recordArg.fields[1];
    Assert.equalValue("Test 4", SubfieldMandatoryIfSubfieldNotPresentRule.validateField(recordArg, fieldArg, paramsArg), []);
});
