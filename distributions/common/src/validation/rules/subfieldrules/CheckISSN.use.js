use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckISSN'];

var CheckISSN = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISSN is used to validate an ISSN number.
     *
     * @syntax CheckISSN.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISSN field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISSN.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckISSN.validateSubfield");
        try {
            var bundle;
            //ValueCheck.checkUndefined( "params", params );
            // http://www.issn.org/understanding-the-issn/assignment-rules/issn-manual/
            // we must iterate the ISSN number string and multiply each number
            // with numbers 8 to 2.
            // 1. the product modulo 11 must be zero
            // 2. subfield value =     03178471
            // 3. subfield trimmed =   0 3 1 7 8 4 7 1
            // 4. weight               8 7 6 5 4 3 2 1
            // 5. before summing =     0 2 6 3 3 1 1 1
            //                           1   5 2 2 4
            // 6. productsum =         0 + 21 + 6 + 35 + 32 + 12 + 14 + 1 = 121
            // 7. productsum % 11 =    121 % 11 = 0 = valid ISSN
            // 8. last digit can be an x/X (ie. 10)
            var result = [];
            var pos = 0;
            var weight = 8;
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
                    if (ch === '-') {
                        continue;
                    }
                    if (ch.toLowerCase() === 'x') {
                        if (ix !== len - 1) {
                            bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                            msg = ResourceBundle.getStringFormat(bundle, "check.issn.length.error", subfieldName);
                            result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                            return result;
                        }
                        value += 10; // 8
                        pos++;
                    } else {
                        bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                        msg = ResourceBundle.getStringFormat(bundle, "check.issn.numbers.error", subfieldName);
                        result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                        return result;
                    }
                }
            }
            if (pos !== 8) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.issn.length.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }
            if (value % 11 !== 0) { // 7
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.issn.invalid.error", subfieldName, subfield['value']);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            }
            return result;
        } finally {
            Log.trace("Exit --- CheckISSN.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
