//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "FieldsIndicator" );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "FieldsIndicator", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldsIndicator.BUNDLE_NAME );

    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : []
    };

    var params00 = {
        indicator : "00"
    };

    SafeAssert.equal( "00: is 00", [], FieldsIndicator.validateFields( record, field, params00 ) );

    var errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", "00", "XX" );
    var errorXX = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var params01 = {
        indicator : "XX"
    };
    SafeAssert.equal( "00: is not XX", errorXX, FieldsIndicator.validateFields( record, field, params01 ) );

    var paramsEmpty = {
        indicator : ""
    };

    errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", "00", "" );
    var errorEmpty = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "00: is not empty", errorEmpty, FieldsIndicator.validateFields( record, field, paramsEmpty ) );

} );