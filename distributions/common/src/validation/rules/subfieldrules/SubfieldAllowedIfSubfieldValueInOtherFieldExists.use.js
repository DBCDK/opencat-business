use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ContextUtil")

EXPORTED_SYMBOLS = ['SubfieldAllowedIfSubfieldValueInOtherFieldExists'];

var SubfieldAllowedIfSubfieldValueInOtherFieldExists = function () {
    var BUNDLE_NAME = "validation";

    /**
     * This validation rule is used to validate that a subfield is only allowed in the record if another subfield
     * exist in the record and that required subfield has an allowed value.
     *
     * E.g. Subfield 245 *k is only allowed if subfield 009 *a exists and 009 *a has one of the these values: a, c, d
     *
     * @syntax SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubField(record, field, subfield, params)
     * @param record
     * @param field
     * @param subfield
     * @param params Must contain the following attributes: field, subfield and values
     * @returns {Array} Validation messages. Empty list means ok
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubField");
        var result = [];

        try {
            ValueCheck.check("params", params);
            ValueCheck.check("params.isObject", params).instanceOf(Object);
            ValueCheck.check("params.field", params.field);
            ValueCheck.check("params.subfield", params.subfield);
            ValueCheck.check("params.values", params.values);
            ValueCheck.check("params.values.isArray", params.values).instanceOf(Array);
            ValueCheck.check("params.context", params.context);
            ValueCheck.check("params.context.isObject", params.context).instanceOf(Object);

            var requiredField = params.field;
            var requiredSubfield = params.subfield;
            var requiredSubfieldValues = params.values;
            var hasRequiredSubfieldValue = false;

            var context = params.context;
            var fields = ContextUtil.getValue(context, 'fields', requiredField);

            if (fields === undefined) {
                fields = [];
                record.fields.forEach(function (recordField) {
                    if (recordField.name === requiredField) {
                        fields.push(recordField);
                    }
                });
                ContextUtil.setValue(context, fields, 'fields', requiredField);
            }

            for (var i = 0; i < fields.length; i++) {
                var recordField = fields[i];
                recordField.subfields.forEach(function (recordSubfield) {
                    if (recordSubfield.name === requiredSubfield) {
                        if (requiredSubfieldValues.indexOf(recordSubfield.value) > -1) {
                            hasRequiredSubfieldValue = true;
                        }
                    }
                });
            }

            if (!hasRequiredSubfieldValue) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var message = ResourceBundle.getStringFormat(bundle, "subfield.requires.other.subfield.value",
                    field.name, subfield.name, requiredField, requiredSubfield, requiredSubfieldValues);
                result.push(ValidateErrors.recordError("TODO:fixurl", message));
            }

            return result;
        } finally {
            Log.trace("Exit SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubField");
        }
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateSubfield': validateSubfield
    };
}();