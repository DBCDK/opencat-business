use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckValueUnlessHasSubfield'];

var CheckValueUnlessHasSubfield = function () {
    var __BUNDLE_NAME = "validation";

    /**
     *
     * @syntax CheckValueUnlessHasSubfield.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params should contain an array of valid values named 'values'
     * @return {object}
     * @name CheckValueUnlessHasSubfield.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckValueUnlessHasSubfield.validateSubfield");
        try {
            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.checkThat("params['subfield']", params['subfield']).instanceOf(String);
            ValueCheck.checkThat("params['values']", params['values']).instanceOf(Array);


            if (ValidationUtil.doesFieldContainSubfield(field, params.subfield) === true) {
                return [];
            }
            for (var i = 0; i < params.values.length; i++) {
                if (subfield.value === params.values[i]) {
                    return [];
                }
            }

            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "check.value.rule.error", subfield.value, params.values.join("', '"));
            return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
        } finally {
            Log.trace("Exit --- CheckValueUnlessHasSubfield.validateSubfield");
        }
    }





    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
