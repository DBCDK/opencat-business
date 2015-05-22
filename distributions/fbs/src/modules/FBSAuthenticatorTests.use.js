//-----------------------------------------------------------------------------
use( "FBSAuthenticator" );
use( "RawRepoClientCore" );
use( "UnitTest" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FBSAuthenticator.authenticateRecord", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var bundle = ResourceBundleFactory.getBundle( FBSAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );

        return JSON.parse( FBSAuthenticator.authenticateRecord( JSON.stringify( record ), userId, groupId ) );
    }

    //-----------------------------------------------------------------------------
    //                  Test new FBS record
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b " + FBS_RECORD_AGENCY_ID + "\n004 00 *a e *r n"
    );
    Assert.equalValue( "New library record",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
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
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
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
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "edit.record.other.library.error", "1 234 567 8" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test new common record
    //-----------------------------------------------------------------------------

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Creation of common record",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "create.common.record.error" ) ) ] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Creation of common FBS-record",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [] );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Creation of common FBS-record for other library",
                       callFunction( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "create.common.record.other.library.error" ) ) ] );

    //-----------------------------------------------------------------------------
    //                  Test update common FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for this FBS library. The record was owned by another FBS library.",
                        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for another FBS library",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
                       [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.other.library.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common RET record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "s10 00 *a RET"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a RET"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common RET record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common DBC record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "s10 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common DBC record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.owner.dbc.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common non-FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "s10 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "996 00 *a 200300"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common DBC record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.owner.other.library.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update national common record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "National common record with no changes",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *b %s *a 1 234 567 8 \n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "032 00 *a xxx *x\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "National common record with no changes, but with different order of subfields",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a xxx\n" +
        "666 00 *0 *e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "New extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a yyy\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "Edit extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "Delete extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "504 00 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "New non extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a yyy *x\n" +
        "504 00 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "Edit non extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue( "Delete non extension field",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        NoteAndSubjectExtentionsHandler.authenticateExtentions( record, FBS_RECORD_AGENCY_ID ) );
    RawRepoClientCore.clear();

} );

UnitTest.addFixture( "FBSAuthenticator.recordDataForRawRepo", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var curRecord;
    var record;
    var internalRecord;
    var expected;

    function callFunction( marcRecord, userId, groupId ) {
        return FBSAuthenticator.recordDataForRawRepo( marcRecord, userId, groupId );
    }

    //-----------------------------------------------------------------------------
    //                  Test FBS record with no DBC enrichment
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "New record",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        "504 00 *a note\n"
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "New record with notes",
                        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                        expected.toString() );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        "504 00 *a note\n" +
        StringUtil.sprintf( "996 00 *a %s", FBS_RECORD_AGENCY_ID )
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [
        NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
            "004 00 *r n *a e\n" +
            StringUtil.sprintf( "s10 00 *a %s", FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "New record with notes & 996a",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
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
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "Update record. RawRepo has no DBC enrichment",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
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
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [ NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ) ];
    Assert.equalValue( "Update record with notes. RawRepo has no DBC enrichment",
                       callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
                       expected.toString() );
    RawRepoClientCore.clear();

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [
        NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
            "004 00 *r n *a e\n" +
            StringUtil.sprintf( "s10 00 *a %s\n", FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "Update record and DBC enrichment. DBC enrichment has no s10",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );
    expected = [
        NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
            "004 00 *r n *a e\n" +
            StringUtil.sprintf( "s10 00 *a %s\n", FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "Update record and DBC enrichment. s10 is updated.",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "s10 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a titel\n" +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
    );
    internalRecord = record.clone();
    RecordUtil.addOrReplaceSubfield( internalRecord, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );

    var expectedNotesRecord = NoteAndSubjectExtentionsHandler.recordDataForRawRepo( internalRecord, "netpunkt", FBS_RECORD_AGENCY_ID );
    var expectedOwnershipRecord = UpdateOwnership.mergeRecord( expectedNotesRecord, RawRepoClientCore.fetchRecord( "1 234 567 8", UpdateConstants.RAWREPO_COMMON_AGENCYID ) );

    expected = [
        expectedOwnershipRecord,
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
            "004 00 *r n *a e\n" +
            StringUtil.sprintf( "s10 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
        )
    ];
    Assert.equalValue( "Update common record with new FBS owner.",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //              Test FBS updating common DBC record with notes
    //-----------------------------------------------------------------------------

    curRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 68519659 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "008 00 *t m *u f *a 2010 *b dk *d å *d y *l dan *x 06 *v 0\n" +
        "009 00 *a a *g xx\n" +
        "021 00 *c Hf.\n" +
        "032 00 *x ACC201205 *a DBF201213\n" +
        "100 00 *a Svendsen *h Kurt Villy *4 aut\n" +
        "245 00 *a Følg gammelnissen Uffe på en ny lokalhistorisk rundtur i Hadsten og omegn *c en julehistorie i 31 afsnit\n" +
        "260 00 *a [Hadsten] *b Hadsten-PingvinNyt.dk *c 2010\n" +
        "300 00 *a 46 sider *b ill. (nogle i farver)\n" +
        "512 00 *i Kolumnetitel *t PingvinNyt julekalenderen 2010\n" +
        "521 00 *& REX *b 1. oplag *c 2010\n" +
        "652 00 *m 46.4 *b Hadsten\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord( curRecord );
    RawRepoClientCore.addRecord( RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 68519659 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "d08 00 *o wnn *o kpn *k ahf\n" +
        "d09 00 *z REX201213\n" +
        "s12 00 *t TeamBMV201210\n" +
        "z98 00 *a Minus korrekturprint\n" +
        "z99 00 *a ahf"
    ) );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 68519659 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "008 00 *t m *u f *a 2010 *b dk *d å *d y *l dan *x 06 *v 0\n" +
        "009 00 *a a *g xx\n" +
        "021 00 *c Hf.\n" +
        "032 00 *x ACC201205 *a DBF201213\n" +
        "100 00 *a Svendsen *h Kurt Villy *4 aut\n" +
        "245 00 *a Følg gammelnissen Uffe på en ny lokalhistorisk rundtur i Hadsten og omegn *c en julehistorie i 31 afsnit\n" +
        "260 00 *a [Hadsten] *b Hadsten-PingvinNyt.dk *c 2010\n" +
        "300 00 *a 46 sider *b ill. (nogle i farver)\n" +
        "504 00 *a DETTE ER EN BERIGENDE NOTE\n" +
        "512 00 *i Kolumnetitel *t PingvinNyt julekalenderen 2010\n" +
        "521 00 *& REX *b 1. oplag *c 2010\n" +
        "652 00 *m 46.4 *b Hadsten\n" +
        "666 00 *f DETTE ER ET BERIGENDE EMNEORD\n" +
        "996 00 *a DBC"
    );

    expected = [ RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 68519659 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "008 00 *t m *u f *a 2010 *b dk *d å *d y *l dan *x 06 *v 0\n" +
        "009 00 *a a *g xx\n" +
        "021 00 *c Hf.\n" +
        "032 00 *x ACC201205 *a DBF201213\n" +
        "100 00 *a Svendsen *h Kurt Villy *4 aut\n" +
        "245 00 *a Følg gammelnissen Uffe på en ny lokalhistorisk rundtur i Hadsten og omegn *c en julehistorie i 31 afsnit\n" +
        "260 00 *a [Hadsten] *b Hadsten-PingvinNyt.dk *c 2010\n" +
        "300 00 *a 46 sider *b ill. (nogle i farver)\n" +
        StringUtil.sprintf( "504 00 *& %s *a DETTE ER EN BERIGENDE NOTE\n", FBS_RECORD_AGENCY_ID ) +
        "512 00 *i Kolumnetitel *t PingvinNyt julekalenderen 2010\n" +
        "521 00 *& REX *b 1. oplag *c 2010\n" +
        "652 00 *m 46.4 *b Hadsten\n" +
        StringUtil.sprintf( "666 00 *& %s*f DETTE ER ET BERIGENDE EMNEORD\n", FBS_RECORD_AGENCY_ID ) +
        "996 00 *a DBC" ),
        RecordUtil.createFromString(
            StringUtil.sprintf( "001 00 *a 68519659 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
            "004 00 *r n *a e\n" +
            "d08 00 *o wnn *o kpn *k ahf\n" +
            "d09 00 *z REX201213\n" +
            "s10 00 *a DBC\n" +
            "s12 00 *t TeamBMV201210\n" +
            "z98 00 *a Minus korrekturprint\n" +
            "z99 00 *a ahf" )
    ];
    Assert.equalValue( "FBS updating common DBC record with notes",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ).toString(),
        expected.toString() );
    RawRepoClientCore.clear();
} );
