/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

use("ResourceBundle");
use("ResourceBundleFactory");
use("UnitTest");
use('GenericSettings');
use("SubfieldValueExcludesOtherSubfields");

UnitTest.addFixture( "SubfieldValueExcludesOtherSubfields.validateSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldValueExcludesOtherSubfields.__BUNDLE_NAME );

    var subfield = {
        'name': "m",
        'value': '2'
    };

    var field = {
        "name" : '008', "indicator" : '00', subfields : [{
            'name' : "m", 'value' : "2"
        }, {
            'name' : "o", 'value' : "b"
        }]
    };

    var record = {
        fields: [field,
            {'name': '008'},
            {'name': '100'}]
    };

    var params = {'values': ['2'], 'excludedSubfields': ['o']};
    var errMsg = ResourceBundle.getStringFormat(bundle, "excluded.subfields", "2", "008", "o");
    Assert.equalValue("1 SubfieldValueExcludesOtherSubfields.validateSubfield found excluded subfield o", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    subfield = {
        'name': "m",
        'value': '1'
    };

    field = {
        "name" : '008', "indicator" : '00', subfields : [{
            'name' : "m", 'value' : "1"
        }, {
            'name' : "o", 'value' : "b"
        }, {
            'name' : "a", 'value' : "2018"
        }]
    };

    params = {'values': ['1'], 'excludedSubfields': ['o']};
    var errMsg2 = ResourceBundle.getStringFormat(bundle, "excluded.subfields", "1", "008", "o");
    Assert.equalValue("2 SubfieldValueExcludesOtherSubfields.validateSubfield found excluded subfield o", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg2)]);

    subfield = {
        'name': "m",
        'value': '3'
    };

    field = {
        "name" : '008', "indicator" : '00', subfields : [{
            'name' : "m", 'value' : "3"
        }, {
            'name' : "o", 'value' : "b"
        }, {
            'name' : "a", 'value' : "2018"
        }]
    };

    params = {'values': ['3'], 'excludedSubfields': ['o']};
    Assert.equalValue("3 SubfieldValueExcludesOtherSubfields.validateSubfield found no excluded subfields", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), []);

    subfield = {
        'name': "m",
        'value': '3'
    };

    field = {
        "name" : '008', "indicator" : '00', subfields : [{
            'name' : "m", 'value' : "3"
        }, {
            'name' : "a", 'value' : "2018"
        }]
    };

    params = {'values': ['not'], 'excludedSubfields': ['o']};
    Assert.equalValue("4 SubfieldValueExcludesOtherSubfields.validateSubfield found no excluded subfields", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), []);


});