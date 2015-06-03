//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['SubfieldCannotContainValue'];

//-----------------------------------------------------------------------------
var SubfieldCannotContainValue = function () {
    var __BUNDLE_NAME = "validation";
    /**
     * subfieldCannotContainValue checks that if a given subfield does not contain the value from params
     * @syntax SubfieldRules.subfieldCannotContainValue( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object containing a property names values with an array of string values that the subfield may not contain
     * @return Array which is either empty or contains an error
     * @name SubfieldRules.subfieldCannotContainValue
     * @method
     */
    function validateSubfield ( record, field, subfield, params ) {
        Log.trace( "Enter --- SubfieldCannotContainValue.validateSubfield" );
        ValueCheck.check( "params.values", params.values );
        ValueCheck.check( "params", params.values ).instanceOf( Array );

        try {
            var ret = [];
            // implicit cast here as we want to check for both strings and ints
            // eg 1 equals '1'
            params.values.forEach( function ( value ) {
                if ( subfield.value == value ) {
                    var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
                    var errorMessage = ResourceBundle.getStringFormat( bundle, "subfield.cannot.contain.value.rule.error", subfield.name, subfield.value );
                    ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
                }
            });
            return ret;
        } finally {
            Log.trace( "Exit --- SubfieldCannotContainValue.validateSubfield" );
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
