use("Exception");
use("Log");
use("RecordUtil");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['SubfieldHasValueDemandsOtherSubfield'];

var SubfieldHasValueDemandsOtherSubfield = function () {
    var BUNDLE_NAME = "validation";

    /**
     * subfieldHasValueDemandsOtherSubfield is used to validate that if field x has subfield y with value z
     * then field a and subfield b are mandatory.
     * @syntax SubfieldHasValueDemandsOtherSubfield.validateField(  record, field, params  )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with properties subfieldConditional, subfieldConditionalValue, fieldMandatory, subfieldMandatory
     *                        e.g. { 'subfieldConditional': 'y', 'subfieldConditionalValue': 'z', 'fieldMandatory': 'a', 'subfieldMandatory': 'b' }
     * @return {object}
     * @name FieldRules.exclusiveSubfield
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter -- SubfieldHasValueDemandsOtherSubfield.validateField");
        ValueCheck.check("params.subfieldConditional", params.subfieldConditional);
        ValueCheck.check("params.subfieldConditionalValue", params.subfieldConditionalValue);
        ValueCheck.check("params.fieldMandatory", params.fieldMandatory);
        ValueCheck.check("params.subfieldMandatory", params.subfieldMandatory);
        try {
            var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);

            var result = [];
            for (var i = 0; i < field.subfields.length; ++i) {
                if (field.subfields[i].name === params.subfieldConditional && field.subfields[i].value === params.subfieldConditionalValue) {
                    var conditionalField = ValidationUtil.getFields(record, params.fieldMandatory);
                    // TODO move this
                    var errorMsg = ResourceBundle.getStringFormat(bundle, "subfield.has.value.demands.other.subfield.rule.error", params.subfieldConditional, field.name, params.subfieldConditionalValue, params.fieldMandatory, params.subfieldMandatory);
                    var foundSubfield = false;
                    if (conditionalField.length > 0) {
                        for (i = 0; i < conditionalField.length; ++i) {
                            for (var j = 0; j < conditionalField[i].subfields.length; ++j) {
                                if (conditionalField[i].subfields[j].name === params.subfieldMandatory) {
                                    foundSubfield = true;
                                }
                            }
                        }
                        if (foundSubfield === false) {
                            result.push(ValidateErrors.fieldError("TODO:fixurl", errorMsg, RecordUtil.getRecordPid(record)));
                        }
                    } else {
                        result.push(ValidateErrors.fieldError("TODO:fixurl", errorMsg, RecordUtil.getRecordPid(record)));
                    }
                    break;
                }
            }
            return result;
        } finally {
            Log.trace("Enter -- SubfieldHasValueDemandsOtherSubfield.validateField");
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
