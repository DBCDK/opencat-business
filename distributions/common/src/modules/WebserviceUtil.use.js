use( "Http" );
use( "Log" );

EXPORTED_SYMBOLS = [ 'WebserviceUtil' ];

/**
 * @file Module to call webservices.
 *
 * @namespace
 * @name WebserviceUtil
 *
 */
var WebserviceUtil = function() {
    var openNumberRoll;

    function init( settings ) {
        Log.trace("init");
        openNumberRoll = settings.get( 'opennumberroll' );
    }

    /**
     * Calls openNumberRoll webservice and returns faust number.
     *
     * @syntax WebserviceUtil.getNewFaustNumberFromOpenNumberRoll()
     * @return {String} Faust number
     * @name WebserviceUtil.getNewFaustNumberFromOpenNumberRoll
     * @method
     */
    function getNewFaustNumberFromOpenNumberRoll() {
        Log.trace( "getNewFaustNumberFromOpenNumberRoll" );
        var headers = {
            'Content-type': 'application/xml;charset=utf-8'
        };
        var params = {};
        var responseString = Http.getNoProxy( openNumberRoll, params, headers, false );
        var response = JSON.parse( responseString );
        var res = "";
        if ( response.hasOwnProperty( "numberRollResponse" )
            && response["numberRollResponse"].hasOwnProperty( "rollNumber" )
            && response["numberRollResponse"]["rollNumber"].hasOwnProperty( "$" ) ) {
            res = response["numberRollResponse"]["rollNumber"]["$"];
        } else {
            throw "Could not find faustNumber in this response: " + responseString;
        }
        return res;
    }

    return {
        'init': init,
        'getNewFaustNumberFromOpenNumberRoll': getNewFaustNumberFromOpenNumberRoll
    };
}();
