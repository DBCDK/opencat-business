//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldValueMakesFieldsAllowed module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "SubfieldValueMakesFieldsAllowed" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "SubfieldValueMakesFieldsAllowed.validateSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldValueMakesFieldsAllowed.__BUNDLE_NAME );

    var record = {
        fields : [{
            'name' : '032'
        }, {
            'name' : '996'
        }]
    };

    var subfield = {
        'name' : "a", 'value' : ""
    };

    var params = ["032", "996"]

    var errMsg = ResourceBundle.getStringFormat( bundle, "subfield.value.makes.field.allowed.rule.error", "996", "a" );
    Assert.equalValue( "1 SubfieldValueMakesFieldsAllowed.validateSubfield invalid value", SubfieldValueMakesFieldsAllowed.validateSubfield( record, {}, subfield , params),  [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )] );


    var record = {
        fields : [{
            'name' : '032'
        }, {
            'name' : '996'
        }]
    };

    var subfield = {
        'name' : "a", 'value' : "DBC"
    };

    var params = ["032", "996"]

    Assert.equalValue( "2 SubfieldValueMakesFieldsAllowed.validateSubfield valid value", SubfieldValueMakesFieldsAllowed.validateSubfield( record, {}, subfield , params),  [] );


    var record = {
        fields : [{
            'name' : '010'
        }, {
            'name' : '011'
        }]
    };

    var subfield = {
        'name' : "a", 'value' : ""
    };

    var params = ["032", "996"]

    Assert.equalValue( "1 SubfieldValueMakesFieldsAllowed.validateSubfield invalid value", SubfieldValueMakesFieldsAllowed.validateSubfield( record, {}, subfield , params),  [] );

    var record = {
        fields : [{
            'name' : '010'
        }, {
            'name' : '011'
        }]
    };

    var subfield = {
        'name' : "a", 'value' : "DBC"
    };

    var params = ["032", "996"]

    Assert.equalValue( "1 SubfieldValueMakesFieldsAllowed.validateSubfield invalid value", SubfieldValueMakesFieldsAllowed.validateSubfield( record, {}, subfield , params),  [] );
});