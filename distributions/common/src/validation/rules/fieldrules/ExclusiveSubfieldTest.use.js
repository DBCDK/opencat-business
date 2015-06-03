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
    SafeAssert.equal( "1 exclusiveSubfield test ok", ExclusiveSubfield.validateField( record, field1, undefined ), [] );

    var field2 = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "aVal"
        }, {
            name : "b", value : "bVal"
        }]
    };
    var error2 = [ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) ) ];
    SafeAssert.equal( "2 exclusiveSubfield test not-ok", ExclusiveSubfield.validateField( record, field2, undefined ), error2 );

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
            name : "a", value : "aVal"
        }]
    };
    var error3 = [
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "i" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "t" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "e" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "x" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) )
    ];

    SafeAssert.equal( "3 exclusiveSubfield test not-ok", ExclusiveSubfield.validateField( record, field3, undefined ), error3 );

    var field4 = {
        name : '001', indicator : '00', subfields : [{
            name : "b", value : "bVal"
        }]
    };
    SafeAssert.equal( "4 exclusiveSubfield test ok", ExclusiveSubfield.validateField( record, field4, undefined ), [] );

} );