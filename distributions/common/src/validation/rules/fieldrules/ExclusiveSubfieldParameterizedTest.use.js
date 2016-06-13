use("UnitTest");
use("SafeAssert");
use("ExclusiveSubfieldParameterized");

UnitTest.addFixture("ExclusiveSubfieldParameterized", function () {
    var bundle = ResourceBundleFactory.getBundle(ExclusiveSubfieldParameterized.BUNDLE_NAME);
    var record = {};
    var params = {subfields: ['w', 'z']};

    var field1 = {
        name: '900', indicator: '00', subfields: [{
            name: "a", value: "aVal"
        }]
    };
    SafeAssert.equal("1 ExclusiveSubfieldParameterized test ok", ExclusiveSubfieldParameterized.validateField(record, field1, params), []);

    var field11 = {
        name: '900', indicator: '00', subfields: [{
            name: "a", value: "aVal"
        }, {
            name: "w", value: "aVal"
        }]
    };
    SafeAssert.equal("11 ExclusiveSubfieldParameterized test ok", ExclusiveSubfieldParameterized.validateField(record, field11, params), []);

    var field12 = {
        name: '900', indicator: '00', subfields: [{
            name: "a", value: "aVal"
        }, {
            name: "z", value: "aVal"
        }]
    };
    SafeAssert.equal("12 ExclusiveSubfieldParameterized test ok", ExclusiveSubfieldParameterized.validateField(record, field12, params), []);

    var field13 = {
        name: '900', indicator: '00', subfields: [{
            name: "w", value: "aVal"
        }]
    };
    SafeAssert.equal("13 ExclusiveSubfieldParameterized test ok", ExclusiveSubfieldParameterized.validateField(record, field13, params), []);

    var field14 = {
        name: '900', indicator: '00', subfields: [{
            name: "a", value: "aVal"
        }]
    };
    SafeAssert.equal("14 ExclusiveSubfieldParameterized test ok", ExclusiveSubfieldParameterized.validateField(record, field14, params), []);

    var field2 = {
        name: '900', indicator: '00', subfields: [{
            name: "z", value: "aVal"
        }, {
            name: "w", value: "bVal"
        }]
    };
    var error2 = [ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "exclusive.subfield.parameterized.rule.error", 'w', ['w', 'z']))];
    SafeAssert.equal("2 ExclusiveSubfieldParameterized test not-ok", ExclusiveSubfieldParameterized.validateField(record, field2, params), error2);

    var field3 = {
        name: '900', indicator: '00', subfields: [{
            name: "a", value: "iVal"
        }, {
            name: "b", value: "tVal"
        }, {
            name: "c", value: "eVal"
        }, {
            name: "d", value: "xVal"
        }, {
            name: "w", value: "bVal"
        }, {
            name: "z", value: "aVal"
        }]
    };
    var error3 = [
        ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "exclusive.subfield.parameterized.rule.error", "z", ['w', 'z']))
    ];
    SafeAssert.equal("3 ExclusiveSubfieldParameterized test not-ok", ExclusiveSubfieldParameterized.validateField(record, field3, params), error3);


});