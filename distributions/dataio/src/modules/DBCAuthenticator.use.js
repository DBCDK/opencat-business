//-----------------------------------------------------------------------------
use( "BasisSplitter" );
use( "DanMarc2Converter" );
use( "Log" );
use( "Marc" );
use( "MarcClasses" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UpdateConstants" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DBCAuthenticator' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name DBCAuthenticator
 */
var DBCAuthenticator = function() {
    var BUNDLE_NAME = "auth";

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
     * @name DBCAuthenticator#authenticateRecord
     */
    function authenticateRecord( record, userId, groupId, settings ) {
        Log.trace( "Enter - DBCAuthenticator.authenticateRecord()" );

        try {
            ResourceBundleFactory.init( settings );

            if( UpdateConstants.DBC_AGENCY_IDS.indexOf( groupId ) == -1 ) {
                Log.warn( "Unknown record/user." );
                Log.warn( "User/group: ", userId, " / ", groupId );
                Log.warn( "Posten:\n", record );

                var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

                return JSON.stringify( [ ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "unknown.user.error", groupId ) ) ] );
            }

            return JSON.stringify( [] );
        }
        finally {
            Log.trace( "Exit - DBCAuthenticator.authenticateRecord()" );
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
        Log.trace( "Enter - DBCAuthenticator.recordDataForRawRepo()" );

        try {
            if( UpdateConstants.DBC_AGENCY_IDS.indexOf( groupId ) == -1 ) {
                Log.warn( "Unknown record/user." );
                Log.warn( "User/group: ", userId, " / ", groupId );
                Log.warn( "Posten:\n", record );
                return [ record ];
            }

            return BasisSplitter.splitCompleteBasisRecord( record );
        }
        finally {
            Log.trace( "Exit - DBCAuthenticator.recordDataForRawRepo()" );
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    }
}();
