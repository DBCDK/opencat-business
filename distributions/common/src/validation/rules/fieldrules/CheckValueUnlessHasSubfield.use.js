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
     * @syntax CheckValueUnlessHasSubfield.validateField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params should contain an array of valid values named 'values'
     * @return {object}
     * @name CheckValueUnlessHasSubfield.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter --- CheckValueUnlessHasSubfield.validateField");
        try {
            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.checkThat("params['subfield']", params['subfield']).type("string");
            ValueCheck.checkThat("params['values']", params['values']).instanceOf(Array);


            if (ValidationUtil.doesFieldContainSubfield(field, params.subfield) === true) {
                return [];
            }

            for (var f = 0; f < field.subfields.length; ++f) {
                var found = false;
                for (var v = 0; v < params.values.length; v++) {
                    if (field.subfields[f].value === params.values[v]) {
                        found = true;
                        break;
                    }
                }
                if (found !== true) {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    var errorMessage = ResourceBundle.getStringFormat(bundle, "check.value.rule.error", field.subfields[f].value, field.name, field.subfields[f].name ,params.values.join("', '"));
                    return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
                }
            }

            return [];
        } finally {
            Log.trace("Exit --- CheckValueUnlessHasSubfield.validateField");
        }
    }





    return {
        'validateField': validateField,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
