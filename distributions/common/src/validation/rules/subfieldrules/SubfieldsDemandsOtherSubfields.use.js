use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['SubfieldsDemandsOtherSubfields'];

var SubfieldsDemandsOtherSubfields = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * subfieldsDemandsOtherSubfields is used to check that the subfield only contains
     * subfields of the given type, matched on subfield name
     * @syntax SubfieldsDemandsOtherSubfields.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldsDemandsOtherSubfields.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- SubfieldsDemandsOtherSubfields.validateSubfield");
        try {
            for (var i = 0; i < field.subfields.length; ++i) {
                if (field.subfields[i].name !== subfield.name) {
                    return [];
                }
            }
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "subfield.demands.other.subfields.rule.error", field.name, subfield.name);
            return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
        } finally {
            Log.trace("Exit --- SubfieldsDemandsOtherSubfields.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
