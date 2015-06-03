//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "SubfieldsDemandsOtherSubfields" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "SubfieldsDemandsOtherSubfields.validateSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var record = {};
    var fieldab = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    var subfield = {
        'name' : "a", 'value' : ""
    };


    SafeAssert.equal( "1 SubfieldsDemandsOtherSubfields.validateSubfield valid value", SubfieldsDemandsOtherSubfields.validateSubfield( record, fieldab, subfield ), [] );
    //var error003a = [ValidateErrors.subfieldError( "TODO:fixurl", 'I felt :"004" mangler delfeltet "d"' )];

    subfield = {
        'name' : "b", 'value' : ""
    };

    var fielda = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }]
    };

    subfield = {
        'name' : "a", 'value' : ""
    };
    var errMsg = ResourceBundle.getStringFormat( bundle, "subfield.demands.other.subfields.rule.error", "003", "a" );
    var errContainsBandA = [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )];
    SafeAssert.equal( "3 SubfieldsDemandsOtherSubfields.validateSubfield valid value", SubfieldsDemandsOtherSubfields.validateSubfield( record, fielda, subfield ), errContainsBandA );
});