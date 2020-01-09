use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckISBN10'];

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
    function validateSubfield035(record, field, subfield, params) {
        Log.trace("Enter --- Check035.validateSubfield");
        try {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);


            var result = [];
            var pos = 0;
            var weight = 10;
            var value = 0;
            var subfieldName035 = subfield['name'];
            var subfieldValue035 = subfield['value'];
            var len = subfieldValue.length;
            var msg;

            var firstParenthesesFrom035 = subfieldValue035.replace(/^\((.+?)\).*$/, "$1" );
            var isValidFirstParentheses = false;
            isValidFirstParentheses = !firstParenthesesFrom035.match(/\(/);


        //    var secondParenthesesFrom035 = subfieldValue035.lastIndexOf(")");
            var secondParenthesesFrom035 = subfieldValue035.replace(/^(\(.*\)).*$/,"$2");
            var isValidSecondParentheses = false;

            isValidSecondParentheses = !secondParenthesesFrom035.match(/\(/);

            if (isValidFirstParentheses = false;) {
                msg = ResourceBundle.getStringFormat(bundle, "035error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }
            else {
                if (isValidSecondParentheses = false;) {
                    msg = ResourceBundle.getStringFormat(bundle, "035.error", subfieldName);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                    return result;
                }
            }



            /*

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
                        if (ix != len - 1) {
                            msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.length.error", subfieldName);
                            result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                            return result;
                        }
                        value += 10; // 8
                        pos++;
                    } else {
                        msg = ResourceBundle.getStringFormat(bundle, "check.isbn10.numbers.error", subfieldName);
                        result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                        return result;
                    }
                }
            }
            */

            return result;
        } finally {
            Log.trace("Exit --- Check035.validateSubfield035");
        }
    }

    return {
        'validateSubfield035': validateSubfield035,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
