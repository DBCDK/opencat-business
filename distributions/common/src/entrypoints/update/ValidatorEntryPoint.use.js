//-----------------------------------------------------------------------------
use( "TemplateContainer" );
use( "Validator" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'ValidatorEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the validator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name ValidatorEntryPoint
 */
var ValidatorEntryPoint = function() {
    /**
     * Gets the names of the templates as an Array
     *
     * @return {JSON} A json with the names of the templates. The names is returned
     *                as an Array.
     */
    function getValidateSchemas( settings ) {
        TemplateContainer.setSettings( settings );

        return JSON.stringify( TemplateContainer.getTemplateNames( settings ) );
    }

    /**
     * Checks if a template exists by its name.
     *
     * @param {String} name The name of the template.
     *
     * @return {Boolean} true if the template exists, false otherwise.
     */
    function checkTemplate( name, settings ) {
        Log.trace( StringUtil.sprintf( "Enter - checkTemplate( '%s' )", name ) );

        var result = null;
        try {
            TemplateContainer.setSettings( settings );

            result = TemplateContainer.getUnoptimized( name ) !== undefined;
            return result;
        }
        catch( ex ) {
            Log.debug( "Caught exception -> returning false. The exception was: ", ex );

            result = false;
            return result;
        }
        finally {
            Log.trace( "Exit - checkTemplate(): " + result );
        }
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
        Log.trace( "Enter - validateRecord()" );

        try {
            var rec = JSON.parse( record );
            var templateProvider = function () {
                TemplateContainer.setSettings( settings );
                return TemplateContainer.get( templateName );
            };

            var result = null;

            try {
                result = Validator.validateRecord( rec, templateProvider, settings );
            }
            catch( ex ) {
                result = [ ValidateErrors.recordError( "", StringUtil.sprintf( "Systemfejl ved validering: %s", ex ) ) ];
            }

            return JSON.stringify( result );
        }
        finally {
            Log.trace( "Exit - validateRecord()" );
        }
    }

    return {
        'getValidateSchemas': getValidateSchemas,
        'checkTemplate': checkTemplate,
        'validateRecord': validateRecord
    }
}();

