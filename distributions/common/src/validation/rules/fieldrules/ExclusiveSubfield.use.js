use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['ExclusiveSubfield'];

var ExclusiveSubfield = function () {
    var BUNDLE_NAME = "validation";

    /**
     * exclusiveSubfield is used to validate that if subfield 'a' is present, then none
     * of 'i', 't', 'e', 'x' or 'b' must be present
     * @syntax ExclusiveSubfield.validateField(  record, field, params  )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used, i.e. must be undefined
     * @return {object}
     * @name ExclusiveSubfield.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter -- ExclusiveSubfield.validateField");
        try {
            // first count all subfields
            var counts = {};
            for (var i = 0; i < field.subfields.length; ++i) {
                var name = field.subfields[i].name;
                if (!counts.hasOwnProperty(name)) {
                    counts[name] = 1;
                } else {
                    counts[name]++;
                }
            }
            var result = [];
            var a = 'a';
            var aExclusiveFields = ['i', 't', 'e', 'x', 'b'];
            // if there are any 'a's
            if (counts.hasOwnProperty(a)) {
                var bundle = null;
                // then check for aExclusiveFields
                for (var j = 0; j < aExclusiveFields.length; ++j) {
                    var name_ = aExclusiveFields[j];
                    if (counts.hasOwnProperty(name_)) {
                        if (bundle === null) {
                            bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                        }
                        result.push(ValidateErrors.fieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "exclusive.subfield.rule.error", "a", name_)));
                    }
                }
            }
            return result;
        } finally {
            Log.trace("Exit -- ExclusiveSubfield.validateField");
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
