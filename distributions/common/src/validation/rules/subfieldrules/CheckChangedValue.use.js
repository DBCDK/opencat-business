use("DanMarc2Converter");
use("Log");
use("RawRepoClient");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("UpdateConstants");

EXPORTED_SYMBOLS = ['CheckChangedValue'];

var CheckChangedValue = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkChangedValue is used to validate that a value only changes by certain criteria.
     *
     * @syntax CheckChangedValue.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the subfield to validate
     * @param {object} params Object with two lists of values {fromValues:[e,b] , toValues[e,b]}
     * @return {object}
     * @name CheckChangedValue.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter - CheckChangedValue.validateSubfield");
        ValueCheck.checkThat("params", params).type("object");
        ValueCheck.checkThat("params['fromValues']", params['fromValues']).instanceOf(Array);
        ValueCheck.checkThat("params['toValues']", params['toValues']).instanceOf(Array);
        try {
            var marcRecord = DanMarc2Converter.convertToDanMarc2(record, params);
            var recId = marcRecord.getValue(/001/, /a/);
            var libNo = marcRecord.getValue(/001/, /b/);
            var bundle;
            var msg;

            if (!ValidationUtil.isNumber(libNo)) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME)
                msg = ResourceBundle.getString(bundle, "agencyid.not.a.number");
                return [ValidateErrors.subfieldError("TODO:fixurl", msg)];
            }
            if (!RawRepoClient.recordExists(recId, libNo)) {
                Log.debug("Record is new!");
                return [];
            }
            var oldRecord = RawRepoClient.fetchRecord(recId, libNo);

            Log.debug("Record is being updated!");
            Log.debug("Old record:\n" + oldRecord);
            var oldValue = oldRecord.getValue(new RegExp(field.name), new RegExp(subfield.name));
            Log.debug(field.name + subfield.name + ": " + oldValue + " -> " + subfield.value);
            if (params.fromValues.indexOf(oldValue) === -1 || params.toValues.indexOf(subfield.value) === -1) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME)
                msg = ResourceBundle.getStringFormat(bundle, "check.changed.value.error", field.name, subfield.name, oldValue, subfield.value);
                Log.debug("Found validation error: " + msg);
                return [ValidateErrors.subfieldError("TODO:fixurl", msg)];

            }
            return [];
        } finally {
            Log.trace("Exit - CheckChangedValue.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
