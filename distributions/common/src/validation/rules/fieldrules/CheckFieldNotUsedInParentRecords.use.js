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

            var context = params.context;

            //get parent record
            var parent;

            if (recordLevel === "h" ){
                parent = ContextUtil.getValue(context, 'getRelationsChildren', recId, libNo);
                if (parent === undefined) {
                    parent = RawRepoClient.getRelationsChildren(recId, libNo);
                    ContextUtil.setValue(context, parent, 'getRelationsChildren', recId, libNo);
                }

            }

            if (parent.length === 0) {
                Log.trace("Returns []: No parent record found.");
                return [];
            }

            // There can be no interesting records below single and volume records
            // Though, technically we only look at levels head and section
            if (!(recordLevel === "h" || recordLevel === "s")) return [];

            var children;

            // get child records
            children = ContextUtil.getValue(context, 'getRelationsChildren', recId, libNo);
            if (children === undefined) {
                children = RawRepoClient.getRelationsChildren(recId, libNo);
                ContextUtil.setValue(context, children, 'getRelationsChildren', recId, libNo);
            }

            if (children.length === 0) {
                Log.trace("Returns []: No children found.");
                return [];
            }
            for (var i = 0; i < children.length; i++) {
                var rec = children[i];
                var loopAgency = rec.getValue(/001/, /b/);
                // Skip record if it is from another base
                if (loopAgency !== libNo) continue;
            //    if (rec.existField(new MatchField(new RegExp(field.name), undefined, new RegExp(field.name)))) {
                  if (rec.existField(new MatchField(new RegExp(field.name)))) {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    var message = ResourceBundle.getStringFormat(bundle, "field.in.children.record.error", field.name);

                    Log.trace("Found error in record [", recId, ":", libNo, "]: ", message);
                    return [ValidateErrors.fieldError("TODO:fixurl", message)];
                }
                // Only dive deeper if it's a section record
                var loopLevel = rec.getValue(/004/, /a/);
                if (loopLevel === "s") {
                    var result = CheckFieldNotUsedInParentRecords.validateField( DanMarc2Converter.convertFromDanMarc2( rec ), field, params );
                    if ( result.length !== 0 ) {
                        Log.trace( "Validation errors found in children records: ", uneval( result ) );
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
