//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use ("ValidationUtil");
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['CheckISBN13'];

//-----------------------------------------------------------------------------
var CheckISBN13 = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISBN13 is used to validate an ISBN 13 number.
     *
     * @syntax CheckISBN13.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN13 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISBN13.validateSubfield
     * @method
     */
    function validateSubfield( record, field, subfield, params ) {
        Log.trace( "Enter --- CheckISBN13.validateSubfield" );
        try {

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        //ValueCheck.checkUndefined( "params", params );
        var result = [];
        // removes dashes and trims the string
        var subfieldValue = subfield['value'].replace(/-/g,"");
        var subfieldName = subfield['name'];
        if ( !ValidationUtil.isNumber( subfieldValue ) ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn.numbers.error", subfieldName ) ) );
        } else if ( subfieldValue.length !== 13 ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.length.error", subfieldName ) ) );
        } else {
            var productSum = 0;
            var singleWeight = [1, 3];
            var weight = [];
            while ( subfieldValue.length > weight.length ) {
                weight = singleWeight.concat( weight );
            }
            for ( var i = 0; i < ( subfieldValue.length - 1 ); ++i ) {
                // Algorithm: http://en.wikipedia.org/wiki/International_Standard_Book_Number#Check_digits
                // We must iterate over all number and multiply them with n
                // where n alternates between 1 and 3.
                // Next all numbers must be added and that number modulo 10
                // must equal the last digit.
                // example:
                // 1. ISBN13 =             9-788793-038189
                // 2. checksum =           9
                // 3. clean & trimmed =    9 7 8 8 7 9 3 0 3 8 1 8 9
                // 4. multiply with        1 3 1 3 1 3 1 3 1 3 1 3
                // 5. result =             9+21+8+24+7+27+3+0+3+24+1+24 = 151
                // 6. product sum % 10 =   151 % 10 = 1
                // 7. validation           10 - 9 = 1 (checksum)
                productSum += parseInt( subfieldValue.charAt( i ) ) * weight[i]; //4
            }
            var checksum = parseInt( subfieldValue.charAt( subfieldValue.length - 1 ) ); // 2
            var x13 = ( 10 - productSum  % 10 ) % 10;
            if ( checksum !== x13 ) { // 7
                result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.invalid.error", subfieldName, subfield['value'] ) ) );
            }
        }
        return result;
    } finally {
            Log.trace( "Exit --- CheckISBN13.validateSubfield" );
        }
    }
    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
