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
     * Checks that if the subfield has a value from params.values
     * then the fields in params.fields are allowed in the record
     * @syntax SubfieldValueMakesFieldsAllowed.validateSubField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params object containing property 'fields' listing allowed fields in an array of strings and
     *                 property 'values' listing controlling subfield values in an array of strings
     * @return {object}
     * @example SubfieldValueMakesFieldsAllowed.validateSubField( record, field, subfield, params )
     * @name SubfieldValueMakesFieldsAllowed.validateSubField
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter SubfieldValueMakesFieldsAllowed.validateSubField");
        try {
            ValueCheck.check("params.fields", params.fields);
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            ValueCheck.check("params.values", params.values);
            ValueCheck.check("params.values", params.values).instanceOf(Array);
            if (subfield.value in __mapifyMe(params.values, false)) {
                return [];
            }
            return __checkForMatchingFields(record, subfield, params)
        } finally {
            Log.trace("Exit SubfieldValueMakesFieldsAllowed.validateSubField");
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


    function __checkForMatchingFields(record, subfield, params) {
        Log.trace("Enter SubfieldValueMakesFieldsAllowed.__checkForMatchingFields");
        try {
            var fields = __mapifyMe(params.fields, false);
            var recordMap = __mapifyMe(record, true);
            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {
                    if (recordMap.hasOwnProperty(key)) {
                        var errorMessage = ResourceBundle.getStringFormat(ResourceBundleFactory.getBundle(BUNDLE_NAME),
                            "subfield.value.makes.field.allowed.rule.error", key, subfield.name,
                            "'" + params.values.join("' eller '") + "'");
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
