use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['UpperCaseCheck'];

var UpperCaseCheck = function () {
    var BUNDLE_NAME = "validation";

    /**
     * upperCaseCheck is used to check whether a subfield order is correct
     * meaning, a subfield uppercase name must be preceded by a subfield with the same lowercase name
     * @syntax UpperCaseCheck.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used
     * @return {object}
     * @name UpperCaseCheck.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter - UpperCaseCheck.validateField( ", record, ", ", field, ", ", params, ", ", " )");

        var result = [];
        try {
            for (var i = 0; i < field.subfields.length; i++) {
                var name = field.subfields[i].name;
                if ((name >= 'A' && name <= 'Z') || name === 'Æ' || name === 'Ø') {
                    if (field.subfields[i + 1] === undefined || name.toLowerCase() !== field.subfields[i + 1].name) {
                        var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        var errorMessage = ResourceBundle.getStringFormat(bundle, "uppercase.rule.error", name, name.toLowerCase(), field.name);
                        result.push(ValidateErrors.fieldError('TODO:fixurl', errorMessage));
                    }
                }
            }
            return result;
        } finally {
            Log.trace("Exit - UpperCaseCheck.validateField(): ", result);
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
