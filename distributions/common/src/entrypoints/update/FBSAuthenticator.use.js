//-----------------------------------------------------------------------------
use( "Log" );
use( "NoteAndSubjectExtentionsHandler" );
use( "RawRepoClient" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'FBSAuthenticator' ];

//-----------------------------------------------------------------------------
/**
 * Module to authenticate and change records for update when they are updated
 * by an user from a FBS library.
 *
 * @namespace
 * @name FBSAuthenticator
 */
var FBSAuthenticator = function() {
    var AGENCY_IDS = [
        "700400", "710100", "714700", "715100", "715300", "715500",
        "715700", "715900", "716100", "716300", "716500", "716700", "716900",
        "717300", "717500", "718300", "718500", "718700", "719000", "720100",
        "721000", "721700", "721900", "722300", "723000", "724000", "725000",
        "725300", "725900", "726000", "726500", "726900", "727000", "730600",
        "731600", "732000", "732600", "732900", "733000", "733600", "734000",
        "735000", "736000", "737000", "737600", "739000", "740000", "741000",
        "742000", "743000", "744000", "745000", "746100", "747900", "748000",
        "748200", "749200", "751000", "753000", "754000", "755000", "756100",
        "757300", "757500", "758000", "760700", "761500", "762100", "763000",
        "765700", "766100", "766500", "767100", "770600", "770700", "771000",
        "772700", "773000", "774000", "774100", "774600", "775100", "775600",
        "776000", "776600", "777300", "777900", "778700", "779100", "781000",
        "781300", "782000", "782500", "784000", "784600", "784900", "785100",
        "786000", "400700", "790900"
    ];
    var COMMON_AGENCYID = "870970";

    /**
     * Checks if this record can be authenticated by this authenticator.
     *
     * It simply checks if groupId contains a FBS agency id.
     *
     * @param record Record - Not used.
     * @param userId User id - Not used.
     * @param groupId Group id.
     *
     * @returns {Boolean} True / False.
     *
     * @name FBSAuthenticator#canAuthenticate
     */
    function canAuthenticate( record, userId, groupId ) {
        Log.trace( "Enter - FBSAuthenticator.canAuthenticate()" );

        try {
            var result = AGENCY_IDS.indexOf( groupId ) > -1;

            Log.trace( "Will FBSAuthenticator authenticate group '", groupId, "' for this record." );
            return result;
        }
        finally {
            Log.trace( "Enter - FBSAuthenticator.canAuthenticate()" );
        }
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
     * @name FBSAuthenticator#authenticateRecord
     */
    function authenticateRecord( record, userId, groupId ) {
        Log.trace( "Enter - FBSAuthenticator.authenticateRecord()" );

        try {
            var agencyId = record.getValue(/001/, /b/);

            if (agencyId === groupId) {
                return [];
            }

            if (agencyId === COMMON_AGENCYID) {
                return __authenticateCommonRecord(record, groupId);
            }

            var recId = record.getValue(/001/, /a/);
            return [ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at opdatere posten '%s'", groupId, recId))];
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.authenticateRecord()" );
        }
    }

    /**
     * Helper function.
     *
     * Handles the special case then a FBS library updates a common DBC record.
     *
     * @param record Record
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @private
     * @name FBSAuthenticator#__authenticateCommonRecord
     */
    function __authenticateCommonRecord( record, groupId ) {
        Log.trace( "Enter - FBSAuthenticator.__authenticateCommonRecord()" );

        try {
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue( /001/, /b/ );

            if( !RawRepoClient.recordExists( recId, agencyId ) ) {
                if( record.matchValue( /996/, /a/, RegExp( groupId ) ) ) {
                    return [];
                }

                return [ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at oprette posten '%s'", groupId, recId))];
            }

            var curRecord = RawRepoClient.fetchRecord( recId, agencyId );
            var curOwner = curRecord.getValue( /s10/, /a/ );
            if( !( curOwner === "RET" || AGENCY_IDS.indexOf( curOwner ) > -1 ) ) {
                Log.info( "Authentication error. Current owner: ", curOwner, " Agency: ", groupId );
                return [ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at opdatere posten '%s'", groupId, recId))];
            }

            var newOwner = record.getValue( /996/, /a/ );
            if( newOwner !== groupId ) {
                Log.info( "Owner has changed: ", curOwner, " !== ", newOwner );
                return [ValidateErrors.recordError("", StringUtil.sprintf("Brugeren '%s' har ikke ret til at opdatere posten '%s' for andre biblioteker end '%s'", groupId, recId, groupId ))];
            }

            return NoteAndSubjectExtentionsHandler.authenticateExtentions( record, groupId );
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.__authenticateCommonRecord()" );
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
        record = NoteAndSubjectExtentionsHandler.changeUpdateRecordForUpdate( record, userId, groupId );
        return RawRepoMerge.mergeRawRepoRecord( record );
    }
    
    return {
        'canAuthenticate': canAuthenticate,
        'authenticateRecord': authenticateRecord,
        'changeUpdateRecordForUpdate': changeUpdateRecordForUpdate
    }

}();
