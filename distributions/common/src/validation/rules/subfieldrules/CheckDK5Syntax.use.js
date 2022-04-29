use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['CheckDK5Syntax'];

var CheckDK5Syntax = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * CheckDK5Syntax is used to validate the syntax of DK5 classification code in subfields in field 652
     *
     * @syntax CheckDK5Syntax.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the DK5 classification code to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckDK5Syntax.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckDK5Syntax.validateSubfield");
        try {
            var result = [];
            var subfieldValue = subfield['value'];
            var error = false;
            var msg;

            var subfieldValueStripped = subfieldValue.replace( /[\d\.]/g, "" );

            if( subfieldValue.match( /uden klassem|ny titel/i ) ) {
                error = false;
            }
            // Check if subfield value contains other chars than numbers and full stop
            else if( "" !== subfieldValueStripped ) {
                error = true;
            }
            // Else check syntax and possibly missing full stop
            else if( 2 > subfieldValue.length ) {
                error = true;
            }
            else if( 2 < subfieldValue.length ) {
                if( !subfieldValue.match( /^\d\d\.\d/ ) ) {
                    error = true;
                }
                else if( !subfieldValue.match( /\./ ) ) {
                    error = true;
                }
            }

            if ( error ) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "checkDK5Syntax.validation.error", field.name, subfield.name);
                result.push(ValidateErrors.subfieldError("TODO:fixurl", msg));
                return result;
            }

            return result;
        } finally {
            Log.trace("Exit --- CheckDK5Syntax.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
