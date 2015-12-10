use("Builder");
use("Log");
use("TemplateContainer");
use("Util");
use("WebserviceUtil");

var BuildRecordExecutor = function () {
    /**
     * Builds a record from a given template.
     *
     * @param {String} tc      Testcase
     * @param {String} record  The record to use as source.
     *
     * @return {String} A json string with an array of validation errors.
     */
    function buildRecord(tc, record, settings) {
        Log.trace("Enter - BuildRecordExecutor.buildRecord()");

        try {
            Log.debug("Testcase: ", tc.name, " - ", tc.description);
            Log.debug("File: ", tc.file.absolutePath);

            var result;
            var templateProvider = function () {
                ResourceBundleFactory.init(settings);
                TemplateContainer.setSettings(settings);
                return TemplateContainer.getUnoptimized(tc.request.templateName);
            };
            var faustProvider = function () {
                WebserviceUtil.init( settings );
                return WebserviceUtil.getNewFaustNumberFromOpenNumberRoll;
            };
            if (record === undefined || record === null) {
                result = Builder.buildRecord(templateProvider, faustProvider);
            } else {
                var rec = JSON.parse(record);
                result = Builder.convertRecord(templateProvider, rec, faustProvider);
            }
            return JSON.stringify(result);
        } catch (e) {
            Log.trace(e);
            var res;
            if (e.toString().indexOf("java.io.FileNotFoundException") > -1) {
                res = "FAILED_INVALID_SCHEMA";
            } else {
                res = StringUtil.sprintf("Systemfejl ved validering af testcase: %s", e);
            }
            return res;
        } finally {
            Log.trace("Exit - BuildRecordExecutor.buildRecord()");
        }
    }

    return {
        'buildRecord': buildRecord
    }
}();

//-----------------------------------------------------------------------------
function buildRecord(tc, record, faustNumber, settings) {
    return BuildRecordExecutor.buildRecord(tc, record, faustNumber, settings);
}
