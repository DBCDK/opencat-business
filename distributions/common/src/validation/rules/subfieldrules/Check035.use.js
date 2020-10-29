use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['Check035'];

var Check035 = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * check035 is used to validate the value of  035a.
     *
     * @syntax Check035.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name Check035.validateSubfield
     * @method
     */

    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- Check035.validateSubfield");
        try {
            var bundle
            var result = [];
            var subfieldValue035 = subfield['value'];
            var msg;

            if (!subfieldValue035.match(/^\([^\(\)]+\).*/)) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check035.validation.error");
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }

            return result;
        } finally {
            Log.trace("Exit --- Check035.validateSubfield035");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
