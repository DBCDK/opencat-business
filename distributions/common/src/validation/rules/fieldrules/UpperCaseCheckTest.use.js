//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "UpperCaseCheck" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "UpperCaseCheck", function( ) {
    var bundle = ResourceBundleFactory.getBundle( UpperCaseCheck.__BUNDLE_NAME );

    var message = '';
    var params = {};
    var record = {};
    var fieldAa = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "A", 'value' : "42"
        }, {
            'name' : "a", 'value' : "42"
        }]
    };

    Assert.equalValue( "1 FieldRules.upperCaseCheck value", UpperCaseCheck.validateField( record, fieldAa ), [] );

    var fieldAb = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "A", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    message = ResourceBundle.getStringFormat( bundle, "uppercase.rule.error", "A", "a", "003" );
    var errNoLowerCaseA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    Assert.equalValue( "2 UpperCaseCheck.validateField value", UpperCaseCheck.validateField( record, fieldAb ), errNoLowerCaseA );

    var fieldaA = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "A", 'value' : "42"
        }]
    };

    message = ResourceBundle.getStringFormat( bundle, "uppercase.rule.error", "A", "a", "003" );
    var errNoTrailingA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    Assert.equalValue( "3 UpperCaseCheck.validateField value", UpperCaseCheck.validateField( record, fieldaA ), errNoTrailingA );
} );