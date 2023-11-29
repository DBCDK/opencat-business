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
        'subfields': [o]
    };

    var record = {
        fields: [field,
            {'name': '100'},
            {'name': '200'}]
    };

    var params = {'values': ['2'], 'excludedSubfields': ['o']};
    var errMsg = ResourceBundle.getStringFormat(bundle, "excluded.subfields", "2", "o");
    Assert.equalValue("1 SubfieldValueExcludesOtherSubfields.validateSubfield found single excluded subfield", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    params = {'values': ['1'], 'excludedSubfields': ['o']};
    var errMsg2 = ResourceBundle.getStringFormat(bundle, "excluded.subfields", "1", "o");
    Assert.equalValue("2 SubfieldValueExcludesOtherSubfields.validateSubfield found multiple excluded fields", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg2), ValidateErrors.subfieldError("TODO:fixurl", errMsg3)]);

    params = {'values': ['1'], 'excludedSubfields': ['o']};
    // skal give
    Assert.equalValue("3 SubfieldValueExcludesOtherSubfields.validateSubfield subfield value match but no excluded subfield", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), []);

    params = {'values': ['3'], 'excludedSubfields': ['o']};
    Assert.equalValue("4 SubfieldValueExcludesOtherSubfields.validateSubfield no subfield value match but excluded subfield", SubfieldValueExcludesOtherSubfields.validateSubfield(record, field, subfield, params), []);

});