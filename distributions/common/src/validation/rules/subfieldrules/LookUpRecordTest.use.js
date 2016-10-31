use("SafeAssert");
use("RawRepoClient");
use("UnitTest");
use("Marc");
use("LookUpRecord");

UnitTest.addFixture("LookUpRecord", function () {
    var bundle = ResourceBundleFactory.getBundle(LookUpRecord.__BUNDLE_NAME);

    // creating common record in rawrepo
    var trueMarcRec = new Record();
    var field001 = new Field("001", "00");
    field001.append(new Subfield("a", "a1Val"));
    field001.append(new Subfield("b", "870970"));
    trueMarcRec.append(field001);
    var field004 = new Field("004", "00");
    field004.append(new Subfield("a", "a1"));
    field004.append(new Subfield("a", "a2"));
    field004.append(new Subfield("b", "b1"));
    trueMarcRec.append(field004);
    RawRepoClientCore.addRecord(trueMarcRec);

    // creating local record in rawrepo
    trueMarcRec = new Record();
    field001 = new Field("001", "00");
    field001.append(new Subfield("a", "a1Val"));
    field001.append(new Subfield("b", "400800"));
    trueMarcRec.append(field001);
    field004 = new Field("004", "00");
    field004.append(new Subfield("a", "a1"));
    field004.append(new Subfield("a", "a2"));
    field004.append(new Subfield("b", "b1"));
    trueMarcRec.append(field004);
    RawRepoClientCore.addRecord(trueMarcRec);

    var record = {
        fields: [
            {
                name: '001', indicator: '00',
                subfields: [
                    {name: "a", value: "awrong"},
                    {name: "b", value: "870970"},
                    {name: "c", value: "c1Val"}
                ]
            }
        ]
    };
    var field = record.fields[0];
    var subfield = field.subfields[0];
    var errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", "awrong", "870970");
    var errors1a = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("001a og 001b mismatch, findes ikke i repo", LookUpRecord.validateSubfield(record, field, subfield, {}), errors1a);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "870970"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    SafeAssert.equal("Common record findes i repo", LookUpRecord.validateSubfield(record, field, subfield, {}), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "870970"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    SafeAssert.equal("Local record findes i repo", LookUpRecord.validateSubfield(record, field, subfield, {}), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "870970"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", "awrong", "870970");
    errors1a = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("001 a mismatch", LookUpRecord.validateSubfield(record, field, subfield, {}), errors1a);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "700600"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", "a1Val", "700600");
    errors1a = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("001 b mismatch", LookUpRecord.validateSubfield(record, field, subfield, {}), errors1a);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "870970"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    var params = {"agencyId": "600200"};
    errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", "a1Val", "600200");
    errors1a = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med ikke matchende params", LookUpRecord.validateSubfield(record, field, subfield, params), errors1a);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970"};
    SafeAssert.equal("med matchende params", LookUpRecord.validateSubfield(record, field, subfield, params), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {
        "agencyId": "870970",
        "allowedSubfieldValues": ["a1", "a2", "a3"],
        "requiredFieldAndSubfield": "004a"
    };
    SafeAssert.equal("med valide allowedSubfieldValues og requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {
        "agencyId": "870970",
        "allowedSubfieldValues": ["nonValidValue1", "nonValidValue2", "nonValidValue3"],
        "requiredFieldAndSubfield": "004a"
    };
    errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.values", "a1Val", "nonValidValue1,nonValidValue2,nonValidValue3", "004a");
    var err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med ikke valide allowedSubfieldValues men valid requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {
        "agencyId": "870970",
        "allowedSubfieldValues": ["nonValidValue1", "nonValidValue2", "a2"],
        "requiredFieldAndSubfield": "004a"
    };
    SafeAssert.equal("med valid allowedSubfieldValues og valid requiredFieldAndSubfield med check af andet subfield", LookUpRecord.validateSubfield(record, field, subfield, params), []);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {
        "agencyId": "870970",
        "allowedSubfieldValues": ["a1", "a2", "a3"],
        "requiredFieldAndSubfield": "005a"
    };
    errorMessage = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.values", "a1Val", "a1,a2,a3", "005a");
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid allowedSubfieldValues men ikke valide requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970", "allowedSubfieldValues": ["a1", "a2", "a3"]};
    errorMessage = 'Params attributten allowedSubfieldValues er angivet men requiredFieldAndSubfield mangler';
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid allowedSubfieldValues mangler requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970", "requiredFieldAndSubfield": "005a"};
    errorMessage = 'Params attributten requiredFieldAndSubfield er angivet men allowedSubfieldValues mangler';
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid requiredFieldAndSubfield mangler allowedSubfieldValues ", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970", "allowedSubfieldValues": {}, "requiredFieldAndSubfield": "005a"};
    errorMessage = 'Params attributten allowedSubfieldValues er ikke af typen array';
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid allowedSubfieldValues men ikke valide requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970", "allowedSubfieldValues": [], "requiredFieldAndSubfield": "005a"};
    errorMessage = 'Params attributten allowedSubfieldValues skal minimum indeholde een v\u00E6rdi';
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid allowedSubfieldValues men ikke valide requiredFieldAndSubfield", LookUpRecord.validateSubfield(record, field, subfield, params), err);

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };
    field = record.fields[0];
    subfield = field.subfields[0];
    params = {"agencyId": "870970", "allowedSubfieldValues": ["a1", "a2", "a3"], "requiredFieldAndSubfield": {}};
    errorMessage = 'Params attributten requiredFieldAndSubfield er ikke af typen string';
    err = [{type: "ERROR", urlForDocumentation: "", message: errorMessage}];
    SafeAssert.equal("med valid allowedSubfieldValues men ikke valid requiredFieldAndSubfield type", LookUpRecord.validateSubfield(record, field, subfield, params), err);
});