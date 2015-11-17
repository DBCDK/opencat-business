//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "DefaultEnrichmentRecordHandler" );
use( "DefaultRawRepoRecordHandler" );
use( "FBSAuthenticator" );
use( "FBSClassificationData" );
use( "Log" );
use( "Marc" );
use( "RecordUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'FBSUpdaterEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the update API between Java and
 * JavaScript.
 *
 * @namespace
 * @name FBSAuthenticator
 */
var FBSUpdaterEntryPoint = function() {
    /**
     * Checks if a record contains any classification data
     *
     * @param {String} jsonRecord The record as a json.
     *
     * @return {Boolean} true if classification data exists in the record, false otherwise.
     */
    function hasClassificationData( jsonRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.hasClassificationData()" );

        var result;
        try {
            var instance = FBSClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
            var marc = DanMarc2Converter.convertToDanMarc2(JSON.parse(jsonRecord));

            result = FBSClassificationData.hasClassificationData( instance, marc);
            return result;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.hasClassificationData():" + result );
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
        Log.trace( "Enter - FBSUpdaterEntryPoint.hasClassificationsChanged()" );

        var result;
        try {
            var oldMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(oldRecord));
            var newMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(newRecord));
            var instance = __createClassificationInstance( oldMarc, newMarc );

            result = FBSClassificationData.hasClassificationsChanged(instance, oldMarc, newMarc);
            return result;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.hasClassificationsChanged(): " + result );
        }
    }

    /**
     * Checks if we chould create enrichment records for a common record.
     *
     * @param {Object} settings             JNDI settings.
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     *
     * @return {String} A json with the value of a ServiceResult instance.
     */
    function shouldCreateEnrichmentRecords( settings, currentCommonRecord, updatingCommonRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.shouldCreateEnrichmentRecords()" );

        var result;
        try {
            ResourceBundleFactory.init( settings );
            var currentCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( currentCommonRecord ) );
            var updatingCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( updatingCommonRecord ) );

            var instance = __createEnrichmentRecordHandlerInstance( currentCommonMarc, updatingCommonMarc );

            result = DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentCommonMarc, updatingCommonMarc );
            result = JSON.stringify( result );
            return result;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.shouldCreateEnrichmentRecords(): " + result );
        }
    }

    /**
     * Creates a new library extended record based on a DBC record.
     *
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     * @param {int}    agencyId Library id for the local library.
     *
     * @return {String} A json with the new record.
     */
    function createLibraryExtendedRecord( currentCommonRecord, updatingCommonRecord, agencyId ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.createLibraryExtendedRecord()" );

        var result;
        try {
            var currentCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( currentCommonRecord ) );
            var updatingCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( updatingCommonRecord ) );

            var instance = __createEnrichmentRecordHandlerInstance( currentCommonMarc, updatingCommonMarc );

            result = DefaultEnrichmentRecordHandler.createRecord( instance, currentCommonMarc, updatingCommonMarc, agencyId );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.createLibraryExtendedRecord(): " + result );
        }
    }

    /**
     * Updates a library extended record with the classifications from
     * a DBC record.
     *
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     * @param {String} enrichmentRecord The library record to update as a json.
     *
     * @return {String} A json with the updated record.
     */
    function updateLibraryExtendedRecord( currentCommonRecord, updatingCommonRecord, enrichmentRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.updateLibraryExtendedRecord()" );

        var result;
        try {
            var currentCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( currentCommonRecord ) );
            var updatingCommonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( updatingCommonRecord ) );
            var enrichmentMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(enrichmentRecord));

            var instance = __createEnrichmentRecordHandlerInstance( currentCommonMarc, updatingCommonMarc );

            result = DefaultEnrichmentRecordHandler.updateRecord( instance, currentCommonMarc, updatingCommonMarc, enrichmentMarc );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.updateLibraryExtendedRecord(): " + result );
        }
    }

    function correctLibraryExtendedRecord( commonRecord, enrichmentRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.correctLibraryExtendedRecord()" );

        var result;
        try {
            var commonMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( commonRecord ) );
            var enrichmentMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(enrichmentRecord));

            Log.trace( "Create instance with FBSClassificationData" );
            var classificationsInstance = FBSClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
            var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, FBSClassificationData );

            result = DefaultEnrichmentRecordHandler.correctRecord( instance, commonMarc, enrichmentMarc );
            result = JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) );
            return result;
        }
        finally {
            Log.trace("Exit - FBSUpdaterEntryPoint.correctLibraryExtendedRecord(): " + result );
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
        Log.trace( "Enter - FBSUpdaterEntryPoint.recordDataForRawRepo" );

        try {
            var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );
            Log.trace( "Record:\n", uneval( marc ) );

            var instance = DefaultRawRepoRecordHandler.create( FBSAuthenticator );

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
            Log.trace( "Exit - FBSUpdaterEntryPoint.recordDataForRawRepo" );
        }
    }

    function __createClassificationInstance( currentRecord, newRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.__createClassificationInstance" );

        try {
            var instance;

            instance = FBSClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );

            return instance;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.__createClassificationInstance" );
        }
    }

    function __createEnrichmentRecordHandlerInstance( currentCommonRecord, updatingCommonRecord ) {
        Log.trace( "Enter - FBSUpdaterEntryPoint.__createEnrichmentRecordHandlerInstance" );

        var instance;
        try {
            Log.trace( "Create instance with FBSClassificationData" );
            var classificationsInstance = FBSClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
            instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, FBSClassificationData );

            return instance;
        }
        finally {
            Log.trace( "Exit - FBSUpdaterEntryPoint.__createEnrichmentRecordHandlerInstance() " + instance );
        }
    }

    return {
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'shouldCreateEnrichmentRecords': shouldCreateEnrichmentRecords,
        'createLibraryExtendedRecord': createLibraryExtendedRecord,
        'updateLibraryExtendedRecord': updateLibraryExtendedRecord,
        'correctLibraryExtendedRecord': correctLibraryExtendedRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    };

}();
