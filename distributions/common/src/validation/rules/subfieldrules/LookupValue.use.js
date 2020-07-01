use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['LookupValue'];

var LookupValue = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * lookupValue is used to validate a value exists or does not exist in a
     * register in the rawrepo.
     *
     * @syntax LookupValue.validateSubfield( record, field, subfield, params )
     *
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the value to validate
     * @param {object} params Object of params: "register" specifies the register
     *                        to lookup in solr as a String. "exist" is a boolean value.
     *                        If true when the sub field value must have hits in solr; false
     *                        means there must be 0 hits in solr.
     * @param {object} settings Settings object with the settings: SOLR_URL.
     *                          This should point to the base url of the
     *                          solr to perform the lookup against.
     * @return {Array} An array of validation errors in case the value of the
     *                 validated subfield results in zero/non-zero hits in solr.
     *
     * @name LookupValue.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params, settings) {
        Log.trace("Enter - LookupValue.validateSubfield");
        ValueCheck.checkThat("params", params).type("object");
        ValueCheck.checkThat("params['register']", params['register']).type("string");
        ValueCheck.checkThat("params['exist']", params['exist']).type("boolean");
        ValueCheck.checkThat("settings", params).type("object");
        try {
            var bundle;
            if (!settings.containsKey('SOLR_URL') && !settings.containsKey('solr.url')) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                throw ResourceBundle.getString(bundle, "lookup.value.missing.solr.url");
            }

            //TODO Remove temp hack
            var url = settings.get('SOLR_URL');
            if (url === null) {
                url = settings.get('solr.url');
            }
            if (url === undefined) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                throw ResourceBundle.getString(bundle, "lookup.value.undefined.solr.url");
            }

            var hits = 0;
            if (subfield.value !== "") {
                hits = Solr.numFound(url, StringUtil.sprintf("%s:\"%s\"", params.register, subfield.value));
            }

            var message;
            if (params.exist === true && hits === 0) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                message = ResourceBundle.getStringFormat(bundle, "lookup.value.expected.value", subfield.value, field.name, subfield.name);
                return [ValidateErrors.subfieldError("TODO:fixurl", message)];
            } else if (params.exist === false && hits !== 0) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                message = ResourceBundle.getStringFormat(bundle, "lookup.value.unexpected.value", subfield.value, field.name, subfield.name);
                return [ValidateErrors.subfieldError("TODO:fixurl", message)];
            }
            return [];
        } finally {
            Log.trace("Exit - LookupValue.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
