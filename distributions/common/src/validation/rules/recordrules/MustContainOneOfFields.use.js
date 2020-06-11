use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['MustContainOneOfFields'];

var MustContainOneOfFields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * MustContainOneOfFields checks if a record contains the field in the params array.
     * @syntax RecordRules.MustContainOneOf (  record, params  )
     * @param {Object} record The record as a json.
     * @param {Object} An object with the key fields and Arrays as value , containing field numbers of which one must exists in the record to pass validation
     * @name MustContainOneOfFields.validateRecord
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - MustContainOneOfFields.validateRecord( ", record, ", ", params, " )");
        var result = [];
        try {
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            ValueCheck.checkThat("params.fields", params.fields.length).is.greaterThan(0);
            if (!__checkRecordForField(record, params)) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var msg = ResourceBundle.getStringFormat(bundle, "record.must.contain.one.of.fields.error", params.fields);
                result.push(ValidateErrors.recordError("", msg));
            }
            return result;
        } finally {
            Log.trace("Exit - MustContainOneOfFields.validateRecord: ", result);
        }
    }

    var __checkRecordForField = function (record, params) {
        for (var i = 0; i < params.fields.length; ++i) {
            if (ValidationUtil.recordContainsField(record, params.fields[i]) === true) {
                return true;
            }
        }
        return false;
    };

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();