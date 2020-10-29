use("CheckSubfieldNotUsedInChildrenRecords");
use("GenericSettings");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckSubfieldNotUsedInChildrenRecords.validateSubfield", function () {
    function callRule(record, field, subfield) {
        return CheckSubfieldNotUsedInChildrenRecords.validateSubfield(record, field, subfield, {'context': {}}, undefined);
    }

    var bundle = ResourceBundleFactory.getBundle(CheckSubfieldNotUsedInChildrenRecords.__BUNDLE_NAME);

    // Case: No children.
    RawRepoClientCore.clear();

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx"
    );

    var record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    var field = record.fields[2];
    var subfield = field.subfields[0];
    Assert.equalValue("No children", callRule(record, field, subfield), []);

    // Case: Subfield not used in any children.
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
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];
    subfield = field.subfields[0];
    Assert.equalValue("Subfield not used in any children", callRule(record, field, subfield), []);

    // Case: Subfield used in one child record.
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
        "008 00 *t xx\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord(marcRecord);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2(marcRecord);
    field = record.fields[2];
    subfield = field.subfields[0];
    Assert.equalValue("Subfield used in one child record", callRule(record, field, subfield),
        [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "subfield.in.children.record.error", "008", "t"))]);

    RawRepoClientCore.clear();
});
