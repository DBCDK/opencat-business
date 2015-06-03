//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckValue" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "checkValue.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckValue.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var subfield = {
        'name': "b",
        'value': "870970"
    };

    var paramsHasValue = {'values': [1, 2, 3, 4, "870970"]};
    SafeAssert.equal("value is correct", CheckValue.validateSubfield(record, field, subfield, paramsHasValue), []);

    var paramsNoValues = {'values': []};
    var errorVal1 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.value.rule.error", "870970", "" ) ) ];
    SafeAssert.equal("value is not correct", CheckValue.validateSubfield(record, field, subfield, paramsNoValues), errorVal1);

    var paramsNoMatchingValues = {'values': [1, 2, 3, 4, 5]};
    var errorVal2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.value.rule.error", "870970", paramsNoMatchingValues.values.join( "', '" ) ) ) ];
    SafeAssert.equal("value is not correct", CheckValue.validateSubfield(record, field, subfield, paramsNoMatchingValues), errorVal2);
});