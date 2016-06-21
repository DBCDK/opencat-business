//-----------------------------------------------------------------------------
use( "DefaultAuthenticator" );
use( "RawRepoClientCore" );
use( "RecordUtil" );
use( "UnitTest" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultAuthenticator.authenticateRecord", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var bundle = ResourceBundleFactory.getBundle( DefaultAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        return DefaultAuthenticator.create().authenticateRecord( marcRecord, userId, groupId );
    }

    OpenAgencyClientCore.addFeatures( OTHER_FBS_RECORD_AGENCY_ID, [ UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD ] );

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
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
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
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
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
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.take.public.library.error" ) ) ] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
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
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.give.public.library.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common RET record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "996 00 *a RET"
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
        [ ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error")) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common DBC record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "996 00 *a DBC"
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
        "996 00 *a DBC"
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
    Assert.equalValue( "Update of common non-FBS record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.other.library.error" ) ) ] );
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

    OpenAgencyClientCore.clearFeatures();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultAuthenticator.authenticateRecord.auth_ret_record", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var bundle = ResourceBundleFactory.getBundle( DefaultAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        return DefaultAuthenticator.create().authenticateRecord( marcRecord, userId, groupId );
    }

    OpenAgencyClientCore.addFeatures( FBS_RECORD_AGENCY_ID, [ UpdateConstants.AUTH_RET_RECORD ] );

    //-----------------------------------------------------------------------------
    //                  Test update common RET record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "996 00 *a RET"
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


    OpenAgencyClientCore.clearFeatures();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultAuthenticator.authenticateRecord.auth_root", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var bundle = ResourceBundleFactory.getBundle( DefaultAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        return DefaultAuthenticator.create().authenticateRecord( marcRecord, userId, groupId );
    }

    //-----------------------------------------------------------------------------
    //                  Test update FBS record
    //-----------------------------------------------------------------------------

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

    OpenAgencyClientCore.addFeatures( FBS_RECORD_AGENCY_ID, [ UpdateConstants.AUTH_ROOT_FEATURE ] );
    Assert.equalValue( "Update FBS library's local record ( with auth_root )",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ), [] );

    RawRepoClientCore.clear();
    OpenAgencyClientCore.clearFeatures();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultAuthenticator.authenticateRecord.auth_public_lib_common_record", function() {
    var FBS_RECORD_AGENCY_ID = "714700";
    var OTHER_FBS_RECORD_AGENCY_ID = "726500";

    var bundle = ResourceBundleFactory.getBundle( DefaultAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        return DefaultAuthenticator.create().authenticateRecord( marcRecord, userId, groupId );
    }

    OpenAgencyClientCore.addFeatures( FBS_RECORD_AGENCY_ID, [ UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD ] );
    OpenAgencyClientCore.addFeatures( OTHER_FBS_RECORD_AGENCY_ID, [ UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD ] );

    //-----------------------------------------------------------------------------
    //                  Test update common FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
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
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
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
        StringUtil.sprintf( "996 00 *a %s\n", OTHER_FBS_RECORD_AGENCY_ID )
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
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.give.public.library.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update common non-FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "996 00 *a DBC"
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
    Assert.equalValue( "Update of common non-FBS record for this FBS library",
        callFunction( record, "netpunkt", FBS_RECORD_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.other.library.error" ) ) ] );
    RawRepoClientCore.clear();

    OpenAgencyClientCore.clearFeatures();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultAuthenticator.authenticateRecord.school-common", function() {
    var LOGIN_AGENCY_ID = "300101";
    var FBS_RECORD_AGENCY_ID = "714700";

    var bundle = ResourceBundleFactory.getBundle( DefaultAuthenticator.__BUNDLE_NAME );

    var curRecord;
    var record;

    function callFunction( marcRecord, userId, groupId ) {
        return DefaultAuthenticator.create().authenticateRecord( marcRecord, userId, groupId );
    }

    //-----------------------------------------------------------------------------
    //                  Test update common school record
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.SCHOOL_COMMON_AGENCYID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", UpdateConstants.SCHOOL_COMMON_AGENCYID )
    );
    Assert.equalValue( "Common school record by school library",
        callFunction( record, "netpunkt", LOGIN_AGENCY_ID ),
        [] );

    //-----------------------------------------------------------------------------
    //                  Test update common FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
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
    Assert.equalValue( "Update of common record for a FBS library",
        callFunction( record, "netpunkt", LOGIN_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.other.library.error" ) ) ] );
    RawRepoClientCore.clear();

    //-----------------------------------------------------------------------------
    //                  Test update FBS record
    //-----------------------------------------------------------------------------

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );
    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", FBS_RECORD_AGENCY_ID ) +
        "004 00 *a e *r n\n" +
        "245 00 *a title\n" +
        StringUtil.sprintf( "996 00 *a %s\n", FBS_RECORD_AGENCY_ID )
    );
    Assert.equalValue( "Update of common record for a FBS library",
        callFunction( record, "netpunkt", LOGIN_AGENCY_ID ),
        [ ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "edit.record.other.library.error", "1 234 567 8" ) ) ] );
    RawRepoClientCore.clear();
} );
