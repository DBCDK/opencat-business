//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "UnitTest" );
use( "Log" );
use( "ValidationUtil" );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "ValidationUtil.isNumber", function() {
    var params1 = "42";
    SafeAssert.equal( "1 ValidationUtil.isNumber, true", ValidationUtil.isNumber(params1), true );

    var params2 = "4S2";
    SafeAssert.equal( "1 ValidationUtil.isNumber, true", ValidationUtil.isNumber(params2), false );

    var params3 = "42O";
    SafeAssert.equal( "1 ValidationUtil.isNumber, true", ValidationUtil.isNumber(params3), false );

} );
