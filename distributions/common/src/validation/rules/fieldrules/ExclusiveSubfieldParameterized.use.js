use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['ExclusiveSubfieldParameterized'];

var ExclusiveSubfieldParameterized = function () {
    var BUNDLE_NAME = "validation";

    /**
     * exclusiveSubfieldParameterized is used to validate that only one subfields defined by the params are present
     * @syntax ExclusiveSubfieldParameterized.validateField(record, field, params)
     * @param {object} record
     * @param {object} field
     * @param {object} params list of exclusive values
     * @return {object}
     * @name ExclusiveSubfieldParameterized.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter -- ExclusiveSubfieldParameterized.validateField");
        try {
            var result = [];
            var subFields;
            var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);

            ValueCheck.checkThat("params", params).type("object");

            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            if (!params.subfields.length >= 2) {
                Log.debug(ResourceBundle.getString(bundle, "conflictingSubfieldsParameterized.params.subfields.error"), params.subfields);
                throw ResourceBundle.getStringFormat(bundle, "conflictingSubfieldsParameterized.params.subfields.error", params.subfields);
            }

            subFields = params.subfields;

            var foundFirstSubfield = false;

            for (var f = 0; f < field.subfields.length; f++) {
                if (subFields.indexOf(field.subfields[f].name) > -1) {
                    if (foundFirstSubfield) { // second match -> return error
                        result.push(ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "exclusive.subfield.paramterized.rule.error", field.subfields[f].name, subFields)));
                        return result;
                    } else {
                        foundFirstSubfield = true; // First match which is okay
                    }
                }
            }

            return result;
        } finally {
            Log.trace("Exit -- ExclusiveSubfieldParameterized.validateField");
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
