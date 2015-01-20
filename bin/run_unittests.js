use( "Print" );
use( "System" );
use( "UnitTest" );
use( "WriteFile" );

UnitTest.doTests = function() {
    return true;
};

// Include iScrum modules
use( "AuthenticatorEntryPointTests" );
use( "ClassificationData_UnitTests" );
use( "UpdaterEntryPoint" );

// Including unittests modules

function main() {
    UnitTest.outputXml = true;
    System.writeFile( "TEST-JavaScriptTest.xml", UnitTest.report() + "\n" );
    UnitTest.outputXml = false;

    print( UnitTest.report() + "\n" );
    return UnitTest.totalFailed();
}
