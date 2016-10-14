use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['SubfieldConditionalMandatoryField'];

var SubfieldConditionalMandatoryField = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * subfieldConditionalMandatoryField checks that if a given subfield contains the value from params
     * then the field from params is mandatory
     * @syntax SubfieldConditionalMandatoryField.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params Object with properties subfieldValue, fieldMandatory, e.g. { 'subfieldValue': '0', 'fieldMandatory': '010' }
     * @return {object}
     * @name SubfieldConditionalMandatoryField.validateSubfield
     * @method
     */

    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- SubfieldConditionalMandatoryField.validateSubfield");
        try {
            ValueCheck.check("params.values", params.subfieldValue);
            ValueCheck.check("params.subfieldMandatory", params.fieldMandatory);
            if (subfield.value === params.subfieldValue) {
                // condition fulfilled, params.fieldMandatory is mandatory
                for (var i = 0; i < record.fields.length; ++i) {
                    if (record.fields[i].name === params.fieldMandatory) {
                        return [];
                    }
                }
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                var errorMessage = ResourceBundle.getStringFormat(bundle, "mandatory.field.conditional.rule.error", subfield.name, params.subfieldValue, params.fieldMandatory);
                return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
            }
            return [];
        } finally {
            Log.trace("Exit --- SubfieldConditionalMandatoryField.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
