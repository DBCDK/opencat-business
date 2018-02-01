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

    var field = {
        "subfields": [subfield]
    };

    var params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    var errMsg = ResourceBundle.getStringFormat( bundle, "subfield.value.makes.field.allowed.rule.error", "996", "a", "'DBC'" );
    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield non-matching value",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield , params),  [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )] );


    record = {
        fields : [{
            'name' : '032'
        }, {
            'name' : '996'
        }]
    };

    subfield = {
        'name' : "a", 'value' : "DBC"
    };

    field = {
        "subfields": [subfield]
    };

    params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield single subfield, matching value",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield , params),  [] );

    record = {
        fields : [{
            'name' : '032'
        }, {
            'name' : '996'
        }]
    };

    var subfield1 = {
        'name' : "a", 'value' : "A"
    };
    var subfield2 = {
        'name' : "a", 'value' : "DBC"
    };

    field = {
        "subfields": [subfield1, subfield2]
    };

    params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield repeated subfields, matching value",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield1 , params),  [] );

    record = {
        fields : [{
            'name' : '032'
        }, {
            'name' : '996'
        }]
    };

    subfield1 = {
        'name' : "a", 'value' : "A"
    };
    subfield2 = {
        'name' : "a", 'value' : "Another A"
    };

    field = {
        "subfields": [subfield1, subfield2]
    };

    params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield repeated subfield already handled",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield2 , params),  [] );

    record = {
        fields : [{
            'name' : '010'
        }, {
            'name' : '011'
        }]
    };

    subfield = {
        'name' : "a", 'value' : ""
    };

    field = {
        "subfields": [subfield]
    };

    params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield no affected fields in record, non-matching value",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield , params),  [] );

    record = {
        fields : [{
            'name' : '010'
        }, {
            'name' : '011'
        }]
    };

    subfield = {
        'name' : "a", 'value' : "DBC"
    };

    field = {
        "subfields": [subfield]
    };

    params = {
        "fields": ["032", "996"],
        "values": ["DBC"]
    };

    Assert.equalValue( "SubfieldValueMakesFieldsAllowed.validateSubfield no affected fields in record, matching value",
        SubfieldValueMakesFieldsAllowed.validateSubfield( record, field, subfield , params),  [] );
});