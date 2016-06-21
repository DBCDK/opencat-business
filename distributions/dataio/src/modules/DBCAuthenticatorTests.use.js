use("DBCAuthenticator");
use("RawRepoClientCore");
use("UnitTest");

UnitTest.addFixture("DBCAuthenticator.authenticateRecord", function () {
    var LOGIN_AGENCY_ID = "010100";

    var curRecord;
    var record;

    function callFunction(record, userId, groupId, settings) {
        Log.trace("Enter - DBCAuthenticatorTests.authenticateRecord.callFunction()");

        try {
            var recordObject = DanMarc2Converter.convertFromDanMarc2(record);
            var recordJson = JSON.stringify(recordObject);
            var result = DBCAuthenticator.authenticateRecord(recordJson, userId, groupId, settings);

            return JSON.parse(result);
        }
        finally {
            Log.trace("Exit - DBCAuthenticatorTests.authenticateRecord.callFunction()");
        }
    }

    //-----------------------------------------------------------------------------
    //                  Test new records
    //-----------------------------------------------------------------------------

    OpenAgencyClientCore.addFeatures(LOGIN_AGENCY_ID, [UpdateConstants.AUTH_ROOT_FEATURE]);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n"
    );
    Assert.equalValue("New record without authentication",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID), []);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    Assert.equalValue("New record with s10",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    Assert.equalValue("New record with 996",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);

    //-----------------------------------------------------------------------------
    //                  Test update DBC records
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n"
    );
    Assert.equalValue("Update record without authentication in current or new record",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID) +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n"
    );
    Assert.equalValue("Update record with s10/996 in current record",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID) +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n" +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    Assert.equalValue("Update record with s10/996 in current record. Only s10 is presented and unchanged in new record.",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID) +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    Assert.equalValue("Update record with s10/996 in current record. Only 996 is presented and unchanged in new record.",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID) +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf("996 00 *a %s\n", UpdateConstants.COMMON_AGENCYID) +
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    );
    Assert.equalValue("Update record with s10/996 in current record. 996/s10 is presented and unchanged in new record.",
        callFunction(record, "netpunkt", LOGIN_AGENCY_ID),
        []);
    RawRepoClientCore.clear();

    OpenAgencyClientCore.clearFeatures();
});

UnitTest.addFixture("DBCAuthenticator.recordDataForRawRepo", function () {
    var BASIS_AGENCY_ID = "010100";
    var FFU_AGENCY_ID = "820010";
    var record;

    var actual;
    var expected;

    function recordToString(record) {
        return record.toString();
    }

    OpenAgencyClientCore.clearFeatures();
    OpenAgencyClientCore.addFeatures(BASIS_AGENCY_ID, UpdateConstants.USE_ENRICHMENTS);

    record = RecordUtil.createFromString([
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s", UpdateConstants.COMMON_AGENCYID),
        "004 00 *a e *r n",
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID),
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    ].join("\n"));

    actual = DBCAuthenticator.recordDataForRawRepo(record, "netpunkt", BASIS_AGENCY_ID);
    expected = BasisSplitter.splitCompleteBasisRecord(record);
    Assert.equalValue("Basis record (USE_ENRICHMENTS)", actual.map(recordToString).toString(), expected.map(recordToString).toString());

    OpenAgencyClientCore.clearFeatures();
    OpenAgencyClientCore.addFeatures(BASIS_AGENCY_ID, UpdateConstants.USE_ENRICHMENTS);

    record = RecordUtil.createFromString([
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s", UpdateConstants.COMMON_AGENCYID),
        "004 00 *a e *r n",
        StringUtil.sprintf("996 00 *a %s", UpdateConstants.COMMON_AGENCYID),
        StringUtil.sprintf("s10 00 *a %s", UpdateConstants.COMMON_AGENCYID)
    ].join("\n"));

    actual = DBCAuthenticator.recordDataForRawRepo(record, "netpunkt", BASIS_AGENCY_ID);
    expected = BasisSplitter.splitCompleteBasisRecord(record);
    Assert.equalValue("Basis record (AUTH_ROOT_FEATURE)", actual.map(recordToString).toString(), expected.map(recordToString).toString());

    OpenAgencyClientCore.clearFeatures();

    record = RecordUtil.createFromString([
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s", FFU_AGENCY_ID),
        "004 00 *a e *r n",
        StringUtil.sprintf("996 00 *a %s", FFU_AGENCY_ID)
    ].join("\n"));

    actual = DBCAuthenticator.recordDataForRawRepo(record, "netpunkt", FFU_AGENCY_ID);
    expected = [record];
    Assert.equalValue("FFU record", actual.map(recordToString).toString(), expected.map(recordToString).toString());
});
