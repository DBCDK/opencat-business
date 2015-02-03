//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RawRepoClient" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'NoteAndSubjectExtentionsHandler' ];

//-----------------------------------------------------------------------------
/**
 * Module to handle the authentication of changing notes or subjects by a FBS
 * library.
 *
 * @namespace
 * @name NoteAndSubjectExtentionsHandler
 */
var NoteAndSubjectExtentionsHandler = function() {
    var extentableFields = /504|530|531|600|610|631|666|770|780|795/;

    /**
     * Authenticates extentions in a record.
     *
     * @param record Record
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @name NoteAndSubjectExtentionsHandler#authenticateExtentions
     */
    function authenticateExtentions( record, groupId ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.authenticateExtentions" );

        try {
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue(/001/, /b/);
            if (!RawRepoClient.recordExists(recId, agencyId)) {
                return [];
            }

            var curRecord = RawRepoClient.fetchRecord(recId, agencyId);
            if (!isNationalCommonRecord(curRecord)) {
                return [];
            }

            var authResult = [];
            record.eachField(/./, function (field) {
                if (!extentableFields.test(field.name)) {
                    if (__isFieldChangedInOtherRecord(field, curRecord)) {
                        authResult.push(ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at rette/tilføje feltet '%s' i posten '%s'", groupId, field.name, recId)));
                    }
                }
            });

            curRecord.eachField(/./, function (field) {
                if (!extentableFields.test(field.name)) {
                    if (__isFieldChangedInOtherRecord(field, record)) {
                        if( curRecord.count( field.name ) !== record.count( field.name ) ) {
                            authResult.push(ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at slette feltet '%s' i posten '%s'", groupId, field.name, recId)));
                        }
                    }
                }
            });

            return authResult;
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.authenticateExtentions" );
        }
    }

    /**
     * Changes the content of a record for update.
     *
     * @param record Record
     * @param userId User id - not used.
     * @param groupId Group id.
     *
     * @returns {Record} A new record with the new content.
     *
     * @name NoteAndSubjectExtentionsHandler#changeUpdateRecordForUpdate
     */
    function recordDataForRawRepo( record, userId, groupId ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.recordDataForRawRepo" );

        try {
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue(/001/, /b/);
            if (!RawRepoClient.recordExists(recId, agencyId)) {
                return record;
            }

            var curRecord = RawRepoClient.fetchRecord(recId, agencyId);
            if (!isNationalCommonRecord(curRecord)) {
                return record;
            }

            record.eachField(/./, function (field) {
                if (extentableFields.test(field.name)) {
                    field.insert( 0, "&", groupId );
                }
            });

            return record;
        }
        finally {
            Log.trace( "Enter - NoteAndSubjectExtentionsHandler.recordDataForRawRepo" );
        }
    }

    /**
     * Checks if this record is a national common record.
     *
     * @param record Record.
     *
     * @returns {Boolean} True / False.
     *
     * @name NoteAndSubjectExtentionsHandler#isNationalCommonRecord
     */
    function isNationalCommonRecord( record ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.isNationalCommonRecord" );

        try {
            if( !record.matchValue( /996/, /a/, /DBC/ ) ) {
                return false;
            }

            for (var i = 0; i < record.size(); i++) {
                if (__isFieldNationalCommonRecord(record.field(i))) {
                    return true;
                }
            }

            return false;
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.isNationalCommonRecord" );
        }
    }

    /**
     * Checks if a field specifies that a record is a national common record.
     *
     * @param {Field} Field.
     *
     * @returns {Boolean} True / False.
     *
     * @private
     * @name NoteAndSubjectExtentionsHandler#__isFieldNationalCommonRecord
     */
    function __isFieldNationalCommonRecord( field ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.__isFieldNationalCommonRecord" );

        try {
            if (field.name !== "032") {
                return false;
            }

            if (!field.exists(/a/)) {
                return false;
            }

            return !field.matchValue(/x/, /BKM*|NET*|SF*/);
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.__isFieldNationalCommonRecord" );
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
     * @name NoteAndSubjectExtentionsHandler#__isFieldChangedInOtherRecord
     */
    function __isFieldChangedInOtherRecord( field, record ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.__isFieldChangedInOtherRecord" );

        try {
            for (var i = 0; i < record.size(); i++) {
                if (__isFieldsEqual(field, record.field(i))) {
                    return false;
                }
            }

            return true;
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.__isFieldChangedInOtherRecord" );
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
     * @name NoteAndSubjectExtentionsHandler#__isFieldsEqual
     */
    function __isFieldsEqual( srcField, destField ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.__isFieldsEqual" );

        try {
            if (srcField.name !== destField.name) {
                return false;
            }

            if (srcField.indicator !== destField.indicator) {
                return false;
            }

            if (srcField.size() !== destField.size()) {
                return false;
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
                    return false;
                }
                if (srcSubfields[i].value !== destSubfields[i].value) {
                    return false;
                }
            }

            return true;
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.__isFieldsEqual" );
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
     * @name NoteAndSubjectExtentionsHandler#__sortSubfield
     */
    function __sortSubfield( a, b ) {
        Log.trace( "Enter - NoteAndSubjectExtentionsHandler.__sortSubfield" );

        try {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            else {
                if (a.value < b.value) {
                    return -1;
                }
                else if (a.value > b.value) {
                    return 1;
                }
            }

            return 0;
        }
        finally {
            Log.trace( "Exit - NoteAndSubjectExtentionsHandler.__sortSubfield" );
        }
    }

    return {
        'authenticateExtentions': authenticateExtentions,
        'recordDataForRawRepo': recordDataForRawRepo,
        'isNationalCommonRecord': isNationalCommonRecord
    }

}();
