use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use( 'GenericSettings' );
use( "CheckValue" );

UnitTest.addFixture( "checkValue.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckValue.__BUNDLE_NAME );

    var record = {};
    var field = {'name': "001"};
    var subfield = {
        'name': "b",
        'value': "870970"
    };

    var paramsHasValue = {'values': [1, 2, 3, 4, "870970"]};
    Assert.equalValue("value is correct", CheckValue.validateSubfield(record, field, subfield, paramsHasValue), []);

    var paramsNoValues = {'values': []};
    var errorVal1 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.value.rule.error", "870970", field.name, subfield.name, "" ) ) ];
    Assert.equalValue("value is not correct because list is empty", CheckValue.validateSubfield(record, field, subfield, paramsNoValues), errorVal1);

    var paramsNoMatchingValues = {'values': [1, 2, 3, 4, 5]};
    var errorVal2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.value.rule.error","870970", field.name, subfield.name, paramsNoMatchingValues.values.join( "', '" ) ) ) ];
    Assert.equalValue("value is not correct because value not in list", CheckValue.validateSubfield(record, field, subfield, paramsNoMatchingValues), errorVal2);
});