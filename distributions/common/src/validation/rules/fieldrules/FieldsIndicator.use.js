//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['FieldsIndicator'];
//-----------------------------------------------------------------------------

var FieldsIndicator = function () {
    var BUNDLE_NAME = "validation";
    /**
     * fieldsIndicator checks whether an indicate has the value corresponding to the value given in params
     *
     * @syntax FieldsIndicator.validateFields( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params must contain a property 'indicator' with the valid indicator, e.g. { 'indicator': "00" }
     * @return {object}
     * @name FieldsIndicator.validateFields
     * @method
     */
    function validateFields( record, field, params, settings ) {
        Log.trace( "Enter - FieldsIndicator.validateFields( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            ValueCheck.check("params.indicator", params.indicator);
            if (field.indicator === params.indicator) {
                return result;
            }
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );
            var errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", field.indicator, params.indicator );
            var error = ValidateErrors.fieldError("TODO:url", errorMessage);
            return result = [error];
        }
        finally {
            Log.trace( "Exit - FieldsIndicator.validateFields(): ", result );
        }
    }
    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateFields' : validateFields
    };
}();
