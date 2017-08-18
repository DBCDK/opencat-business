use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['FieldsIndicator'];

var FieldsIndicator = function () {
    var BUNDLE_NAME = "validation";

    /**
     * fieldsIndicator checks whether an indicate has the value corresponding to the value given in params
     *
     * @syntax FieldsIndicator.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params must contain a property 'indicator' with the valid indicator, e.g. { 'indicator': "00" }
     * @return {object}
     * @name FieldsIndicator.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter - FieldsIndicator.validateField( ", record, ", ", field, ", ", params, ")");
        var result = [];
        var bundle;
        var errorMessage;
        var error;
        try {
            ValueCheck.check("params.indicator", params.indicator);
            if (typeof( params.indicator ) === "string") {
                if (field.indicator === params.indicator) {
                    return result;
                }
                bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                errorMessage = ResourceBundle.getStringFormat(bundle, "field.indicator.string.error", field.indicator, params.indicator);
                error = ValidateErrors.fieldError("TODO:url", errorMessage);
                return result = [error];
            } else {
                if (params.indicator.indexOf(field.indicator) > -1) {
                    return result;
                }
                bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                errorMessage = ResourceBundle.getStringFormat(bundle, "field.indicator.array.error", field.indicator, params.indicator.join(", "));
                error = ValidateErrors.fieldError("TODO:url", errorMessage);
                return result = [error];
            }
        } finally {
            Log.trace("Exit - FieldsIndicator.validateField(): ", result);
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
