/**
 * Created by mib on 1/7/16.
 */
use("CheckEAN13");
use("Log");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckISMN'];

var CheckISMN = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISMN is used to validate an ISMN number.
     *
     * @syntax CheckISMN.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISMN field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISMN.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckISMN.validateSubfield");
        try {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var result = [];
            var subfieldValue = subfield['value'];
            var subfieldName = subfield['name'];
            var msg;
            if (subfieldValue.charAt(0) === 'M') {
                // Old style ISMN nummer på formen M-<cifre>-<cifre>-<ciffer>
                // der skal være - i pos 2 og 12
                // der skal være en - imellem 3 og 11 (exclusive)
                // alt andet skal være cifre
                var ix;
                var hyphens = 0;
                var len = subfieldValue.length;
                for (ix = 1; ix < len; ix++) {
                    var ch = subfieldValue.charAt(ix);
                    if (!( ch >= '0' && ch <= '9' )) {
                        if (ch === '-') {
                            if (ix === 1 || ix === 11) {
                                hyphens++;
                                continue;
                            }
                            if (ix > 2 && ix < 10) {
                                hyphens++;
                                continue;
                            }
                            msg = ResourceBundle.getStringFormat(bundle, "check.ismn.hyphenpos.error", subfieldName);
                            result.push(ValidateErrors.subfieldError("TODO:fixurl", msg, RecordUtil.getRecordPid(record)));
                            return result;
                        } else {
                            msg = ResourceBundle.getStringFormat(bundle, "check.ismn.numbers.error", subfieldName);
                            result.push(ValidateErrors.subfieldError("TODO:fixurl", msg, RecordUtil.getRecordPid(record)));
                            return result;
                        }
                    }

                }
                if (hyphens !== 3) {
                    msg = ResourceBundle.getStringFormat(bundle, "check.ismn.hyphens.error", subfieldName);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg, RecordUtil.getRecordPid(record)));
                }
                if (ix !== 13) {
                    msg = ResourceBundle.getStringFormat(bundle, "check.ismn.length.error", subfieldName);
                    result.push(ValidateErrors.subfieldError("TODO:fixurl", msg, RecordUtil.getRecordPid(record)));
                }
            } else {
                // Moderne ISMN nummer - behandles som et ISBN13
                result = CheckEAN13.makeCheck(subfield, bundle, 'M', record);
            }
            return result;
        } finally {
            Log.trace("Exit --- CheckISMN.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();