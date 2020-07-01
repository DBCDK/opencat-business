use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckISBN10'];

var CheckISBN10 = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISBN10 is used to validate an ISBN 10 number.
     *
     * @syntax CheckISBN10.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISBN10.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckISBN10.validateSubfield");
        try {
            var bundle;
            //ValueCheck.checkUndefined( "params", params );
            // https://www.isbn-international.org/
            // we must iterate the ISBN10 number string and multiply each number
            // with numbers 10 to 1.
            // 1. the product modulo 11 must be zero
            // 2. subfield value =     0-201-53082-1
            // 3. subfield trimmed =   0  2 0 1 5 3 0 8 2 1
            // 4. weight               10 9 8 7 6 5 4 3 2 1
            // 5. before summing =     0  1 0 7 3 1 0 2 4 1
            //                            8     0 5   4
            // 6. productsum =         0 + 18 + 0 + 7 + 30 + 15 + 0 + 24 + 4 + 1 = 99
            // 7. productsum % 11 =    99 % 11 = 0 = valid ISBN10
            // 8. last digit can be an x (ie. 10)
            var result = [];
            var pos = 0;
            var weight = 10;
            var value = 0;
            var subfieldName = subfield['name'];
            var subfieldValue = subfield['value'];
            var len = subfieldValue.length;
            var msg;
            for (var ix = 0; ix < len; ix++) {
                var ch = subfieldValue.charAt(ix);
                if (ch >= '0' && ch <= '9') {
                    value += parseInt(ch) * weight; // 4, 5, 6
                    weight--;
                    pos++;
                } else {
                    if (ch === '-' || ch === ' ') {
                        continue;
                    }
                    if (ch.toLowerCase() === 'x') {
                        if (ix !== len - 1) {
                            bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                            msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.length.error", subfieldName);
                            result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                            return result;
                        }
                        value += 10; // 8
                        pos++;
                    } else {
                        bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                        msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.numbers.error", subfieldName);
                        result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                        return result;
                    }
                }
            }
            if (pos !== 10) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.length.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }
            if (value % 11 !== 0) { // 7
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.invalid.error", subfieldName, subfield['value']);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            }
            return result;
        } finally {
            Log.trace("Exit --- CheckISBN10.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
