//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['ExclusiveSubfield'];
//-----------------------------------------------------------------------------

var ExclusiveSubfield = function () {
    var BUNDLE_NAME = "validation";

    /**
     * exclusiveSubfield is used to validate that if subfield 'a' is present, then none
     * of 'i', 't', 'e', 'x' or 'b' must be present
     * @syntax ExclusiveSubfield.validateFields(  record, field, params  )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used, i.e. must be undefined
     * @return {object}
     * @name ExclusiveSubfield.validateFields
     * @method
     */
    function validateFields ( record, field, params ) {
        Log.trace( "Enter -- ExclusiveSubfield.validateFields" );
        try {
            // first count all subfields
            var counts = {};
            for ( var i = 0; i < field.subfields.length; ++i ) {
                var name = field.subfields[i].name;
                if ( !counts.hasOwnProperty( name ) ) {
                    counts[name] = 1;
                } else {
                    counts[name]++;
                }
            }
            var result = [];
            var a = 'a';
            var aExclusiveFields = ['i', 't', 'e', 'x', 'b'];
            // if there are any 'a's
            if ( counts.hasOwnProperty( a ) ) {
                var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

                // then check for aExclusiveFields
                for ( var j = 0; j < aExclusiveFields.length; ++j ) {
                    var name_ = aExclusiveFields[j];
                    if ( counts.hasOwnProperty( name_ ) ) {
                        result.push( ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", name_ ) ) );
                    }
                }
            }
            return result;
        } finally {
            Log.trace( "Exit -- ExclusiveSubfield.validateFields" );
        }
    }
    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateFields': validateFields
    };
}();
