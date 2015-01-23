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
     * Changes the content of a record for update.
     *
     * The actual implementation is placed in a list of authenticators. The first authenticator
     * that can authenticate the record is used. The others are ignored.
     *
     * @param record Record
     * @param userId User id.
     * @param groupId Group id.
     *
     * @returns {Record} A new record with the new content.
     *
     * @name AuthenticatorEntryPoint#changeUpdateRecordForUpdate
     */
    function changeUpdateRecordForUpdate( record, userId, groupId ) {
        Log.trace( "Enter - AuthenticatorEntryPoint.changeUpdateRecordForUpdate()" );

        try {
            for( var i = 0; i < authenticators.length; i++ ) {
                var authenticator = authenticators[ i ];
                if( authenticator.canAuthenticate( record, userId, groupId ) === true ) {
                    return authenticator.changeUpdateRecordForUpdate( record, userId, groupId );
                }
            }

            Log.warn( "Der eksisterer ikke en authenticator for denne post eller bruger." );
            Log.warn( "User/group: ", userId, " / ", groupId );
            Log.warn( "Posten:\n", record );
            return record;
        }
        finally {
            Log.trace( "Exit - AuthenticatorEntryPoint.changeUpdateRecordForUpdate()" );
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
        'changeUpdateRecordForUpdate': changeUpdateRecordForUpdate
    }
}();
