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
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue( /001/, /b/ );

            if( !RawRepoClient.recordExists( recId, agencyId ) ) {
                return [];
            }

            var curRecord = RawRepoClient.fetchRecord( recId, agencyId );
            var curOwner = curRecord.getValue( /s10/, /a/ );
            var newOwner = record.getValue( /996/, /a/ );
            if( curOwner !== newOwner ) {
                Log.info( "Owner has changed: ", curOwner, " !== ", newOwner );
                return [ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' m\u00E5 ikke \u00E6ndret v\u00E6rdien af felt 996a i posten '%s'", groupId, recId))];
            }

            return [];
        }
        finally {
            Log.trace( "Enter - DBCAuthenticator.authenticateRecord()" );

        }
    }

    /**
     * Changes the content of a record for update.
     *
     * @param record Record
     * @param userId User id - not used.
     * @param groupId Group id - not used.
     *
     * @returns {Record} A new record with the new content.
     *
     * @name DBCAuthenticator#changeUpdateRecordForUpdate
     */
    function changeUpdateRecordForUpdate( record, userId, groupId ) {
        return RawRepoMerge.mergeRawRepoRecord( record );
    }

    return {
        'canAuthenticate': canAuthenticate,
        'authenticateRecord': authenticateRecord,
        'changeUpdateRecordForUpdate': changeUpdateRecordForUpdate
    }
}();
