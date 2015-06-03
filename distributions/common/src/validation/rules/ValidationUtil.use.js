//-----------------------------------------------------------------------------
use( "Log" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['ValidationUtil'];

//-----------------------------------------------------------------------------
var ValidationUtil = function () {
// stolen from this Stackoverflow accepted answer:
// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
// used by checkLength
    function isNumber ( n ) {
        return !isNaN( parseFloat( n ) ) && isFinite( n );
    }
    return {"isNumber": isNumber};
}();