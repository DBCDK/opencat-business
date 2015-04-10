//-----------------------------------------------------------------------------
use( "AuthenticatorEntryPoint" );
use( "DanMarc2Converter" );
use( "ClassificationData" );
use( "Log" );
use( "Marc" );
use( "RecordUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'UpdaterEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the update API between Java and
 * JavaScript.
 *
 * @namespace
 * @name AuthenticatorEntryPoint
 */
var UpdaterEntryPoint = function() {
    /**
     * Checks if a record contains any classification data
     *
     * @param {String} jsonMarc The record as a json.
     *
     * @return {Boolean} true if classification data exists in the record, false otherwise.
     */
    function hasClassificationData( jsonMarc ) {
        Log.trace( "Enter - UpdaterEntryPoint.hasClassificationData()" );

        var result;
        try {
            var marc = DanMarc2Converter.convertToDanMarc2(JSON.parse(jsonMarc));

            result = ClassificationData.hasClassificationData(marc);
            return result;
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.hasClassificationData():" + result );
        }
    }

    /**
     * Checks if the classifications has changed between two records.
     *
     * @param {String} oldRecord The old record as a json.
     * @param {String} newRecord The new record as a json.
     *
     * @return {Boolean} true if the classifications has changed, false otherwise.
     */
    function hasClassificationsChanged( oldRecord, newRecord ) {
        Log.trace( "Enter - UpdaterEntryPoint.hasClassificationsChanged()" );

        var result;
        try {
            var oldMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(oldRecord));
            var newMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(newRecord));

            result = ClassificationData.hasClassificationsChanged(oldMarc, newMarc);
            return result;
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.hasClassificationsChanged(): " + result );
        }
    }

    /**
     * Creates a new library extended record based on a DBC record.
     *
     * @param {String} dbcRecord The DBC record as a json.
     * @param {int}    libraryId Library id for the local library.
     *
     * @return {String} A json with the new record.
     */
    function createLibraryExtendedRecord( dbcRecord, libraryId ) {
        Log.trace( "Enter - UpdaterEntryPoint.createLibraryExtendedRecord()" );

        var result;
        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));
            result = new Record;

            var curDate = new Date();
            var curDateStr = curDate.getFullYear().toString() +
                curDate.getMonth().toString() +
                curDate.getDay().toString();
            var curTimeStr = curDate.getHours().toString() +
                curDate.getMinutes().toString() +
                curDate.getSeconds().toString();

            var idField = new Field("001", "00");
            idField.append(new Subfield("a", dbcMarc.getValue(/001/, /a/)));
            idField.append(new Subfield("b", libraryId.toString()));
            idField.append(new Subfield("c", curDateStr + curTimeStr));
            idField.append(new Subfield("d", curDateStr));
            idField.append(new Subfield("f", "a"));
            result.append(idField);

            result = updateLibraryExtendedRecord(dbcRecord, JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result)));
            return result;
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.createLibraryExtendedRecord(): " + result );
        }
    }

    /**
     * Updates a library extended record with the classifications from
     * a DBC record.
     *
     * @param {String} dbcRecord The DBC record as a json.
     * @param {String} libraryRecord The library record to update as a json.
     *
     * @return {String} A json with the updated record.
     */
    function updateLibraryExtendedRecord( dbcRecord, libraryRecord ) {
        Log.trace( "Enter - UpdaterEntryPoint.updateLibraryExtendedRecord()" );

        var result;
        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));
            var libraryMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(libraryRecord));

            result = __correctEnrichmentRecordIfEmpty(ClassificationData.updateClassificationsInRecord(dbcMarc, libraryMarc));
            return JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result));
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.updateLibraryExtendedRecord(): " + result );
        }
    }

    function correctLibraryExtendedRecord( dbcRecord, libraryRecord ) {
        Log.info( "Enter - ClassificationData.__hasFieldChanged()" );

        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));
            var libraryMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(libraryRecord));

            Log.info("    dbcMarc: " + dbcMarc);
            Log.info("    libraryMarc: " + libraryMarc);

            if (ClassificationData.hasClassificationData(dbcMarc)) {
                if (!ClassificationData.hasClassificationsChanged(dbcMarc, libraryMarc)) {
                    Log.info("Classifications is the same. Removing it from library record.");
                    libraryMarc = ClassificationData.removeClassificationsFromRecord(libraryMarc);
                }
                else {
                    Log.info("Classifications has changed.");
                }
            }
            else {
                Log.info("Common record has no classifications.");
            }

            var record = __correctEnrichmentRecordIfEmpty(libraryMarc);
            return JSON.stringify(DanMarc2Converter.convertFromDanMarc2(record));
        }
        finally {
            Log.info("Exit - ClassificationData.correctLibraryExtendedRecord()" );
        }
    }

    /**
     * Converts a record to the actual records that should be stored in the RawRepo.
     *
     * @param {String} record The record as a json.
     *
     * @returns {Array} A list of records as json strings.
     */
    function recordDataForRawRepo( record, userId, groupId ) {
        Log.trace( "Enter - UpdaterEntryPoint.recordDataForRawRepo" );

        try {
            var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );
            Log.trace( "Record:\n", uneval( marc ) );

            var records = AuthenticatorEntryPoint.recordDataForRawRepo( marc, userId, groupId );
            var result = [];

            for( var i = 0; i < records.length; i++ ) {
                var curRecord = records[ i ];
                curRecord = RecordUtil.addOrReplaceSubfield( curRecord, "001", "c", RecordUtil.currentAjustmentTime() );
                Log.debug( "curRecord:\n", curRecord );

                var resultRecord = DanMarc2Converter.convertFromDanMarc2( curRecord );
                var resultRecordAsJson = JSON.stringify( resultRecord );
                Log.debug( "Adding resultRecord: ", resultRecordAsJson );
                result.push( resultRecordAsJson );
            }

            var resultAsJson = "[" + result.join( "," )+ "]";
            Log.debug( "Returning: ", resultAsJson );
            return resultAsJson;
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.recordDataForRawRepo" );
        }
    }

    function __correctEnrichmentRecordIfEmpty( record ) {
        Log.trace( "Enter - UpdaterEntryPoint.__correctEnrichmentRecordIfEmpty" );

        Log.debug( "Record: ", record.toString() );
        var result = record;
        try {
            for( var i = 0; i < record.size(); i++ ) {
                var field = record.field( i );
                if( !( field.name === "001" || field.name === "996" ) ) {
                    Log.debug( "Return full record." );
                    return result;
                }
            }

            result = new Record;
            Log.debug( "Return empty record." );
            return result;
        }
        finally {
            Log.trace( "Exit - UpdaterEntryPoint.__correctEnrichmentRecordIfEmpty: " + result.toString() );
        }
    }

    return {
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'createLibraryExtendedRecord': createLibraryExtendedRecord,
        'updateLibraryExtendedRecord': updateLibraryExtendedRecord,
        'correctLibraryExtendedRecord': correctLibraryExtendedRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    };

}();
