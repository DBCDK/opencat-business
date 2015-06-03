//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use ("ValidationUtil");
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['CheckISBN10'];

//-----------------------------------------------------------------------------
var CheckISBN10 = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * checkISBN10 is used to validate an ISBN 10 number.
     *
     * @syntax CheckISBN10.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name CheckISBN10.validateSubfield
     * @method
     */
    function validateSubfield( record, field, subfield, params ) {
        Log.trace( "Enter --- CheckISBN10.validateSubfield" );
        try {
        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        //ValueCheck.checkUndefined( "params", params );
        var result = [];
        var subfieldValue = subfield['value'].replace(/-/g,""); // removes dashes
        var subfieldName = subfield['name'];
        if ( !ValidationUtil.isNumber( subfieldValue.substring( 0, subfieldValue.length - 2 ) ) ||
            (!ValidationUtil.isNumber(subfieldValue.substring( subfieldValue.length - 1 ) ) && subfieldValue.substring( subfieldValue.length - 1 ).toLowerCase() !== 'x' ) ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn.numbers.error", subfieldName ) ) );
        } else if ( subfieldValue.length !== 10 ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.length.error", subfieldName ) ) );
        } else {
            // we must iterate the ISBN10 number string and multiply each number
            // with numbers 10 to 1.
            // 1. the product modulo 11 must be zero
            // 2. subfield value =     0-201-53082-1
            // 3. subfield trimmed =   0  2 0 1 5 3 0 8 2 1
            // 4. weight               10 9 8 7 6 5 4 3 2 1
            // 5. before summing =     0  1 0 7 3 1 0 2 4 1
            //                            8     0 5   4
            // 6. productsum =         0 + 18 + 0 + 7 + 30 + 15 + 0 + 24 + 4 + 1 = 99
            // 7. productsum % 11 =    99 % 11 = 0 = valid ISBN10
            // 8. last digit can be an x (ie. 10)
            var value = 0;
            for ( var i = 0; i < subfieldValue.length - 1; ++i ) {
                value += parseInt( subfieldValue.charAt( i ) ) * ( subfieldValue.length - i ); // 4, 5, 6
            }
            if ( subfieldValue.charAt( subfieldValue.length - 1 ).toLowerCase() === 'x' ) {
                value += 10; // 8
            } else {
                value += parseInt( subfieldValue.charAt( subfieldValue.length - 1 ) ); // 4, 5, 6
            }
            if ( value % 11 !== 0 ) { // 7
                result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.invalid.error", subfieldName, subfield['value'] ) ) );
            }
        }
        return result;
        } finally {
            Log.trace( "Exit --- CheckISBN10.validateSubfield" );
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
