use("DBCAuthenticator");
use("DBCUpdaterEntryPoint");
use("DBCValidatorEntryPoint");

function initTemplates(settings) {
    DBCValidatorEntryPoint.initTemplates(settings);
}

function authenticateRecord(record, userId, groupId, settings) {
    return DBCAuthenticator.authenticateRecord(record, userId, groupId, settings);
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
    return DBCUpdaterEntryPoint.createLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, agencyId);
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
    return DBCUpdaterEntryPoint.updateLibraryExtendedRecord(currentCommonRecord, updatingCommonRecord, enrichmentRecord);
}

function correctLibraryExtendedRecord(commonRecord, enrichmentRecord) {
    return DBCUpdaterEntryPoint.correctLibraryExtendedRecord(commonRecord, enrichmentRecord);
}

function checkDoubleRecord(record, settings) {
    return DBCUpdaterEntryPoint.checkDoubleRecord(record, settings);
}

function sortRecord(templateName, record, settings) {
    return DBCUpdaterEntryPoint.sortRecord(templateName, record, settings);
}

/**
 * Gets the names of the templates as an Array
 *
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getValidateSchemas(groupId, settings) {
    return DBCValidatorEntryPoint.getValidateSchemas(groupId, settings);
}

/**
 * Checks if a template exists by its name.
 *
 * @param {String} name The name of the template.
 *
 * @return {Boolean} true if the template exists, false otherwise.
 */
function checkTemplate(name, groupId, settings) {
    return DBCValidatorEntryPoint.checkTemplate(name, groupId, settings);
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
    return DBCValidatorEntryPoint.validateRecord(templateName, record, settings);
}
