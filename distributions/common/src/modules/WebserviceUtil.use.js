use("Http");
use("Log");

EXPORTED_SYMBOLS = ['WebserviceUtil'];

/**
 * @file Module to call webservices.
 *
 * @namespace
 * @name WebserviceUtil
 *
 */
var WebserviceUtil = function () {
    var openNumberRollUrl;
    var numberRollNameFaust8;
    var numberRollNameFaust;

    function init(settings) {
        Log.trace("init");
        openNumberRollUrl = String(settings.get('opennumberroll.url'));

        numberRollNameFaust8 = String(settings.get('opennumberroll.name.faust8'));
        numberRollNameFaust = String(settings.get('opennumberroll.name.faust'));
    }

    /**
     * Calls openNumberRoll webservice and returns faust number.
     *
     * @syntax WebserviceUtil.getNewFaustNumberFromOpenNumberRoll()
     * @return {String} Faust number
     * @name WebserviceUtil.getNewFaustNumberFromOpenNumberRoll
     * @method
     */
    function getNewFaustNumberFromOpenNumberRoll(type) {
        Log.trace("getNewFaustNumberFromOpenNumberRoll");
        var headers = {
            'Content-type': 'application/xml;charset=utf-8'
        };
        var params = {};

        var numberRollName;
        /*
        Temporarily commented out until we are ready to use 9 digit faust numbers for local records
        if (type === "faust8") {
            numberRollName = numberRollNameFaust8;
        } else {
            numberRollName = numberRollNameFaust;
        }
       */

        // Remove line below once we are ready to use 9 digit faust for local records
        numberRollName = numberRollNameFaust8;

        var url = openNumberRollUrl + '?action=numberRoll&numberRollName=' + numberRollName + '&outputType=json';
        var responseString = Http.getNoProxy(url, params, headers, false);
        var response = JSON.parse(responseString);
        var res = "";
        if (response.hasOwnProperty("numberRollResponse")
            && response["numberRollResponse"].hasOwnProperty("rollNumber")
            && response["numberRollResponse"]["rollNumber"].hasOwnProperty("$")) {
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
