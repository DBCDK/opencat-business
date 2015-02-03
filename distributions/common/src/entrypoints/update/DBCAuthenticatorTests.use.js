//-----------------------------------------------------------------------------
use( "DBCAuthenticator" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DBCAuthenticator.canAuthenticate", function() {
    Assert.equalValue( "Found groupId", DBCAuthenticator.canAuthenticate( undefined, "netpunkt", "010100" ), true );
    Assert.equalValue( "groupId not found", DBCAuthenticator.canAuthenticate( undefined, "netpunkt", "700400" ), false );
} );

UnitTest.addFixture( "DBCAuthenticator.authenticateRecord", function() {
    var COMMON_RECORD_AGENCY_ID = "870970";
    var DBC_RECORD_AGENCY_ID = "010100";

    var curRecord;
    var record;

    //-----------------------------------------------------------------------------
    //                  Test new records
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "New record without authentication",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "New record with s10",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "New record with 996",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );

    //-----------------------------------------------------------------------------
    //                  Test update DBC records
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update record without authentication in current or new record",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update record with s10/996 in current record",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n" +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. Only s10 is presented and unchanged in new record.",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. Only 996 is presented and unchanged in new record.",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", COMMON_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", COMMON_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. 996/s10 is presented and unchanged in new record.",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", DBC_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();
} );
