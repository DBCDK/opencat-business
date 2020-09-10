use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['RepeatableFields'];

var RepeatableFields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks that only allowed fields are repeated in the record.
     * @syntax RepeatableFields.validateRecord( record, params )
     * @param {object} record
     * @param {object} params must contain a key 'fields' with an array of fields that can repeat
     * params example:
     * {'fields': []}
     * {'fields': ['002']}
     * {'fields': ['002','003','004','042','666','999']}
     * @return {object}
     * @name RepeatableFields.validateRecord
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - RepeatableFields.validateRecord( ", record, ", ", params, " )");

        var result = [];
        try {

            ValueCheck.check("params.fields", params['fields']).instanceOf(Array);

            var foundFields = {};
            result = [];
            for (var i = 0; i < record.fields.length; i++) {
                if (!foundFields.hasOwnProperty(record['fields'][i]['name'])) {
                    foundFields[record['fields'][i]['name']] = 1;
                } else {
                    foundFields[record['fields'][i]['name']]++;
                }
            }
            var paramsFields = params['fields'];
            var paramsValues = {};
            for (var j = 0; j < paramsFields.length; ++j) {
                paramsValues[paramsFields[j]] = 1;
            }
            // saves an iteration , via Object.keys
            var bundle = null;
            for (var key in foundFields) {
                if (foundFields.hasOwnProperty(key)) {
                    if (paramsValues[key] === undefined && foundFields[key] > 1) {
                        if (bundle == null) {
                            bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        }
                        var msg = ResourceBundle.getStringFormat(bundle, "fields.repeatable.error", key, foundFields[key]);
                        result.push(ValidateErrors.recordError("TODO:fixurl", msg));
                    }
                }
            }
            return result;
        } finally {
            Log.trace("Exit - RepeatableFields.validateRecord: ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();