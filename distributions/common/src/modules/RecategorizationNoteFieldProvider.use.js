use("Marc");
use("MarcClasses");
use("RawRepoClient");
use("RecordLookupField");
use("Log");

EXPORTED_SYMBOLS = ['RecategorizationNoteFieldProvider'];

/**
 * This module has the responsability to extract fields from a record.
 *
 * This feature is used by {{RecategorizationNoteFieldFactory}} to format the
 * information from different fields.
 *
 * @type {{newNoteField}}
 */
var RecategorizationNoteFieldProvider = function () {
    function loadFieldRecursiveReplaceValue(bundle, record, fieldname, subfieldmatcher) {
        Log.trace("Enter - RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue()");
        var result = undefined;
        try {
            Log.debug("Provide field: ", fieldname);

            var field = record.getFirstFieldAsField(RegExp(fieldname));
            Log.debug("Found field: ", field);

            if (field !== "") {
                result = new Field(fieldname, "00");
                for (var i = 0; i < field.count(); i++) {
                    var subfield = field.subfield(i);

                    if (subfieldmatcher.test(subfield.name)) {
                        result.append(subfield.name, __loadBundleValue(bundle, field, subfield));
                    }
                }
            } else {
                var parentId = record.getValue(/014/, /a/);
                var agencyId = record.getValue(/001/, /b/);

                Log.debug("Trying to lookup parentid in record:\n", record.toString());
                Log.debug("Found parent id: ", parentId);
                Log.debug("Found agency id: ", agencyId);

                if (parentId !== "" && agencyId !== "") {
                    if (RawRepoClient.recordExists(parentId, agencyId)) {
                        var parentRecord = RawRepoClient.fetchRecord(parentId, agencyId);
                        return result = loadFieldRecursiveReplaceValue(bundle, parentRecord, fieldname, subfieldmatcher);
                    }
                }
                return result = undefined;
            }

            if (result.count() === 0) {
                result = undefined;
            }
            return result;
        } finally {
            if (result !== undefined) {
                // TODO , not sure what this adds , but stays for now i guess
                Log.trace("Exit - RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(): ", result);
            } else {
                Log.trace("Exit - RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(): undefined result!");
            }
        }
    }

    function loadMergeFieldRecursive(record, fieldname, subfieldmatcher) {
        Log.trace("Enter - RecategorizationNoteFieldProvider.loadMergeFieldRecursive( '", record, "', '", fieldname, "' )");
        var result = undefined;
        try {
            result = new Field(fieldname, "00");
            var parentId = record.getValue(/014/, /a/);
            var agencyId = record.getValue(/001/, /b/);

            if (parentId !== "" && RawRepoClient.recordExists(parentId, agencyId)) {
                var field = loadMergeFieldRecursive(RawRepoClient.fetchRecord(parentId, agencyId), fieldname, subfieldmatcher);

                if (field !== undefined) {
                    field.eachSubField(/./, function (field, subfield) {
                        result.append(subfield);
                    })
                }
            }

            record.eachField(RegExp(fieldname), function (field) {
                field.eachSubField(subfieldmatcher, function (field, subfield) {
                    result.append(subfield);
                })
            });

            if (result.count() === 0) {
                return result = undefined;
            }
            return result;
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldProvider.loadMergeFieldRecursive(): ", result);
        }
    }

    function __loadBundleValue(bundle, field, subfield) {
        var key = StringUtil.sprintf("code.%s%s.%s", field.name, subfield.name, subfield.value);
        if (ResourceBundle.containsKey(bundle, key)) {
            return ResourceBundle.getString(bundle, key);
        } else {
            return subfield.value;
        }
    }

    return {
        'loadFieldRecursiveReplaceValue': loadFieldRecursiveReplaceValue,
        'loadMergeFieldRecursive': loadMergeFieldRecursive
    }
}();
