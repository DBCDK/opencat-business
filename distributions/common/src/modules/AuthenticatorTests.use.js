use("Authenticator");
use("RawRepoClientCore");
use("UnitTest");
use("RecordUtil");
use("UpdateConstants");
use("ResourceBundle");
use("Log");

UnitTest.addFixture("Authenticator.authenticateRecordEntryPoint", function () {
    var LOGIN_AGENCY_ID = "010100";
    var bundle = ResourceBundleFactory.getBundle(Authenticator.__BUNDLE_NAME);
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";
    var FBS_AGENCY_AUTH_DBC_RECORDS = "712345";
    var FBS_AGENCY_AUTH_RET_RECORD = "754321";
    var FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD = "654321";
    var curRecord;
    var record;

    OpenAgencyClientCore.addFeatures(LOGIN_AGENCY_ID, [UpdateConstants.AUTH_ROOT_FEATURE]);
    OpenAgencyClientCore.addFeatures(FBS_AGENCY_AUTH_DBC_RECORDS, [UpdateConstants.AUTH_DBC_RECORDS]);
    OpenAgencyClientCore.addFeatures(FBS_AGENCY_AUTH_RET_RECORD, [UpdateConstants.AUTH_RET_RECORD]);
    OpenAgencyClientCore.addFeatures(FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD, [UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD]);


    function callFunction(record, userId, groupId, settings) {

        var recordObject = DanMarc2Converter.convertFromDanMarc2(record);
        var recordJson = JSON.stringify(recordObject);
        var result = Authenticator.authenticateRecordEntryPoint(recordJson, userId, groupId, settings);

        return JSON.parse(result);

    }

    //-----------------------------------------------------------------------------
    //                  Test new records
    //-----------------------------------------------------------------------------

    RawRepoClientCore.clear();


    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("New record for FBS library",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), []);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue("New record for FBS library - no owner",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "create.common.record.error"))]);

    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 726500"
    );
    Assert.equalValue("New record for FBS library - different owner",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "create.common.record.other.library.error"))]);

    //-----------------------------------------------------------------------------
    //                  Test existing records
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("Update existing DBC owned record - no permission",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "update.common.record.owner.dbc.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("Update existing DBC owned record - permission",
        callFunction(record, "netpunkt", FBS_AGENCY_AUTH_DBC_RECORDS), []);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a RET"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("Update existing RET record - no permission",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a RET"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("Update existing RET record - wrong katalogiseringsniveau",
        callFunction(record, "netpunkt", FBS_AGENCY_AUTH_RET_RECORD), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.katalogiseringsniveau.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "008 00 *v 4 \n" +
        "996 00 *a RET"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "008 00 *v 0 \n" +
        "996 00 *a 714700"
    );
    Assert.equalValue("Update existing RET record - RET permission",
        callFunction(record, "netpunkt", FBS_AGENCY_AUTH_RET_RECORD), []);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n"
    );
    Assert.equalValue("Update existing DBC owned record - permission",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_AGENCY_AUTH_RET_RECORD
    );
    Assert.equalValue("AUTH_PUBLIC_LIB_COMMON_RECORD - other owner",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.give.public.library.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    Assert.equalValue("AUTH_PUBLIC_LIB_COMMON_RECORD - no permission",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.take.public.library.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD
    );
    Assert.equalValue("AUTH_PUBLIC_LIB_COMMON_RECORD - ok",
        callFunction(record, "netpunkt", FBS_AGENCY_AUTH_PUBLIC_LIB_COMMON_RECORD), []);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    Assert.equalValue("Standard FBS common record - ok",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), []);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    Assert.equalValue("Standard FBS common record - different groupId",
        callFunction(record, "netpunkt", OTHER_FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.other.library.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + FBS_RECORD_AGENCY_ID
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970 \n" +
        "004 00 *a e *r n \n" +
        "996 00 *a " + OTHER_FBS_RECORD_AGENCY_ID
    );
    Assert.equalValue("Standard FBS common record - different owner",
        callFunction(record, "netpunkt", FBS_RECORD_AGENCY_ID), [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.other.library.error"))]);
    RawRepoClientCore.clear();
    //-----------------------------------------------------------------------------
});