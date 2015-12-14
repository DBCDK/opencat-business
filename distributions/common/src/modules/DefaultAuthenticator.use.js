//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "MarcClasses" );
use( "NoteAndSubjectExtentionsHandler" );
use( "OpenAgencyClient" );
use( "RawRepoClient" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UpdateConstants" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DefaultAuthenticator' ];

//-----------------------------------------------------------------------------
var DefaultAuthenticator = function() {
    var __BUNDLE_NAME = "default-auth";

    /**
     * Constructor.
     *
     * @param agencyIds {Array}  Array of agency ids.
     * @param settings  {Object} JNDI settings.
     *
     * @returns {DefaultAuthenticator} The new instance.
     */
    function create() {
        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        function authenticateRecord( record, userId, groupId ) {
            Log.trace( "Enter - DefaultAuthenticator.authenticateRecord()" );

            try {
                var agencyId = record.getValue( /001/, /b/ );

                if( OpenAgencyClient.hasFeature( groupId, UpdateConstants.AUTH_ROOT_FEATURE ) ) {
                    return [];
                }

                if (agencyId === groupId) {
                    return [];
                }

                if (agencyId === UpdateConstants.COMMON_AGENCYID ) {
                    return __authenticateCommonRecord( record, groupId );
                }

                if( UpdateConstants.SCHOOL_AGENCY_PATTERN.test( groupId ) ) {
                    if( record.matchValue( /001/, /b/, RegExp( UpdateConstants.SCHOOL_COMMON_AGENCYID ) ) ) {
                        return [];
                    }
                }

                var recId = record.getValue(/001/, /a/);
                return [ValidateErrors.recordError("", ResourceBundle.getStringFormat( bundle, "edit.record.other.library.error", recId ) ) ];
            }
            finally {
                Log.trace( "Exit - DefaultAuthenticator.authenticateRecord()" );
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
         * @name DefaultAuthenticator#__authenticateCommonRecord
         */
        function __authenticateCommonRecord( record, groupId ) {
            Log.trace( "Enter - DefaultAuthenticator.__authenticateCommonRecord()" );

            try {
                if( NoteAndSubjectExtentionsHandler.isNationalCommonRecord( record ) === true ) {
                    return NoteAndSubjectExtentionsHandler.authenticateExtentions( record, groupId );
                }

                var recId = record.getValue(/001/, /a/);
                var agencyId = record.getValue( /001/, /b/ );
                var owner = record.getValue( /996/, /a/ );

                Log.info( "Record agency: ", agencyId );
                Log.info( "New owner: ", owner );

                if( !RawRepoClient.recordExists( recId, UpdateConstants.RAWREPO_COMMON_AGENCYID ) ) {
                    Log.debug( "Checking authentication for new common record." );
                    if( owner === "" ) {
                        return [ValidateErrors.recordError("", ResourceBundle.getString( bundle, "create.common.record.error" ) ) ];
                    }

                    if( owner !== groupId ) {
                        return [ValidateErrors.recordError("", ResourceBundle.getString( bundle, "create.common.record.other.library.error" ) ) ];
                    }

                    return [];
                }

                Log.debug( "Checking authentication for updating existing common record." );
                var curRecord = RawRepoClient.fetchRecord( recId, UpdateConstants.RAWREPO_COMMON_AGENCYID );
                var curOwner = curRecord.getValue( /996/, /a/ );

                Log.info( "Current owner: ", curOwner );

                if( curOwner === "DBC" ) {
                    if( !OpenAgencyClient.hasFeature( groupId, UpdateConstants.AUTH_DBC_RECORDS ) ) {
                        return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.owner.dbc.error"))];
                    }

                    return [];
                }
                if( curOwner === "RET" ) {
                    if( !OpenAgencyClient.hasFeature( groupId, UpdateConstants.AUTH_RET_RECORD ) ) {
                        return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error"))];
                    }

                    return [];
                }

                if( owner === "" ) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString( bundle, "update.common.record.error" ) ) ];
                }

                if( OpenAgencyClient.hasFeature( curOwner, UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD ) ) {
                    if( owner !== groupId ) {
                        return [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.give.public.library.error" ) ) ];
                    }

                    if( !OpenAgencyClient.hasFeature( groupId, UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD ) ) {
                        return [ ValidateErrors.recordError( "", ResourceBundle.getString( bundle, "update.common.record.take.public.library.error" ) ) ];
                    }

                    return [];
                }

                if( !( owner === groupId && groupId === curOwner ) ) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.other.library.error"))];
                }

                return [];
            }
            finally {
                Log.trace( "Exit - DefaultAuthenticator.__authenticateCommonRecord()" );
            }
        }

        return {
            'authenticateRecord': authenticateRecord
        }
    }

    return {
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'create': create
    }
}();
