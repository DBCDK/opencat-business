use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['SubfieldsMandatory'];

var SubfieldsMandatory = function () {
    var BUNDLE_NAME = "validation";

    /**
     * checks whether a subfield exists in the given field
     * @syntax SubfieldsMandatory.validateField( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with property subfields as an Array of names of mandatory subfields, e.g. { 'subfields': ['a', 'c'] }
     * @return {object}
     * @example SubfieldsMandatory.validateField( record, field, params )
     * @name SubfieldsMandatory.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter - SubfieldsMandatory.validateField( ", record, ", ", field, ", ", params, ", ", " )");

        var result = [];
        try {
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);
            for (var i = 0; i < params.subfields.length; ++i) {
                if (ValidationUtil.doesFieldContainSubfield(field, params.subfields[i]) === false) {
                    var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    var msg = ResourceBundle.getStringFormat(bundle, "mandatory.subfields.rule.error", params.subfields[i], field.name);
                    result.push(ValidateErrors.fieldError("TODO:url", msg));
                }
            }
            return result;
        } finally {
            Log.trace("Exit - SubfieldsMandatory.validateField(): ", result);
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
