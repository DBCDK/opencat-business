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
            var bundle = null;

            ValueCheck.checkThat("params", params).type("object");

            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            if (!params.subfields.length >= 2) {
                bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                Log.debug(ResourceBundle.getString(bundle, "conflictingSubfieldsParameterized.params.subfields.error"), params.subfields.length);
                throw ResourceBundle.getStringFormat(bundle, "conflictingSubfieldsParameterized.params.subfields.error", params.subfields.length);
            }

            // Transform the params.subfields to an array for faster lookup
            var subfieldsMap = {};
            for (var s = 0; s < params.subfields.length; s++) {
                var sf = params.subfields[s];
                subfieldsMap[sf] = '';
            }

            var foundFirstSubfield = false;

            for (var f = 0; f < field.subfields.length; f++) {
                if (subfieldsMap.hasOwnProperty(field.subfields[f].name)) {
                    if (foundFirstSubfield) { // second match -> return error
                        bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        result.push(ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "exclusive.subfield.parameterized.rule.error", field.subfields[f].name, params.subfields)));
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
