use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['ConflictingFields'];

var ConflictingFields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks that a maximum of the of the fields given as a parameter is
     * present in the record.
     * @syntax ConflictingFields.validateRecord(record, params)
     * @param {object} record
     * @param {object} params should contain an array of conflicting fieldnames. The array must be keyed on fields
     * // TODO
     * @return {object}
     * @name ConflictingFields.validateRecord
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - ConflictingFields.validateRecord( ", record, ", ", params, " )");

        var result = [];
        try {
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            var foundFields = {};
            result = [];
            for (var i = 0; i < record.fields.length; i++) {
                if (!foundFields.hasOwnProperty(foundFields[record.fields[i].name])) {
                    foundFields[record.fields[i].name] = 1;
                } else {
                    foundFields[record.fields[i].name]++;
                }
            }
            var found = {'counter': 0};
            for (var j = 0; j < params.fields.length; ++j) {
                if (foundFields.hasOwnProperty(params.fields[j])) {
                    found.counter++;
                    if (found.counter > 1) {
                        var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        var msg = ResourceBundle.getStringFormat(bundle, "fields.conflicting.error", params.fields[j], found.name);
                        result.push(ValidateErrors.recordError("", msg));
                    } else {
                        found.name = params.fields[j];
                    }
                }
            }
            return result;
        } finally {
            Log.trace("Exit - ConflictingFields.validateRecord: ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();