//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UpdateConstants" );
use( "ValidateErrors" );
use ("ValidationUtil");

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['CheckYear'];

//-----------------------------------------------------------------------------
var CheckYear = function () {
    var __BUNDLE_NAME = "validation";


    /**
     * checkYear is used to validate a year. Content can be 0 to 4 digits followed by 0 to 4 ? marks.
     * valid examples : ???? 1??? 12?? 123? 2016
     * invalid examples : 19?2 19o3
     *
     * @syntax CheckYear.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name CheckYear.validateSubfield
     * @method
     */
    function validateSubfield( record, field, subfield, params ) {
        Log.trace( "Enter --- CheckYear.validateSubfield" );
        try {
            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

            var YEAR_LENGTH = 4;
            var result = [];
            var gotQmark = false;
            var subfieldValue = subfield['value'].replace(/\s/g,"");
            var subfieldName = subfield['name'];


            if ( subfieldValue.length != YEAR_LENGTH ) {
                result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.length.error", subfieldName, YEAR_LENGTH ) ) );
                return result;
            }

            for ( var i = 0 ; i < subfieldValue.length ; ++i ) {
                if ( subfieldValue[i] >= '0' && subfieldValue[i] <= '9' ) {
                    if ( gotQmark ) {
                        result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.order.error", subfieldName ) ) );
                        return result;
                    }
                } else {
                    if (subfieldValue[i] == '?') {
                        gotQmark = true;
                    } else {
                        result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.content.error", subfieldName ) ) );
                        return result;
                    }
                }
            }

            return result;
        } finally {
            Log.trace( "Exit --- CheckYear.validateSubfield" );
        }
    }
    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
