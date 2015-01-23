//-----------------------------------------------------------------------------
use( "FBSAuthenticator" );
use( "RawRepoClientCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FBSAuthenticator.canAuthenticate", function() {
    Assert.equalValue( "Found groupId", FBSAuthenticator.canAuthenticate( undefined, "netpunkt", "700400" ), true );
    Assert.equalValue( "groupId not found", FBSAuthenticator.canAuthenticate( undefined, "netpunkt", "870970" ), false );
} );

UnitTest.addFixture( "FBSAuthenticator.authenticateRecord", function() {
    var curRecord;
    var record;

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "No errors",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [] );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Creation of common record",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Brugeren '700400' har ikke ret til at oprette posten '1 234 567 8'" ) ] );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700400"
    );
    Assert.equalValue( "Creation of common FBS-record",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [] );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 800400"
    );
    Assert.equalValue( "Creation of common FBS-record for other library",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Brugeren '700400' har ikke ret til at oprette posten '1 234 567 8'" ) ] );

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 800400\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update of common record: 996a_c !== RET",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Brugeren '700400' har ikke ret til at opdatere posten '1 234 567 8'" ) ] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a RET\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue( "Update of common record: s10a == RET, but no 996a",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Brugeren '700400' har ikke ret til at opdatere posten '1 234 567 8' for andre biblioteker end '700400'" ) ] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a RET\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 800400\n"
    );
    Assert.equalValue( "Update of common record: s10a == RET, but 996a !== 700400",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [ ValidateErrors.recordError( "", "Brugeren '700400' har ikke ret til at opdatere posten '1 234 567 8' for andre biblioteker end '700400'" ) ] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a RET\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700400\n"
    );
    Assert.equalValue( "Update of common record: s10a == RET and 996a === 700400",
                       FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
                       [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a 700400\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700400\n"
    );
    Assert.equalValue( "Update of common FBS-record: s10a == 700400 and 996a === 700400",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
        [] );
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "s10 00 *a 716100\n"
    );
    RawRepoClientCore.addRecord( curRecord );

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n\n" +
        "996 00 *a 700400\n"
    );
    Assert.equalValue( "Update of common FBS-record: s10a == 716100 and 996a === 700400",
        FBSAuthenticator.authenticateRecord( record, "netpunkt", "700400" ),
        [] );
    RawRepoClientCore.clear();
} );
