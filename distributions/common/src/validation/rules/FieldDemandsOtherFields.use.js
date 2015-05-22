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
     * validateSubfield
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object with the following properties
     * source: Array of the field values that requires other fields to be present
     * demands: Array of the fields that must be present if either of the fields in sources is present
     * example params { "sources": [ "008", "009", "038", "039", "100", "239", "245", "652" ] , "demands": [ "008", "009", "245", "652" ] }
     * @return Array which is either empty or contains an error
     * @name FieldDemandsOtherFields
     * @method
     */
    function validateFields ( record, field, subfield, params, settings ) {
        Log.trace( "Enter - FieldDemandsOtherFields.validateFields" );
        try {

            ValueCheck.check( "record", record ).type( "object" );
            ValueCheck.check( "field", field ).type( "object" );
            ValueCheck.check( "params", params ).type( "object" );

            var checkedParams = __checkParams( params );
            if ( checkedParams.length > 0 ) {
                return checkedParams;
            }
            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
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
    function __checkParams ( params ) {
        Log.trace( "Enter - FieldDemandsOtherFields.__checkParams" );
        try {
            var ret = [];
            if ( params.hasOwnProperty( "sources" ) && params.hasOwnProperty( "demands" ) ) {
                if ( !Array.isArray( params.sources ) ) {
                    ret.push( ValidateErrors.recordError( "", "Params attributten sources er ikke af typen array" ) );
                    Log.warn( "params.sources is not of type array" );
                } else if ( params.sources.length < 1 ) {
                    ret.push( ValidateErrors.recordError( "", "Params attributten sources skal minimum indeholde een v\u00E6rdi" ) );
                    Log.warn( "params.sources is empty" );
                }
                if ( !Array.isArray( params.demands ) ) {
                    ret.push( ValidateErrors.recordError( "", "Params attributten demands er ikke af typen array" ) );
                    Log.warn( "params.demands is not of type array" );
                } else if ( params.demands.length < 1 ) {
                    ret.push( ValidateErrors.recordError( "", "Params attributten demands skal minimum indeholde een v\u00E6rdi" ) );
                    Log.warn( "params.demands is empty" );
                }
            } else if ( !params.hasOwnProperty( "sources" ) && !params.hasOwnProperty( "demands" ) ) {
                ret.push( ValidateErrors.subfieldError( "", "Params mangler sources og demands attribbuterne" ) );
            } else {
                if ( params.hasOwnProperty( "sources" ) && !params.hasOwnProperty( "demands" ) ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten sources er angivet men attributten demands mangler" ) );
                    Log.warn( "allowedSubfieldValues is missing" );
                } else if ( !params.hasOwnProperty( "sources" ) && params.hasOwnProperty( "demands" ) ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten demands er angivet men attributten sources mangler" ) );
                    Log.warn( "allowedSubfieldValues is missing" );
                }
            }
            return ret;
        }
        finally {
            Log.trace( "Exit - FieldDemandsOtherFields.__checkParams() with number of errors ", ret.length );
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
