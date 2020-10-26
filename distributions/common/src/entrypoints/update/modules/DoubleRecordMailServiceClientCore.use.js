use("Log");

EXPORTED_SYMBOLS = ['DoubleRecordMailServiceClientCore'];

/**
 *
 * @namespace
 * @name DoubleRecordMailServiceClientCore
 */
var DoubleRecordMailServiceClientCore = function () {
    var SERVICE_PROVIDER = getServiceProvider();

    function getServiceProvider() {
        Log.info("Getting DoubleRecordMailServicePackage..")
        try {
            Packages.dk.dbc.opencat.javascript.DoubleRecordMailService.exists();
            return Packages.dk.dbc.opencat.javascript.DoubleRecordMailService;
        }
        catch (ex) {
            return Packages.dk.dbc.updateservice.update.DoubleRecordMailService;
        }
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
