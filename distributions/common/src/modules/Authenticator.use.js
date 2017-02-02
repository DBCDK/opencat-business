use("DanMarc2Converter");
use("DefaultAuthenticator");
use("Log");
use("ResourceBundleFactory");

EXPORTED_SYMBOLS = ['Authenticator'];

/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name Authenticator
 */
var Authenticator = function () {
    var BUNDLE_NAME = "default-auth";

    /**
     * Authenticates a record.
     *
     * @param record Record
     * @param userId User id - not used.
     * @param groupId Group id.
     * @param settings Settings collection
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @name Authenticator#authenticateRecord
     */
    function authenticateRecord(record, userId, groupId, settings) {
        Log.trace("Enter - Authenticator.authenticateRecord()");
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
            Log.trace("Exit - Authenticator.authenticateRecord(): " + result);
        }
    }

    return {
        'authenticateRecord': authenticateRecord
    }
}();
