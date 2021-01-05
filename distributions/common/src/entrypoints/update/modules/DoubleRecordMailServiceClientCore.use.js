use("Log");

EXPORTED_SYMBOLS = ['DoubleRecordMailServiceClientCore'];

/**
 *
 * @namespace
 * @name DoubleRecordMailServiceClientCore
 */
var DoubleRecordMailServiceClientCore = function () {
    var JNDI_NAME = "java:global/opencat-business-1.0-SNAPSHOT/DoubleRecordMailService";
    var SERVICE_PROVIDER = getServiceProvider();

    function getServiceProvider() {
        var context = new Packages.javax.naming.InitialContext();

        return context.lookup(JNDI_NAME);
    }

    function sendMessage(subject, body) {
        Log.trace("Enter - DoubleRecordMailServiceClientCore.sendMessage()");
        try {
            SERVICE_PROVIDER.sendMessage(subject, body);
        } finally {
            Log.trace("Exit - DoubleRecordMailServiceClientCore.sendMessage()");
        }
    }

    return {
        'sendMessage': sendMessage
    }
}();
