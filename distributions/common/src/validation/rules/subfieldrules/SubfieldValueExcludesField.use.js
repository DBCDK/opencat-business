/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['SubfieldValueExcludesField'];

var SubfieldValueExcludesField = function () {
    var BUNDLE_NAME = "validation";

    /**
     * This rule is used for requiring that a record does NOT contain one or more specific fields
     * if the value of the subfield with this rule has a value matching the values of the rule
     *
     * Params should contain two elements:
     * - values [Array] contains the values the subfield should match with
     * - excludedFields [Array] contains the list of fields that are excluded on the record if a match is made with
     * the matchValues list
     *
     * @param record The whole record to perform the validation on
     * @param field The field with the validation rule
     * @param subfield The subfield with the validation rule
     * @param params Contains the values to match and the excluded fields
     * @returns {Array}
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter SubfieldValueExcludesField.validateSubField");
        var result = [];

        try {
            ValueCheck.check("params", params);
            ValueCheck.check("params", params).instanceOf(Object);
            ValueCheck.check("params", params.values);
            ValueCheck.check("params", params.values).instanceOf(Array);
            ValueCheck.check("params", params.excludedFields);
            ValueCheck.check("params", params.excludedFields).instanceOf(Array);

            var matchValues = params.values;
            var excludedFields = params.excludedFields;

            if (matchValues.indexOf(subfield.value) > -1) {
                record.fields.forEach(function (recordField) {
                    if (excludedFields.indexOf(recordField.name) > -1) {
                        var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        var message = ResourceBundle.getStringFormat(bundle, "excluded.field", recordField.name, field.name, subfield.name);
                        result.push(ValidateErrors.recordError("TODO:fixurl", message));
                    }
                });
            }

            return result;
        } finally {
            Log.trace("Exit SubfieldValueExcludesField.validateSubfield");
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateSubfield': validateSubfield
    };
}();