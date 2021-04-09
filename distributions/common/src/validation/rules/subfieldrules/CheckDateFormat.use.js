use("Log");

EXPORTED_SYMBOLS = ['CheckDateFormat'];

var CheckDateFormat = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * This function validates a date string against the defined date format.
     * Two sets of validation is performed:
     * First to see if the length of the input is valid (either 8 or 14)
     * If length is valid, then validate the format
     * Accepted formats are:
     * yyyyMMdd and yyyyMMddHHmmss
     *
     * Working with Javascript Date is a pain in the butt, so we use the Java SimpleDateFormatter instead
     *
     * @param record
     * @param field
     * @param subfield
     * @param params
     * @returns {*}
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckDateFormat.validateSubfield");

        var result = [];
        var msg;
        var bundle;

        try {
            var validLengths = [8];

            if (params.allowLong) {
                validLengths.push(14);
            }

            var value = subfield.value;
            if (validLengths.indexOf(value.length) === -1) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME)
                msg = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.length", subfield.value, validLengths.join(", "));
                return [ValidateErrors.subfieldError('TODO:fixurl', msg)];
            }

            var SimpleDateFormat = Java.type('java.text.SimpleDateFormat');
            var TimeZone = Java.type('java.util.TimeZone');
            var formatter;

            if (value.length === 8) {
                formatter = new SimpleDateFormat('yyyyMMdd');
            } else {
                formatter = new SimpleDateFormat('yyyyMMddHHmmss');
            }

            formatter.setTimeZone(TimeZone.getTimeZone("UTC")); // Ignore timezone when checking format
            formatter.setLenient(false); // Use strict formatting

            try {
                formatter.parse(value);
            } catch (error) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME)
                msg = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", subfield.value);
                return [ValidateErrors.subfieldError('TODO:fixurl', msg)];
            }

            return result;
        } finally {
            Log.trace("Exit --- CheckDateFormat.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }

}();