//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "SubfieldConditionalMandatory" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "SubfieldConditionalMandatory", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldConditionalMandatory.BUNDLE_NAME );

    var record = {};

    var field = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "a1Val"
        }, {
            name : "b", value : "b1Val"
        }, {
            name : "c", value : "c1Val"
        }]
    };
    var params = {
        'subfieldConditional' : 'v', 'values' : ['0'], 'subfieldMandatory' : 'a'
    };

    SafeAssert.equal( "1 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['xxx'], 'subfieldMandatory' : 'xxx'
    };

    SafeAssert.equal( "2 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'xxx'
    };

    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "xxx", "a", "a1Val" );
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    SafeAssert.equal( "3 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [error] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "4 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "5 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['test1', 'test2', 'test3'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "6 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [] );


    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'd'
    };
    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "d", "a", "a1Val,b1Val,c1Val" );
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    SafeAssert.equal( "7 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateFields( record, field, params ), [error] );
} );
