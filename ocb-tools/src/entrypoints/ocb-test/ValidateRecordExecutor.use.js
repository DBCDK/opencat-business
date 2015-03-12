//-----------------------------------------------------------------------------
use( "ValidatorEntryPoint" );
use( "Log" );

//-----------------------------------------------------------------------------
/**
 * Validates a record with a given template.
 *
 * @param {String} templateName The name of the template to use.
 * @param {String} record       The record to validator as a json.
 *
 * @return {String} A json string with an array of validation errors.
 */
function validateRecord( templateName, record, settings ) {
    Log.trace( "Enter - validateRecord()" );

    try {
        return ValidatorEntryPoint.validateRecord( templateName, record, settings );
    }
    finally {
        Log.trace( "Exit - validateRecord()" );
    }
}
