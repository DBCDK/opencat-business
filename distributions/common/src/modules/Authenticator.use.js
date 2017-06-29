use("DanMarc2Converter");
use("Log");
use("OpenAgencyClient");
use("RawRepoClient");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("ValidateErrors");

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
     * @name Authenticator#authenticateRecordEnrtyPoint
     */
    function authenticateRecordEntryPoint(record, userId, groupId, settings) {
        Log.trace("Enter - Authenticator.authenticateRecordEntryPoint()");
        var result = undefined;
        try {
            if (settings !== undefined) {
                ResourceBundleFactory.init(settings);
            }
            var marcRecord = DanMarc2Converter.convertToDanMarc2(JSON.parse(record));
            result = __authenticateCommonRecord(marcRecord, groupId);
            return JSON.stringify(result);
        } finally {
            Log.trace("Exit - Authenticator.authenticateRecordEntryPoint(): " + result);
        }
    }

    /**
     *
     * Handles the special case then a FBS library updates a common DBC record.
     *
     * @param record Record
     * @param groupId Group id.
     *
     * @returns {Array} Array of authentication errors. We use the same structure
     *                  as for validation errors.
     *
     * @private
     * @name Authenticator#__authenticateCommonRecord
     */
    function __authenticateCommonRecord(record, groupId) {
        Log.trace("Enter - Authenticator.__authenticateCommonRecord()");
        try {
            var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue(/001/, /b/);
            var owner = record.getValue(/996/, /a/);

            Log.info("Record agency: ", agencyId);
            Log.info("New owner: ", owner);

            if (!RawRepoClient.recordExists(recId, UpdateConstants.COMMON_AGENCYID)) {
                Log.debug("Checking authentication for new common record.");
                if (owner === "") {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "create.common.record.error"))];
                }
                if (owner !== groupId) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "create.common.record.other.library.error"))];
                }
                return [];
            }

            Log.debug("Checking authentication for updating existing common record.");
            var curRecord = RawRepoClient.fetchRecord(recId, UpdateConstants.COMMON_AGENCYID);
            var curOwner = curRecord.getValue(/996/, /a/);

            Log.info("Current owner: ", curOwner);
            if (curOwner === "DBC") {
                if (!OpenAgencyClient.hasFeature(groupId, UpdateConstants.AUTH_DBC_RECORDS)) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.owner.dbc.error"))];
                }
                return [];
            }

            if (curOwner === "RET") {
                if (!OpenAgencyClient.hasFeature(groupId, UpdateConstants.AUTH_RET_RECORD)) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error"))];
                }

                // IS-2214 Update: Katalogiseringsniveaucheck
                if (curRecord.getValue(/008/, /v/) !== "4" || record.getValue(/008/, /v/) !== "0") {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.katalogiseringsniveau.error"))];
                }
                return [];
            }

            if (owner === "") {
                return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.error"))];
            }

            if (OpenAgencyClient.hasFeature(curOwner, UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD)) {
                if (owner !== groupId) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.give.public.library.error"))];
                }

                if (!OpenAgencyClient.hasFeature(groupId, UpdateConstants.AUTH_PUBLIC_LIB_COMMON_RECORD)) {
                    return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.take.public.library.error"))];
                }
                return [];
            }

            if (!( owner === groupId && groupId === curOwner )) {
                return [ValidateErrors.recordError("", ResourceBundle.getString(bundle, "update.common.record.other.library.error"))];
            }

            return [];
        } finally {
            Log.trace("Exit - Authenticator.__authenticateCommonRecord()");
        }
    }

    return {
        'authenticateRecordEntryPoint': authenticateRecordEntryPoint,
        '__BUNDLE_NAME': BUNDLE_NAME
    }
}();
