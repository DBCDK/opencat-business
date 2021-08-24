use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("Marc");
use("DanMarc2Converter");
use("RawRepoClient");

EXPORTED_SYMBOLS = ['CheckFieldNotUsedInParentRecords'];

var CheckFieldNotUsedInParentRecords = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * Checks if parent record contains a specific field.
     * Check is only done on section and volume records in a base defined in the calling record.
     * @param record    The record that should be inspected
     * @param field     Field to check
     * @param params    Unused parameter - couldmaybe be removed
     * @returns {result|empty} Return value type : ValidateErrors.subfieldError
     */
    function validateField(record, field, params) {
        Log.trace("Enter - CheckFieldNotUsedInParentRecords.validateField");

        try {
            var marcRecord = DanMarc2Converter.convertToDanMarc2(record, params);
            var recId = marcRecord.getValue(/001/, /a/);
            var libNo = marcRecord.getValue(/001/, /b/);
            var recordLevel = marcRecord.getValue(/004/, /a/);
            var parentFaust = marcRecord.getValue(/014/, /a/);

            var context = params.context;

            // input record is child record
            // only look at record levels head and section
            if (!(recordLevel === "b" || recordLevel === "s")) return [];

            // check if parentFaust not empty
            if (0 !== parentFaust) {

                // get parent record from parentFaust
                var parentRecord = RawRepoClient.fetchRecord(parentFaust, libNo);

                // check if input field exists in parent record
                if (parentRecord.existField(new MatchField(new RegExp(field.name)))) {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    var message = ResourceBundle.getStringFormat(bundle, "field.in.parent.record.error", field.name);

                    Log.trace("Found error in record [", recId, ":", libNo, "]: ", message);
                    return [ValidateErrors.fieldError("TODO:fixurl", message)];
                }

                // go further up in record level if parent record is a section record
                var loopLevel = parentRecord.getValue(/004/, /a/);

                if (loopLevel === "s") {
                    // run validation rule on section record
                    var result = CheckFieldNotUsedInParentRecords.validateField(DanMarc2Converter.convertFromDanMarc2(parentRecord), field, params);
                    if (result.length !== 0) {
                        Log.trace("Validation errors found in section records: ", uneval(result));
                        return result;
                    }
                }
            }
            return [];
        } finally {
            Log.trace("Exit - CheckFieldNotUsedInParentRecords.validateField");
        }
    }

    return {
        'validateField': validateField,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
