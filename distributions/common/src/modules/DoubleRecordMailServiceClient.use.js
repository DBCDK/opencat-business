//-----------------------------------------------------------------------------
use( "DoubleRecordMailServiceClientCore" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DoubleRecordMailServiceClient' ];

//-----------------------------------------------------------------------------
/**
 * Module to send a mail for the double checker service.
 *
 * @namespace
 * @name DoubleRecordMailServiceClient
 */
var DoubleRecordMailServiceClient = function() {
    function sendMessage( subject, body ) {
        Log.trace( "Enter - DoubleRecordMailServiceClient.checkAndSendMails()" );

        try {
            DoubleRecordMailServiceClientCore.sendMessage( subject, body );
        }
        finally {
            Log.trace( "Exit - DoubleRecordMailServiceClient.checkAndSendMails()" );
        }
    }

    return {
        'sendMessage': sendMessage
    }
}();
