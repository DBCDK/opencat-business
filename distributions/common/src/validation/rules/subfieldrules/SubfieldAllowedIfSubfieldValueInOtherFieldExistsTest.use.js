use("ResourceBundle");
use("SafeAssert");
use("UnitTest");
use("GenericSettings");
use("SubfieldAllowedIfSubfieldValueInOtherFieldExists");

UnitTest.addFixture("SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(SubfieldAllowedIfSubfieldValueInOtherFieldExists.__BUNDLE_NAME);
    var field009, field245, subfield009, subfield245, record, params;

    subfield245 = {'name': 'k'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field245]};

    params = {
        "field": "009",
        "subfield": "a",
        "values": ["a", "c", "d"],
        "context": {}
    };

    var errMsg = ResourceBundle.getStringFormat(bundle, "subfield.requires.other.subfield.value", "245", "k", "009", "a", "a,c,d");
    Assert.equalValue("SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield missing required field",
        SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield(record, field245, subfield245, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    subfield009 = {'name': 'b'};
    field009 = {'name': '009', 'subfields': [subfield009]};

    subfield245 = {'name': 'k'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field009, field245]};

    params = {
        "field": "009",
        "subfield": "a",
        "values": ["a", "c", "d"],
        "context": {}
    };

    errMsg = ResourceBundle.getStringFormat(bundle, "subfield.requires.other.subfield.value", "245", "k", "009", "a", "a,c,d");
    Assert.equalValue("SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield missing required subfield",
        SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield(record, field245, subfield245, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    subfield009 = {'name': 'a', 'value': '42'};
    field009 = {'name': '009', 'subfields': [subfield009]};

    subfield245 = {'name': 'k'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field009, field245]};

    params = {
        "field": "009",
        "subfield": "a",
        "values": ["a", "c", "d"],
        "context": {}
    };

    errMsg = ResourceBundle.getStringFormat(bundle, "subfield.requires.other.subfield.value", "245", "k", "009", "a", "a,c,d");
    Assert.equalValue("SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield missing required subfield value",
        SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield(record, field245, subfield245, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    subfield009 = {'name': 'a', 'value': 'a'};
    field009 = {'name': '009', 'subfields': [subfield009]};

    subfield245 = {'name': 'k'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field009, field245]};

    params = {
        "field": "009",
        "subfield": "a",
        "values": ["a", "c", "d"],
        "context": {}
    };

    //errMsg = ResourceBundle.getStringFormat(bundle, "subfield.requires.other.subfield.value", "245", "k", "009", "a", "a,c,d");
    Assert.equalValue("SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield OK",
        SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield(record, field245, subfield245, params), []);
});