use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['FieldsMandatory'];

var FieldsMandatory = function () {
    var BUNDLE_NAME = "validation";

    /**
     * fieldsMandatory , checks if a record contains the field in the params array.
     * @syntax RecordRules.fieldsMandatory (  record, params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing atleast an array keyed on fields. The array should contain the mandatory field names
     * @name FieldsMandatory.validateRecord
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - FieldsMandatory.validateRecord( ", record, ", ", params, " )");
        var result = [];
        var bundle = null;
        try {
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            Log.debug("Checking fields: ", params.fields);
            for (var i = 0; i < params.fields.length; ++i) {
                if (ValidationUtil.recordContainsField(record, params.fields[i]) !== true) {
                    if (bundle == null) {
                        bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    }
                    Log.debug("Fields: ", params.fields[i], " was not found in record: ", uneval(record));
                    var url = TemplateUrl.getUrlForField(params.fields[i], params.template);
                    var msg = ResourceBundle.getStringFormat(bundle, "field.mandatory.error", params.fields[i]);
                    result.push(ValidateErrors.recordError(url, msg));
                }
            }
            return result;
        } finally {
            Log.trace("Exit - FieldsMandatory.validateRecord: ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();