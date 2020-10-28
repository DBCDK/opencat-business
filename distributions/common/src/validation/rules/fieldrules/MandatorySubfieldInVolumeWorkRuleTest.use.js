use("MandatorySubfieldInVolumeWorkRule");
use("RawRepoClientCore");
use("RecordUtil");
use("UnitTest");

UnitTest.addFixture("MandatorySubfieldInVolumeWorkRule.validateField.NotHeadOrVolumeRecord", function () {
    function callRule(record, field, params) {
        return MandatorySubfieldInVolumeWorkRule.validateField(record, field, params);
    }

    var record;

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n"
    ));
    Assert.equalValue("No type in record", callRule(record, record.fields[1], {subfield: "t", context: {}}), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n"
    ));
    Assert.equalValue("Record is not head or volume", callRule(record, record.fields[1], {subfield: "t", context: {}}), []);
});

UnitTest.addFixture("MandatorySubfieldInVolumeWorkRule.validateField.HeadRecord", function () {
    function callRule(record, field, params) {
        return MandatorySubfieldInVolumeWorkRule.validateField(record, field, params);
    }

    var record;
    var bundle = ResourceBundleFactory.getBundle(MandatorySubfieldInVolumeWorkRule.__BUNDLE_NAME);
    RawRepoClientCore.clear();

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n"
    ));
    Assert.equalValue("Head record with no children: OK", callRule(record, record.fields[2], {subfield: "t", context: {}}), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *h ggg\n"
    ));
    var msg = ResourceBundle.getStringFormat(bundle, "volume.work.mandatory.subfield.rule.error", "008", "t");
    Assert.equalValue("Head record with no children: Missing subfield",
        callRule(record, record.fields[2], {subfield: "t", context: {}}),
        [ValidateErrors.subfieldError("", msg)]);

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *h ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n"
    ));
    Assert.equalValue("Update Head record: Subfield in head record",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), []);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *t ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 9 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *t ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *g ggg\n"
    ));
    Assert.equalValue("Update Head record: Subfield in all volumes",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), []);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *t ddd\n" +
        "014 00 *a 2 234 567 8"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 9 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *g ggg\n"
    ));
    msg = ResourceBundle.getStringFormat(bundle, "volume.work.mandatory.subfield.rule.error", "008", "t");
    Assert.equalValue("Update Head record: Remove subfield. Subfield missing in one volume",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), [ValidateErrors.subfieldError("", msg)]);
    RawRepoClientCore.clear();
});

UnitTest.addFixture("MandatorySubfieldInVolumeWorkRule.validateField.VolumeRecord", function () {
    function callRule(record, field, params) {
        return MandatorySubfieldInVolumeWorkRule.validateField(record, field, params);
    }

    var record;
    var bundle = ResourceBundleFactory.getBundle(MandatorySubfieldInVolumeWorkRule.__BUNDLE_NAME);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *h ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    var msg = ResourceBundle.getStringFormat(bundle, "volume.work.mandatory.subfield.rule.error", "008", "t");
    Assert.equalValue("Volume record: Missing subfield",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), [ValidateErrors.subfieldError("", msg)]);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *h ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    Assert.equalValue("Volume record OK: Subfield in head record",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), []);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *h ggg\n"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *t ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    Assert.equalValue("Volume record OK: Subfield in volume record",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), []);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *t ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    Assert.equalValue("Volume record OK: Subfield in both records",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), []);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n"
    ));
    RawRepoClientCore.addRecord(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a h\n" +
        "008 00 *t ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a b\n" +
        "008 00 *h ggg\n" +
        "014 00 *a 2 234 567 8"
    ));
    msg = ResourceBundle.getStringFormat(bundle, "volume.work.mandatory.subfield.rule.error", "008", "t");
    Assert.equalValue("Mandatory subfield removed from volume record",
        callRule(record, record.fields[2], {subfield: "t", context: {}}), [ValidateErrors.subfieldError("", msg)]);
    RawRepoClientCore.clear();
});
