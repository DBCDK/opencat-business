//-----------------------------------------------------------------------------
use( "DBCAuthenticator" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DBCAuthenticator.canAuthenticate", function() {
    Assert.equalValue( "Found groupId", DBCAuthenticator.canAuthenticate( undefined, "netpunkt", "010100" ), true );
    Assert.equalValue( "groupId not found", DBCAuthenticator.canAuthenticate( undefined, "netpunkt", "700400" ), false );
} );

UnitTest.addFixture( "DBCAuthenticator.authenticateRecord", function() {
    var curRecord;
    var record;

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "New record",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", "010100" ),
        [] );

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a 700300"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700300"
    );
    Assert.equalValue( "Update of common record: s10a == 996a",
                       DBCAuthenticator.authenticateRecord( record, "netpunkt", "010100" ),
                       [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700300"
    );
    Assert.equalValue( "Update of common record: 996c_n !== 996a_n",
        DBCAuthenticator.authenticateRecord( record, "netpunkt", "010100" ),
        [ ValidateErrors.recordError( "", "Brugeren '010100' m\u00E5 ikke \u00E6ndret v\u00E6rdien af felt 996a i posten '1 234 567 8'" ) ] );
    RawRepoClientCore.clear();
} );
