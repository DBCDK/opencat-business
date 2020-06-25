use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckEAN13'];

var CheckEAN13 = function () {
    var __BUNDLE_NAME = "validation";

    function makeCheck(subfield, ISBNorISMN) {
        var result = [];
        var bundle;
        var subfieldValue = subfield['value'];
        var subfieldName = subfield['name'];
        var msg;
        if (!ValidationUtil.isNumber(subfieldValue)) {
            bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            if (ISBNorISMN === 'B') {
                msg = ResourceBundle.getStringFormat(bundle, "check.isbn13.numbers.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            } else {
                msg = ResourceBundle.getStringFormat(bundle, "check.ismn.numbers.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            }
        } else if (subfieldValue.length !== 13) {
            bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            if (ISBNorISMN === 'B') {
                msg = ResourceBundle.getStringFormat(bundle, "check.isbn13.length.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            } else {
                msg = ResourceBundle.getStringFormat(bundle, "check.ismn.length.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            }
        } else {
            var productSum = 0;
            var singleWeight = [1, 3];
            var weight = [];
            while (subfieldValue.length > weight.length) {
                weight = singleWeight.concat(weight);
            }
            for (var i = 0; i < (subfieldValue.length - 1); ++i) {
                // https://www.isbn-international.org/
                // Algorithm: http://en.wikipedia.org/wiki/International_Standard_Book_Number#Check_digits
                // We must iterate over all number and multiply them with n
                // where n alternates between 1 and 3.
                // Next all numbers must be added and that number modulo 10
                // must equal the last digit.
                // example:
                // 1. ISBN13 =             9-788793-038189
                // 2. checksum =           9
                // 3. clean & trimmed =    9 7 8 8 7 9 3 0 3 8 1 8 9
                // 4. multiply with        1 3 1 3 1 3 1 3 1 3 1 3
                // 5. result =             9+21+8+24+7+27+3+0+3+24+1+24 = 151
                // 6. product sum % 10 =   151 % 10 = 1
                // 7. validation           10 - 9 = 1 (checksum)
                productSum += parseInt(subfieldValue.charAt(i)) * weight[i]; //4
            }
            var checksum = parseInt(subfieldValue.charAt(subfieldValue.length - 1)); // 2
            var x13 = (10 - productSum % 10) % 10;
            if (checksum !== x13) { // 7
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                if (ISBNorISMN === 'B') {
                    msg = ResourceBundle.getStringFormat(bundle, "check.isbn13.invalid.error", subfieldName, subfieldValue);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                } else {
                    msg = ResourceBundle.getStringFormat(bundle, "check.ismn.invalid.error", subfieldName, subfieldValue);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                }
            }
        }
        return result;
    }

    return {
        'makeCheck': makeCheck,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();