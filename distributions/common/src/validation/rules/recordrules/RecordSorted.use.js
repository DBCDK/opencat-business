use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['RecordSorted'];

var RecordSorted = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks if the fields are lexically sorted
     * @syntax RecordSorted.validateRecord(  record , params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing an array keyed on fields
     * @name RecordSorted.validateRecord
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - recordSorted.validateRecord( ", record, ", ", params, " )");
        try {

            ValueCheck.check("record.fields", record.fields).instanceOf(Array);

            var result = [];
            var previous = "000";
            for (var i = 0; i < record.fields.length; ++i) {
                if (record.fields[i].name < previous) {
                    var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    var url = TemplateUrl.getUrlForField(record.fields[i].name, params.template);
                    var msg = ResourceBundle.getStringFormat(bundle, "record.sorted.error", record.fields[i].name);
                    return result = [ValidateErrors.recordError(url, msg)];
                }
                previous = record.fields[i].name;
            }
            return result;
        } finally {
            Log.trace("Exit - recordSorted.validateRecord: ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();