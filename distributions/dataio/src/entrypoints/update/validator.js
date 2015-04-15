//-----------------------------------------------------------------------------
use( "DBCValidatorEntryPoint" );

//-----------------------------------------------------------------------------

/**
 * Gets the names of the templates as an Array
 * 
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getValidateSchemas( settings ) {
	return DBCValidatorEntryPoint.getValidateSchemas( settings );
}

/**
 * Checks if a template exists by its name.
 * 
 * @param {String} name The name of the template.
 * 
 * @return {Boolean} true if the template exists, false otherwise.
 */
function checkTemplate( name, settings ) {
    return DBCValidatorEntryPoint.checkTemplate( name, settings );
}

/**
 * Validates a record with a given template.
 * 
 * @param {String} templateName The name of the template to use.
 * @param {String} record       The record to validator as a json.
 * 
 * @return {String} A json string with an array of validation errors.
 */
function validateRecord( templateName, record, settings ) {
    return DBCValidatorEntryPoint.validateRecord( templateName, record, settings );
}
