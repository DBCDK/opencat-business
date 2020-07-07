use("RawRepoClientCore");

EXPORTED_SYMBOLS = ['RawRepoClient'];

/**
 * This module gives access to a raw-repo of records.
 *
 * Each JS environment must provide a RawRepoCore module that implements the
 * actual access to the rawrepo.
 *
 * @namespace
 * @name RawRepoClient
 */
var RawRepoClient = function () {

    /**
     * Checks if a record exists in the rawrepo.
     *
     * @param {String} recordId  Record id.
     * @param {String} libraryNo Library no.
     *
     * @return {Boolean} true if the record exists, false otherwise.
     *
     * @name RawRepoClient#recordExists
     */
    function recordExists(recordId, libraryNo) {
        Log.debug("Enter - RawRepoClient.recordExists()");
        var result = null;
        try {
            Log.debug("Check if record [", recordId, ":", libraryNo, "] exists.");
            result = RawRepoClientCore.recordExists(recordId, libraryNo);
            return result;
        } catch (ex) {
            Log.error("Caught exception: ", ex);
            throw ex;
        } finally {
            Log.trace("Exit - RawRepoClient.recordExists(): ", result);
        }
    }

    /**
     * Fetches a record from the rawrepo.
     *
     * @param {String} recordId  Record id.
     * @param {String} libraryNo Library no.
     *
     * @return {Record} The record from the rawrepo if it can be fecthed, undefined otherwise.
     *
     * @name RawRepoClient#fetchRecord
     */
    function fetchRecord(recordId, libraryNo) {
        Log.trace("Enter - RawRepoClient.fetchRecord()");
        var result = null;
        try {
            Log.debug("Fetchrecord [", recordId, ":", libraryNo, "] from rawrepo");
            result = RawRepoClientCore.fetchRecord(recordId, libraryNo);
            return result;
        } catch (ex) {
            Log.error("Caught exception: ", ex);
            throw ex;
        } finally {
            Log.trace("Exit - RawRepoClient.fetchRecord(): ", result);
        }
    }

    /**
     * Returns all records that points to a specific record.
     *
     * @param {String}
     *          recordId  The record id of the record, that the records should be children of.
     * @param {Number}
     *          libraryNo The library number of the record, that the records should be children of.
     *
     * @returns {Array}
     *          Array of found childrens or an empty array if none could be found.
     *
     * @name RawRepoCore#getRelationsChildren
     */
    function getRelationsChildren(recordId, libraryNo) {
        Log.trace("Enter - RawRepoClient.getRelationsChildren()");
        var result = null;
        try {
            Log.debug("Fetch childrens of [", recordId, ":", libraryNo, "]");
            result = RawRepoClientCore.getRelationsChildren(recordId, libraryNo);
            return result;
        } catch (ex) {
            Log.error("Caught exception: ", ex);
            throw ex;
        } finally {
            Log.trace("Exit - RawRepoClient.getRelationsChildren(): ", result);
        }
    }

    return {
        'recordExists': recordExists,
        'fetchRecord': fetchRecord,
        'getRelationsChildren': getRelationsChildren
    };
}();
