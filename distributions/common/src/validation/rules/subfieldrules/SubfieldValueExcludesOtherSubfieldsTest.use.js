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
            {'name': '008'}]
    };

    var params = {'values': ['2'], 'excludedSubfields': ['o']};
    var errMsg = ResourceBundle.getStringFormat(bundle, "excluded.subfields", "008", "m", "008", "o");
    Assert.equalValue("1 SubfieldValueExcludesOtherSubfields.validateSubfield found excluded subfield", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    params = {'values': ['1'], 'excludedSubfields': ['o']};
    Assert.equalValue("2 SubfieldValueExcludesOtherSubfields.validateSubfield found no subfields", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), []);

});