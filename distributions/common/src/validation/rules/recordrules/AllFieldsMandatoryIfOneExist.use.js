use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['AllFieldsMandatoryIfOneExist'];

var AllFieldsMandatoryIfOneExist = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Verifies that if one of the fields from params is present, all must be present.
     * @syntax RecordRules.allFieldsMandatoryIfOneExist( record, params )
     * @param {object} record
     * @param {object} params must contain a key 'fields' with an array of fields that must be present
     * params example:
     * {'fields': ['008','009','038','039','100','110','239','245','652']}
     * @return {object}
     * @name RecordRules.allFieldsMandatoryIfOneExist
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - RecordRules.allFieldsMandatoryIfOneExist( ", record, ", ", params, " )");

        var result = [];
        try {

            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.check("params.fields", params.fields).instanceOf(Array);

            var totalFieldsFound = 0;
            var foundFields = [];
            var totalFieldsToCheckFor = params.fields.length;
            var fieldAsKeys = ValidationUtil.getFieldNamesAsKeys(record);

            for (var i = 0; i < totalFieldsToCheckFor; ++i) {
                var fieldName = params.fields[i];
                if (fieldAsKeys.hasOwnProperty(fieldName)) {
                    totalFieldsFound += 1;
                } else {
                    foundFields.push(fieldName);
                }
            }
            if (totalFieldsFound > 0 && totalFieldsFound < totalFieldsToCheckFor) {
                foundFields.forEach(function (f) {
                    var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    var message = ResourceBundle.getStringFormat(bundle, "field.mandatory.error", f);
                    result.push(ValidateErrors.recordError("TODO:fixurl", message));
                });
            }
            return result;
        } finally {
            Log.trace("Exit - RecordRules.allFieldsMandatoryIfOneExist(): ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();