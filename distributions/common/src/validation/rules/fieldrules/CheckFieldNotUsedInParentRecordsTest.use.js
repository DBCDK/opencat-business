use("CheckFieldNotUsedInParentRecords");
use("GenericSettings");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckFieldNotUsedInParentRecords.validateField", function () {
    function callRule(record, field) {
        return CheckFieldNotUsedInParentRecords.validateField(record, field, {context: {}});
    }

    var bundle = ResourceBundleFactory.getBundle(CheckFieldNotUsedInParentRecords.__BUNDLE_NAME);


    // Test 0 - Case: Not volume record.
    // validation rule will never be run, because input record has empty parentFaust
    RawRepoClientCore.clear();

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a e\n" +
        "041 00 *a eng"
    );

    var record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    var field = record.fields[2];

    Assert.equalValue("Not volume record", callRule(record, field), []);


    // Test 1 - Case: Field used in parent record, no child records.
    // validation rule will never be run, because input record don't have field and will not meet validation rule
    RawRepoClientCore.clear();

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "041 00 *a eng"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 256 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 512 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];

    Assert.equalValue("Field used in parent record, no child records", callRule(record, field), []);


    // Test 2 - Case: Field not used in parent record, but in child records.
    // validation rule runs and validates ok, returns empty string
    RawRepoClientCore.clear();

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 512 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8\n" +
        "041 00 *a eng"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[3];

    Assert.equalValue("Field not used in parent record, but in child records", callRule(record, field), []);


    // Test 3 - Case: Field used in both parent and child record.
    // validation rule runs and validates error, returns string with validation message
    RawRepoClientCore.clear();

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "041 00 *a eng"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 512 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "041 00 *a eng *c dan \n" +
        "014 00 *a 1 234 567 8"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];

    Assert.equalValue("Field used in both parent and child record", callRule(record, field),
        [ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "field.in.parent.record.error", "041"))]);

    RawRepoClientCore.clear();
});
