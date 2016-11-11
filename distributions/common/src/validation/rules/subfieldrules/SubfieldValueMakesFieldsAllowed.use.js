use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['SubfieldValueMakesFieldsAllowed'];

var SubfieldValueMakesFieldsAllowed = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks that if the subfield has the value 'DBC'
     * then the fields in listOfAllowedSubfields are allowed in the record
     * @syntax SubfieldValueMakesFieldsAllowed.validateField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Array of allowed fields ['032', '990']
     * @return {object}
     * @example SubfieldValueMakesFieldsAllowed.validateField( record, field, subfield, params )
     * @name SubfieldValueMakesFieldsAllowed.validateField
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter SubfieldValueMakesFieldsAllowed.validateField");
        try {
            ValueCheck.check("params", params);
            ValueCheck.check("params", params).instanceOf(Array);
            if (subfield.value === 'DBC') {
                return [];
            }
            var parMap = __mapifyMe(params, false);
            var recordMap = __mapifyMe(record, true);
            return __checkForExcluded(recordMap, subfield, parMap)
        } finally {
            Log.trace("Exit SubfieldValueMakesFieldsAllowed.validateField");
        }
    }

    function __mapifyMe(arr, isRecord) {
        Log.trace("Enter SubfieldValueMakesFieldsAllowed.__mapifyMe");
        try {
            var ret = {};
            if (isRecord) {
                arr.fields.forEach(function (ele) {
                    if (!ret.hasOwnProperty(ele.name)) {
                        ret[ele.name] = undefined;
                    }
                });
            } else {
                arr.forEach(function (ele) {
                    if (!ret.hasOwnProperty(ele)) {
                        ret[ele] = undefined;
                    }
                });
            }
            return ret;
        } finally {
            Log.trace("exit SubfieldValueMakesFieldsAllowed.__mapifyMe");
        }
    }


    function __checkForExcluded(recordMap, subfield, parMap) {
        Log.trace("Enter SubfieldValueMakesFieldsAllowed.__checkForMatchingFields");
        try {

            for (var key in parMap) {
                if (parMap.hasOwnProperty(key)) {
                    if (recordMap.hasOwnProperty(key)) {
                        var errorMessage = ResourceBundle.getStringFormat(ResourceBundleFactory.getBundle(BUNDLE_NAME), "subfield.value.makes.field.allowed.rule.error", key, subfield.name);
                        return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
                    }
                }
            }
            return [];
        } finally {
            Log.trace("Exit SubfieldValueMakesFieldsAllowed.__checkForMatchingFields");
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateSubfield': validateSubfield
    };
}();
