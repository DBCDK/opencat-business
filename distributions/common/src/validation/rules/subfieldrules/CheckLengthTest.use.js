//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckLength" );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "CheckLength.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var paramsEqual = {'min': 2, 'max': 2};
    SafeAssert.equal("checkLength validates ok", CheckLength.validateSubfield(record, field, subfield, paramsEqual), []);

    var paramsNotEqualOk = {'min': 2, 'max': 40000};
    SafeAssert.equal("checkLength validates ok", CheckLength.validateSubfield(record, field, subfield, paramsNotEqualOk), []);

    var paramsWrong = {'min': 3, 'max': 2};
    Assert.exception("checkLength wrong parameters", 'CheckLength.validateSubfield(record, field, subfield, paramsWrong)');

    var paramsNoValues = {};
    Assert.exception("checkLength no parameters", 'CheckLength.validateSubfield(record, field, subfield, noParams)');

    var paramsValueTooShort = {'min': 4};
    var errorVal1 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.length.min.error", "a", 4 ) )];
    SafeAssert.equal("length of value to short", CheckLength.validateSubfield(record, field, subfield, paramsValueTooShort), errorVal1);

    var paramsValueTooLong = {'max': 1};
    var errorVal2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.length.max.error", "a", 1 ) )];
    SafeAssert.equal("length of value to short", CheckLength.validateSubfield(record, field, subfield, paramsValueTooLong), errorVal2);
});

UnitTest.addFixture( "SubfieldRules.__checkLengthMin", function() {
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var params1 = {'min': 1};
    SafeAssert.equal( "1 SubfieldRules.__checkLengthMin, ok test", SubfieldRules.__checkLengthMin( subfield, params1 ), [] );

    var params2 = {'min': 42};
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.length.min.error", "a", 42 ) ) ];
    SafeAssert.equal( "2 SubfieldRules.__checkLengthMin, error test", SubfieldRules.__checkLengthMin( subfield, params2 ), error2 );
} );

UnitTest.addFixture( "SubfieldRules.__checkLengthMax", function() {
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var params1 = {'max': 42};
    SafeAssert.equal( "1 SubfieldRules.__checkLengthMax, ok test", SubfieldRules.__checkLengthMax( subfield, params1 ), [] );

    var params2 = {'max': 1};
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.length.max.error", "a", 1 ) ) ];
    SafeAssert.equal( "2 SubfieldRules.__checkLengthMax, error test", SubfieldRules.__checkLengthMax( subfield, params2 ), error2 );
} );
