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

EXPORTED_SYMBOLS = ['SubfieldValueExcludesOtherSubfields'];

var SubfieldValueExcludesOtherSubfields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * This rule is used for requiring that a record does NOT contain one or more specific subfields if specific subfield value is present
     * if the value of the subfield with this rule has a value matching the values of the rule
     *
     * Params should contain two elements:
     * - values [Array] contains the values the subfield should match with
     * - excludedSubfields [Array] contains the list of subfields that are excluded on the record if a match is made with
     * the matchValues list
     *
     * @param record The whole record to perform the validation on
     * @param field The field with the validation rule
     * @param subfield The subfield with the validation rule
     * @param params Contains the values to match and the excluded subfields
     * @returns {Array}
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter SubfieldValueExcludesOtherSubfields.validateSubField");
        var result = [];

        try {
            ValueCheck.check("params", params);
            ValueCheck.check("params", params).instanceOf(Object);
            ValueCheck.check("params", params.values);
            ValueCheck.check("params", params.values).instanceOf(Array);
            ValueCheck.check("params", params.excludedSubfields);
            ValueCheck.check("params", params.excludedSubfields).instanceOf(Array);

            var matchValues = params.values;
            var excludedSubfields = params.excludedSubfields;

            // if matchValue exists
            if (("1" === subfield.value || "2" === subfield.value )) {
                // run through subfields in record to check if excluded subfield name exists
                field.subfields.forEach(function (subfield) {
                if (excludedSubfields.indexOf(subfield.name) > -1) {
                // create error message
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var message = ResourceBundle.getStringFormat(bundle, "excluded.subfields", matchValues, field.name, excludedSubfields);
                result.push(ValidateErrors.recordError("TODO:fixurl", message));
                    }
                });
            }

            return result;
        } finally {
            Log.trace("Exit SubfieldValueExcludesOtherSubfields.validateSubfield");
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateSubfield': validateSubfield
    };
}();