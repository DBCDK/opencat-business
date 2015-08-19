//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "DBCAuthenticator" );
use( "DefaultEnrichmentRecordHandler" );
use( "DefaultRawRepoRecordHandler" );
use( "ClassificationData" );
use( "Log" );
use( "Marc" );
use( "RecordUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DBCUpdaterEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the update API between Java and
 * JavaScript.
 *
 * @namespace
 * @name DBCUpdaterEntryPoint
 */
var DBCUpdaterEntryPoint = function() {
    /**
     * Checks if a record contains any classification data
     *
     * @param {String} jsonRecord The record as a json.
     *
     * @return {Boolean} true if classification data exists in the record, false otherwise.
     */
    function hasClassificationData( jsonRecord ) {
        Log.trace( "Enter - DBCUpdaterEntryPoint.hasClassificationData()" );

        var result;
        try {
            var instance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
            var marc = DanMarc2Converter.convertToDanMarc2(JSON.parse(jsonRecord));

            result = ClassificationData.hasClassificationData( instance, marc);
            return result;
        }
        finally {
            Log.trace( "Exit - DBCUpdaterEntryPoint.hasClassificationData():" + result );
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
        Log.trace( "Enter - DBCUpdaterEntryPoint.hasClassificationsChanged()" );

        var result;
        try {
            var instance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
            var oldMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(oldRecord));
            var newMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(newRecord));

            result = ClassificationData.hasClassificationsChanged( instance, oldMarc, newMarc);
            return result;
        }
        finally {
            Log.trace( "Exit - DBCUpdaterEntryPoint.hasClassificationsChanged(): " + result );
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
        Log.trace( "Enter - DBCUpdaterEntryPoint.createLibraryExtendedRecord()" );

        var result;
        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));

            var classificationsInstance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
            var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

            result = DefaultEnrichmentRecordHandler.createRecord( instance, dbcMarc, libraryId );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.trace( "Exit - DBCUpdaterEntryPoint.createLibraryExtendedRecord(): " + result );
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
        Log.trace( "Enter - DBCUpdaterEntryPoint.updateLibraryExtendedRecord()" );

        var result;
        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));
            var libraryMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(libraryRecord));

            var classificationsInstance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
            var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

            result = DefaultEnrichmentRecordHandler.updateRecord( instance, dbcMarc, libraryMarc );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.trace( "Exit - DBCUpdaterEntryPoint.updateLibraryExtendedRecord(): " + result );
        }
    }

    function correctLibraryExtendedRecord( dbcRecord, libraryRecord ) {
        Log.info( "Enter - ClassificationData.__hasFieldChanged()" );

        var result;
        try {
            var dbcMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(dbcRecord));
            var libraryMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(libraryRecord));

            var classificationsInstance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
            var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

            result = DefaultEnrichmentRecordHandler.correctRecord( instance, dbcMarc, libraryMarc );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.info("Exit - ClassificationData.correctLibraryExtendedRecord(): " + result );
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
        Log.trace( "Enter - DBCUpdaterEntryPoint.recordDataForRawRepo" );

        try {
            var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );
            Log.trace( "Record:\n", uneval( marc ) );

            var instance = DefaultRawRepoRecordHandler.create( DBCAuthenticator );

            var records = DefaultRawRepoRecordHandler.recordDataForRawRepo( instance, marc, userId, groupId );
            var result = [];

            for( var i = 0; i < records.length; i++ ) {
                var curRecord = records[ i ];
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
            Log.trace( "Exit - DBCUpdaterEntryPoint.recordDataForRawRepo" );
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
