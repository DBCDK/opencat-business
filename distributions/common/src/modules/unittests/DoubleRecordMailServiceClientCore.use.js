//-----------------------------------------------------------------------------
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DoubleRecordMailServiceClientCore' ];

//-----------------------------------------------------------------------------
/**
 * Core unittest module to send a mail for the double checker service.
 *
 * This module is used in unittests to mock out the DoubleRecordMailServiceClient
 * so we can run unittests without a mail server.
 *
 * @namespace
 * @name DoubleRecordMailServiceClientCore
 */
var DoubleRecordMailServiceClientCore = function() {
    var receivedMails = [];

    /**
     * Mock of sending a message.
     *
     * The message is stored in an internal array, that can be returned by
     * receivedMessages().
     *
     * @param subject {String} The subject of the message.
     * @param body    {String} Message body.
     *
     * @name DoubleRecordMailServiceClientCore#sendMessage
     */
    function sendMessage( subject, body ) {
        Log.trace( "Enter - DoubleRecordMailServiceClientCore.checkAndSendMails()" );

        try {
            receivedMails.push( {
                subject: subject,
                body: body
            } );
        }
        finally {
            Log.trace( "Exit - DoubleRecordMailServiceClientCore.checkAndSendMails()" );
        }
    }

    /**
     * Clear the internal array of send messages.
     *
     * @name DoubleRecordMailServiceClientCore#sendMessage
     */
    function clearMessages() {
        Log.trace( "Enter - DoubleRecordMailServiceClientCore.clearMessages()" );

        try {
            receivedMails = [];
        }
        finally {
            Log.trace( "Exit - DoubleRecordMailServiceClientCore.clearMessages()" );
        }
    }

    /**
     * Returns an array of send messages.
     *
     * @returns {Array} Array of send messages.
     */
    function receivedMessages() {
        Log.trace( "Enter - DoubleRecordMailServiceClientCore.receivedMessages()" );

        var result = undefined;
        try {
            return result = receivedMails;
        }
        finally {
            Log.trace( "Exit - DoubleRecordMailServiceClientCore.receivedMessages(): ", result );
        }
    }

    return {
        'sendMessage': sendMessage,
        'clearMessages': clearMessages,
        'receivedMessages': receivedMessages
    }
}();
