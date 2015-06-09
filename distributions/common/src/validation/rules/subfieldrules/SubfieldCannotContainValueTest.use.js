//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "SubfieldCannotContainValue" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "SubfieldCannotContainValue.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( SubfieldCannotContainValue.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var subfield = {
        'name': "a",
        'value': "42"
    };
    var params ={values:[]};

    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);

    var errorMsg = [{type:"ERROR", params:{url:"TODO:fixurl", message: ResourceBundle.getStringFormat( bundle, "subfield.cannot.contain.value.rule.error", "a", "42" ) } } ];
    params = {values:["42"]};
    SafeAssert.equal("subfieldCannotContainValue with value that is not allowed", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);
    params = {values:[42]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);

    params = {values:["30","x"]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), []);
    params = {values:["42", "x"]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldCannotContainValue.validateSubfield(record, field, subfield, params), errorMsg);
});
