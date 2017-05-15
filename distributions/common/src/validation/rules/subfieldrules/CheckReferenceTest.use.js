use("CheckReference");
use("GenericSettings");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckReference.validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(CheckReference.__BUNDLE_NAME);

    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }]
        }, {
            name: '910', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "z", 'value': "710"
            }]
        }]
    };
    var subfield = {
        'name': "z", 'value': "710"
    };
    Assert.equalValue("1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield(record, undefined, subfield), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }]
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "\u00E5", 'value': "42"
            }]
        }, {
            name: '910', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "z", 'value': "710"
            }]
        }]
    };
    subfield = {
        'name': "z", 'value': "710"
    };
    var err = [{
        type: "ERROR",
        urlForDocumentation: "TODO:fixurl",
        message: "Felt '710' findes ikke i posten uden et delfelt å"
    }];
    Assert.equalValue("1 CheckReference.validateSubfield field exists and with a 710 field with danish aa", CheckReference.validateSubfield(record, undefined, subfield), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '002', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }, {
                'name': "d", 'value': "42"
            }, {
                'name': "e", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }]
    };
    subfield = {
        'name': "a", 'value': "001"
    };
    Assert.equalValue("1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield(record, undefined, subfield), []);

    subfield = {
        'name': "a", 'value': "005"
    };
    var error005Missing = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.field", "005"))];
    Assert.equalValue("2 CheckReference.validateSubfield field exists", CheckReference.validateSubfield(record, undefined, subfield), error005Missing);

    subfield = {
        'name': "a", 'value': "005/12345"
    };
    Assert.equalValue("2,1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield(record, undefined, subfield), error005Missing);

    subfield = {
        'name': "a", 'value': "003/12345"
    };
    Assert.equalValue("3 CheckReference.validateSubfield , valid check that value after forwardslash is present in subfield \u00E5", CheckReference.validateSubfield(record, undefined, subfield), []);

    subfield = {
        'name': "a", 'value': "004/12345(a,b,c)"
    };
    Assert.equalValue("5 CheckReference.validateSubfield valid value with forwardslashval and parenthesis", CheckReference.validateSubfield(record, undefined, subfield), []);

    subfield = {
        'name': "a", 'value': "004/12345(a,b,c,d)"
    };
    var err004MissingD = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "d"))];
    Assert.equalValue("6 CheckReference.validateSubfield valid value with forwardslash val and parenthesis, missing d", CheckReference.validateSubfield(record, undefined, subfield), err004MissingD);

    var errD = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "d"));
    var errE = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "e"));
    var errF = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "f"));
    var errG = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "g"));
    var errH = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 1, "004", "h"));
    var errFTwo = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 2, "004", "f"));
    var errGTwo = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 2, "004", "g"));
    var errHTwo = ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", 2, "004", "h"));
    var errArr = [errD, errE, errF, errG, errH, errFTwo, errGTwo, errHTwo];
    subfield = {
        'name': "a", 'value': "004/12345(a,b,c,d,e,f,g,h)"
    };
    Assert.equalValue("7 CheckReference.validateSubfield valid value with forward slash val and parenthesis, missing d", CheckReference.validateSubfield(record, undefined, subfield), errArr);

    subfield = {'name': 'a', 'value': '004'};
    err = [{
        type: "ERROR",
        urlForDocumentation: "TODO:fixurl",
        message: "Felt '004' findes ikke i posten uden et delfelt å"
    }];
    Assert.equalValue("8 CheckReference.validateSubfield error, valid value without forward slash but no field without 'å' subfield", CheckReference.validateSubfield(record, undefined, subfield), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '002', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "\u00E5", 'value': "1"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }, {
                'name': "d", 'value': "42"
            }, {
                'name': "e", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }]
    };
    subfield = {'name': 'a', 'value': '004/1(c1, c2)'};
    var errorMessage = [ValidateErrors.subfieldError('TODO:fixurl', ResourceBundle.getStringFormat(bundle, "check.ref.subfield.not.repeated", "c", "004", 2))];
    Assert.equalValue("9 CheckReference.validateSubfield error, subfield not repeated correctly", CheckReference.validateSubfield(record, undefined, subfield), errorMessage);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '002', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: []
        }, {
            name: '003', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "\u00E5", 'value': "1"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }]
        }, {
            name: '004', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }, {
                'name': "b", 'value': "42"
            }, {
                'name': "c", 'value': "42"
            }, {
                'name': "d", 'value': "42"
            }, {
                'name': "e", 'value': "42"
            }, {
                'name': "\u00E5", 'value': "12345"
            }]
        }]
    };
    subfield = {'name': 'a', 'value': '004/1(c1,c2,b)'};
    Assert.equalValue("10 CheckReference.validateSubfield ok, subfield repeated correctly", CheckReference.validateSubfield(record, undefined, subfield), []);
});