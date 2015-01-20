//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Marc" );
use( "MarcClasses" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'AuthenticatorEntryPoint' ];

//-----------------------------------------------------------------------------
var AuthenticatorEntryPoint = function() {
    function authenticateRecord( record, userId, groupId ) {
        Log.trace( "Enter - AuthenticatorEntryPoint.authenticateRecord()" );

        try {
            // DBC login can update any record
            if( groupId === "010100" ) {
                return true;
            }

            var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( record ) );
            var libId = marc.getValue(/001/, /b/);

            if( libId === groupId ) {
                return true;
            }

            Log.debug( "Try to update/delete non local record: ", libId, " !== ", groupId );
            return false;
        }
        finally {
            Log.trace( "Exit - AuthenticatorEntryPoint.authenticateRecord()" );
        }
    }

    return {
        'authenticateRecord': authenticateRecord
    }
}();
