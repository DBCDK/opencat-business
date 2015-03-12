//-----------------------------------------------------------------------------
use( "TypeCheck" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "TypeCheck.isObject", function() {
    Assert.equalValue( "Object", TypeCheck.isObject( {} ), true );
} );

