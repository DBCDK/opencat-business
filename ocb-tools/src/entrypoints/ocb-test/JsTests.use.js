use( "Print" );
use( "System" );
use( "UnitTest" );
use( "WriteFile" );

UnitTest.doTests = function() {
    return true;
};

function actionPerformed( modules, jUnitFileName, printReport ) {
    for( var i = 0; i < modules.size(); i++ ) {
        use( String( modules.get( i ).toString() ) );
    }

    UnitTest.outputXml = true;
    System.writeFile( jUnitFileName, UnitTest.report() + "\n" );
    UnitTest.outputXml = false;

    if( printReport === true ) {
        print( UnitTest.report() + "\n" );
    }

    return UnitTest.totalFailed();
}
