use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['CheckLength'];

var CheckLength = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkLength is used to check the length of the value of a subfield,
     * an error is returned if the field is not validated
     *
     * @syntax CheckLength.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * TODO:params example.
     * @param {object} params contain either 'min' or 'max' or both values
     * param examples:
     * {'min' : 8}
     * {'max' : 8}
     * {'min' : 5,
     *  'max' : 10}
     * @return {object}
     * @name CheckLength.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckLength.validateSubfield");
        try {
            // these checks cannot easily be tested with CheckValue
            if (!params.hasOwnProperty('min') && !params.hasOwnProperty('max')) {
                Exception.throwError(20001, 'mindst et af min eller max skal være angivet');
            }
            if (params.hasOwnProperty('min') && params.hasOwnProperty('max')) {
                ValueCheck.checkThat("params['max']", params['max']).greaterEqualThan(params['min']);
            }
            var ret = [];
            if (params.hasOwnProperty('min')) {
                ret = __checkLengthMin(subfield, params, record);
            }
            if (ret.length === 0 && params.hasOwnProperty('max')) {
                ret = __checkLengthMax(subfield, params, record);
            }
            return ret;
        } finally {
            Log.trace("Exit --- CheckLength.validateSubfield");
        }
    }

    // utility function used by checkLength if params contains min value
    function __checkLengthMin(subfield, params, record) {
        var subfieldValueLength = subfield['value'].length;
        var subfieldName = subfield['name'];
        var paramsMin = params['min'];
        if (subfieldValueLength < paramsMin) {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "check.length.min.error", subfieldName, paramsMin);
            var error = ValidateErrors.subfieldError("TODO:fixurl", errorMessage);
            return [error];
        }
        return [];
    }

    // utility function used by checkLength if params contains max value
    function __checkLengthMax(subfield, params, record) {
        var subfieldValueLength = subfield['value'].length;
        var subfieldName = subfield['name'];
        var paramsMax = params['max'];
        if (subfieldValueLength > paramsMax) {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var errorMessage = ResourceBundle.getStringFormat(bundle, "check.length.max.error", subfieldName, paramsMax);
            var error = ValidateErrors.subfieldError("TODO:fixurl", errorMessage);
            return [error];
        }
        return [];
    }

    return {
        'validateSubfield': validateSubfield,
        "__checkLengthMax": __checkLengthMax,
        "__checkLengthMin": __checkLengthMin,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
