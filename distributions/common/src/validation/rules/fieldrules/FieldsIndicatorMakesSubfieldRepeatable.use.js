use("Exception");
use("Log");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['FieldsIndicatorMakesSubfieldRepeatable'];

var FieldsIndicatorMakesSubfieldRepeatable = function () {
    var BUNDLE_NAME = "validation";

    /**
     * FieldsIndicatorMakesSubfieldRepeatable checks that if a given indicator is not present , then the subfield cannot be repeatable
     * Meaning if the indicator macthes the value from the list , they are allowed to be repeated.
     * Note this rule does not negate the normal rule of repeatable on a given subfield
     * So to use this rule you have to make the subfields repeatable and then add this rule
     *
     * @syntax FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params must contain an object with two properties, indicators, subfieldNames.
     * Both properties must be lists. The indicator list denotes which indicator values makes the list of subfields repeatable.
     * @return {object}
     * @name FieldsIndicatorMakesSubfieldRepeatable.validateField
     * @method
     */

    function validateField(record, field, params, settings) {
        Log.trace("Enter - FieldsIndicatorMakesSubfieldRepeatable.validateField( ", record, ", ", field, ", ", params, ", ", settings, " )");
        var result = [];
        try {
            ValueCheck.check("params.indicators", params.indicators);
            ValueCheck.check("params.indicators", params.indicators).instanceOf(Array);
            ValueCheck.checkThat("params.indicators", params.indicators.length).is.greaterThan(0);
            ValueCheck.check("params.subfieldNames", params.subfieldNames);
            ValueCheck.check("params.subfieldNames", params.subfieldNames).instanceOf(Array);
            ValueCheck.checkThat("params.subfieldNames", params.subfieldNames.length).is.greaterThan(0);

            if (!__fieldIndicatorInParams(params, field)) {
                var subfieldMap = __getSubfieldMap(field.subfields);
                params.subfieldNames.forEach(function (subfield) {
                    if (subfieldMap.hasOwnProperty(subfield) && subfieldMap[subfield].isRepeated === true) {
                        result.push(__getError(params.indicators, subfield));
                    }
                });
            }
            return result;
        } finally {
            Log.trace("Exit - FieldsIndicatorMakesSubfieldRepeatable.validateField(): ", result);
        }
    }

    function __getError(indicators, subfieldName, record) {
        Log.trace("Enter - FieldsIndicatorMakesSubfieldRepeatable.____getSubfieldMap(): ", indicators, subfieldName);
        var res = "";
        try {
            var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "field.indicator.subfield.repeated.error", subfieldName, indicators);
            return res = ValidateErrors.fieldError("TODO:url", errorMessage, RecordUtil.getRecordPid(record));
        } finally {
            Log.trace("exit - FieldsIndicatorMakesSubfieldRepeatable.____getSubfieldMap(): ", res);
        }
    }

    function __getSubfieldMap(subfields) {
        Log.trace("Enter - FieldsIndicatorMakesSubfieldRepeatable.____getSubfieldMap(): ", subfields);
        var ret = {};
        try {
            for (var i = 0; i < subfields.length; i++) {
                if (ret.hasOwnProperty(subfields[i].name)) {
                    ret[subfields[i].name]["isRepeated"] = true;
                } else {
                    ret[subfields[i].name] = {"isRepeated": false}
                }
            }
            return ret;
        } finally {
            Log.trace("Exit - FieldsIndicatorMakesSubfieldRepeatable.____getSubfieldMap(): ", ret);
        }
    }

    function __fieldIndicatorInParams(params, field) {
        var res = false;
        try {
            for (var i = 0; i < params.indicators.length; ++i) {
                if (field.indicator === params.indicators[i]) {
                    return res = true;
                }
            }
        } finally {
            Log.trace("Exit - FieldsIndicatorMakesSubfieldRepeatable.__fieldIndicatorInParams(): ", res);
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };

}();
