use("Log");

EXPORTED_SYMBOLS = ['DoubleRecordMailServiceClientCore'];

/**
 *
 * @namespace
 * @name DoubleRecordMailServiceClientCore
 */
var DoubleRecordMailServiceClientCore = function () {
    var JNDI_NAME = "java:global/opencat-business-1.0-SNAPSHOT/DoubleRecordMailService";
    var JNDI_NAME_DEPRECATED = "java:global/updateservice-2.0-SNAPSHOT/DoubleRecordMailService";
    var SERVICE_PROVIDER = getServiceProvider();

    function getServiceProvider() {
        var context = new Packages.javax.naming.InitialContext();
        var serviceProvider;

        try {
            serviceProvider = context.lookup(JNDI_NAME);
        } catch (e) {
            Log.debug(JNDI_NAME + " not found. Trying " + JNDI_NAME_DEPRECATED)
            serviceProvider = context.lookup(JNDI_NAME_DEPRECATED);
        }
        Log.info("Using DoubleRecordMailService provider: ", serviceProvider);
        return serviceProvider;
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
