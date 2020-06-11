use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['OptionalFields'];

var OptionalFields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks that only fields from the template are used.
     * @syntax OptionalFields.validateRecord( record, params )
     * @param {object} record
     * @param {object} params should contain an array of usable fields. The array must be keyed on fields
     * @return {object}
     * @name OptionalFields.validateRecord
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - OptionalFields.validateRecord( ", record, ", ", params, " )");

        var result = [];
        try {
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);

            var positiveFields = params;
            var negativeFields = [];
            for (var i = 0; i < record.fields.length; ++i) {
                if (positiveFields.fields.indexOf(record.fields[i].name) === -1) {
                    negativeFields.push(record.fields[i].name);
                }
            }
            if (negativeFields.length > 0) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var msg = ResourceBundle.getStringFormat(bundle, "fields.optional.error", negativeFields);
                result = [ValidateErrors.recordError("", msg)];
            }
            return result;
        } finally {
            Log.trace("Enter - OptionalFields.validateRecord: ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();