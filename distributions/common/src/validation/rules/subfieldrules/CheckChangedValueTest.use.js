use("CheckChangedValue");
use("GenericSettings");
use("ResourceBundle");
use("SafeAssert");
use("UnitTest");

UnitTest.addFixture("CheckChangedValue.validateSubfield", function () {
    var params;
    var bundle = ResourceBundleFactory.getBundle(CheckChangedValue.__BUNDLE_NAME);

    var msg_format = ResourceBundle.getStringFormat(bundle, "check.changed.value.error", "004", "a", "%s", "%s");

    params = {toValues: [], fromValues: []};
    SafeAssert.equal("Empty param values", CheckChangedValue.validateSubfield({fields: []}, {}, {}, params),
        [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getString(bundle, "agencyid.not.a.number"))]);

    params = {toValues: ["e", "b"], fromValues: ["s", "h"]};
    SafeAssert.equal("Params with new empty record", CheckChangedValue.validateSubfield({fields: []}, {}, {}, params),
        [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getString(bundle, "agencyid.not.a.number"))]);

    var record = {};
    var field = {};
    var subfield = {};
    var marcRecord = undefined;

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b xxx\n" +
        "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};
    SafeAssert.equal("001b is NaN", CheckChangedValue.validateSubfield(record, field, subfield, params),
        [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getString(bundle, "agencyid.not.a.number"))]);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};
    SafeAssert.equal("New record with type not in fromValues", CheckChangedValue.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};
    SafeAssert.equal("New record with type in fromValues", CheckChangedValue.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};
    SafeAssert.equal("Update record with same record type", CheckChangedValue.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};

    SafeAssert.equal("Update record with unknown old value and unknown new value",
        CheckChangedValue.validateSubfield(record, field, subfield, params),
        []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};

    SafeAssert.equal("Update record with known old value and unknown new value",
        CheckChangedValue.validateSubfield(record, field, subfield, params),
        []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a h"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["s", "h"]};

    SafeAssert.equal("Update record with unknown old value and known new value",
        CheckChangedValue.validateSubfield(record, field, subfield, params),
        []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a s"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["b", "e"]};

    Assert.equal("Update record with wrong record type", CheckChangedValue.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", "Delfelt 004a må ikke ændre sig fra e til s")]);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a b"
    );
    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[1];
    subfield = field.subfields[0];
    params = {fromValues: ["e", "b"], toValues: ["b", "e"]};

     Assert.equal("Update record with wrong record type", CheckChangedValue.validateSubfield(record, field, subfield, params), []);


});