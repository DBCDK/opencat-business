//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['FieldDemandsOtherFields'];
//-----------------------------------------------------------------------------

var FieldDemandsOtherFields = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * validateFields
     * Function that takes two arrays as parameters, demands and sources.
     * If any of the fieldnames in sources is present in the record, then all of the fields in the demands array must be presen.
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object with the following properties
     * sources: Array of the field names that requires other fields to be present
     * demands: Array of the fields that must be present if either of the fields in sources is present
     * example params { "sources": [ "008", "009", "038", "039", "100", "239", "245", "652" ] , "demands": [ "008", "009", "245", "652" ] }
     * @return Array which is either empty or contains an error
     * @name FieldDemandsOtherFields
     * @method validateFields
     */
    function validateFields ( record, field, subfield, params, settings ) {
        Log.trace( "Enter - FieldDemandsOtherFields.validateFields" );
        try {

            ValueCheck.check( "record", record ).type( "object" );
            ValueCheck.check( "field", field ).type( "object" );
            ValueCheck.check( "params", params ).type( "object" );

            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
            var checkedParams = __checkParams( params , bundle);
            if ( checkedParams.length > 0 ) {
                return checkedParams;
            }
            var fieldNamesAskeys = __getFieldNamesAskeys( record );
            return __checkFields( fieldNamesAskeys, params, bundle );
        } finally {
            Log.trace( "Exit - FieldDemandsOtherFields.validateFields" );
        }
    }

//-----------------------------------------------------------------------------
// Helper functions
//-----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// __checkFields
//-----------------------------------------------------------------------------
    function __checkFields ( fieldNames, params, bundle ) {
        Log.trace( "Enter - FieldDemandsOtherFields.__checkFields" );
        try {
            var existingSourceFields = [];
            var missingDemandFields = [];

            params.sources.forEach( function ( fieldName ) {
                if ( fieldNames.hasOwnProperty( fieldName ) ) {
                    existingSourceFields.push( fieldName );
                }
            } )
            if ( existingSourceFields.length > 0 ) {
                params.demands.forEach( function ( fieldName ) {
                    if ( !fieldNames.hasOwnProperty( fieldName ) ) {
                        missingDemandFields.push( fieldName );
                    }
                } )
            }
            if ( missingDemandFields.length > 0 ) {
                return [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.missing.values", existingSourceFields, missingDemandFields ) )];
            }
            return [];
        }
        finally {
            Log.trace( "Exit - FieldDemandsOtherFields.__checkFields" );
        }
    }
// -----------------------------------------------------------------------------
// __getFieldNamesAskeys
//-----------------------------------------------------------------------------
    function __getFieldNamesAskeys ( record ) {
        Log.trace( "Enter - FieldDemandsOtherFields.__getFieldNamesAskeys" );
        try {
            var ret = {}
            record.fields.forEach( function ( field ) {
                Object.defineProperty( ret, field.name, { enumerable: true } );
            })
            return ret;
        } finally {
            Log.trace( "Exit - FieldDemandsOtherFields.__getFieldNamesAskeys" );
        }
    }
// -----------------------------------------------------------------------------
// __checkParams
//-----------------------------------------------------------------------------
    function __checkParams ( params, bundle ) {
        Log.trace( "Enter - FieldDemandsOtherFields.__checkParams" );
        try {
            var ret = [];
            if ( !params.hasOwnProperty( "sources" ) && !params.hasOwnProperty( "demands" ) ) {
                Log.warn( "sources and demands params are missing" );
                return [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.missing.sources.and.demands" ))];
            }
            if ( !params.hasOwnProperty( "demands" ) ) {
                Log.warn( "params.demands is missing" );
                return [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.sources.missing.demands" ))];
            }
            if ( !params.hasOwnProperty( "sources" ) ) {
                Log.warn( "params.sources is missing" );
                return [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.demands.missing.sources" ))];
            }
            // check for wrong type and array.length
            if ( !Array.isArray( params.sources ) ) {
                ret.push( ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.sources.but.not.array" )));
                Log.warn( "params.sources is not of type array" );
            } else if ( Array.isArray( params.sources ) && params.sources.length < 1 ) {
                ret.push( ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.sources.length.0" )));
                Log.warn( "params.sources is empty" );
            }
            if ( !Array.isArray( params.demands ) ) {
                ret.push( ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.demands.but.not.array" )));
                Log.warn( "params.demands is not of type array" );
            } else if ( Array.isArray( params.demands ) &&  params.demands.length < 1 ) {
                ret.push( ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.having.demands.length.0" )));
                Log.warn( "params.demands is empty" );
            }
            return ret;
        }
        finally {
            Log.trace( "Exit - FieldDemandsOtherFields.__checkParams" );
        }
    }
//-----------------------------------------------------------------------------
// End helper functions
//-----------------------------------------------------------------------------
    return {
        'validateFields': validateFields,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}
();
