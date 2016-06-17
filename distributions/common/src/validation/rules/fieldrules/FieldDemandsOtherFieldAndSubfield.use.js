//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );
use( "ValidationUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['FieldDemandsOtherFieldAndSubfield'];
//-----------------------------------------------------------------------------

var FieldDemandsOtherFieldAndSubfield = function () {
    var BUNDLE_NAME = "validation";
    /**
     * Function that checks if a field exists then another field must exists and contain the subfields from params.
     * @syntax FieldDemandsOtherFieldAndSubfield.validateField(  record , params  )
     * @param {Object} record The record as a json.
     * @param {Object} object
     * Param example :
     * params = {
     *     field : '096',
     *     subfields : ['z']
     * }
     * @name FieldDemandsOtherFieldAndSubfield.validateField
     * @returns an array which contains errors if any is present.
     * @method
     */
    function validateField ( record, field, params ) {
        Log.debug( "Enter - FieldDemandsOtherFieldAndSubfield.validateField( record, field,params,settings)" );
        Log.debug( "record ", record !== undefined ? JSON.stringify(record) : "undef" );
        Log.debug( "field ", field !== undefined ? JSON.stringify(field) : "undef" );
        Log.debug( "params ", params !== undefined ? JSON.stringify(params) : "undef" );

        var result = null;
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("record.fields", record.fields).instanceOf(Array);
            ValueCheck.check("params.field", params.field);
            ValueCheck.check("field", field);
            ValueCheck.check("field.name", field.name);
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            var message = "";
            var collectedFields = ValidationUtil.getFields(record, params.field);

            if (collectedFields.length === 0) {
                message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields );
                return result = [ValidateErrors.fieldError( "", message ) ];
            } else {

                for (var i = 0; i < collectedFields.length; ++i) {
                    var collectedSubFields = {};
                    for (var j = 0; j < collectedFields[i].subfields.length; ++j) {
                        collectedSubFields[collectedFields[i].subfields[j]] = true;
                    }
                    var ct = 0;
                    for (var k = 0; k < params.subfields.length; ++k) {
                        if (collectedSubFields.hasOwnProperty(params.subfields[k])) {
                            ct++;
                        }
                        if (ct === params.subfields.length) {
                            return result = [];
                        }
                    }
                }
            }
            message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields );
            return result = [ ValidateErrors.fieldError( "", message ) ];
        }
        finally {
            Log.debug( "Exit - FieldDemandsOtherFieldAndSubfield.validateField(): ", result !== undefined ? JSON.stringify(result) : "undef" );
        }
    }


    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField' : validateField
    };
}();
