use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['RepeatableSubfields'];

var RepeatableSubfields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks whether a subfield is repeated.
     * @syntax RepeatableSubfields.validateField ( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with property subfields as an Array of names of subfields that can not be repeated, e.g. { 'subfields': ['a', 'c'] }
     * @return {object}
     * @example RepeatableSubfields.validateField ( record, field, params )
     * @name RepeatableSubfields.validateField
     * @method
     */

    function validateField(record, field, params) {
        Log.trace("Enter - RepeatableSubfields.validateField ( ", record, ", ", field, ", ", params, " )");

        var result = [];
        try {
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);
            var counter = {};
            for (var j = 0; j < field.subfields.length; j++) {
                if (params.subfields.indexOf(field.subfields[j].name) !== -1) {
                    if (!counter.hasOwnProperty(field.subfields[j].name)) {
                        counter[field.subfields[j].name] = 1;
                    } else {
                        counter[field.subfields[j].name]++;
                    }
                }
            }
            for (var i = 0; i < params.subfields.length; ++i) {
                if (counter[params.subfields[i]] > 1) {
                    var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    var errorMessage = ResourceBundle.getStringFormat(bundle, "repeatable.subfields.rule.error", params.subfields[i], counter[params.subfields[i]]);
                    result.push(ValidateErrors.fieldError("TODO:url", errorMessage));
                }
            }
            return result;
        } finally {
            Log.trace("Exit - RepeatableSubfields.validateField (): ", result);
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
