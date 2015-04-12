//-----------------------------------------------------------------------------
use( "DBCAuthenticator" );
use( "RawRepoClientCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DBCAuthenticator.authenticateRecord", function() {
    var curRecord;
    var record;

    //-----------------------------------------------------------------------------
    //                  Test new records
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "New record without authentication",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    Assert.equalValue( "New record with s10",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    Assert.equalValue( "New record with 996",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );

    //-----------------------------------------------------------------------------
    //                  Test update DBC records
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update record without authentication in current or new record",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update record with s10/996 in current record",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n" +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. Only s10 is presented and unchanged in new record.",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. Only 996 is presented and unchanged in new record.",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", UpdateConstants.COMMON_AGENCYID ) +
        StringUtil.sprintf( "s10 00 *a %s", UpdateConstants.COMMON_AGENCYID )
    );
    Assert.equalValue( "Update record with s10/996 in current record. 996/s10 is presented and unchanged in new record.",
        JSON.parse( DBCAuthenticator.authenticateRecord( record, "netpunkt", UpdateConstants.DBC_LOGIN_AGENCY_ID ) ),
        [] );
    RawRepoClientCore.clear();
} );
