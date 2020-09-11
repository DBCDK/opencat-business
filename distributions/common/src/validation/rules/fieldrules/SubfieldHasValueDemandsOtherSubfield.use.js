use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");
use("ContextUtil");

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
     * @name SubfieldHasValueDemandsOtherSubfield.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter -- SubfieldHasValueDemandsOtherSubfield.validateField");
        ValueCheck.check("params.subfieldConditional", params.subfieldConditional);
        ValueCheck.check("params.subfieldConditionalValue", params.subfieldConditionalValue);
        ValueCheck.check("params.fieldMandatory", params.fieldMandatory);
        ValueCheck.check("params.subfieldMandatory", params.subfieldMandatory);
        try {
            var errorMsg = null;
            var result = [];
            var context = params.context;
            for (var i = 0; i < field.subfields.length; ++i) {
                if (field.subfields[i].name === params.subfieldConditional && field.subfields[i].value === params.subfieldConditionalValue) {
                    var conditionalField = ContextUtil.getValue(context, 'getFields', params.fieldMandatory);
                    if (conditionalField === undefined) {
                        conditionalField = ValidationUtil.getFields(record, params.fieldMandatory);
                        ContextUtil.setValue(context, conditionalField, 'getFields', params.fieldMandatory);
                    }
                    // TODO move this
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
                            errorMsg = getErrorMessage(params, field);
                            result.push(ValidateErrors.fieldError("TODO:fixurl", errorMsg));
                        }
                    } else {
                        errorMsg = getErrorMessage(params, field);
                        result.push(ValidateErrors.fieldError("TODO:fixurl", errorMsg));
                    }
                    break;
                }
            }
            return result;
        } finally {
            Log.trace("Enter -- SubfieldHasValueDemandsOtherSubfield.validateField");
        }
    }

    function getErrorMessage(params, field) {
        var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
        return ResourceBundle.getStringFormat(bundle, "subfield.has.value.demands.other.subfield.rule.error", params.subfieldConditional, field.name, params.subfieldConditionalValue, params.fieldMandatory, params.subfieldMandatory);
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
