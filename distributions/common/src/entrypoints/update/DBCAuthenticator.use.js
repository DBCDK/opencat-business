//-----------------------------------------------------------------------------
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DBCAuthenticator' ];

//-----------------------------------------------------------------------------
/**
 * Module to authenticate and change records for update when they are updated
 * by an user from DBC.
 *
 * @namespace
 * @name DBCAuthenticator
 */
var DBCAuthenticator = function() {
    var AGENCY_IDS = [ "870970", "010100" ];

    /**
     * Checks if this record can be authenticated by this authenticator.
     *
     * It simply checks if groupId contains a DBC agency id.
     *
     * @param record Record - Not used.
     * @param userId User id - Not used.
     * @param groupId Group id.
     *
     * @returns {Boolean} True / False.
     *
     * @name DBCAuthenticator#canAuthenticate
     */
    function canAuthenticate( record, userId, groupId ) {
        return AGENCY_IDS.indexOf( groupId ) > -1;
    }

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
    function authenticateRecord( record, userId, groupId ) {
        Log.trace( "Enter - DBCAuthenticator.authenticateRecord()" );

        try {
            return [];
        }
        finally {
            Log.trace( "Enter - DBCAuthenticator.authenticateRecord()" );

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
            return BasisSplitter.splitCompleteBasisRecord( record );
        }
        finally {
            Log.trace( "Exit - DBCAuthenticator.recordDataForRawRepo()" );
        }
    }

    return {
        'canAuthenticate': canAuthenticate,
        'authenticateRecord': authenticateRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    }
}();
