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

function doRecategorizationThings(currentRecord, updateRecord, newRecord) {
    return FBSUpdaterEntryPoint.doRecategorizationThings(currentRecord, updateRecord, newRecord);
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
