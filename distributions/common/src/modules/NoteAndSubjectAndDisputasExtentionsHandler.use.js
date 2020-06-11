use("Log");
use("Marc");
use("OpenAgencyClient");
use("RawRepoClient");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['NoteAndSubjectAndDisputasExtentionsHandler'];

/**
 * Module to handle the authentication of changing notes or subjects by a FBS
 * library.
 *
 * @namespace
 * @name NoteAndSubjectAndDisputasExtentionsHandler
 */
var NoteAndSubjectAndDisputasExtentionsHandler = function () {
    var BUNDLE_NAME = "default-auth";
    /**
     * Authenticates extentions in a record.
     *
     * @param record Record
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @name NoteAndSubjectAndDisputasExtentionsHandler#authenticateExtentions
     */
    function authenticateExtentions(record, groupId) {
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions( %s, %s )", uneval(record), uneval(groupId)));
        var result = null;
        try {
            var recId = record.getValue(/001/, /a/);
            var bundle;
            if (!RawRepoClient.recordExists(recId, UpdateConstants.COMMON_AGENCYID)) {
                return result = [];
            }
            var curRecord = RawRepoClient.fetchRecord(recId, UpdateConstants.COMMON_AGENCYID);
            if (!isNationalCommonRecord(curRecord)) {
                return result = [];
            }
            curRecord.field("001").subfield("b").value = record.getValue(/001/, /b/);

            var authResult = [];
            var extentableFieldsRx = __createExtentableFieldsRx(groupId);
            record.eachField(/./, function (field) {
                if (!( extentableFieldsRx !== undefined && extentableFieldsRx.test(field.name) )) {
                    if (__isFieldChangedInOtherRecord(field, curRecord)) {
                        bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        var message = ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", groupId, field.name, recId);
                        authResult.push(ValidateErrors.recordError("", message));
                    }
                }
            });
            curRecord.eachField(/./, function (field) {
                if (!( extentableFieldsRx !== undefined && extentableFieldsRx.test(field.name) )) {
                    if (__isFieldChangedInOtherRecord(field, record)) {
                        if (curRecord.count(field.name) !== record.count(field.name)) {
                            bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                            var message = ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", groupId, field.name, recId);
                            authResult.push(ValidateErrors.recordError("", message));
                        }
                    }
                }
            });
            return result = authResult;
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(): ", result);
        }
    }

    /**
     * Checks if a field specifies that a record is a national common record.
     *
     * @param {Field} Field.
     *
     * @returns {Boolean} True / False. Return false if a field is indicating it is a NCR field, and true if the field demonstrates it's not a NCR.
     *
     * @private
     * @name NoteAndSubjectAndDisputasExtentionsHandler#__isFieldNationalCommonRecord
     */
    function __isFieldNationalCommonRecord(field) {
        //TODO remove this, should be handled by API methods on record
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldNationalCommonRecord( %s )", field));
        var result = null;
        try {
            var fieldName = field.name.toString() + '';
            if (fieldName !== "032") {
                result = StringUtil.sprintf("x1: '%s': false", fieldName);
                return false;
            }
            if (!field.exists(/a/)) {
                result = "x2: false";
                return false;
            }
            result = "x3: " + !field.matchValue(/x/, /BKM*|NET*|SF*/);
            return !field.matchValue(/x/, /BKM*|NET*|SF*/);
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldNationalCommonRecord(): ", result);
        }
    }

    /**
     * Checks if this record is a national common record.
     *
     * @param record Record.
     *
     * @returns {Boolean} True / False.
     *
     * @name NoteAndSubjectAndDisputasExtentionsHandler#isNationalCommonRecord
     */
    function isNationalCommonRecord(record) {
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord( %s )", record));
        var result = null;
        try {
            if (!record.matchValue(/996/, /a/, /DBC/)) {
                return result = false;
            }
            for (var i = 0; i < record.size(); i++) {
                if (__isFieldNationalCommonRecord(record.field(i))) {
                    return result = true;
                }
            }
            return result = false;
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(): ", result);
        }
    }

    function __createExtentableFieldsRx(agencyId) {
        Log.trace("Enter - NoteAndSubjectAndDisputasExtentionsHandler.__createExtentableFieldsRx()");
        var result = undefined;
        try {
            var extentableFields = "";

            if (OpenAgencyClient.hasFeature(agencyId, UpdateConstants.AUTH_COMMON_NOTES)) {
                extentableFields += UpdateConstants.EXTENTABLE_NOTE_FIELDS;
            }
            if (OpenAgencyClient.hasFeature(agencyId, UpdateConstants.AUTH_COMMON_SUBJECTS)) {
                if (extentableFields !== "") {
                    extentableFields += "|";
                }
                extentableFields += UpdateConstants.EXTENTABLE_SUBJECT_FIELDS;
            }
            if (extentableFields !== "") {
                return result = RegExp(extentableFields);
            }
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.__createExtentableFieldsRx(): " + result);
        }
    }

    /**
     * Checks if a field is changed compared to another record.
     *
     * @param {Field} Field.
     * @param {Record} record.
     *
     * @returns {Boolean} True / False.
     *
     * @private
     * @name NoteAndSubjectAndDisputasExtentionsHandler#__isFieldChangedInOtherRecord
     */
    function __isFieldChangedInOtherRecord(field, record) {
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldChangedInOtherRecord( %s, %s )", field, record));
        var result = null;
        try {
            var compareRecord = record;
            if (field.name === "001") {
                compareRecord = record.clone();
                if (field.exists(/c/)) {
                    RecordUtil.addOrReplaceSubfield(compareRecord, "001", "c", field.getValue(/c/));
                }
                if (field.exists(/d/)) {
                    RecordUtil.addOrReplaceSubfield(compareRecord, "001", "d", field.getValue(/d/));
                }
            }
            for (var i = 0; i < compareRecord.size(); i++) {
                if (__isFieldsEqual(field, compareRecord.field(i))) {
                    return result = false;
                }
            }
            return result = true;
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldChangedInOtherRecord(): ", result);
        }
    }

    /**
     * Checks if 2 fields contains the same information.
     *
     * @param {Field} srcField
     * @param {Field} destField
     *
     * @returns {Boolean} True / False.
     *
     * @private
     * @name NoteAndSubjectAndDisputasExtentionsHandler#__isFieldsEqual
     */
    function __isFieldsEqual(srcField, destField) {
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldsEqual( %s, %s )", srcField, destField));
        var result = null;
        try {
            if (srcField.name !== destField.name) {
                return result = false;
            }
            if (srcField.indicator !== destField.indicator) {
                return result = false;
            }
            if (srcField.size() !== destField.size()) {
                return result = false;
            }
            var srcSubfields = [];
            var destSubfields = [];
            for (var i = 0; i < srcField.size(); i++) {
                srcSubfields.push(srcField.subfield(i));
                destSubfields.push(destField.subfield(i));
            }
            srcSubfields.sort(__sortSubfield);
            destSubfields.sort(__sortSubfield);
            for (i = 0; i < srcSubfields.length; i++) {
                if (srcSubfields[i].name !== destSubfields[i].name) {
                    return result = false;
                }
                if (srcSubfields[i].value !== destSubfields[i].value) {
                    return result = false;
                }
            }
            return true;
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.__isFieldsEqual(): ", result);
        }
    }

    /**
     * Compares two subfields are order by name and value.
     *
     * @param {Subfield} a
     * @param {Subfield} b
     *
     * @returns {Integer} Compare integer.
     *
     * @private
     * @name NoteAndSubjectAndDisputasExtentionsHandler#__sortSubfield
     */
    function __sortSubfield(a, b) {
        Log.trace(StringUtil.sprintf("Enter - NoteAndSubjectAndDisputasExtentionsHandler.__sortSubfield( %s, %s )", a, b));
        var result = null;
        try {
            if (a.name < b.name) {
                return result = -1;
            } else if (a.name > b.name) {
                return result = 1;
            } else {
                if (a.value < b.value) {
                    return result = -1;
                } else if (a.value > b.value) {
                    return result = 1;
                }
            }
            return result = 0;
        } finally {
            Log.trace("Exit - NoteAndSubjectAndDisputasExtentionsHandler.__sortSubfield(): ", result);
        }
    }

    return {
        'authenticateExtentions': authenticateExtentions,
        'isNationalCommonRecord': isNationalCommonRecord,
        '__BUNDLE_NAME': BUNDLE_NAME
    }
}();
