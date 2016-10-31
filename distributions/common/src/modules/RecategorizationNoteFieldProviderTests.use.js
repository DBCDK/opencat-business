use("Marc");
use("MarcClasses");
use("RawRepoClientCore");
use("RecategorizationNoteFieldProvider");
use("RecordUtil");
use("UnitTest");

UnitTest.addFixture("RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue", function () {
    function callFunction(bundle, record, fieldname, subfieldmatcher) {
        return RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(bundle, record, fieldname, subfieldmatcher);
    }

    var bundle = ResourceBundleFactory.getBundle("categorization-codes");
    var record;
    var expected;

    //-----------------------------------------------------------------------------
    //                  Single records
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "038 00 *a dr"
    );

    expected = undefined;
    Assert.equalValue("Field not found in single record", callFunction(bundle, record, "245", /a/), expected);

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "038 00 *b dr"
    );

    expected = undefined;
    Assert.equalValue("Field found and subfield not found in single record", callFunction(bundle, record, "038", /a/), expected);

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "038 00 *a dr"
    );

    expected = RecordUtil.createFieldFromString("038 00 *a " + ResourceBundle.getString(bundle, "code.038a.dr"));
    Assert.equalValue("Field and subfield found in single record", callFunction(bundle, record, "038", /a/).toString(), expected.toString());

    //-----------------------------------------------------------------------------
    //                  Field found in volume records
    //-----------------------------------------------------------------------------

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *a dr"
    );

    expected = undefined;
    Assert.equalValue("Field not found in volume record", callFunction(bundle, record, "245", /a/), expected);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *b dr"
    );

    expected = undefined;
    Assert.equalValue("Field found and subfield not found in volume record", callFunction(bundle, record, "038", /a/), expected);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *a dr"
    );

    expected = RecordUtil.createFieldFromString("038 00 *a " + ResourceBundle.getString(bundle, "code.038a.dr"));
    Assert.equalValue("Field and subfield found in volume record", callFunction(bundle, record, "038", /a/).toString(), expected.toString());
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Field found in main records
    //-----------------------------------------------------------------------------

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "038 00 *a dr"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8\n"
    );

    expected = undefined;
    Assert.equalValue("Field not found in main record", callFunction(bundle, record, "245", /a/), expected);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "038 00 *b dr"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8"
    );

    expected = undefined;
    Assert.equalValue("Field found and subfield not found in main record", callFunction(bundle, record, "038", /a/), expected);
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "038 00 *a dr"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "014 00 *a 2 234 567 8"
    );

    expected = RecordUtil.createFieldFromString("038 00 *a " + ResourceBundle.getString(bundle, "code.038a.dr"));
    Assert.equalValue("Field and subfield found in main record", callFunction(bundle, record, "038", /a/).toString(), expected.toString());
    RawRepoClientCore.clear();
});

UnitTest.addFixture("RecategorizationNoteFieldProvider.loadMergeFieldRecursive", function () {
    function callFunction(record, fieldname, subfieldmatcher) {
        return RecategorizationNoteFieldProvider.loadMergeFieldRecursive(record, fieldname, subfieldmatcher);
    }

    var record;
    var expected;

    //-----------------------------------------------------------------------------
    //                  Single records
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "038 00 *a dr"
    );

    expected = undefined;
    Assert.equalValue("Field not found in single record", callFunction(record, "245", /a/), expected);

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "038 00 *b dr"
    );

    expected = undefined;
    Assert.equalValue("Field found and subfield not found in single record", callFunction(record, "038", /a/), expected);

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "652 00 *n 85 *z 26\n" +
        "652 00 *o sk"
    );

    expected = RecordUtil.createFieldFromString("652 00 *n 85 *z 26 *o sk");
    Assert.equalValue("Field and subfield found in single record", callFunction(record, "652", /n|z|o/).toString(), expected.toString());

    //-----------------------------------------------------------------------------
    //                  Field found in main/volume records
    //-----------------------------------------------------------------------------

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919\n" +
            "004 00 *r n *a h\n" +
            "652 00 *n 15 *z 46\n"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "014 00 *a 2 234 567 8\n" +
        "652 00 *n 85 *z 26\n" +
        "652 00 *o sk"
    );

    expected = RecordUtil.createFieldFromString("652 00 *n 15 *z 46 *n 85 *z 26 *o sk");
    Assert.equalValue("Field and subfield found in main/volume record", callFunction(record, "652", /n|z|o/).toString(), expected.toString());
    RawRepoClientCore.clear();
});
