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

    Assert.equalValue( "1 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['xxx'], 'subfieldMandatory' : 'xxx'
    };

    Assert.equalValue( "2 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'xxx'
    };

    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "xxx", "a", "a1Val" );
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    Assert.equalValue( "3 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [error] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'c'
    };
    Assert.equalValue( "4 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'c'
    };
    Assert.equalValue( "5 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['test1', 'test2', 'test3'], 'subfieldMandatory' : 'c'
    };
    Assert.equalValue( "6 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [] );


    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'd'
    };
    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "d", "a", "a1Val,b1Val,c1Val" );
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    Assert.equalValue( "7 Test of subfieldConditionalMandatory", SubfieldConditionalMandatory.validateField( record, field, params ), [error] );
} );
