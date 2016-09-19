//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['SubfieldValueMakesFieldsAllowed'];
//-----------------------------------------------------------------------------

var SubfieldValueMakesFieldsAllowed = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Checks that if the subfield has the value 'DBC'
     * then the fields in listOfAllowedSubfields are allowed in the record
     * @syntax SubfieldValueMakesFieldsAllowed.validateField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Array of allowed fields ['032', '990']
     * @return {object}
     * @example SubfieldValueMakesFieldsAllowed.validateField( record, field, subfield, params )
     * @name SubfieldValueMakesFieldsAllowed.validateField
     * @method
     */
    function validateSubfield ( record, field, subfield, params ) {
        Log.trace( "Enter SubfieldValueMakesFieldsAllowed.validateField" );
        try {
            ValueCheck.check( "params", params );
            ValueCheck.check( "params", params ).instanceOf( Array );

            if ( subfield.value === 'DBC' ) {
                return [];
            }
            return __checkForMatchingFields( record, subfield, params )
        } finally {
            Log.trace( "Exit SubfieldValueMakesFieldsAllowed.validateField" );
        }
    }

    function __checkForMatchingFields ( record, subfield, params ) {
        Log.trace( "Enter SubfieldValueMakesFieldsAllowed.__checkForMatchingFields" );
        try {
            for ( var i = 0; i < record.fields.length; i++ ) {
                for ( var j = 0; j < params.length; j++ ) {
                    if ( record.fields[i].name === params[j] ) {
                        var errorMessage = ResourceBundle.getStringFormat( ResourceBundleFactory.getBundle( BUNDLE_NAME ), "subfield.value.makes.field.allowed.rule.error", params[j], subfield.name );
                        return [ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage )];
                    }
                }
            }
            return [];
        } finally {
            Log.trace( "Exit SubfieldValueMakesFieldsAllowed.__checkForMatchingFields" );
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateSubfield': validateSubfield
    };
}();
