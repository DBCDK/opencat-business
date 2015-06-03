//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "SubfieldsMandatory" );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "SubfieldsMandatory", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldsMandatory.BUNDLE_NAME );

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

    var paramsA = {
        'subfields' : ['a']
    };
    SafeAssert.equal( "1 testing with valid a param", [], SubfieldsMandatory.validateField( record, field, paramsA ) );

    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "f", "001" );
    var errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsF = {
        'subfields' : ['f']
    };
    SafeAssert.equal( "2 testing with NON valid f param", errorFmissing, SubfieldsMandatory.validateField( record, field, paramsF ) );

    var paramsABC = {
        'subfields' : ['a', 'b', 'c']
    };
    SafeAssert.equal( "3 testing with valid a,b,c param", [], SubfieldsMandatory.validateField( record, field, paramsABC ) );

    errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsABF = {
        'subfields' : ['a', 'b', 'f']
    };
    SafeAssert.equal( "4 testing with NON valid  " + paramsABF.subfields + " param", errorFmissing, SubfieldsMandatory.validateField( record, field, paramsABF ) );

    var errorXY = [];
    errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "x", "001" );
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "y", "001" );
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    var paramsAXY = {
        'subfields' : ['a', 'x', 'y']
    };
    SafeAssert.equal( "5 testing with NON valid  " + paramsAXY.subfields + " param", errorXY, SubfieldsMandatory.validateField( record, field, paramsAXY ) );

} );