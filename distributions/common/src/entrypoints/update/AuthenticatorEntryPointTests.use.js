//-----------------------------------------------------------------------------
use( "AuthenticatorEntryPoint" );
use( "DanMarc2Converter" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "AuthenticatorEntryPoint.authenticateRecord", function() {
    var marcRecord;
    var record;

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );

    Assert.equalValue( "Local record",
                       AuthenticatorEntryPoint.authenticateRecord( JSON.stringify( record ), "netpunkt", "700400" ),
                       JSON.stringify( FBSAuthenticator.authenticateRecord( marcRecord, "netpunkt", "700400" ) ) );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e *r n"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );

    Assert.equalValue( "Common record",
                       AuthenticatorEntryPoint.authenticateRecord( JSON.stringify( record ), "netpunkt", "700400" ),
                       JSON.stringify( FBSAuthenticator.authenticateRecord( marcRecord, "netpunkt", "700400" ) ) );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );

    Assert.equalValue( "Unknown library",
                       AuthenticatorEntryPoint.authenticateRecord( JSON.stringify( record ), "netpunkt", "999900" ),
                       JSON.stringify( [ ValidateErrors.recordError( "", "Der eksisterer ikke en authenticator for denne post eller bruger." ) ] ) );
} );
