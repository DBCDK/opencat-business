use("Authenticator");
use("DefaultValidatorEntryPoint");
use("DefaultEnrichmentRecordHandler");
use("RecategorizationNoteFieldFactory");
use("RecordSorting");
use("Log");

function initTemplates(settings) {
    DefaultValidatorEntryPoint.initTemplates(settings);
}

function authenticateRecord(record, userId, groupId, settings) {
    return Authenticator.authenticateRecord(record, userId, groupId, settings);
}

function doRecategorizationThings(currentRecord, updateRecord, newRecord) {
    return DefaultEnrichmentRecordHandler.doRecategorizationThings(currentRecord, updateRecord, newRecord);
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
 * Function that takes a record and creates a 512 notefield from the given data.
 *
 * @param {String} currentCommonRecord  The current record as a json.
 *
 * @return {String} A json with the new record.
 */
function recategorizationNoteFieldFactory(currentCommonRecord) {
    return RecategorizationNoteFieldFactory.createNewNoteField(currentCommonRecord);
}