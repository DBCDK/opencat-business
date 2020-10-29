use("CheckFieldNotUsedInChildrenRecords");
use("GenericSettings");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckFieldNotUsedInChildrenRecords.validateField", function () {
    function callRule(record, field) {
        return CheckFieldNotUsedInChildrenRecords.validateField(record, field, {context: {}});
    }

    var bundle = ResourceBundleFactory.getBundle(CheckFieldNotUsedInChildrenRecords.__BUNDLE_NAME);

    // Case: No children.
    RawRepoClientCore.clear();

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a e\n" +
        "041 00 *a eng"
    );

    var record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    var field = record.fields[2];
    var subfield = field.subfields[0];
    Assert.equalValue("No children", callRule(record, field, subfield), []);

    // Case: Field not used in any children.
    RawRepoClientCore.clear();

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
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "041 00 *a eng"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];
    subfield = field.subfields[0];
    Assert.equalValue("Field not used in any children", callRule(record, field), []);

    // Case: Field used in one child record.
    RawRepoClientCore.clear();

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
        "041 00 *s eng\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "041 00 *a eng"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];
    Assert.equalValue("Field used in one child record", callRule(record, field),
        [ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "field.in.children.record.error", "041"))]);

    RawRepoClientCore.clear();
});
