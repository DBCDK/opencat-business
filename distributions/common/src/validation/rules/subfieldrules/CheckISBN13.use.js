use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");
use("CheckEAN13");

EXPORTED_SYMBOLS = ['CheckISBN13'];

var CheckISBN13 = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISBN13 is used to validate an ISBN 13 number.
     *
     * @syntax CheckISBN13.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN13 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISBN13.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckISBN13.validateSubfield");
        try {
            return CheckEAN13.makeCheck(subfield, 'B');
        } finally {
            Log.trace("Exit --- CheckISBN13.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
