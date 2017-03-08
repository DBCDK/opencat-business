//-----------------------------------------------------------------------------
use( "GenericSettings" );
use( "SafeAssert" );
use( "UnitTest" );

// -----------------------------------------------------------------------------
//                          Unit tests
// -----------------------------------------------------------------------------

UnitTest.addFixture( "GenericSettings.containsKey", function() {
    /**
     * This fixture tests the function "containsKey" in the GenericSettings module.
     */

    var exceptCallFormat = "GenericSettings.containsKey( %s )";

    GenericSettings.setSettings( {} );

    var exceptArg = null;
    // TODO US2139 exception problem Assert.exception( "obj is null", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = 25;
    // TODO US2139 exception problem Assert.exception( "obj is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    SafeAssert.equal( "key does not exist", GenericSettings.containsKey( "key" ), false );
    SafeAssert.equal( "key with dots does not exist", GenericSettings.containsKey( "x.y.z" ), false );

    var settings = {};
    settings[ 'key' ] = 7;
    settings[ 'x.y.z' ] = 45;    
    GenericSettings.setSettings( settings );
    
    SafeAssert.equal( "key does exist", GenericSettings.containsKey( "key" ), true );
    SafeAssert.equal( "key with dots does exist", GenericSettings.containsKey( "x.y.z" ), true );
} );

UnitTest.addFixture( "GenericSettings.get", function() {
    /**
     * This fixture tests the function "get" in the GenericSettings module.
     */

    var exceptCallFormat = "GenericSettings.get( %s )";

    GenericSettings.setSettings( {} );
    
    var exceptArg = null;
    // TODO US2139 exception problem Assert.exception( "obj is null", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = 25;
    // TODO  US2139exception problem Assert.exception( "obj is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    SafeAssert.equal( "key does not exist", GenericSettings.get( "key" ), undefined );
    SafeAssert.equal( "key with dots does not exist", GenericSettings.get( "x.y.z" ), undefined );

    var settings = {};
    settings[ 'key' ] = 7;
    settings[ 'x.y.z' ] = 45;    
    GenericSettings.setSettings( settings );
    
    SafeAssert.equal( "key does exist", GenericSettings.get( "key" ), 7 );
    SafeAssert.equal( "key with dots does exist", GenericSettings.get( "x.y.z" ), 45 );
} );
