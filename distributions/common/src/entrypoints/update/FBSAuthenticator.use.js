//-----------------------------------------------------------------------------
use( "Log" );
use( "NoteAndSubjectExtentionsHandler" );
use( "RawRepoClient" );
use( "UpdateConstants" );
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
            var agencyId = record.getValue( /001/, /b/ );

            if (agencyId === groupId) {
                return [];
            }

            if (agencyId === COMMON_AGENCYID) {
                return __authenticateCommonRecord(record, groupId);
            }

            var recId = record.getValue(/001/, /a/);
            return [ValidateErrors.recordError("", StringUtil.sprintf( "Du har ikke ret til at rette posten '%s' da den er ejet af et andet bibliotek.", recId))];
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
            if( NoteAndSubjectExtentionsHandler.isNationalCommonRecord( record ) === true ) {
                return NoteAndSubjectExtentionsHandler.authenticateExtentions( record, groupId );
            }

            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue( /001/, /b/ );
            var owner = record.getValue( /996/, /a/ );

            Log.info( "Record agency: ", agencyId );
            Log.info( "New owner: ", owner );

            if( !RawRepoClient.recordExists( recId, agencyId ) ) {
                Log.debug( "Checking authentication for new common record." );
                if( owner === "" ) {
                    return [ValidateErrors.recordError("", "Du har ikke ret til at oprette en f\xe6llesskabspost")];
                }

                if( owner !== groupId ) {
                    return [ValidateErrors.recordError("", "Du har ikke ret til at oprette en f\xe6llesskabspost for et andet bibliotek.")];
                }

                return [];
            }

            Log.debug( "Checking authentication for updating existing common record." );
            if( owner === "" ) {
                return [ValidateErrors.recordError("", "Du har ikke ret til at opdatere f\xe6llesskabsposten")];
            }

            if( owner !== groupId ) {
                return [ValidateErrors.recordError("", "Du har ikke ret til at opdatere f\xe6llesskabsposten for et andet bibliotek.")];
            }

            var curRecord = RawRepoClient.fetchRecord( recId, agencyId );
            var curOwner = curRecord.getValue( /996/, /a/ );

            Log.info( "Current owner: ", curOwner );

            if( curOwner === "DBC" ) {
                return [ValidateErrors.recordError("", "Du har ikke ret til at opdatere en f\xe6llesskabspost som er ejet af DBC")];
            }
            if( curOwner !== "RET" && AGENCY_IDS.indexOf( curOwner ) === -1 ) {
                return [ValidateErrors.recordError("", "Du har ikke ret til at opdatere en f\xe6llesskabspost som ikke er ejet af et folkebibliotek.")];
            }

            return [];
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.__authenticateCommonRecord()" );
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
        Log.trace( "Enter - FBSAuthenticator.recordDataForRawRepo()" );

        try {
            var correctedRecord = NoteAndSubjectExtentionsHandler.recordDataForRawRepo( record, userId, groupId );
            var owner = correctedRecord.getValue( /996/, /a/ );
            if( owner === "" ) {
                Log.debug( "No owner in record." );
                return [ correctedRecord ];
            }

            var recId = correctedRecord.getValue( /001/, /a/ );

            if( !RawRepoClient.recordExists( recId, UpdateConstants.DBC_ENRICHMENT_AGENCYID ) ) {
                Log.debug( "DBC enrichment record [", recId, ":", UpdateConstants.DBC_ENRICHMENT_AGENCYID, "] does not exist." );
                return [ correctedRecord ];
            }

            Log.debug( "DBC enrichment record [", recId, ":", UpdateConstants.DBC_ENRICHMENT_AGENCYID, "found." );

            var dbcEnrichmentRecord = RawRepoClient.fetchRecord( recId, UpdateConstants.DBC_ENRICHMENT_AGENCYID );

            Log.debug( "Replace s10 in DBC enrichment record with: ", owner );
            dbcEnrichmentRecord = RecordUtil.addOrReplaceSubfield( dbcEnrichmentRecord, "s10", "a", owner );

            return [ correctedRecord, dbcEnrichmentRecord ];
        }
        finally {
            Log.trace( "Exit - FBSAuthenticator.recordDataForRawRepo()" );
        }
    }

    return {
        'canAuthenticate': canAuthenticate,
        'authenticateRecord': authenticateRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    }

}();
