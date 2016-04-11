//-----------------------------------------------------------------------------
use( "AuthenticateTemplate" );
use( "StopWatch" );
use( "TemplateContainer" );
use( "Validator" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'FBSValidatorEntryPoint' ];

//-----------------------------------------------------------------------------
/**
 * Module to contain entry points for the validator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name FBSValidatorEntryPoint
 */
var FBSValidatorEntryPoint = function() {
    /**
     * Gets the names of the templates as an Array
     *
     * @return {JSON} A json with the names of the templates. The names is returned
     *                as an Array.
     */
    function getValidateSchemas( groupId, settings ) {
        Log.trace( "Enter - FBSValidatorEntryPoint.getValidateSchemas( '", groupId, "', ", settings, " )" );

        var result = undefined;
        try {
            ResourceBundleFactory.init(settings);
            TemplateContainer.setSettings(settings);

            var schemas = TemplateContainer.getTemplateNames();
            var list = [];
            for( var i = 0; i < schemas.length; i++ ) {
                var schema = schemas[ i ];
                if( AuthenticateTemplate.canAuthenticate( groupId, TemplateContainer.getUnoptimized( schema.schemaName ) ) ) {
                    list.push( schema );
                }
            }

            return result = JSON.stringify( list );
        }
        finally {
            Log.trace( "Exit - FBSValidatorEntryPoint.getValidateSchemas(): ", result );
        }
    }

    /**
     * Checks if a template exists by its name.
     *
     * @param {String} name The name of the template.
     *
     * @return {Boolean} true if the template exists, false otherwise.
     */
    function checkTemplate( name, groupId, settings ) {
        Log.trace( StringUtil.sprintf( "Enter - checkTemplate( '%s' )", name ) );

        var result = null;
        try {
            ResourceBundleFactory.init( settings );
            TemplateContainer.setSettings( settings );

            var templateObj = TemplateContainer.getUnoptimized( name );
            if( templateObj !== undefined ) {
                return result = AuthenticateTemplate.canAuthenticate(groupId, templateObj);
            }

            return result = false;
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
                ResourceBundleFactory.init( settings );
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

