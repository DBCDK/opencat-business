//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "ExclusiveSubfield" );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "ExclusiveSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( ExclusiveSubfield.BUNDLE_NAME );
    var record = {};

    var field1 = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "aVal"
        }]
    };
    Assert.equalValue( "1 exclusiveSubfield test ok", ExclusiveSubfield.validateField( record, field1, undefined ), [] );

    var field2 = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "aVal"
        }, {
            name : "b", value : "bVal"
        }]
    };
    var error2 = [ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) ) ];
    Assert.equalValue( "2 exclusiveSubfield test not-ok", ExclusiveSubfield.validateField( record, field2, undefined ), error2 );

    var field3 = {
        name : '001', indicator : '00', subfields : [{
            name : "i", value : "iVal"
        }, {
            name : "t", value : "tVal"
        }, {
            name : "e", value : "eVal"
        }, {
            name : "x", value : "xVal"
        }, {
            name : "b", value : "bVal"
        }, {
            name : "d", value : "dVal"
        }, {
            name : "c", value : "cVal"
        }, {
            name : "g", value : "gVal"
        }, {
            name : "p", value : "pVal"
        }, {
            name : "f", value : "fVal"
        }, {
            name : "a", value : "aVal"
        }]
    };
    var error3 = [
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "i" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "t" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "e" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "x" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "d" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "c" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "g" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "p" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "f" ) )
    ];

    Assert.equalValue( "3 exclusiveSubfield test not-ok", ExclusiveSubfield.validateField( record, field3, undefined ), error3 );

    var field4 = {
        name : '001', indicator : '00', subfields : [{
            name : "b", value : "bVal"
        }]
    };
    Assert.equalValue( "4 exclusiveSubfield test ok", ExclusiveSubfield.validateField( record, field4, undefined ), [] );

} );