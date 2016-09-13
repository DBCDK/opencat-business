use( "Exception" );
use( "Log" );
use("RecordUtil");
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );

EXPORTED_SYMBOLS = ['UpperCaseCheck'];

var UpperCaseCheck = function () {
    var BUNDLE_NAME = "validation";
    /**
     * upperCaseCheck is used to check whether a subfield order is correct
     * meaning, a subfield uppercase name must be preceeded by a subfield with the same lowercase name
     * @syntax UpperCaseCheck.validateField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used
     * @return {object}
     * @name UpperCaseCheck.validateField
     * @method
     */
    function validateField( record, field, params, settings ) {
        Log.trace( "Enter - UpperCaseCheck.validateField( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );
            for (var i = 0; i < field.subfields.length; i++) {
                var name = field.subfields[i].name;
                if ( (name >= 'A' && name <= 'Z') || name == 'Æ' || name == 'Ø') {
                    if (field.subfields[i + 1] === undefined || name.toLowerCase() !== field.subfields[i + 1].name) {
                        var errorMessage = ResourceBundle.getStringFormat(bundle, "uppercase.rule.error", name, name.toLowerCase(), field.name);
                        result.push(ValidateErrors.fieldError('TODO:fixurl', errorMessage, RecordUtil.getRecordPid(record)));
                    }
                }
            }
            return result;
        } finally {
            Log.trace( "Exit - UpperCaseCheck.validateField(): ", result );
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateField' : validateField
    };
}();
