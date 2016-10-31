use( "TypeCheck" );
use( "UnitTest" );

UnitTest.addFixture( "TypeCheck.isObject", function() {
    Assert.equalValue( "Object", TypeCheck.isObject( {} ), true );
} );

