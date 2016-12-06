use("DanMarc2Converter");
use("DefaultAuthenticator");
use("Log");
use("Marc");
use("MarcClasses");
use("NoteAndSubjectExtentionsHandler");
use("RawRepoClient");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("UpdateOwnership");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['FBSAuthenticator'];

/**
 * Module to contain entry points for the authenticator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name FBSAuthenticator
 */
var FBSAuthenticator = function () {
    var __BUNDLE_NAME = "fbs-auth";

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
     * @name FBSAuthenticator#authenticateRecord
     */
    function authenticateRecord(record, userId, groupId, settings) {
        Log.trace("Enter - FBSAuthenticator.authenticateRecord(", record, ", ", userId, ", ", groupId, ", ", settings, ")");
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
            Log.trace("Exit - FBSAuthenticator.authenticateRecord(): " + result);
        }
    }

    return {
        'authenticateRecord': authenticateRecord,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
