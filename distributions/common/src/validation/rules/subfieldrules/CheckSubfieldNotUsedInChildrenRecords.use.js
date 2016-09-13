use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("RawRepoClientCore");
use("Marc");
use("DanMarc2Converter");
use("RawRepoClient");

EXPORTED_SYMBOLS = ['CheckSubfieldNotUsedInChildrenRecords'];

var CheckSubfieldNotUsedInChildrenRecords = function () {
    var __BUNDLE_NAME = "validation";

    function validateSubfield(record, field, subfield, params, settings) {
        Log.trace("Enter - CheckSubfieldNotUsedInChildrenRecords.validateSubfield");

        try {
            var marcRecord = DanMarc2Converter.convertToDanMarc2(record);
            var recId = marcRecord.getValue(/001/, /a/);
            var libNo = marcRecord.getValue(/001/, /b/);
            var children = RawRepoClient.getRelationsChildren(recId, libNo);
            Log.trace("Children: ", uneval(children));
            if (children.length === 0) {
                Log.trace("Returns []: No children found.");
                return [];
            }
            for (var i = 0; i < children.length; i++) {
                var rec = children[i];
                if (rec.existField(new MatchField(RegExp(field.name), undefined, RegExp(subfield.name)))) {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    var message = ResourceBundle.getStringFormat(bundle, "subfield.in.children.record.error", field.name, subfield.name);

                    Log.trace("Found error in record [", recId, ":", libNo, "]: ", message);
                    return [ValidateErrors.subfieldError("TODO:fixurl", message, RecordUtil.getRecordPid(record))];
                }
                var result = CheckSubfieldNotUsedInChildrenRecords.validateSubfield(DanMarc2Converter.convertFromDanMarc2(rec), field, subfield, params, settings);
                if (result.length !== 0) {
                    Log.trace("Validation errors found in children records: ", uneval(result));
                    return result;
                }
            }
            return [];
        } finally {
            Log.trace("Exit - CheckSubfieldNotUsedInChildrenRecords.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
