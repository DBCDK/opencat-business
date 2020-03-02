use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['Check042a'];

var Check042a = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * check042a is used to validate the value of  042a.
     *
     * @syntax Check042a.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name Check042a.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- Check042a.validateSubfield");
        try {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);


            var result = [];


            var subfieldName042a = subfield['name'];
            var subfieldValue042a = subfield['value'];
           // var len = subfieldValue035.length;
          //  var subfield035LastIndexOf = subfieldValue035.lastIndexOf(")");
            var msg;


            if (!subfieldValue042a.match (/^[0-9]*$/)){
                msg = ResourceBundle.getStringFormat(bundle, "check042a.validation.error");
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }





            return result;
        } finally {
            Log.trace("Exit --- Check042a.validateSubfield042a");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
