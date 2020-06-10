use("Log");
use("Marc");
use("RawRepoClient");
use("RecordSorter");

EXPORTED_SYMBOLS = ['RecordUtil'];

/**
 * Utility functions that operates on a Field
 *
 * @namespace
 * @name RecordUtil
 */
var RecordUtil = function () {
    /**
     * Adds or replaces a subfield with a given value.
     * <p/>
     * If the field or subfield does not exist, it is created.
     * <p/>
     * The record is expected to be sorted by field names.
     *
     * @param {Record} record The record to change.
     * @param {String} fieldName The name of the field to add or replace.
     * @param {String} subfieldName The name of the subfield to add or replace.
     * @param {String} value The value of the subfield.
     *
     * @returns {Record} The record with the new/changed subfield.
     *
     * @name RecordUtil#addOrReplaceSubfield
     */
    function addOrReplaceSubfield(record, fieldName, subfieldName, value) {
        Log.trace("Enter - RecordUtil.addOrReplaceSubfield");
        try {
            if (record.existField(new RegExp(fieldName))) {
                record.field(fieldName).append(subfieldName, value, true);
                return record;
            } else {
                var field = new Field(fieldName, "00");
                field.append(subfieldName, value);

                return RecordSorter.insertField(record, field);
            }
        } finally {
            Log.trace("Exit - RecordUtil.addOrReplaceSubfield");
        }
    }

    /**
     * Calculates the current ajustment date that follows the danMARC2
     * format for field 001d.
     *
     * @returns {String} The current ajustment time.
     */
    function currentAjustmentDate() {
        Log.trace("Enter - RecordUtil.currentAjustmentDate");
        try {
            var curDate = new Date();
            var ajustmentDateStr = StringUtil.sprintf("%4s%2s%2s", curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
            return __replaceAll(ajustmentDateStr, " ", "0");
        } finally {
            Log.trace("Exit - RecordUtil.currentAjustmentDate");
        }
    }

    /**
     * Calculates the current ajustment time that follows the danMARC2
     * format for field 001c.
     *
     * @returns {String} The current ajustment time.
     */
    function currentAjustmentTime() {
        Log.trace("Enter - RecordUtil.currentAjustmentTime");
        try {
            var curDate = new Date();
            var ajustmentTimeStr = StringUtil.sprintf("%4s%2s%2s%2s%2s%2s", curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate(), curDate.getHours(), curDate.getMinutes(), curDate.getSeconds());
            return __replaceAll(ajustmentTimeStr, " ", "0");
        } finally {
            Log.trace("Exit - RecordUtil.currentAjustmentTime");
        }
    }

    /**
     * Creates a Record from a String.
     *
     * @param {String} s Marc record in line format.
     *
     * @returns {Record} The new record.
     *
     * @name RecordUtil#createFromString
     */
    function createFromString(s) {
        Log.trace("Enter - RecordUtil.createFromString");
        var start = new Date().getTime();
        try {
            var record = new Record();
            if (s !== "") {
                record.fromString(s);
                Log.trace("record created from <" + s + ">");
            }
            return record;
        } finally {
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.RecordUtil.createFromString]');
            Log.trace("Exit - RecordUtil.createFromString");
        }
    }

    /**
     * Creates a Field from a String.
     *
     * @param {String} s Marc field in line format.
     *
     * @returns {Field} The new field.
     *
     * @name RecordUtil#createFieldFromString
     */
    function createFieldFromString(s) {
        Log.trace("Enter - RecordUtil.createFieldFromString");
        try {
            return createFromString(s).field(0);
        } finally {
            Log.trace("Exit - RecordUtil.createFieldFromString");
        }
    }

    function equalIds(rec1, rec2) {
        Log.trace("Enter - RecordUtil.equalIds");
        try {
            return rec1.getValue(/001/, /a/) === rec2.getValue(/001/, /a/) && rec1.getValue(/001/, /b/) === rec2.getValue(/001/, /b/);
        } finally {
            Log.trace("Exit - RecordUtil.equalIds");
        }
    }

    function isChangedFromVolumeToSingle(oldRecord, newRecord) {
        Log.trace("Enter - RecordUtil.isChangedFromVolumeToSingle()");
        try {
            var result;
            Log.debug("New Record: " + newRecord.toString());
            if (newRecord.matchValue(/004/, /a/, /e/)) {
                if (oldRecord !== undefined) {
                    Log.debug("oldRecord: " + oldRecord.toString());
                    return result = oldRecord.matchValue(/004/, /a/, /b/);
                }
            }
            return result = false;
        } finally {
            Log.trace("Exit - RecordUtil.isChangedFromVolumeToSingle(): " + result);
        }
    }

    function fetchCurrentRecord(record) {
        Log.trace("Enter - RecordUtil.__fetchParentRecord()");
        var result = undefined;
        try {
            Log.debug("Record: " + record);
            var recId = record.getValue(/001/, /a/);
            var libNo = record.getValue(/001/, /b/);
            return result = fetchRecord(recId, libNo);
        } finally {
            Log.trace("Enter - RecordUtil.__fetchParentRecord(): " + result);
        }
    }

    function fetchRecord(recId, libNo) {
        Log.trace("Enter - RecordUtil.__fetchRecord()");
        var result = undefined;
        try {
            if (RawRepoClient.recordExists(recId, libNo)) {
                result = RawRepoClient.fetchRecord(recId, libNo);
            }
            return result;
        } finally {
            Log.trace("Enter - RecordUtil.__fetchRecord(): " + result);
        }
    }

    function __escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function __replaceAll(string, find, replace) {
        return string.replace(new RegExp(__escapeRegExp(find), 'g'), replace);
    }

    return {
        'addOrReplaceSubfield': addOrReplaceSubfield,
        'currentAjustmentDate': currentAjustmentDate,
        'currentAjustmentTime': currentAjustmentTime,
        'createFromString': createFromString,
        'createFieldFromString': createFieldFromString,
        'equalIds': equalIds,
        'isChangedFromVolumeToSingle': isChangedFromVolumeToSingle,
        'fetchCurrentRecord': fetchCurrentRecord,
        'fetchRecord': fetchRecord
    }
}();
