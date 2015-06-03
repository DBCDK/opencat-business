//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "SubfieldConditionalMandatoryField" );
//-----------------------------------------------------------------------------


UnitTest.addFixture( "SubfieldConditionalMandatoryField.validateSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldConditionalMandatoryField.__BUNDLE_NAME );

    var rec = {
        fields : [{
            name : '001', indicator : '00', subfields : []
        }, {
            name : '002', indicator : '00', subfields : ["a", "b", "c"]
        }, {
            name : '010', indicator : '00', subfields : []
        }]
    };

    var fieldab = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    var subfield = {
        'name' : "b", 'value' : "not42"
    };

    var params = { 'subfieldValue': '42', 'fieldMandatory': '010' };
    SafeAssert.equal( "1 SubfieldConditionalMandatoryField.validateSubfield valid value", SubfieldConditionalMandatoryField.validateSubfield( rec, fieldab, subfield, params ), [] );

    subfield = {
        'name' : "b", 'value' : "42"
    };
    params = { 'subfieldValue': '42', 'fieldMandatory': '010' };
    SafeAssert.equal( "2 SubfieldConditionalMandatoryField.validateSubfield valid value but nonexisting conditional subfield", SubfieldConditionalMandatoryField.validateSubfield( rec, fieldab, subfield, params ), [] );

    subfield = {
        'name' : "b", 'value' : "42"
    };

    var errMsg = ResourceBundle.getStringFormat( bundle, "mandatory.field.conditional.rule.error", "b", "42", "011" );
    var err = [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )];
    params = {'subfieldValue': '42', 'fieldMandatory': '011' };
    SafeAssert.equal( "3 SubfieldConditionalMandatoryField.validateSubfield valid value but nonexisting conditional subfield", SubfieldConditionalMandatoryField.validateSubfield( rec, fieldab, subfield, params ), err );

});

