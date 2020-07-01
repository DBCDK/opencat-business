use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckLix'];

var CheckLix = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkLix is used to validate the value of  042a.
     *
     * @syntax CheckLix.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckLix.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckLix.validateSubfield");
        try {
            var result = [];
            var subfieldValue042a = subfield['value'];
            var msg;

            if (!subfieldValue042a.match(/^[0-9]*$/)) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "checkLix.validation.error");
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }

            return result;
        } finally {
            Log.trace("Exit --- CheckLix.validateSubfield042a");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
