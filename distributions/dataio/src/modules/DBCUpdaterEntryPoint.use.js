use("ClassificationData");
use("DanMarc2Converter");
use("DBCAuthenticator");
use("DefaultDoubleRecordHandler");
use("DefaultEnrichmentRecordHandler");
use("DefaultRawRepoRecordHandler");
use("Log");
use("Marc");
use("RecordSorting");
use("TemplateContainer");

EXPORTED_SYMBOLS = ['DBCUpdaterEntryPoint'];

/**
 * Module to contain entry points for the update API between Java and
 * JavaScript.
 *
 * @namespace
 * @name DBCUpdaterEntryPoint
 */
var DBCUpdaterEntryPoint = function () {

    /**
     * Checks if the classifications has changed between two records.
     *
     * @param {String} oldRecord The old record as a json.
     * @param {String} newRecord The new record as a json.
     *
     * @return {Boolean} true if the classifications has changed, false otherwise.
     */
    function hasClassificationsChanged(oldRecord, newRecord) {
        Log.trace("Enter - DBCUpdaterEntryPoint.hasClassificationsChanged()");
        var result;
        try {
            var oldMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(oldRecord));
            var newMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(newRecord));
            var instance = __createClassificationInstance(oldMarc, newMarc);
            result = ClassificationData.hasClassificationsChanged(instance, oldMarc, newMarc);
            return result;
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.hasClassificationsChanged(): " + result);
        }
    }

    /**
     * Creates a new library extended record based on a DBC record.
     *
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     * @param {int}    agencyId Library id for the local library.
     *
     * @return {String} A json with the new record.
     */
    function createLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, agencyId) {
        Log.trace("Enter - DBCUpdaterEntryPoint.createLibraryExtendedRecord()");
        var result;
        try {
            var currentCommonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(currentCommonRecord));
            var updatingCommonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(updatingCommonRecord));
            var instance = __createEnrichmentRecordHandlerInstance(currentCommonMarc, updatingCommonMarc);
            result = DefaultEnrichmentRecordHandler.createRecord(instance, currentCommonMarc, updatingCommonMarc, agencyId);
            result = JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result));
            return result;
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.createLibraryExtendedRecord(): " + result);
        }
    }

    /**
     * Updates a library extended record with the classifications from
     * a DBC record.
     *
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     * @param {String} enrichmentRecord The library record to update as a json.
     *
     * @return {String} A json with the updated record.
     */
    function updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord) {
        Log.trace("Enter - DBCUpdaterEntryPoint.updateLibraryExtendedRecord()");
        var result;
        try {
            var currentCommonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(currentCommonRecord));
            var updatingCommonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(updatingCommonRecord));
            var enrichmentMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(enrichmentRecord));
            var instance = __createEnrichmentRecordHandlerInstance(currentCommonMarc, updatingCommonMarc);
            result = DefaultEnrichmentRecordHandler.updateRecord(instance, currentCommonMarc, updatingCommonMarc, enrichmentMarc);
            result = JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result));
            return result;
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.updateLibraryExtendedRecord(): " + result);
        }
    }

    function correctLibraryExtendedRecord(commonRecord, enrichmentRecord) {
        Log.trace("Enter - DBCUpdaterEntryPoint.correctLibraryExtendedRecord()");
        var result;
        try {
            var commonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(commonRecord));
            var enrichmentMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(enrichmentRecord));
            Log.trace("Create instance with ClassificationData");
            var classificationsInstance = ClassificationData.create(UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS);
            var instance = DefaultEnrichmentRecordHandler.create(classificationsInstance, ClassificationData);
            result = DefaultEnrichmentRecordHandler.correctRecord(instance, commonMarc, enrichmentMarc);
            result = JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result));
            return result;
        }
        finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.correctLibraryExtendedRecord(): " + result);
        }
    }

    function checkDoubleRecord(record, settings) {
        Log.trace("Enter - DBCUpdaterEntryPoint.checkDoubleRecord");
        try {
            DefaultDoubleRecordHandler.checkAndSendMails(DanMarc2Converter.convertToDanMarc2(JSON.parse(record)), settings);
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.checkDoubleRecord");
        }
    }

    function sortRecord(templateName, record, settings) {
        Log.trace("Enter - DBCUpdaterEntryPoint.sortRecord");

        var templateProvider = function () {
            TemplateContainer.setSettings(settings);
            return TemplateContainer.get(templateName);
        };

        try {
            ResourceBundleFactory.init(settings);

            var recordSorted = RecordSorting.sort(templateProvider, JSON.parse(record));
            var marc = DanMarc2Converter.convertToDanMarc2(recordSorted);

            return JSON.stringify(DanMarc2Converter.convertFromDanMarc2(marc));
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.sortRecord");
        }
    }

    function __createClassificationInstance(currentRecord, newRecord) {
        Log.trace("Enter - DBCUpdaterEntryPoint.__createClassificationInstance");
        try {
            return ClassificationData.create(UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS);
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.__createClassificationInstance");
        }
    }

    function __createEnrichmentRecordHandlerInstance(currentCommonRecord, updatingCommonRecord) {
        Log.trace("Enter - DBCUpdaterEntryPoint.__createEnrichmentRecordHandlerInstance");
        var instance;
        try {
            Log.trace("Create instance with ClassificationData");
            var classificationsInstance = ClassificationData.create(UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS);
            instance = DefaultEnrichmentRecordHandler.create(classificationsInstance, ClassificationData);
            return instance;
        } finally {
            Log.trace("Exit - DBCUpdaterEntryPoint.__createEnrichmentRecordHandlerInstance(): " + instance);
        }
    }

    return {
        'hasClassificationsChanged': hasClassificationsChanged,
        'shouldCreateEnrichmentRecords': shouldCreateEnrichmentRecords,
        'createLibraryExtendedRecord': createLibraryExtendedRecord,
        'updateLibraryExtendedRecord': updateLibraryExtendedRecord,
        'correctLibraryExtendedRecord': correctLibraryExtendedRecord,
        'checkDoubleRecord': checkDoubleRecord,
        'sortRecord': sortRecord
    };
}();
