use("Exception");
use("Log");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['SubfieldConditionalMandatory'];

var SubfieldConditionalMandatory = function () {
    var BUNDLE_NAME = "validation";

    /**
     * checks that if a specified subfield has a specific value, then another given subfield is mandatory
     * @syntax SubfieldConditionalMandatory.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with properties subfieldConditional, value, subfieldMandatory, e.g. { 'subfieldConditional': 'v', 'values': '0', 'subfieldMandatory': 'a' }
     * @return {object}
     * @example SubfieldConditionalMandatory.validateField( record, field, params )
     * @name SubfieldConditionalMandatory.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter SubfieldConditionalMandatory.validateField");
        try {
            ValueCheck.check("params.subfieldConditional", params.subfieldConditional);
            ValueCheck.check("params.values", params.values);
            ValueCheck.check("params.subfieldMandatory", params.subfieldMandatory);
            var mandatoryAndNotFound = false;
            // check for condition and if it is fulfilled
            for (var i = 0; i < field.subfields.length; ++i) {
                var name = field.subfields[i].name;
                var value = field.subfields[i].value;
                if (name === params.subfieldConditional && __inArray(params.values, value) === true) {
                    // condition fulfilled, params.subfieldMandatory is mandatory
                    mandatoryAndNotFound = true;
                } else if (name === params.subfieldMandatory) {
                    // mandatory subfield exists, i.e. condition fulfilled
                    return [];
                }
            }
            if (mandatoryAndNotFound) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var errorMessage = ResourceBundle.getStringFormat(bundle, "mandatory.subfield.conditional.rule.error", params.subfieldMandatory, params.subfieldConditional, params.values);
                return [ValidateErrors.fieldError("TODO:url", errorMessage, RecordUtil.getRecordPid(record))];
            }
            return [];
        } finally {
            Log.trace("Exit SubfieldConditionalMandatory.validateField");
        }

        function __inArray(listOfValues, valToCheck) {
            for (var i = 0; i < listOfValues.length; ++i) {
                if (listOfValues[i] === valToCheck) {
                    return true;
                }
            }
            return false;
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
