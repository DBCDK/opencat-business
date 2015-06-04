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

    // Helper function for determining is a subfield exists on a field
    function doesFieldContainSubfield( field, subfieldName ) {
        Log.trace ( "RecordRules.__doesFieldContainSubfield" );
        for ( var i = 0 ; i < field.subfields.length ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                return true;
            }
        }
        return false;
    }
    // helper function
    // function that returns only the fields we are interested in
    // takes a fieldName and a record
    // and returns the fields that matches the name
    function getFields( record, fieldName ) {
        var ret = [];
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName )
                ret.push( record.fields[i] );
        }
        return ret;
    }
    function recordContainsField( record, fieldName ) {
        Log.trace ( "RecordRules.__recordContainsField" );
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                return true;
            }
        }
        return false;
    }

    return {"isNumber": isNumber,
            "doesFieldContainSubfield" : doesFieldContainSubfield,
            "getFields" : getFields,
            "recordContainsField" : recordContainsField };

}();