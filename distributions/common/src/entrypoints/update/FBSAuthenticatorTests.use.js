//-----------------------------------------------------------------------------
use( "FBSAuthenticator" );
use( "RawRepoClientCore" );
use( "UnitTest" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FBSAuthenticator.canAuthenticate", function() {
    Assert.equalValue( "Found groupId", FBSAuthenticator.canAuthenticate( undefined, "netpunkt", "700400" ), true );
    Assert.equalValue( "groupId not found", FBSAuthenticator.canAuthenticate( undefined, "netpunkt", "870970" ), false );
} );

UnitTest.addFixture( "FBSAuthenticator.authenticateRecord", function() {
    var COMMON_RECORD_AGENCY_ID = "870970";
    var DBC_RECORD_AGENCY_ID = "010100";
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var curRecord;
    var record;

    //-----------------------------------------------------------------------------
    //                  Test new FBS record
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "New library record",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [] );

    //-----------------------------------------------------------------------------
    //                  Test update FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a new title"
    );
    Assert.equalValue( "Update own record",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", OTHER_FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", OTHER_FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a new title"
    );
    Assert.equalValue( "Update FBS library's local record",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", "Du har ikke ret til at rette posten '1 234 567 8' da den er ejet af et andet bibliotek." ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test new common record
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Creation of common record",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [ ValidateErrors.recordError( "", "Du har ikke ret til at oprette en f\xe6llesskabspost" ) ] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Creation of common FBS-record",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Creation of common FBS-record for other library",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Du har ikke ret til at oprette en f\xe6llesskabspost for et andet bibliotek." ) ] );

    //-----------------------------------------------------------------------------
    //                  Test update common FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for this FBS library",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for this FBS library. The record was owned by another FBS library.",
                        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for another FBS library",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [ ValidateErrors.recordError( "", "Du har ikke ret til at opdatere f\xe6llesskabsposten for et andet bibliotek." ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common RET record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        "s10 00 *a RET"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a RET"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common RET record for this FBS library",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common DBC record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        "s10 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common DBC record for this FBS library",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", "Du har ikke ret til at opdatere en f\xe6llesskabspost som er ejet af DBC" ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common non-FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", DBC_RECORD_AGENCY_ID ) +
        "s10 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", COMMON_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a 200300"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common DBC record for this FBS library",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", "Du har ikke ret til at opdatere en f\xe6llesskabspost som ikke er ejet af et folkebibliotek." ) ] );
    RawRepoClientCore.clear();
} );

UnitTest.addFixture( "FBSAuthenticator.recordDataForRawRepo", function() {
    var FBS_RECORD_AGENCY_ID = "714700";

    var curRecord;
    var record;
    var expected;

    //-----------------------------------------------------------------------------
    //                  Test FBS record with no DBC enrichment
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "New record",
                       FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        "504 00 *a note\n"
    );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "New record with notes",
                        FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                        expected.toString() );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        "504 00 *a note\n" +
        StringUtil.sprintf( "996 00 *a %s", FBS_RECORD_AGENCY_ID )
    );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "New record with notes & 996a",
                       FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );

    //-----------------------------------------------------------------------------
    //                  Test FBS record with DBC enrichment
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "Update record. RawRepo has no DBC enrichment",
                       FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        "504 00 *a note\n"
    );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "Update record with notes. RawRepo has no DBC enrichment",
                       FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );
    RawRepoClientCore.clear();

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s", UpdateConstants.DBC_ENRICHMENT_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        StringUtil.sprintf( "996 00 *a %s\n", UpdateConstants.FBS_RECORD_AGENCY_ID )
    );
    expected = [
        NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.DBC_ENRICHMENT_AGENCYID ) +
            StringUtil.sprintf( "s10 00 *a %s\n", UpdateConstants.FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "Update record and DBC enrichment. DBC enrichment has no s10",
        FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.DBC_ENRICHMENT_AGENCYID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", UpdateConstants.DBC_ENRICHMENT_AGENCYID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        StringUtil.sprintf( "996 00 *a %s\n", UpdateConstants.FBS_RECORD_AGENCY_ID )
    );
    expected = [
        NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.DBC_ENRICHMENT_AGENCYID ) +
            StringUtil.sprintf( "s10 00 *a %s\n", UpdateConstants.FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "Update record and DBC enrichment. s10 is updated.",
        FBSAuthenticator.recordDataForRawRepo( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();
} );
