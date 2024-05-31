//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "FieldsIndicator" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FieldsIndicator.string", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldsIndicator.BUNDLE_NAME );
    var bundleKey = "field.indicator.string.error";

    var record = {};
    var field = {
        name : '001', indicator : ["0","0"], subfields : []
    };

    var params = {
        indicator : "00"
    };

    Assert.equalValue( "00: is 00", FieldsIndicator.validateField( record, field, params ), [] );

    var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, "00", "XX" );
    var error = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var params = {
        indicator : "XX"
    };
    Assert.equalValue( "00: is not XX", FieldsIndicator.validateField( record, field, params ),error );

    params = {
        indicator : ""
    };

    errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, "00", "" );
    var errorEmpty = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    Assert.equalValue( "00: is not empty", FieldsIndicator.validateField( record, field, params ), errorEmpty );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FieldsIndicator.array", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldsIndicator.BUNDLE_NAME );
    var bundleKey = "field.indicator.array.error";

    var record = {};
    var field = {
        name : '001', indicator : ["0","0"], subfields : []
    };

    var params = {
        indicator : [ "00" ]
    };

    Assert.equalValue( "00: is 00", FieldsIndicator.validateField( record, field, params ), [] );

    params = {
        indicator :[ "XX", "XY" ]
    };

    var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, "00", params.indicator.join( ", " ) );
    var error = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    Assert.equalValue( "00: is not XX", FieldsIndicator.validateField( record, field, params ), error );

    params = {
        indicator : [ "" ]
    };

    errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, "00", params.indicator.join( ", " ) );
    var errorEmpty = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    Assert.equalValue( "00: is not empty", FieldsIndicator.validateField( record, field, params ), errorEmpty );

} );
