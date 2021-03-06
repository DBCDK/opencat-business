/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

use("ResourceBundle");
use("ResourceBundleFactory");
use("UnitTest");
use('GenericSettings');
use("SubfieldValueExcludesField");

UnitTest.addFixture( "SubfieldValueExcludesField.validateSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( SubfieldValueExcludesField.__BUNDLE_NAME );

    var subfield = {
        'name': "a",
        'value': 'hit'
    };

    var field = {
        'name': '032',
        'subfields': [subfield]
    };

    var record = {
        fields: [field,
            {'name': '100'},
            {'name': '200'}]
    };

    var params = {'values': ['blah', 'hit', 'something else'], 'excludedFields': ['100']};
    var errMsg = ResourceBundle.getStringFormat(bundle, "excluded.field", "100", "032", "a");
    Assert.equalValue("1 SubfieldValueExcludesField.validateSubfield found single excluded field", SubfieldValueExcludesField.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg)]);

    params = {'values': ['blah', 'hit', 'something else'], 'excludedFields': ['100', '200']};
    var errMsg2 = ResourceBundle.getStringFormat(bundle, "excluded.field", "100", "032", "a");
    var errMsg3 = ResourceBundle.getStringFormat(bundle, "excluded.field", "200", "032", "a");
    Assert.equalValue("2 SubfieldValueExcludesField.validateSubfield found multiple excluded fields", SubfieldValueExcludesField.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError("TODO:fixurl", errMsg2), ValidateErrors.subfieldError("TODO:fixurl", errMsg3)]);

    params = {'values': ['blah', 'hit', 'something else'], 'excludedFields': ['500']};
    Assert.equalValue("3 SubfieldValueExcludesField.validateSubfield subfield value match but no excluded subfield", SubfieldValueExcludesField.validateSubfield(record, field, subfield, params), []);

    params = {'values': ['blah', 'something else'], 'excludedFields': ['100']};
    Assert.equalValue("4 SubfieldValueExcludesField.validateSubfield no subfield value match but excluded subfield", SubfieldValueExcludesField.validateSubfield(record, field, subfield, params), []);

});