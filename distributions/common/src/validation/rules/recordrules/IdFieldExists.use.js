use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['IdFieldExists'];

var IdFieldExists = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks if a record contains field 001.
     * @syntax IdFieldExists.validateRecord (  record, params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing atleast an array keyed on fields
     * @name IdFieldExists.validateRecord
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("RecordRules.idFieldExists");
        if (record !== undefined && record.fields !== undefined) {
            for (var i = 0; i < record.fields.length; i++) {
                var field = record.fields[i];
                if (field.name === "001") {
                    return [];
                }
            }
        }
        var url = "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869";
        var msg = "Felt 001 er obligatorisk.";
        return [ValidateErrors.recordError(url, msg)];
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();