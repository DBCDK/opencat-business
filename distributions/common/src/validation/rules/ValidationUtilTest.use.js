
use("UnitTest");
use("Log");
use("ValidationUtil");

UnitTest.addFixture("ValidationUtil.isNumber", function () {
    var params1 = "42";
    Assert.equalValue("1 ValidationUtil.isNumber", ValidationUtil.isNumber(params1), true);

    var params2 = "4S2";
    Assert.equalValue("1 ValidationUtil.isNumber", ValidationUtil.isNumber(params2), false);

    var params3 = "42O";
    Assert.equalValue("1 ValidationUtil.isNumber", ValidationUtil.isNumber(params3), false);
});

UnitTest.addFixture("ValidationUtil.doesFieldContainSubfield", function () {
    var field = {
        name: '001', indicator: '00', subfields: [{
            name: "a", value: "awrong"
        }, {
            name: "b", value: "bwrong"
        }, {
            name: "c", value: "c1Val"
        }]
    };
    Assert.equalValue("1 ValidationUtil.doesFieldContainSubfield", ValidationUtil.doesFieldContainSubfield(field, "b"), true);
    Assert.equalValue("1 ValidationUtil.doesFieldContainSubfield, false", ValidationUtil.doesFieldContainSubfield(field, "z"), false);
});

UnitTest.addFixture("ValidationUtil.getFields", function () {
    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }, {
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }, {
            name: '014', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    Assert.equalValue("1 ValidationUtil.getFields, returning 1", ValidationUtil.getFields(record, "014").length, 1);
    Assert.equalValue("1 ValidationUtil.getFields, returning 2 fields", ValidationUtil.getFields(record, "001").length, 2);
    Assert.equalValue("1 ValidationUtil.getFields, 0 fields", ValidationUtil.getFields(record, "015").length, 0);
});

UnitTest.addFixture("ValidationUtil.getFirstField", function () {
    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }, {
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a2"
            }, {
                name: "b", value: "b2"
            }, {
                name: "k", value: "k2"
            }]
        }, {
            name: '014', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    Assert.equalValue("1 ValidationUtil.getFirstField, returning 1", ValidationUtil.getFirstField(record, "014"), record.fields[2]);
    Assert.equalValue("1 ValidationUtil.getFirstField, returning 2 fields", ValidationUtil.getFirstField(record, "001"), record.fields[0]);
    Assert.equalValue("1 ValidationUtil.getFirstField, 0 fields", ValidationUtil.getFirstField(record, "015"), undefined);
});

UnitTest.addFixture("ValidationUtil.recordContainsField", function () {
    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }, {
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a2"
            }, {
                name: "b", value: "b2"
            }, {
                name: "k", value: "k2"
            }]
        }, {
            name: '014', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    Assert.equalValue("1 ValidationUtil.recordContainsField", ValidationUtil.recordContainsField(record, "014"), true);
    Assert.equalValue("1 ValidationUtil.recordContainsField", ValidationUtil.recordContainsField(record, "015"), false);
});


UnitTest.addFixture("ValidationUtil.getFirstSubfieldValue", function () {
    var subfields = [{
        name: "a", value: "a1"
    }, {
        name: "b", value: "b1"
    }, {
        name: "b", value: "b2"
    }, {
        name: "k", value: "k1"
    }];

    Assert.equalValue("1 ValidationUtil.getFirstSubfieldValue", ValidationUtil.getFirstSubfieldValue(subfields, "a"), "a1");
    Assert.equalValue("1 ValidationUtil.getFirstSubfieldValue", ValidationUtil.getFirstSubfieldValue(subfields, "z"), undefined);
    Assert.equalValue("1 ValidationUtil.getFirstSubfieldValue", ValidationUtil.getFirstSubfieldValue(subfields, "b"), "b1");
});

UnitTest.addFixture("ValidationUtil.getFieldNamesAsKeys", function () {
    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }, {
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a2"
            }, {
                name: "b", value: "b2"
            }, {
                name: "k", value: "k2"
            }]
        }, {
            name: '014', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    var expectedVal = {"001": record.fields[0], "014": record.fields[2]};
    Assert.equalValue("1 ValidationUtil.recordContainsField", ValidationUtil.getFieldNamesAsKeys(record), expectedVal);
});
