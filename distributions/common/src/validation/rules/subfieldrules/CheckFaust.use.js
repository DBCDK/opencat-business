use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckFaust'];

var CheckFaust = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkFaust is used to validate a faust number.
     *
     * @syntax CheckFaust.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name CheckFaust.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckFaust.validateSubfield");
        try {
            var bundle;
            var FAUST_MIN_LENGTH = 8;
            var result = [];
            var subfieldValue = subfield['value'].replace(/\s/g, "");
            var subfieldName = subfield['name'];
            var msg;
            if (!ValidationUtil.isNumber(subfieldValue)) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.faust.digit.error", subfieldName);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }
            if (subfieldValue.length < FAUST_MIN_LENGTH) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.faust.length.error", subfieldName, FAUST_MIN_LENGTH);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }
            if (subfieldValue.length !== 8) {
                var marc = DanMarc2Converter.convertToDanMarc2(record, params);
                if (marc.matchValue(/001/, /b/, RegExp(UpdateConstants.COMMON_AGENCYID))) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    msg = ResourceBundle.getStringFormat(bundle, "check.faust.common.records.length.error", subfieldName);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                    return result;
                }
            }
            var singleWeight = [7, 6, 5, 4, 3, 2];
            var weight = [];
            while (subfieldValue.length > weight.length) {
                weight = singleWeight.concat(weight);
            }
            // we must iterate the faust number string, except for the last
            // one (which is a checksum value)
            // 1.  subfield[value] =    5 0 9 8 4 5 0 8
            // 2.  checksumValue =                    8
            // 3.  length -1 =          7
            // 4.  index                0 1 2 3 4 5 6
            //
            // 5.  weight     7 6 5 4 3 2 7 6 5 4 3  2
            // 6.  index      0 1 2 3 4 5 6 7 8 9 10 11
            // 7.  weight.length(12) - value.length(8-1) = 5
            // 8.  splice               5, 12
            // 9.  after splice         2 7 6 5 4 3 2
            // 10. subfield[value] =    5 0 9 8 4 5 0
            // 11. before summing       1 0 5 4 1 1 0
            //                          0   4 0 6 5 0
            // 12. productsum           10 + 0 + 54 + 40 + 16 + 15 + 0 = 135
            // 13. productsum % 11      135 % 11 = 3
            // 14. verification         8 + 3 = 11
            var value = 0;
            var lengthMinusOne = subfieldValue.length - 1; // 7
            weight = weight.splice(weight.length - lengthMinusOne, weight.length); // 8, 9
            for (var i = 0; i < lengthMinusOne; ++i) {
                value += parseInt(subfieldValue.charAt(i), 10) * weight[i]; // 11, 12
            }
            value = value % 11; // 13
            var checksumValue = parseInt(subfieldValue.charAt(subfieldValue.length - 1));
            if (value + checksumValue !== 11 && value !== 0) { // 14
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "check.faust.error", subfieldName, subfieldValue);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
            }
            return result;
        } finally {
            Log.trace("Exit --- CheckFaust.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
