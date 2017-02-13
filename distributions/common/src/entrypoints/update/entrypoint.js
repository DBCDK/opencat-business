use("Authenticator");
use("ValidatorEntryPoint");
use("EnrichmentRecordHandler");
use("RecategorizationNoteFieldFactory");
use("DoubleRecordHandler");
use("RecordSorting");
use("Log");

function initTemplates(settings) {
    ValidatorEntryPoint.initTemplates(settings);
}

function authenticateRecord(record, userId, groupId, settings) {
    return Authenticator.authenticateRecordEntryPoint(record, userId, groupId, settings);
}

function doRecategorizationThings(currentRecord, updateRecord, newRecord) {
    return EnrichmentRecordHandler.doRecategorizationThings(currentRecord, updateRecord, newRecord);
}

/**
 * Gets the names of the templates as an Array
 *
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getValidateSchemas(groupId, libraryGroup, settings) {
    return ValidatorEntryPoint.getValidateSchemas(groupId, libraryGroup, settings);
}

/**
 * Checks if a template exists by its name.
 *
 * @param {String} name The name of the template.
 *
 * @return {Boolean} true if the template exists, false otherwise.
 */
function checkTemplate(name, groupId, libraryGroup, settings) {
    return ValidatorEntryPoint.checkTemplate(name, groupId, libraryGroup, settings);
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
    return ValidatorEntryPoint.validateRecord(templateName, record, settings);
}

function checkDoubleRecord(record, settings) {
    return DoubleRecordHandler.checkAndSendMails(DanMarc2Converter.convertToDanMarc2(JSON.parse(record)), settings);
}

function checkDoubleRecordFrontend(record, settings) {
    return DoubleRecordHandler.checkDoubleRecordFrontend(DanMarc2Converter.convertToDanMarc2(JSON.parse(record)), settings);
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