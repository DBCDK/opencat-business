use("Log");

EXPORTED_SYMBOLS = ['DoubleRecordMailServiceClientCore'];

/**
 *
 * @namespace
 * @name DoubleRecordMailServiceClientCore
 */
var DoubleRecordMailServiceClientCore = function () {
    var JNDI_NAME = "java:global/updateservice-2.0-SNAPSHOT/DoubleRecordMailService";

    function sendMessage(subject, body) {
        Log.trace("Enter - DoubleRecordMailServiceClientCore.sendMessage()");
        try {

            var context = new Packages.javax.naming.InitialContext();
            var serviceProvider = context.lookup(JNDI_NAME);
            serviceProvider.sendMessage(subject, body);
        } finally {
            Log.trace("Exit - DoubleRecordMailServiceClientCore.sendMessage()");
        }
    }

    return {
        'sendMessage': sendMessage
    }
}();
