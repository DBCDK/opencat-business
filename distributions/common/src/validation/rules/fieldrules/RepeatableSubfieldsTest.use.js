//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "RepeatableSubfields" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "RepeatableSubfields", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RepeatableSubfields.BUNDLE_NAME );

    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "a1Val"
        }, {
            name : "a", value : "a2Val"
        }, {
            name : "b", value : "b1Val"
        }]
    };

    var params1a = {
        'subfields' : ['a']
    };
    var errorMessage = ResourceBundle.getStringFormat( bundle, "repeatable.subfields.rule.error", "a", 2 );
    var errors1a = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "repeatableSubfields testing with NON valid " + params1a.subfields + " param", errors1a, RepeatableSubfields.validateField( record, field, params1a ) );

    var params1b = {
        'subfields' : ['b']
    };
    SafeAssert.equal( "repeatableSubfields testing with valid b" + params1b.subfields + " param", [], RepeatableSubfields.validateField( record, field, params1b ) );

    var params1ac = {
        'subfields' : ['a', 'c']
    };
    errorMessage = ResourceBundle.getStringFormat( bundle, "repeatable.subfields.rule.error", "a", 2 );
    var errors1ac = [ValidateErrors.fieldError( "TODO:url", errorMessage )];

    SafeAssert.equal( "repeatableSubfields testing with valid ac " + params1ac.subfields + " param", errors1ac, RepeatableSubfields.validateField( record, field, params1ac ) );

} );