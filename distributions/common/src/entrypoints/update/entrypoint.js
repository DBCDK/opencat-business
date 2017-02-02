use("Authenticator");
use("FBSUpdaterEntryPoint");
use("DBCUpdaterEntryPoint");
use("DefaultValidatorEntryPoint");
use("RecordSorting");
use("Log");

function initTemplates(settings) {
    DefaultValidatorEntryPoint.initTemplates(settings);
}

function authenticateRecord(record, userId, groupId, settings) {
    return Authenticator.authenticateRecord(record, userId, groupId, settings);
}

/**
 * Gets the names of the templates as an Array
 *
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getValidateSchemas(groupId, libraryGroup, settings) {
    return DefaultValidatorEntryPoint.getValidateSchemas(groupId, libraryGroup, settings);
}

/**
 * Checks if a template exists by its name.
 *
 * @param {String} name The name of the template.
 *
 * @return {Boolean} true if the template exists, false otherwise.
 */
function checkTemplate(name, groupId, libraryGroup, settings) {
    return DefaultValidatorEntryPoint.checkTemplate(name, groupId, libraryGroup, settings);
}

/**
 * Validates a record with a given template.
 *
 * @param {String} templateName The name of the template to use.
 * @param {String} record       The record to validator as a json.
 *
 * @return {String} A json string with an array of validation errors.
 */
function validateRecord(templateName, record, settings) {
    return DefaultValidatorEntryPoint.validateRecord(templateName, record, settings);
}

function checkDoubleRecord(record, settings) {
    return DefaultDoubleRecordHandler.checkAndSendMails(DanMarc2Converter.convertToDanMarc2(JSON.parse(record)), settings);
}

function checkDoubleRecordFrontend(record, settings) {
    return DefaultDoubleRecordHandler.checkDoubleRecordFrontend(DanMarc2Converter.convertToDanMarc2(JSON.parse(record)), settings);
}

function sortRecord(templateName, record, settings) {
    return RecordSorting.sortRecord(templateName, record, settings);
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
function createLibraryExtendedRecordDBC(currentCommonRecord, updatingCommonRecord, agencyId) {
    return DBCUpdaterEntryPoint.createLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, agencyId);
}

function createLibraryExtendedRecordFBS(currentCommonRecord, updatingCommonRecord, agencyId) {
    return FBSUpdaterEntryPoint.createLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, agencyId);
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
function updateLibraryExtendedRecordDBC(currentCommonRecord, updatingCommonRecord, enrichmentRecord) {
    return DBCUpdaterEntryPoint.updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord);
}

function updateLibraryExtendedRecordFBS(currentCommonRecord, updatingCommonRecord, enrichmentRecord) {
    return FBSUpdaterEntryPoint.updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord);
}

/**
 *
 * @param commonRecord
 * @param enrichmentRecord
 * @returns {*}
 */
function correctLibraryExtendedRecordDBC(commonRecord, enrichmentRecord) {
    return DBCUpdaterEntryPoint.correctLibraryExtendedRecord(commonRecord, enrichmentRecord);
}

function correctLibraryExtendedRecordFBS(commonRecord, enrichmentRecord) {
    return FBSUpdaterEntryPoint.correctLibraryExtendedRecord(commonRecord, enrichmentRecord);
}

/**
 * Function that takes a record and creates a 512 notefield from the given data.
 *
 * @param {String} currentCommonRecord  The current record as a json.
 *
 * @return {String} A json with the new record.
 */
function recategorizationNoteFieldFactory(currentCommonRecord) {
    return FBSUpdaterEntryPoint.recategorizationNoteFieldFactory(currentCommonRecord);
}