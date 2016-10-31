use( "SafeAssert" );
use( "UnitTest" );
use ( "AllFieldsMandatoryIfOneExist");

UnitTest.addFixture( "AllFieldsMandatoryIfOneExist.validateRecord", function( ) {
    var bundle = ResourceBundleFactory.getBundle( AllFieldsMandatoryIfOneExist.__BUNDLE_NAME );
    var params = { fields: [ '001', '002', '003', '004' ]};
    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }, {
            'name' : '004'
        }]
    };

    var expectedResult = [];
    var actualResult = AllFieldsMandatoryIfOneExist.validateRecord( record, params );
    SafeAssert.equal( "AllFieldsMandatoryIfOneExist.validateRecord 1", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "003" ) ) ];
    actualResult = AllFieldsMandatoryIfOneExist.validateRecord( record, params );
    SafeAssert.equal( "AllFieldsMandatoryIfOneExist.validateRecord 2", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '042'
        }]
    };
    expectedResult = [];
    actualResult = AllFieldsMandatoryIfOneExist.validateRecord( record, params );
    SafeAssert.equal( "AllFieldsMandatoryIfOneExist.validateRecord 3", actualResult, expectedResult );

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [
        ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "002" ) ),
        ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "003" ) ),
    ];
    actualResult = AllFieldsMandatoryIfOneExist.validateRecord( record, params );
    SafeAssert.equal( "AllFieldsMandatoryIfOneExist.validateRecord 4", actualResult, expectedResult );
} );
