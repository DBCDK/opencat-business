use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['CheckValue'];

var CheckValue = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkValue is used to check the value of a subfield, an error
     * is returned if the field is not validated
     *
     * @syntax CheckValue.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params should contain an array of valid values named 'values'
     * param examples:
     * {'values': ["123", "234", "345", "456", "870970"]}
     * @return {object}
     * @name CheckValue.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckValue.validateSubfield");
        try {
            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.checkThat("params['values']", params['values']).instanceOf(Array);
            for (var i = 0; i < params.values.length; i++) {
                if (subfield.value === params.values[i]) {
                    return [];
                }
            }
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "check.value.rule.error", subfield.value, field.name, subfield.name, params.values.join("', '"));
            return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
        } finally {
            Log.trace("Exit --- CheckValue.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
