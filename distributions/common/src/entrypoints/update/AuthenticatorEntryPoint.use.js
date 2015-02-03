//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "DBCAuthenticator" );
use( "FBSAuthenticator" );
use( "Marc" );
use( "MarcClasses" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'AuthenticatorEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name AuthenticatorEntryPoint
 */
var AuthenticatorEntryPoint = function() {
    var authenticators = [
        DBCAuthenticator,
        FBSAuthenticator
    ];

    /**
     * Authenticates a record.
     *
     * The actual implementation is placed in a list of authenticators. The first authenticator
     * that can authenticate the record is used. The others are ignored.
     *
     * @param record Record
     * @param userId User id.
     * @param groupId Group id.
     *
     * @returns {String} A JSON-string of authentication errors. We use the same structure
     *                   as for validation errors.
     *
     * @name AuthenticatorEntryPoint#authenticateRecord
     */
    function authenticateRecord( record, userId, groupId ) {
        Log.trace( "Enter - AuthenticatorEntryPoint.authenticateRecord()" );

        try {
            var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );

            for( var i = 0; i < authenticators.length; i++ ) {
                var authenticator = authenticators[ i ];
                if( authenticator.canAuthenticate( marc, userId, groupId ) === true ) {
                    return JSON.stringify( authenticator.authenticateRecord( marc, userId, groupId ) );
                }
            }

            Log.warn( "Der eksisterer ikke en authenticator for denne post eller bruger." );
            Log.warn( "User/group: ", userId, " / ", groupId );
            Log.warn( "Posten:\n", record );
            return JSON.stringify( [ ValidateErrors.recordError( "", "Der eksisterer ikke en authenticator for denne post eller bruger." ) ] );
        }
        finally {
            Log.trace( "Exit - AuthenticatorEntryPoint.authenticateRecord()" );
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
        Log.trace( "Enter - AuthenticatorEntryPoint.recordDataForRawRepo()" );

        try {
            for( var i = 0; i < authenticators.length; i++ ) {
                var authenticator = authenticators[ i ];
                if( authenticator.canAuthenticate( record, userId, groupId ) === true ) {
                    return authenticator.recordDataForRawRepo( record, userId, groupId );
                }
            }

            Log.warn( "Der eksisterer ikke en authenticator for denne post eller bruger." );
            Log.warn( "User/group: ", userId, " / ", groupId );
            Log.warn( "Posten:\n", record );
            return [ record ];
        }
        finally {
            Log.trace( "Exit - AuthenticatorEntryPoint.recordDataForRawRepo()" );
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
        'recordDataForRawRepo': recordDataForRawRepo
    }
}();
