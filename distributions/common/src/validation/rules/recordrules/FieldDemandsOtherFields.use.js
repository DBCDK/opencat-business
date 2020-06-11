use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['FieldDemandsOtherFields'];

var FieldDemandsOtherFields = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * validateRecord
     * Function that takes two arrays as parameters, demands and sources.
     * If any of the fieldnames in sources is present in the record, then all of the fields in the demands array must be present.
     * @syntax
     * @param {object} record
     * @param {object} params Object with the following properties
     * sources: Array of the field names that requires other fields to be present
     * demands: Array of the fields that must be present if either of the fields in sources is present
     * example params { "sources": [ "008", "009", "038", "039", "100", "239", "245", "652" ] , "demands": [ "008", "009", "245", "652" ] }
     * @return Array which is either empty or contains an error
     * @name FieldDemandsOtherFields.validateRecord
     * @method validateRecord
     */
    function validateRecord(record, params) {
        Log.trace("Enter - FieldDemandsOtherFields.validateRecord");
        try {
            ValueCheck.check("record", record).type("object");
            ValueCheck.check("params", params).type("object");

            var checkedParams = __checkParams(params);
            if (checkedParams.length > 0) {
                return checkedParams;
            }
            return __checkFields(ValidationUtil.getFieldNamesAsKeys(record), params);
        } finally {
            Log.trace("Exit - FieldDemandsOtherFields.validateRecord");
        }
    }

    function __checkFields(fieldNames, params) {
        Log.trace("Enter - FieldDemandsOtherFields.__checkFields");
        try {
            var existingSourceFields = [];
            var missingDemandFields = [];

            params.sources.forEach(function (fieldName) {
                if (fieldNames.hasOwnProperty(fieldName)) {
                    existingSourceFields.push(fieldName);
                }
            });
            if (existingSourceFields.length > 0) {
                params.demands.forEach(function (fieldName) {
                    if (!fieldNames.hasOwnProperty(fieldName)) {
                        missingDemandFields.push(fieldName);
                    }
                })
            }
            if (missingDemandFields.length > 0) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                var msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.missing.values", existingSourceFields, missingDemandFields);
                return [ValidateErrors.recordError("", msg)];
            }
            return [];
        } finally {
            Log.trace("Exit - FieldDemandsOtherFields.__checkFields");
        }
    }

    function __checkParams(params) {
        Log.trace("Enter - FieldDemandsOtherFields.__checkParams");
        var bundle;
        try {
            var ret = [];
            var msg;
            if (!params.hasOwnProperty("sources") && !params.hasOwnProperty("demands")) {
                Log.warn("sources and demands params are missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.missing.sources.and.demands");
                return [ValidateErrors.recordError("", msg)];
            }
            if (!params.hasOwnProperty("demands")) {
                Log.warn("params.demands is missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.sources.missing.demands");
                return [ValidateErrors.recordError("", msg)];
            }
            if (!params.hasOwnProperty("sources")) {
                Log.warn("params.sources is missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.demands.missing.sources");
                return [ValidateErrors.recordError("", msg)];
            }
            // check for wrong type and array.length
            if (!Array.isArray(params.sources)) {
                Log.warn("params.sources is not of type array");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.sources.but.not.array");
                ret.push(ValidateErrors.recordError("", msg));
            } else if (Array.isArray(params.sources) && params.sources.length < 1) {
                Log.warn("params.sources is empty");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.sources.length.0");
                ret.push(ValidateErrors.recordError("", msg));
            }
            if (!Array.isArray(params.demands)) {
                Log.warn("params.demands is not of type array");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.demands.but.not.array");
                ret.push(ValidateErrors.recordError("", msg));
            } else if (Array.isArray(params.demands) && params.demands.length < 1) {
                Log.warn("params.demands is empty");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.having.demands.length.0");
                ret.push(ValidateErrors.recordError("", msg));
            }
            return ret;
        } finally {
            Log.trace("Exit - FieldDemandsOtherFields.__checkParams");
        }
    }

    return {
        'validateRecord': validateRecord,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
