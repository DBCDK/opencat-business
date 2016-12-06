use("BasisSplitter");
use("DanMarc2Converter");
use("DefaultAuthenticator");
use("Log");
use("Marc");
use("MarcClasses");
use("OpenAgencyClient");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['DBCAuthenticator'];

/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name DBCAuthenticator
 */
var DBCAuthenticator = function () {
    var BUNDLE_NAME = "dbc-auth";

    /**
     * Authenticates a record.
     *
     * @param record Record
     * @param userId User id - not used.
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @name DBCAuthenticator#authenticateRecord
     */
    function authenticateRecord(record, userId, groupId, settings) {
        Log.trace("Enter - DBCAuthenticator.authenticateRecord()");
        var result = undefined;
        try {
            if (settings !== undefined) {
                ResourceBundleFactory.init(settings);
            }
            var authenticator = DefaultAuthenticator.create();
            var marcRecord = DanMarc2Converter.convertToDanMarc2(JSON.parse(record));
            result = authenticator.authenticateRecord(marcRecord, userId, groupId);
            return JSON.stringify(result);
        } finally {
            Log.trace("Exit - DBCAuthenticator.authenticateRecord(): " + result);
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
    }
}();
