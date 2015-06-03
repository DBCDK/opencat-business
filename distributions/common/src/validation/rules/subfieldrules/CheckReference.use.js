//-----------------------------------------------------------------------------
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['CheckReference'];

//-----------------------------------------------------------------------------
var CheckReference = function () {
    var __BUNDLE_NAME = "validation";

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
     * @syntax CheckReference.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name CheckReference.validateSubfield
     * @method
     */
    function validateSubfield ( record, field, subfield, params ) {
        Log.trace( "Enter --- CheckReference.validateSubfield" );
        try {
            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

            var fieldNameToCheck = subfield.value.slice( 0, 3 );// String
            // array of fields which matches the fieldNameToCheck
            // meaning thew first three letters in subfield.value, ie 700/1(a,b,c) --> 700
            var matchingFields = __getFields( record, fieldNameToCheck );
            var errorMessage;

            if ( matchingFields.length < 1 ) {
                errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.field", fieldNameToCheck );
                return [(  ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) )];
            }
            // if the reference value is only 3 chars we are done
            // meaning we a subfield formatted like this : 700 with no forwardSlash or parenthesis involved
            if ( subfield.value.length === 3 ) {
                return [];
            }

            var forwardslashValue = __getValueFromForwardSlash( subfield.value ); // { containsValidValue: Boolean, Value: String }
            // if the forwardslashvalue doesnt contain a valid value, the subfield.value is formatted without a a forward slash and no parenthesis
            if ( forwardslashValue.containsValidValue === false ) {
                return []
            }

            var fieldsWithSubfieldContainingDanishaa = __matchValueFromForwardSlashToSubfieldValue( forwardslashValue.value, matchingFields );
            if ( fieldsWithSubfieldContainingDanishaa.length > 0 ) {
                var subfieldValuesToCheck = __getValuesToCheckFromparenthesis( subfield.value );// Array: String
                if ( subfieldValuesToCheck.length > 0 ) {
                    return ( __checkSubFieldValues( fieldsWithSubfieldContainingDanishaa, subfieldValuesToCheck ) );
                }
            } else {
                errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.value", forwardslashValue.value, matchingFields[0].name );
                return [( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) )];
            }
            return [];
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield" );
        }
    }

    function __checkFieldsNotContainingDanishaa ( fields, fieldNameToCheck, bundle ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.____checkFieldsNotContainingDanishaa" );
        try {
            for ( var i = 0; i < fields.length; ++i ) {
                if ( __fieldHasSubFieldDanishaa( fields[i] ) ) {
                    return [(  ValidateErrors.subfieldError( 'TODO:fixurl', ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield.å", fieldNameToCheck ) ) )];
                }
            }
            return [];
        } finally {
            Log.trace( "Exit--- CheckReference.validateSubfield.____checkFieldsNotContainingDanishaa" );
        }
    }

    // helper function that checks if a subfield with a given value exists on the field
    function __fieldHasSubFieldDanishaa ( field ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__subfieldExistOnfield" );
        try {
            for ( var i = 0; i < field.subfields.length; ++i ) {
                if ( field.subfields[i].name === '\u00E5') {
                    return true;
                }
            }
            return false;
        } finally {
            Log.trace( "Enter --- CheckReference.validateSubfield.__subfieldExistOnfield" );
        }
    }

    // helper function which returns an array of errors
    // checks if the fields supplied does not contain the subfields in the subfieldValuesToCheck
    function __checkSubFieldValues ( fieldsWithSubfieldDanishaa, subfieldValuesToCheck ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__checkSubFieldValues" );
        try {
            var ret = [];
            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

            var found = {};
            for ( var i = 0; i < fieldsWithSubfieldDanishaa.length; ++i ) {
                for ( var j = 0; j < fieldsWithSubfieldDanishaa[i].subfields.length; ++j ) {
                    found[fieldsWithSubfieldDanishaa[i].subfields[j].name] = true;
                }
                subfieldValuesToCheck.forEach( function ( val ) {
                    var val = val.trim();
                    if ( val.length > 1 ) {
                        var nbr = val.slice( 1 );
                        var subfield = val.slice( 0, 1 );
                        var count = __countSubfieldOccurrences( fieldsWithSubfieldDanishaa[i], subfield );
                        if ( count < nbr ) {
                            var errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.subfield.not.repeated", subfield, fieldsWithSubfieldDanishaa[i].name, nbr );
                            ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
                        }
                    } else {
                        if ( !found.hasOwnProperty( val ) ) {
                            var errorMessage = ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", i + 1, fieldsWithSubfieldDanishaa[0].name, val );
                            ret.push( ValidateErrors.subfieldError( 'TODO:fixurl', errorMessage ) );
                        }
                    }
                } );
            }
            return ret;
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield.__checkSubFieldValues" );
        }
    }

    //helper function
    // takes two arguments
    // matchValue , String with the value that the å subfield must match
    // fields : array of fields to serahc through
    // returns an array of fields which has an å value
    function __matchValueFromForwardSlashToSubfieldValue ( matchValue, fields ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__matchValueFromForwardSlashToSubfieldValue" );
        try {
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
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield.__matchValueFromForwardSlashToSubfieldValue" );
        }
    }

    // helper function
    // function that returns only the fields we are interested in
    // takes a fieldName and a record
    // and returns the fields that matches the name
    function __getFields ( record, fieldName ) {
        Log.trace( "Exit --- CheckReference.validateSubfield.__getFields" );
        try {
            var ret = [];
            for ( var i = 0; i < record.fields.length; ++i ) {
                if ( record.fields[i].name === fieldName ) {
                    ret.push( record.fields[i] );
                }
            }
            return ret;
        } finally {
            Log.trace( "Enter --- CheckReference.validateSubfield.__getFields" );
        }
    }

    // helper function that returns the value from the backslash part
    function __getValueFromForwardSlash ( subfieldValue ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__getValueFromForwardSlash" );
        try {
            var value = {
                'containsValidValue': false
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
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield.__getValueFromForwardSlash" );
        }
    }

    // function that checks wheter an paranthesis is present
    // if it is , an array of the values in the paranthesis is returned.
    // if not an empty array will be returned
    function  __getValuesToCheckFromparenthesis ( subfieldValue ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__getValuesToCheckFromparenthesis" );
        try {
            var indexStartParenthesis = subfieldValue.indexOf( "(" );
            var ret = [];
            if ( indexStartParenthesis !== -1 ) {
                ret = subfieldValue.slice( indexStartParenthesis + 1, subfieldValue.lastIndexOf( ')' ) ).split( ',' );
            }
            return ret;
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield.__getValuesToCheckFromparenthesis" );
        }
    }



    // helper function to count number of specific subfield occurrences
    function __countSubfieldOccurrences ( field, subfieldName ) {
        Log.trace( "Enter --- CheckReference.validateSubfield.__countSubfieldOccurrences" );
        try {
            var ret = 0;
            for ( var i = 0; i < field.subfields.length; ++i ) {
                if ( field.subfields[i].name === subfieldName ) {
                    ret++;
                }
            }
            return ret;
        } finally {
            Log.trace( "Exit --- CheckReference.validateSubfield.__countSubfieldOccurrences" );
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
