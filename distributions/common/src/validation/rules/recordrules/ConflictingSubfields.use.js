use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateUrl");
use("ValidateErrors");
use("ValueCheck");

EXPORTED_SYMBOLS = ['ConflictingSubfields'];

var ConflictingSubfields = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Validation rule to checks that a subfield is not presented in the record at the
     * same time as another subfield.
     *
     * @syntax RecordRules.conflictingSubfields( record, params )
     *
     * @param {Object} record A DanMarc2 record as descriped in DanMarc2Converter
     * @param {Object} params Object of parameters. The property 'subfields' is an
     *                 Array of field/subfield names on the form <fieldname><subfieldname>.
     *
     * @return {Array}
     *
     * @name RecordRules.conflictingSubfields
     * @method
     */
    function validateRecord(record, params) {
        Log.trace("Enter - RecordRules.conflictingSubfields( ", record, ", ", params, " )");

        var result = [];
        try {
            var bundle;

            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            // Convert to Record so we can use its utility functions.
            var marc = DanMarc2Converter.convertToDanMarc2(record, params);

            // Array of found subfields. If this array contains 2 or more items, when we
            // have a validation error.
            var foundSubfields = [];

            for (var i = 0; i < params.subfields.length; i++) {
                var arg = params.subfields[i];
                if (arg.length !== 4) {
                    bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    Log.debug(ResourceBundle.getString(bundle, "conflictingSubfields.params.subfields.error"), arg, params.subfields);
                    throw ResourceBundle.getStringFormat(bundle, "conflictingSubfields.params.subfields.error", arg, params.subfields);
                }
                var fieldName = arg.substr(0, 3);
                var subfieldName = arg[3];

                marc.eachField(new RegExp(fieldName), function (field) {
                    field.eachSubField(new RegExp(subfieldName), function (field, subfield) {
                        if (foundSubfields.indexOf(arg) == -1) {
                            foundSubfields.push(arg)
                        }
                    })
                });

                if (foundSubfields.length > 1) {
                    bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    var message = ResourceBundle.getStringFormat(bundle, "conflictingSubfields.validation.error", foundSubfields[0], foundSubfields[1]);
                    return result = [ValidateErrors.recordError("TODO:fixurl", message)];
                }
            }

            return result;
        } finally {
            Log.trace("Exit - RecordRules.conflictingSubfields(): ", result);
        }
    }

    return {
        "validateRecord": validateRecord,
        "__BUNDLE_NAME": BUNDLE_NAME
    };
}();