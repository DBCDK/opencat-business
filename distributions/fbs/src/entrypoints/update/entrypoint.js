use("FBSAuthenticator");
use("FBSUpdaterEntryPoint");
use("FBSValidatorEntryPoint");
use("Log");

function initTemplates(settings) {
    FBSValidatorEntryPoint.initTemplates(settings);
}

function authenticateRecord(record, userId, groupId, settings) {
    return FBSAuthenticator.authenticateRecord(record, userId, groupId, settings);
}

function isRecordInProduction(marc) {
    return FBSUpdaterEntryPoint.isRecordInProduction(marc);
}

function hasClassificationData(marc) {
    return FBSUpdaterEntryPoint.hasClassificationData(marc);
}

/**
 * Checks if the classifications has changed between two records.
 *
 * @param {String} oldRecord The old record as a json.
 * @param {String} newRecord The new record as a json.
 *
 * @return {Boolean} true if the classifications has changed, false otherwise.
 */
function hasClassificationsChanged(oldRecord, newRecord) {
    return FBSUpdaterEntryPoint.hasClassificationsChanged(oldRecord, newRecord);
}

function shouldCreateEnrichmentRecords(settings, currentRecord, updatingRecord) {
    return FBSUpdaterEntryPoint.shouldCreateEnrichmentRecords(settings, currentRecord, updatingRecord);
}

/**
 * Function that takes a record and creates a 512 notefield from the given data.
 *
 * @param {String} currentCommonRecord  The current record as a json.
 *
 * @return {String} A json with the new record.
 */

function recategorizationNoteFieldFactory(currentRecord) {
    return FBSUpdaterEntryPoint.recategorizationNoteFieldFactory(currentRecord, currentRecord);
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
function updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord) {
    return FBSUpdaterEntryPoint.updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord);
}

function correctLibraryExtendedRecord(commonRecord, enrichmentRecord) {
    return FBSUpdaterEntryPoint.correctLibraryExtendedRecord(commonRecord, enrichmentRecord);
}

function checkDoubleRecord(record, settings) {
    return FBSUpdaterEntryPoint.checkDoubleRecord(record, settings);
}

function checkDoubleRecordFrontend(record, settings) {
    return FBSUpdaterEntryPoint.checkDoubleRecordFrontend(record, settings);
}

function sortRecord(templateName, record, settings) {
    return FBSUpdaterEntryPoint.sortRecord(templateName, record, settings);
}

/**
 * Gets the names of the templates as an Array
 *
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getValidateSchemas(groupId, settings) {
    return FBSValidatorEntryPoint.getValidateSchemas(groupId, settings);
}

/**
 * Checks if a template exists by its name.
 *
 * @param {String} name The name of the template.
 *
 * @return {Boolean} true if the template exists, false otherwise.
 */
function checkTemplate(name, groupId, settings) {
    return FBSValidatorEntryPoint.checkTemplate(name, groupId, settings);
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
    return FBSValidatorEntryPoint.validateRecord(templateName, record, settings);
}
