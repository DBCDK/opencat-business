//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "DefaultAuthenticator" );
use( "Log" );
use( "Marc" );
use( "MarcClasses" );
use( "NoteAndSubjectExtentionsHandler" );
use( "RawRepoClient" );
use( "RecordUtil" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UpdateConstants" );
use( "UpdateOwnership" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'FBSAuthenticator' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name FBSAuthenticator
 */
var FBSAuthenticator = function() {
    var __BUNDLE_NAME = "fbs-auth";

    /**
     * Authenticates a record.
     *
     * @param record Record
     * @param userId User id - not used.
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @name FBSAuthenticator#authenticateRecord
     */
    function authenticateRecord( record, userId, groupId, settings ) {
        Log.trace( "Enter - FBSAuthenticator.authenticateRecord( ", record, ", ", userId, ", ", groupId, ", ", settings, " )" );

        var result = undefined;
        try {
            if( settings !== undefined ) {
                ResourceBundleFactory.init( settings );
            }

            var authenticator = DefaultAuthenticator.create();

            var marcRecord = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );
            var result = authenticator.authenticateRecord( marcRecord, userId, groupId );

            return JSON.stringify( result );
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.authenticateRecord(): result" );
        }
    }

    /**
     * Converts a record to the actual records that should be stored in the RawRepo.
     *
     * @param {Record} record The record.
     *
     * @returns {Array} A list of records of type Record.
     */
    function recordDataForRawRepo( record, userId, groupId ) {
        Log.trace( StringUtil.sprintf( "Enter - FBSAuthenticator.recordDataForRawRepo( %s, %s, %s )", record, userId, groupId ) );

        var result = [];
        try {
            var records = __recordDataForRawRepo( record, userId, groupId );

            for( var i = 0; i < records.length; i++ ) {
                var curRecord = records[ i ];
                curRecord = RecordUtil.addOrReplaceSubfield( curRecord, "001", "c", RecordUtil.currentAjustmentTime() );
                Log.debug( "curRecord:\n", curRecord );

                Log.debug( "Adding curRecord: ", curRecord.toString() );
                result.push( curRecord );
            }

            return result;
        }
        finally {
            Log.trace( StringUtil.sprintf( "Exit - FBSAuthenticator.recordDataForRawRepo( %s )", result ) );
        }
    }

    function __recordDataForRawRepo( record, userId, groupId ) {
        Log.trace( "Enter - FBSAuthenticator.__recordDataForRawRepo()" );

        try {
            var agencyId = record.getValue( /001/, /b/ );

            if (agencyId === UpdateConstants.COMMON_AGENCYID) {
                return __recordDataForRawRepoCommonRecord( record, userId, groupId );
            }

            return [ record ];
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.__recordDataForRawRepo()" );
        }
    }

    function __recordDataForRawRepoCommonRecord( record, userId, groupId ) {
        Log.trace( "Enter - FBSAuthenticator.__recordDataForRawRepoCommonRecord" );

        var correctedRecord = null;
        var dbcEnrichmentRecord = null;
        try {
            RecordUtil.addOrReplaceSubfield( record, "001", "b", UpdateConstants.RAWREPO_COMMON_AGENCYID );

            correctedRecord = NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, userId, groupId );

            var recId = correctedRecord.getValue( /001/, /a/ );
            var agencyId = UpdateConstants.RAWREPO_COMMON_AGENCYID;
            var curRecord;
            if( RawRepoClient.recordExists( recId, agencyId ) ) {
                curRecord = RawRepoClient.fetchRecord( recId, agencyId );
            }
            else {
                curRecord = undefined;
            }
            correctedRecord = UpdateOwnership.mergeRecord( correctedRecord, curRecord );

            var owner = correctedRecord.getValue( /996/, /a/ );
            if( owner === "" ) {
                Log.debug( "No owner in record." );
                return [ correctedRecord ];
            }

            var recId = correctedRecord.getValue( /001/, /a/ );

            if( !RawRepoClient.recordExists( recId, UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) ) {
                Log.debug( "DBC enrichment record [", recId, ":", UpdateConstants.DBC_ENRICHMENT_AGENCYID, "] does not exist." );
                dbcEnrichmentRecord = new Record;

                var idField = record.field( "001" ).clone();
                idField.subfield( "b" ).value = UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID;

                dbcEnrichmentRecord.append( idField );
            }
            else {
                Log.debug("DBC enrichment record [", recId, ":", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID, "found.");
                dbcEnrichmentRecord = RawRepoClient.fetchRecord(recId, UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID);
            }

            var recordStatus = correctedRecord.getValue( /004/, /r/ );
            if( recordStatus !== "" ) {
                Log.debug( "Replace 004 *r in DBC enrichment record with: ", recordStatus );
                dbcEnrichmentRecord = RecordUtil.addOrReplaceSubfield( dbcEnrichmentRecord, "004", "r", recordStatus );
            }

            var recordType = correctedRecord.getValue( /004/, /a/ );
            if( recordType !== "" ) {
                Log.debug( "Replace 004 *a in DBC enrichment record with: ", recordType );
                dbcEnrichmentRecord = RecordUtil.addOrReplaceSubfield( dbcEnrichmentRecord, "004", "a", recordType );
            }

            return [ correctedRecord, dbcEnrichmentRecord ];
        }
        finally {
            Log.trace( "  correctedRecord:\n", correctedRecord );
            Log.trace( "  dbcEnrichmentRecord:\n", dbcEnrichmentRecord );
            Log.trace( "Exit - FBSAuthenticator.__recordDataForRawRepoCommonRecord" );
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
        'recordDataForRawRepo': recordDataForRawRepo,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
