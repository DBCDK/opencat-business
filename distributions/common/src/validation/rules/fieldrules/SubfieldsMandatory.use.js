//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['SubfieldsMandatory'];
//-----------------------------------------------------------------------------

var SubfieldsMandatory = function () {
    var BUNDLE_NAME = "validation";

    /**
     * checks whether a subfield exists in the given field
     * @syntax SubfieldsMandatory.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with property subfields as an Array of names of mandatory subfields, e.g. { 'subfields': ['a', 'c'] }
     * @return {object}
     * @example SubfieldsMandatory.validateField( record, field, params )
     * @name SubfieldsMandatory.validateField
     * @method
     */
    function validateField( record, field, params, settings ) {
        Log.trace( "Enter - SubfieldsMandatory.validateField( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );
            for (var i = 0; i < params.subfields.length; ++i) {
                if (__doesFieldContainSubfield(field, params.subfields[i]) === false) {
                    result.push(ValidateErrors.fieldError("TODO:url", ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", params.subfields[i], field.name ) ) );
                }
            }
            return result;
        }
        finally {
            Log.trace( "Exit - SubfieldsMandatory.validateField(): ", result );
        }
    }

    // Helper function for determining is a subfield exists on a field
    function __doesFieldContainSubfield( field, subfieldName ) {
        Log.trace ( "RecordRules.__doesFieldContainSubfield" );
        for ( var i = 0 ; i < field.subfields.length ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                return true;
            }
        }
        return false;
    }
    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField' : validateField
    };
}();
