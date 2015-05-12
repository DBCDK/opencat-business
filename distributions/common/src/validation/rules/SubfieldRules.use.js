//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Exception" );
use( "Log" );
use( "Marc" );
use( "RawRepoClient" );
use( "RecordRules" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "Solr" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'SubfieldRules' ];

//-----------------------------------------------------------------------------
/**
 * Module for validation rules for subfields
 *
 * @namespace
 * @name SubfieldRules
 * @file SubfieldRules is part of the jsValidation, and validates on subfield level
 */
var SubfieldRules = function() {
    var __BUNDLE_NAME = "validation";

    /**
     * subfieldCannotContainValue checks that if a given subfield does not contain the value from params
     * @syntax SubfieldRules.subfieldCannotContainValue( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object containing a property names values with an array of string values that the subfield may not contain
     * @return Array which is either empty or contains an error
     * @name SubfieldRules.subfieldCannotContainValue
     * @method
     */

    function subfieldCannotContainValue( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.subfieldCannotContainValue" );
        ValueCheck.check( "params.values", params.values );
        ValueCheck.check( "params", params.values ).instanceOf( Array );
        var ret = [];
        // implicit cast here as the want to check for both strings and ints
        // eg 1 equals '1'
        params.values.forEach( function( value ) {
            if ( subfield.value == value) {
                var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

                var errorMessage = ResourceBundle.getStringFormat( bundle, "subfield.cannot.contain.value.rule.error", subfield.name, subfield.value );
                ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
            }
        } );
        return ret;
    }


    /**
     * subfieldConditionalMandatoryField checks that if a given subfield contains the value from params
     * then the field from params is mandatory
     * @syntax SubfieldRules.subfieldConditionalMandatoryField( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params Object with properties subfieldValue, fieldMandatory, e.g. { 'subfieldValue': '0', 'fieldMandatory': '010' }
     * @return {object}
     * @name SubfieldRules.subfieldConditionalMandatoryField
     * @method
     */


    function subfieldConditionalMandatoryField( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.subfieldConditionalMandatoryField" );

        ValueCheck.check( "params.values", params.subfieldValue );
        ValueCheck.check( "params.subfieldMandatory", params.fieldMandatory );

        if ( subfield.value === params.subfieldValue ) {
            // condition fulfilled, params.fieldMandatory is mandatory
            for ( var i = 0; i < record.fields.length; ++i ) {
                if ( record.fields[i].name === params.fieldMandatory ) {
                    return [];
                }
            }

            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

            var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.field.conditional.rule.error", subfield.name, params.subfieldValue, params.fieldMandatory );
            return [ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage )];
        }
        return [];
    }



    /**
     * subfieldsDemandsOtherSubfields is used to check that the subfield only contains
     * subfields of the given type, matched on subfield name
     * @syntax SubfieldRules.subfieldsDemandsOtherSubfields( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.subfieldsDemandsOtherSubfields
     * @method
     */
    function subfieldsDemandsOtherSubfields( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.subfieldsDemandsOtherSubfields" );
        for ( var i = 0 ; i < field.subfields.length ; ++i  ) {
            if ( field.subfields[i].name !== subfield.name ) {
                return [];
            }
        }

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
        var errorMessage = ResourceBundle.getStringFormat( bundle, "subfield.demands.other.subfields.rule.error", field.name, subfield.name );
        return [ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage )];
    }

    /**
     * CheckReference is used to check if the fields contains correct references
     * the function is invoked with a subfield which contains one of three forms of a formatted string
     * 1  = 700
     * 2  = 700/1
     * 3  = 700/1(a,b,c)
     * 1 ) its checked whether a 700 field exists with no å subfield
     * 2 ) field must exists and subfield å must contain the value after the backslash
     * 3 ) rule 2 + 3 and the field with the correct value in å must also contain the subfields denoted in the paranthesis
     * url Danmarc2 : http://www.kat-format.dk/danMARC2/Danmarc2.99.htm#pgfId=1575494
     *
     * @syntax SubfieldRules.checkReference( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.checkReference
     * @method
     */
    function checkReference( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.checkReference" );
        var ret = [];

        var fieldNameToCheck = subfield.value.slice( 0, 3 );// String
        var fields = getFields( record, fieldNameToCheck ); // array of fields which matches the firldNameToCheck
        var forwardslashValue = getValueFromForwardSlash( subfield.value ); // { containsValidValue: Boolean, Value: String }
        var subfieldValuesToCheck = getValuesToCheckFromparenthesis( subfield.value );// Array: String
        var containsParenthesisValues = subfieldValuesToCheck.length > 0;
        var errorMessage;

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        if ( fields.length < 1 ) {
            errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.field", fieldNameToCheck );
            return [(  ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) )];
        }

        // if the reference value is only 3 chars long the field referenced must exist without an å subfield
        if ( subfield.value.length === 3 ) {
            var subfieldWithoutAA = false;
            for ( var i = 0; i < fields.length && subfieldWithoutAA === false; ++i ) {
                if ( subfieldExistOnfield( fields[i], '\u00E5' ) === false ) {
                    subfieldWithoutAA = true;
                }
            }

            if ( subfieldWithoutAA === false ) {
                errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield.å", fieldNameToCheck );
                return [(  ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) )];
            }
        }

        if ( forwardslashValue.containsValidValue === true ) {
            var fieldsWithSubfield = matchValueFromForwardSlashToSubfieldValue( forwardslashValue.value, fields );
            if ( fieldsWithSubfield.length > 0 ) {
                if ( containsParenthesisValues === true ) {
                    ret = ret.concat( checkSubFieldValues( fieldsWithSubfield, subfieldValuesToCheck ) );
                }
            } else {
                errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.value", forwardslashValue.value, fields[0].name );
                ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
            }
        }
        return ret;
    }

    // helper function which returns an array of errors
    // checks if the fields supplied does not contain the subfields in the subfieldValuesToCheck
    function checkSubFieldValues( fieldsWithSubfield, subfieldValuesToCheck ) {
        var ret = [];
        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        var found = {};
        for ( var i = 0; i < fieldsWithSubfield.length; ++i ) {
            for ( var j = 0; j < fieldsWithSubfield[i].subfields.length; ++j ) {
                found[fieldsWithSubfield[i].subfields[j].name] = true;
            }
            subfieldValuesToCheck.forEach( function( val ) {
                val = val.trim();
                if ( val.length > 1 ) {
                    var nbr = val.slice( 1 );
                    var subfield = val.slice( 0, 1 );
                    var count = countSubfieldOccurrences( fieldsWithSubfield[i], subfield );
                    if ( count < nbr ) {
                        var errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.subfield.not.repeated", subfield, fieldsWithSubfield[i].name, nbr );
                        ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
                    }
                } else {
                    if ( !found.hasOwnProperty( val ) ) {
                        var errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", i + 1, fieldsWithSubfield[0].name, val );
                        ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
                    }
                }
            } );
        }
        return ret;
    }

    //helper function
    // takes two arguments
    // matchValue , String with the value that the å subfield must match
    // fields : array of fields to serahc through
    // returns an array of fields which has an å value
    function matchValueFromForwardSlashToSubfieldValue( matchValue, fields ) {
        var ret = [];
        for ( var i = 0; i < fields.length; ++i ) {
            for ( var j = 0; j < fields[i].subfields.length; ++j ) {
                if ( fields[i].subfields[j].name === '\u00E5' ) {
                    if ( fields[i].subfields[j].value === matchValue ) {
                        ret.push( fields[i] );
                    }
                }
            }
        }
        return ret;
    }
    // helper function
    // function that returns only the fields we are interested in
    // takes a fieldName and a record
    // and returns the fields that matches the name
    function getFields( record, fieldName ) {
        var ret = [];
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                ret.push( record.fields[i] );
            }
        }
        return ret;
    }

    // helper function that returns the value from the backslash part
    function getValueFromForwardSlash( subfieldValue ) {
        Log.trace( "SubfieldRules.getValueFromForwardSlash" );
        var value = {
            'containsValidValue' : false
        };
        var indexOfParenthesis = subfieldValue.indexOf( "(" );
        if ( subfieldValue.indexOf( "/" ) !== -1 ) {
            value.containsValidValue = true;
            if ( indexOfParenthesis !== -1 ) {
                value.value = subfieldValue.slice( subfieldValue.indexOf( "/" ) + 1, indexOfParenthesis );
            } else {
                value.value = subfieldValue.slice( subfieldValue.indexOf( "/" ) + 1 );
            }
        }
        return ( value );
    }

    // function that checks wheter an paranthesis is present
    // if it is , an array of the values in the paranthesis is returned.
    // if not an empty array will be returned
    function getValuesToCheckFromparenthesis( subfieldValue ) {
        Log.trace( "SubfieldRules.getValueToCheck" );
        var indexStartParenthesis = subfieldValue.indexOf( "(" );
        var ret = [];
        if ( indexStartParenthesis !== -1 ) {
            ret = subfieldValue.slice( indexStartParenthesis + 1, subfieldValue.lastIndexOf( ')' ) ).split( ',' );
        }
        return ret;
    }

    // helper function that checks if a subfield with a given value exists on the field
    function subfieldExistOnfield( field, subfieldName ) {
        Log.trace( "SubfieldRules.getValueToCheck" );
        var ret = false;
        for ( var i = 0 ; i < field.subfields.length && ret === false ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                ret = true;
            }
        }
        return ret;
    }

    // helper function to count number of specific subfield occurrences
    function countSubfieldOccurrences( field, subfieldName ) {
        Log.trace( "SubfieldRules.countSubfieldOccurrences" );
        var ret = 0;
        for ( var i = 0 ; i < field.subfields.length ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                ret++;
            } else {
            }
        }
        return ret;
    }

    /**
     * checkLength is used to check the length of the value of a subfield,
     * an error is returned if the field is not validated
     *
     * @syntax SubfieldRules.checkLength( record, field, subfield, params )
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
     * @name SubfieldRules.checkLength
     * @method
     */
    function checkLength(record, field, subfield, params){
        Log.trace( "SubfieldRules.checkLength" );
        // these checks cannot easily be tested with CheckValue
        if (!params.hasOwnProperty('min') && !params.hasOwnProperty('max')){
            Exception.throwError(20001, 'mindst et af min eller max skal være angivet');
        }
        if (params.hasOwnProperty('min') && params.hasOwnProperty('max')) {
            ValueCheck.checkThat( "params['max']", params['max'] ).greaterEqualThan( params['min'] );
        }
        var ret = [];
        if (params.hasOwnProperty('min')) {
            ret = checkLengthMin( subfield, params );
        }
        if (ret.length === 0 && params.hasOwnProperty('max')) {
            ret = checkLengthMax( subfield, params );
        }
        return ret;
    }


    /**
     * checkValue is used to check the value of a subfield, an error
     * is returned if the field is not validated
     *
     * @syntax SubfieldRules.checkValue( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params should contain an array of valid values named 'values'
     * param examples:
     * {'values': ["123", "234", "345", "456", "870970"]}
     * @return {object}
     * @name SubfieldRules.checkValue
     * @method
     */
    function checkValue(record, field, subfield, params) {
        Log.trace( "SubfieldRules.checkValue" );

        ValueCheck.checkThat( "params", params ).type( "object" );
        ValueCheck.checkThat( "params['values']", params['values'] ).instanceOf( Array );
        for (var i = 0; i < params.values.length; i++) {
            if (subfield.value === params.values[i]) {
                return [];
            }
        }

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        var errorMessage = ResourceBundle.getStringFormat( bundle, "check.value.rule.error", subfield.value, params.values.join("', '") );
        return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
    }

    /**
     * checkFaust is used to validate a faust number.
     *
     * @syntax SubfieldRules.checkFaust( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.checkFaust
     * @method
     */
    function checkFaust( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.checkFaust" );

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        //ValueCheck.checkUndefined( "params", params );
        var FAUST_MIN_LENGTH = 8;
        var result = [];
        var subfieldValue = subfield['value'].replace(/\s/g,"");
        var subfieldName = subfield['name'];
        if ( !isNumber( subfieldValue ) ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.digit.error", subfieldName ) ) );
        } else if ( subfieldValue.length < FAUST_MIN_LENGTH ) {
            result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.length.error", subfieldName, FAUST_MIN_LENGTH ) ) );
        } else {
            var singleWeight = [7, 6, 5, 4, 3, 2];
            var weight = [];
            while ( subfieldValue.length > weight.length ) {
                weight = singleWeight.concat( weight );
            }
            // we must iterate the faust number string, except for the last
            // one (which is a checksum value)
            // 1.  subfield[value] =    5 0 9 8 4 5 0 8
            // 2.  checksumValue =                    8
            // 3.  length -1 =          7
            // 4.  index                0 1 2 3 4 5 6
            //
            // 5.  weight     7 6 5 4 3 2 7 6 5 4 3  2
            // 6.  index      0 1 2 3 4 5 6 7 8 9 10 11
            // 7.  weight.length(12) - value.length(8-1) = 5
            // 8.  splice               5, 12
            // 9.  after splice         2 7 6 5 4 3 2
            // 10. subfield[value] =    5 0 9 8 4 5 0
            // 11. before summing       1 0 5 4 1 1 0
            //                          0   4 0 6 5 0
            // 12. productsum           10 + 0 + 54 + 40 + 16 + 15 + 0 = 135
            // 13. productsum % 11      135 % 11 = 3
            // 14. verification         8 + 3 = 11

            var value = 0;
            var lengthMinusOne = subfieldValue.length - 1; // 7
            weight = weight.splice( weight.length - lengthMinusOne, weight.length ); // 8, 9
            for ( var i = 0; i < lengthMinusOne; ++i ) {
                value += parseInt( subfieldValue.charAt( i ), 10 ) * weight[i]; // 11, 12
            }
            value = value % 11; // 13
            var checksumValue = parseInt( subfieldValue.charAt( subfieldValue.length - 1 ) );
            if ( value + checksumValue !== 11 && value !== 0 ) { // 14
                result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.error", subfieldName, subfieldValue ) ) );
            }
        }
        return result;
    }

    /**
     * checkISBN10 is used to validate an ISBN 10 number.
     *
     * @syntax SubfieldRules.checkISBN10( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN10 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.checkISBN10
     * @method
     */
    function checkISBN10( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.checkISBN10" );

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        //ValueCheck.checkUndefined( "params", params );
        var result = [];
        var subfieldValue = subfield['value'].replace(/-/g,""); // removes dashes
        var subfieldName = subfield['name'];
        if ( !isNumber( subfieldValue.substring( 0, subfieldValue.length - 2 ) ) ||
                (!isNumber(subfieldValue.substring( subfieldValue.length - 1 ) ) && subfieldValue.substring( subfieldValue.length - 1 ).toLowerCase() !== 'x' ) ) {
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
    }

    /**
     * checkISBN13 is used to validate an ISBN 13 number.
     *
     * @syntax SubfieldRules.checkISBN13( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN13 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.checkISBN13
     * @method
     */
    function checkISBN13( record, field, subfield, params ) {
        Log.trace( "SubfieldRules.checkISBN13" );

        var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

        //ValueCheck.checkUndefined( "params", params );
        var result = [];
        // removes dashes and trims the string
        var subfieldValue = subfield['value'].replace(/-/g,"");
        var subfieldName = subfield['name'];
        if ( !isNumber( subfieldValue ) ) {
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
            //printn("productSum % 10               =", productSum % 10 );
            //printn("10 - productSum  % 10         =", 10 - productSum % 10 );
            //printn("( 10 - productSum  % 10 ) % 10=", ( 10 - productSum  % 10 ) % 10 );
            //printn("subfieldvalue=", subfieldValue, ", checksum=", checksum, ",x13=", x13);
            if ( checksum !== x13 ) { // 7
                result.push( ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.invalid.error", subfieldName, subfield['value'] ) ) );
            }
        }
        return result;
    }

    /**
     * checkChangedValue is used to validate that a value only changes by certain criteria.
     *
     * @syntax SubfieldRules.checkChangedValue( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the ISBN13 field to validate
     * @param {object} params is not used
     * @return {object}
     * @name SubfieldRules.checkChangedValue
     * @method
     */
    function checkChangedValue( record, field, subfield, params ) {
        Log.trace( "Enter - SubfieldRules.checkChangedValue" );

        ValueCheck.checkThat( "params", params ).type( "object" );
        ValueCheck.checkThat( "params['fromValues']", params['fromValues'] ).instanceOf( Array );
        ValueCheck.checkThat( "params['toValues']", params['toValues'] ).instanceOf( Array );

        try {
        	var marcRecord = DanMarc2Converter.convertToDanMarc2( record );
        	var recId = marcRecord.getValue( /001/, /a/ );
            var libNo = marcRecord.getValue( /001/, /b/ );

	        if( !RawRepoClient.recordExists( recId, libNo ) ) {
	        	Log.debug( "Record is new!" )
	        	return [];
	        }

	        var oldRecord = RawRepoClient.fetchRecord( recId, libNo );
	        Log.debug( "Record is being updated!" );
	        Log.debug( "Old record:\n" + oldRecord );
	        var oldValue = oldRecord.getValue( new RegExp( field.name ), new RegExp( subfield.name ) );
	        Log.debug( field.name + subfield.name + ": " + oldValue + " -> " + subfield.value );
	        if( params.fromValues.indexOf( oldValue ) > -1 && params.toValues.indexOf( subfield.value ) > -1 ) {
                var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
	        	var msg = ResourceBundle.getStringFormat( bundle, "check.changed.value.error", field.name, subfield.name, oldValue, subfield.value );

				Log.debug( "Found validation error: " + msg );
				return [ ValidateErrors.subfieldError( "TODO:fixurl", msg ) ];

	        }
	        return [];
        }
        finally {
            Log.trace( "Exit - SubfieldRules.checkChangedValue" );
        }
    }

    /**
     * Checks if this subfield exists in multivolume work. If it exist
     * a validation error is returned.
     *
     * @param {Object} record A DanMarc2 record as descriped in DanMarc2Converter
     * @param {Object} field A DanMarc2 field as descriped in DanMarc2Converter
     * @param {Object} subfield The DanMarc2 subfield being validated as descriped
     *                 in DanMarc2Converter
     * @param {Object} params Not used.
     * @param {Object} settings Not used.
     * @return {Array} An array of validation errors in case the value of the
     *                 validated subfield results in zero/non-zero hits in solr.
     *
     * @name SubfieldRules.checkSubfieldNotUsedInParentRecord
     * @method
     */
    function checkSubfieldNotUsedInParentRecord( record, field, subfield, params, settings ) {
        Log.trace( "Enter - SubfieldRules.checkSubfieldNotUsedInParentRecord" );

        try {
        	var marcRecord = DanMarc2Converter.convertToDanMarc2( record );

            // If the point does not has a parent, when we are fine.
        	if( !marcRecord.existField( /014/ ) ) {
        	    return [];
        	}

        	var recId = marcRecord.getValue( /014/, /a/ );
        	var libNo = marcRecord.getValue( /001/, /b/ );

            // If parent record does not exist then we are fine.
	        if( !RawRepoClient.recordExists( recId, libNo ) ) {
	        	Log.debug( "Parent record does not exist!" );
	        	return [];
	        }

            // Load parent record and check if this subfield is used.
	        var parentRecord = RawRepoClient.fetchRecord( recId, libNo );
            if( parentRecord.existField( new MatchField( RegExp( field.name ), undefined, RegExp( subfield.name ) ) ) ) {
                var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );
                var message = ResourceBundle.getStringFormat( bundle, "subfield.in.parent.record.error", field.name, subfield.name, recId );

                return [ ValidateErrors.subfieldError( "TODO:fixurl", message ) ];
            }

            // Recursively check the parent record for the subfield.
            var parentRec = DanMarc2Converter.convertFromDanMarc2( parentRecord );
            return checkSubfieldNotUsedInParentRecord( parentRec, field, subfield, params, settings );
        }
        finally {
            Log.trace( "Exit - SubfieldRules.checkSubfieldNotUsedInParentRecord" );
        }
    }

    function checkSubfieldNotUsedInChildrenRecords( record, field, subfield, params, settings ) {
        Log.trace( "Enter - SubfieldRules.checkSubfieldNotUsedInChildrenRecords" );

        try {
            var marcRecord = DanMarc2Converter.convertToDanMarc2( record );

            var recId = marcRecord.getValue( /001/, /a/ );
            var libNo = marcRecord.getValue( /001/, /b/ );

            var children = RawRepoClient.getRelationsChildren( recId, libNo );
            Log.trace( "Children: ", uneval( children ) );
            if( children.length === 0 ) {
                Log.trace( "Returns []: No children found." );
                return [];
            }

            for( var i = 0; i < children.length; i++ ) {
                var rec = children[ i ];
                if( rec.existField( new MatchField( RegExp( field.name ), undefined, RegExp( subfield.name ) ) ) ) {
                    var message = StringUtil.sprintf( "Delfelt %s%s m\u00E5 kun anvendes i en post i et flerbindsv\u00E6k",
                        field.name, subfield.name );
                    Log.trace( "Found error in record [", recId, ":", libNo, "]: ", message );
                    return [ ValidateErrors.subfieldError( "TODO:fixurl", message ) ];
                }

                var result = checkSubfieldNotUsedInChildrenRecords( DanMarc2Converter.convertFromDanMarc2( rec ), field, subfield, params, settings );
                if( result.length !== 0 ) {
                    Log.trace( "Validation errors found in children records: ", uneval( result ) );
                    return result;
                }
            }

            return [];
        }
        finally {
            Log.trace( "Exit - SubfieldRules.checkSubfieldNotUsedInChildrenRecords" );
        }
    }

    /**
     * lookupValue is used to validate a value exists or does not exist in a
     * register in the rawrepo.
     *
     * @syntax SubfieldRules.lookupValue( record, field, subfield, params )
     *
     * @param {object} record
     * @param {object} field
     * @param {object} subfield Subfield containing the value to validate
     * @param {object} params Object of params: "register" specifies the register
     *                        to lookup in solr as a String. "exist" is a boolean value.
     *                        If true when the sub field value must have hits in solr; false
     *                        means there must be 0 hits in solr.
     * @param {object} settings Settings object with the settings: solr.url.
     *                          This should point to the base url of the
     *                          solr to perform the lookup against.
     * @return {Array} An array of validation errors in case the value of the
     *                 validated subfield results in zero/non-zero hits in solr.
     *
     * @name SubfieldRules.lookupValue
     * @method
     */
    function lookupValue( record, field, subfield, params, settings ) {
        Log.trace( "Enter - SubfieldRules.lookupValue" );

        ValueCheck.checkThat( "params", params ).type( "object" );
        ValueCheck.checkThat( "params['register']", params['register'] ).type( "string" );
        ValueCheck.checkThat( "params['exist']", params['exist'] ).type( "boolean" );
        ValueCheck.checkThat( "settings", params ).type( "object" );

        try {
            if( !settings.containsKey( 'solr.url' ) ) {
                throw "Settings does not contain the key 'solr.url'";
            }

            var url = settings.get( 'solr.url' );
            if( url === undefined ) {
                throw "Settings 'solr.url' is set to undefined";
            }

            var hits = 0;
            if( subfield.value !== "" ) {
                hits = Solr.numFound( url, StringUtil.sprintf( "%s:\"%s\"", params.register, subfield.value ) );
            }

            if( params.exist === true && hits === 0 ) {
                var message = StringUtil.sprintf( "V\u00E6rdien %s (delfelt %s%s) kan ikke findes i en eksisterende post.",
                                                  subfield.value, field.name, subfield.name );
                return [ ValidateErrors.subfieldError( "TODO:fixurl", message ) ];
            }
            else if( params.exist === false && hits !== 0 ) {
                var message = StringUtil.sprintf( "V\u00E6rdien %s (delfelt %s%s) findes allerede i en eksisterende post.",
                                                  subfield.value, field.name, subfield.name );
                return [ ValidateErrors.subfieldError( "TODO:fixurl", message ) ];
            }

            return [];
        }
        finally {
            Log.trace( "Exit - SubfieldRules.lookupValue" );
        }
    }

    // utility function used by checkLength if params contains min value
    function checkLengthMin( subfield, params ) {
        var subfieldValueLength = subfield['value'].length;
        var subfieldName = subfield['name'];
        var paramsMin = params['min'];
        if ( subfieldValueLength < paramsMin ) {
            var errorMessage = 'delfelt "' + subfieldName + '" er mindre end "' + paramsMin + '" tegn langt';
            var error = ValidateErrors.subfieldError( "TODO:fixurl", errorMessage );
            return [error];
        }
        return [];
    }
    // utility function used by checkLength if params contains max value
    function checkLengthMax( subfield, params ) {
        var subfieldValueLength = subfield['value'].length;
        var subfieldName = subfield['name'];
        var paramsMax = params['max'];
        if ( subfieldValueLength > paramsMax ) {
            var errorMessage = 'delfelt "' + subfieldName + '" er mere end "' + paramsMax + '" tegn langt';
            var error = ValidateErrors.subfieldError( "TODO:fixurl", errorMessage );
            return [error];
        }
        return [];
    }

    // stolen from this Stackoverflow accepted answer:
    // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    // used by checkLength
    function isNumber( n ) {
        return !isNaN( parseFloat( n ) ) && isFinite( n );
    }

    return {
        'subfieldsDemandsOtherSubfields' : subfieldsDemandsOtherSubfields,
        'subfieldConditionalMandatoryField' :  subfieldConditionalMandatoryField,
        'subfieldCannotContainValue' : subfieldCannotContainValue,
        'checkReference' :checkReference,
        'checkLength': checkLength,
        'checkValue': checkValue,
        'checkFaust': checkFaust,
        'checkISBN10': checkISBN10,
        'checkISBN13': checkISBN13,
        'checkChangedValue': checkChangedValue,
        'checkSubfieldNotUsedInParentRecord': checkSubfieldNotUsedInParentRecord,
        'checkSubfieldNotUsedInChildrenRecords': checkSubfieldNotUsedInChildrenRecords,
        'lookupValue': lookupValue,
        '__checkLengthMin': checkLengthMin, // exported for unittest
        '__checkLengthMax': checkLengthMax, // exported for unittest
        '__isNumber': isNumber,             // exported for unittest
        '__BUNDLE_NAME': __BUNDLE_NAME      // exported for unittest
    };
}();

//-----------------------------------------------------------------------------
// Unittests can be found in SubfieldRulesTest.use.js
