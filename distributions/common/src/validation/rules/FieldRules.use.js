EXPORTED_SYMBOLS = ['FieldRules'];

//-----------------------------------------------------------------------------
use( "ValidateErrors" );
use( "ValueCheck" );
use( "Exception" );
use( "Log" );

//-----------------------------------------------------------------------------
/**
 * @file Module for validation rules for fields
 *
 * @namespace
 * @name FieldRules
 *
 */
var FieldRules = function( ) {

    /**
     * fieldMustContainSubfield is used to check whether a field contains subfield
     * will return an error if the field has no subfields
     * @syntax FieldRules.upperCaseCheck( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used
     * @return {object}
     * @name FieldRules.fieldMustContainSubfield
     * @method
     */

    function fieldMustContainSubfield( record, field, params ) {
        Log.trace( "FieldRules.fieldMustContainSubfield" );
        ValueCheck.check( "record.fields", record.fields ).instanceOf( Array );
        ValueCheck.check( "field", field );
        ValueCheck.check( "field.name", field.name );

        var subfieldLength = field.subfields.length;

        if (subfieldLength > 0 ) {
            return [];
        }
        return ['Feltet : "' + field.name + '" skal indeholde delfelter"'];
    }

    /**
     * upperCaseCheck is used to check whether a subfield order is correct
     * meaning, a subfield uppercase name must be preceeded by a subfield with the same lowercase name
     * @syntax FieldRules.upperCaseCheck( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used
     * @return {object}
     * @name FieldRules.upperCaseCheck
     * @method
     */
    function upperCaseCheck( record, field, params ) {
        Log.trace( "FieldRules.upperCaseCheck" );
        var ret = [];
        for ( var i = 0; i < field.subfields.length; i++ ) {
            var name = field.subfields[i].name;
            if ( name.toUpperCase( ) === name ) {// its uppercase
                if ( field.subfields[i + 1] === undefined || name !== field.subfields[i + 1].name.toUpperCase( ) || field.subfields[i + 1].name.toUpperCase( ) === field.subfields[i + 1] ) {
                    var errorMessage = 'Delfeltet : "' + name + '" skal efterf\xf8lges af et "' + name.toLowerCase( ) + '" i felt "' + field.name + '"';
                    ret.push( ValidateErrors.fieldError( 'TODO:fixurl', errorMessage ) );
                }
            }
        }
        return ret;
    }
    /**
     * Function that checks if a field exists then another field must exists and contain the subfields from params.
     * @syntax FieldRules.fieldDemandsOtherFieldAndSubfield(  record , params  )
     * @param {Object} record The record as a json.
     * @param {Object} object
     * Param example :
     * params = {
     *     field : '096',
     *     subfields : ['z']
     * }
     * @name FieldRules.fieldDemandsOtherFieldAndSubfield
     * @returns an array which contains errors if any is present.
     * @method
     */
    function fieldDemandsOtherFieldAndSubfield( record, field, params ) {
        Log.trace( "RecordRules.fieldDemandsOtherFieldAndSubfields" );
        ValueCheck.check( "record.fields", record.fields ).instanceOf( Array );
        ValueCheck.check( "params.field", params.field );
        ValueCheck.check( "field", field );
        ValueCheck.check( "field.name", field.name );
        ValueCheck.check( "params.subfields", params.subfields ).instanceOf( Array );

        var message = "";
        var collectedFields = getFields( record, params.field )

        if ( collectedFields.length === 0 ) {
            message = 'Tilstedev\xe6relsen af felt "' + field.name + '" kr\xe6ver at felt : "' + params.field + '" og delfelt : "' + params.subfields + '" findes i posten';
            return [ValidateErrors.recordError( ( params.field, params.template ), message )];
        } else {

            for ( var i = 0; i < collectedFields.length; ++i ) {
                var collectedSubFields = {};
                for ( var j = 0; j < collectedFields[i].subfields.length; ++j ) {
                    collectedSubFields[collectedFields[i].subfields[j]] = true;
                }
                var ct = 0;
                for ( var k = 0; k < params.subfields.length; ++k ) {
                    if ( collectedSubFields.hasOwnProperty( params.subfields[k] ) ) {
                        ct++;
                    }
                    if ( ct === params.subfields.length ) {
                        return [];
                    }
                }
            }
        }
        message = 'Tilstedev\xe6relsen af felt "' + field.name + '" kr\xe6ver at felt : "' + params.field + '" og delfelt : "' + params.subfields + '" findes i posten';
        return [ValidateErrors.recordError( ( params.field, params.template ), message )];
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
    /**
     * fieldsIndicator checks whether an indicate has the value corresponding to the value given in params
     *
     * @syntax FieldRules.fieldsIndicator( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params must contain a property 'indicator' with the valid indicator, e.g. { 'indicator': "00" }
     * @return {object}
     * @name FieldRules.fieldsIndicator
     * @method
     */
    function fieldsIndicator( record, field, params ) {
        Log.trace( "FieldRules.fieldsIndicator" );
        ValueCheck.check( "params.indicator", params.indicator );
        if ( field.indicator === params.indicator ) {
            return [];
        }
        var errorMessage = 'indicator er "' + field.indicator + '", men skal v\xe6re "' + params.indicator + '"';
        var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
        return [error];
    }
    /**
     * Checks wheter a subfield is repeated.
     *
     *
     * @syntax FieldRules.repeatableSubfields( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with property subfields as an Array of names of subfields that can not be repeated, e.g. { 'subfields': ['a', 'c'] }
     * @return {object}
     * @example FieldRules.repeatableSubfields( record, field, params )
     * @name FieldRules.repeatableSubfields
     * @method
     */
    function repeatableSubfields( record, field, params ) {
        Log.trace( "FieldRules.repeatableSubfields" );
        ValueCheck.check( "params.subfields", params.subfields ).instanceOf( Array );
        var result = [];
        var counter = {};
        for ( var j = 0; j < field.subfields.length; j++ ) {
            if ( params.subfields.indexOf( field.subfields[j].name ) !== -1 ) {
                if ( !counter.hasOwnProperty( field.subfields[j].name ) ) {
                    counter[field.subfields[j].name] = 1;
                } else {
                    counter[field.subfields[j].name]++;
                }
            }
        }
        for ( var i = 0; i < params.subfields.length; ++i ) {
            if ( counter[params.subfields[i]] > 1 ) {
                var errorMessage = 'subfield "' + params.subfields[i] + '" er gentaget "' + counter[params.subfields[i]] + '" gange i feltet';
                result.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
            }
        }
        return result;
    }
    // TODO: skal det ikke hedde subfield og ikke subField?

    /**
     * checks wheter a subfield exists in the given field
     *
     *
     * @syntax FieldRules.subfieldsMandatory( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with property subfields as an Array of names of mandatory subfields, e.g. { 'subfields': ['a', 'c'] }
     * @return {object}
     * @example FieldRules.subfieldsMandatory( record, field, params )
     * @name FieldRules.subfieldsMandatory
     * @method
     */
    function subfieldsMandatory( record, field, params ) {
        Log.trace( "FieldRules.subfieldsMandatory" );
        ValueCheck.check( "params.subfields", params.subfields ).instanceOf( Array );
        var result = [];
        for ( var i = 0; i < field.subfields.length; ++i ) {
            var indexOfParam = params.subfields.indexOf( field.subfields[i].name );
            if ( indexOfParam !== -1 ) {
                // each subfield that matches has its value deleted from the array
                params.subfields[indexOfParam] = undefined;
            }
        }
        for ( var ii = 0; ii < params.subfields.length; ++ii ) {
            if ( params.subfields[ii] !== undefined ) {
                var errorMessage = 'subfield "' + params.subfields[ii] + '" mangler i feltet';
                result.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
            }
        }
        return result;
    }

    /**
     * Makes a subfield mandatory if another subfield is not presented in the field.
     *
     * @syntax FieldRules.subfieldMandatoryIfSubfieldNotPresent( record, field, params )
     * @param {object} record The record that contains the field.
     * @param {object} field  The field to validate.
     * @param {object} params Object with two properties: 'subfield' and 'not_presented_subfield'.
     *                        'subfield' is the name of the subfield that should be mandatory.
     *                        Ex. "m". 'not_presented_subfield' is the list og field/subfield that
     *                        should not be presented in the record for 'subfield' to be mandatory.
     *                        The 'not_presented_subfield' list should be formatted as field/subfield, ex.
     *                        ["652m", "666abc", "123z"].
     * @return {Array} Array of validation errors.
     * @example FieldRules.subfieldMandatoryIfSubfieldNotPresent( record, field, params )
     * @name FieldRules.subfieldMandatoryIfSubfieldNotPresent
     * @method
     */
    function subfieldMandatoryIfSubfieldNotPresent( record, field, params ) {
        Log.trace( "Enter - FieldRules.subfieldMandatoryIfSubfieldNotPresent( record, field, params )" );

        try {
            Log.trace( "Params = " + uneval( params ) );
            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.subfield", params['subfield'] ).type( "string" );
            ValueCheck.check( "params.not_presented_subfield", params['not_presented_subfield'] ).instanceOf( Array );

            for( var i = 0; i < field.subfields.length; i++ ) {
                if( field.subfields[i].name === params.subfield ) {
                    return [];
                }
            }

            params.not_presented_subfield.forEach( function ( fieldSubfield ) {
                if( fieldSubfield.length < 4 ) {
                    // TODO: FIXME hvad hulen står der her?!?!
                    Log.debug( "params.not_presented_subfield is not a field/subfield: %s in param %s", fieldSubfield, params.subfields );
                    throw StringUtil.sprintf( "params.not_presented_subfield is not a field/subfield: %s in param %s", params.not_presented_subfield, params.subfields );
                }
            });

            var foundFieldAndSubfields = 0;
            params.not_presented_subfield.forEach( function ( fieldSubfield ) {
                var fieldName = fieldSubfield.substring( 0, 3 );
                var subfieldNames = fieldSubfield.substring( 3 );
                var recordField = __getFieldFromRecord( record, fieldName );
                if ( recordField.status === true ) {
                    for ( var j = 0 ; j < subfieldNames.length ; ++j ) {
                        if ( __doesFieldContainSubfield( recordField.field, subfieldNames.substring( j, 1 ) ) ) {
                            foundFieldAndSubfields += 1;
                        }
                    }
                }
            });

            var result = [];
            if ( foundFieldAndSubfields === 0 ) {
                var errorMessage = StringUtil.sprintf( 'Delfelt "%s" mangler i felt "%s".', params.subfield, field.name );
                result.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
            }
            return result;
        }
        finally {
            Log.trace( "Exit - FieldRules.subfieldMandatoryIfSubfieldNotPresent( record, field, params )" );
        }
    }

    // Helper function for getting at specific field from the record
    function __getFieldFromRecord( record, fieldName ) {
        Log.trace ( "RecordRules.__getFieldFromRecord" );
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                return { field: record.fields[i], status: true };
            }
        }
        return { status: false };
    }

    // Helper function for determining is a subfield exists on a field
    function __doesFieldContainSubfield( field, subfieldName ) {
        Log.trace ( "RecordRules.__doesFieldContainSubfield" );
        for ( var i = 0 ; i < field.subfields.length ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                return true;
            }
        }
        return false;
    }


    /**
     * checks that if a specified subfield has a specific value, then another given subfield is mandatory
     * @syntax FieldRules.subfieldConditionalMandatory( record, field, params )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with properties subfieldConditional, value, subfieldMandatory, e.g. { 'subfieldConditional': 'v', 'values': '0', 'subfieldMandatory': 'a' }
     * @return {object}
     * @example FieldRules.subfieldConditionalMandatory( record, field, params )
     * @name FieldRules.subfieldConditionalMandatory
     * @method
     */
    function subfieldConditionalMandatory( record, field, params ) {
        Log.trace( "FieldRules.subfieldConditionalMandatory" );
        ValueCheck.check( "params.subfieldConditional", params.subfieldConditional );
        ValueCheck.check( "params.values", params.values );
        ValueCheck.check( "params.subfieldMandatory", params.subfieldMandatory );
        var mandatoryAndNotFound = false;
        // check for condition and if it is fulfilled
        for ( var i = 0; i < field.subfields.length; ++i ) {
            var name = field.subfields[i].name;
            var value = field.subfields[i].value;
            if ( name === params.subfieldConditional && inArray( params.values, value ) === true ) {
                // condition fulfilled, params.subfieldMandatory is mandatory
                mandatoryAndNotFound = true;
            } else if ( name === params.subfieldMandatory ) {
                return [];
                // mandatory subfield exists, i.e. condition fulfilled
            }
        }
        if ( mandatoryAndNotFound ) {
            var errorMessage = 'delfelt "' + params.subfieldMandatory + '" mangler og er obligatorisk, n\xe5r delfelt "' + params.subfieldConditional + '" har v\xe6rdierne "' + params.values + '"';
            return [ValidateErrors.fieldError( "TODO:url", errorMessage )];
        }
        return [];

        function inArray( listOfValues, valToCheck ) {
            for ( var i = 0; i < listOfValues.length; ++i ) {
                if ( listOfValues[i] === valToCheck ) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * exclusiveSubfield is used to validate that if subfield 'a' is present, then none
     * of 'i', 't', 'e', 'x' or 'b' must be present
     * @syntax FieldRules.exclusiveSubfield(  record, field, params  )
     * @param {object} record
     * @param {object} field
     * @param {object} params is not used, i.e. must be undefined
     * @return {object}
     * @name FieldRules.exclusiveSubfield
     * @method
     */
    function exclusiveSubfield( record, field, params ) {
        Log.trace( "FieldRules.exclusiveSubfield" );

        // first count all subfields
        var counts = {};
        for ( var i = 0; i < field.subfields.length; ++i ) {
            var name = field.subfields[i].name;
            if ( !counts.hasOwnProperty( name ) ) {
                counts[name] = 1;
            } else {
                counts[name]++;
            }
        }

        var result = [];
        var a = 'a';
        var aExclusiveFields = ['i', 't', 'e', 'x', 'b'];
        // if there are any 'a's
        if ( counts.hasOwnProperty( a ) ) {
            // then check for aExclusiveFields
            for ( var j = 0; j < aExclusiveFields.length; ++j ) {
                var name_ = aExclusiveFields[j];
                if ( counts.hasOwnProperty( name_ ) ) {
                    result.push( ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "' + name_ + '"' ) );
                }
            }
        }
        return result;
    }

    /**
     * subfieldHasValueDemandsOtherSubfield is used to validate that if field x has subfield y with value z
     * then field a and subfield b are mandatory.
     * @syntax FieldRules.subfieldHasValueDemandsOtherSubfield(  record, field, params  )
     * @param {object} record
     * @param {object} field
     * @param {object} params Object with properties subfieldConditional, subfieldConditionalValue, fieldMandatory, subfieldMandatory
     *                        e.g. { 'subfieldConditional': 'y', 'subfieldConditionalValue': 'z', 'fieldMandatory': 'a', 'subfieldMandatory': 'b' }
     * @return {object}
     * @name FieldRules.exclusiveSubfield
     * @method
     */
    function subfieldHasValueDemandsOtherSubfield( record, field, params ) {
        Log.trace( "FieldRules.subfieldHasValueDemandsOtherSubfield" );
        ValueCheck.check( "params.subfieldConditional", params.subfieldConditional );
        ValueCheck.check( "params.subfieldConditionalValue", params.subfieldConditionalValue );
        ValueCheck.check( "params.fieldMandatory", params.fieldMandatory );
        ValueCheck.check( "params.subfieldMandatory", params.subfieldMandatory );

        var result = [];
        for ( var i = 0 ; i < field.subfields.length ; ++i  ) {
            if ( field.subfields[i].name === params.subfieldConditional && field.subfields[i].value === params.subfieldConditionalValue ) {
                var conditionalField = getFields( record, params.fieldMandatory );
                var errorMsg = 'delfelt "' + params.subfieldConditional + '" på felt "' + field.name + '" har værdien "' + params.subfieldConditionalValue + '", derfor er felt "' + params.fieldMandatory + '" og delfelt "' + params.subfieldMandatory + '" obligatorisk';
                var foundSubfield = false;
                if ( conditionalField.length > 0 ) {
                    for ( var i = 0 ; i < conditionalField.length ; ++i ) {
                        for ( var j = 0 ; j < conditionalField[i].subfields.length ; ++j  ) {
                            if ( conditionalField[i].subfields[j].name === params.subfieldMandatory ) {
                                foundSubfield = true;
                            }
                        }
                    }
                    if ( foundSubfield === false ) {
                        result.push( ValidateErrors.fieldError( "TODO:fixurl", errorMsg ) );
                    }
                } else {
                    result.push( ValidateErrors.fieldError( "TODO:fixurl", errorMsg ) );
                }
                break;
            }
        }
        return result;
    }

    return {
        'upperCaseCheck' : upperCaseCheck,
        'fieldDemandsOtherFieldAndSubfield' : fieldDemandsOtherFieldAndSubfield,
        'fieldsIndicator' : fieldsIndicator,
        'subfieldsMandatory' : subfieldsMandatory,
        'subfieldMandatoryIfSubfieldNotPresent': subfieldMandatoryIfSubfieldNotPresent,
        'subfieldConditionalMandatory' : subfieldConditionalMandatory,
        'repeatableSubfields' : repeatableSubfields,
        'exclusiveSubfield' : exclusiveSubfield,
        'fieldMustContainSubfield' : fieldMustContainSubfield,
        'subfieldHasValueDemandsOtherSubfield' : subfieldHasValueDemandsOtherSubfield
    };
}( );

//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );

UnitTest.addFixture( "fieldsIndicator", function( ) {
    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : []
    };

    var params00 = {
        indicator : "00"
    };

    SafeAssert.equal( "00: is 00", [], FieldRules.fieldsIndicator( record, field, params00 ) );

    var errorMessage = 'indicator er "00", men skal v\xe6re "XX"';
    var errorXX = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var params01 = {
        indicator : "XX"
    };
    SafeAssert.equal( "00: is not XX", errorXX, FieldRules.fieldsIndicator( record, field, params01 ) );

    var paramsEmpty = {
        indicator : ""
    };

    errorMessage = 'indicator er "00", men skal v\xe6re ""';
    var errorEmpty = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "00: is not empty", errorEmpty, FieldRules.fieldsIndicator( record, field, paramsEmpty ) );

} );

UnitTest.addFixture( "subfieldsMandatory", function( ) {
    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "a1Val"
        }, {
            name : "b", value : "b1Val"
        }, {
            name : "c", value : "c1Val"
        }]
    };
    // TODO fix params, its an Object

    var paramsA = {
        'subfields' : ['a']
    };
    SafeAssert.equal( "1 testing with valid " + paramsA.subfields + " param", [], FieldRules.subfieldsMandatory( record, field, paramsA ) );

    var errorMessage = 'subfield \"f\" mangler i feltet';
    var errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsF = {
        'subfields' : ['f']
    };
    SafeAssert.equal( "2 testing with NON valid " + paramsF.subfields + " param", errorFmissing, FieldRules.subfieldsMandatory( record, field, paramsF ) );

    var paramsABC = {
        'subfields' : ['a', 'b', 'c']
    };
    SafeAssert.equal( "3 testing with valid  " + paramsABC.subfields + " param", [], FieldRules.subfieldsMandatory( record, field, paramsABC ) );

    errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsABF = {
        'subfields' : ['a', 'b', 'f']
    };
    SafeAssert.equal( "4 testing with NON valid  " + paramsABF.subfields + " param", errorFmissing, FieldRules.subfieldsMandatory( record, field, paramsABF ) );

    var errorXY = [];
    errorMessage = "subfield \"x\" mangler i feltet";
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    errorMessage = "subfield \"y\" mangler i feltet";
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    var paramsAXY = {
        'subfields' : ['a', 'x', 'y']
    };
    SafeAssert.equal( "5 testing with NON valid  " + paramsAXY.subfields + " param", errorXY, FieldRules.subfieldsMandatory( record, field, paramsAXY ) );

} );

UnitTest.addFixture( "repeatableSubfields", function( ) {
    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "a1Val"
        }, {
            name : "a", value : "a2Val"
        }, {
            name : "b", value : "b1Val"
        }]
    };

    var params1a = {
        'subfields' : ['a']
    };
    var errorMessage = 'subfield "a" er gentaget "2" gange i feltet';
    var errors1a = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "repeatableSubfields testing with NON valid " + params1a.subfields + " param", errors1a, FieldRules.repeatableSubfields( record, field, params1a ) );

    var params1b = {
        'subfields' : ['b']
    };
    SafeAssert.equal( "repeatableSubfields testing with valid b" + params1b.subfields + " param", [], FieldRules.repeatableSubfields( record, field, params1b ) );

    var params1ac = {
        'subfields' : ['a', 'c']
    };
    errorMessage = 'subfield "a" er gentaget "2" gange i feltet';
    var errors1ac = [ValidateErrors.fieldError( "TODO:url", errorMessage )];

    SafeAssert.equal( "repeatableSubfields testing with valid ac " + params1ac.subfields + " param", errors1ac, FieldRules.repeatableSubfields( record, field, params1ac ) );

} );

UnitTest.addFixture( "exclusiveSubfield", function( ) {
    var record = {};

    var field1 = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "aVal"
        }]
    };
    SafeAssert.equal( "1 exclusiveSubfield test ok", FieldRules.exclusiveSubfield( record, field1, undefined ), [] );

    var field2 = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "aVal"
        }, {
            name : "b", value : "bVal"
        }]
    };
    var error2 = [ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "b"' )];
    SafeAssert.equal( "2 exclusiveSubfield test not-ok", FieldRules.exclusiveSubfield( record, field2, undefined ), error2 );

    var field3 = {
        name : '001', indicator : '00', subfields : [{
            name : "i", value : "iVal"
        }, {
            name : "t", value : "tVal"
        }, {
            name : "e", value : "eVal"
        }, {
            name : "x", value : "xVal"
        }, {
            name : "b", value : "bVal"
        }, {
            name : "a", value : "aVal"
        }]
    };
    var error3 = [ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "i"' ), ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "t"' ), ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "e"' ), ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "x"' ), ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" må ikke bruges samtidigt med delfelt "b"' )];

    SafeAssert.equal( "3 exclusiveSubfield test not-ok", FieldRules.exclusiveSubfield( record, field3, undefined ), error3 );

    var field4 = {
        name : '001', indicator : '00', subfields : [{
            name : "b", value : "bVal"
        }]
    };
    SafeAssert.equal( "4 exclusiveSubfield test ok", FieldRules.exclusiveSubfield( record, field4, undefined ), [] );

} );

UnitTest.addFixture( "FieldRules.subfieldMandatoryIfSubfieldNotPresent", function() {
    var exceptCallFormat = "FieldRules.subfieldMandatoryIfSubfieldNotPresent( %s, %s, %s )";

    var recordArg = null;
    var fieldArg = {
        name: "001", indicator: "00",
        subfields: [ { name: "a", value: "xx" } ]
    };
    var paramsArg = { subfield: "m", not_presented_subfield: ["652m"] };
    Assert.exception( "records is null", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );

    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [ { name: "a", value: "xx" } ]
            }
        ]
    };
    fieldArg = null;
    paramsArg = { subfield: "m", not_presented_subfield: ["652m"] };
    Assert.exception( "field is null", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );

    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [ { name: "a", value: "xx" } ]
            }
        ]
    };
    fieldArg = recordArg.fields[0];
    paramsArg = null;
    Assert.exception( "params is null", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = undefined;
    Assert.exception( "params is undefined", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = {};
    Assert.exception( "params is empty object", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = { not_presented_subfield: "652m" };
    Assert.exception( "params.subfield is undefined", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = { subfield: 45, not_presented_subfield: ["652m"] };
    Assert.exception( "params.subfield is not string", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = { subfield: "m" };
    Assert.exception( "params.not_presented_subfield is undefined", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = { subfield: "m", not_presented_subfield: 47 };
    Assert.exception( "params.not_presented_subfield is not array", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );
    paramsArg = { subfield: "m", not_presented_subfield: ["042"] };
    Assert.exception( "params.not_presented_subfield is not field/subfield", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( fieldArg ), uneval( paramsArg ) ) );

    recordArg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [ { name: "a", value: "xx" } ]
            }
        ]
    };
    fieldArg = recordArg.fields[0];
    paramsArg = { subfield: "a", not_presented_subfield: ["001b"] };
    SafeAssert.equal( "001a: Mandatory without 001b",
                      FieldRules.subfieldMandatoryIfSubfieldNotPresent( recordArg, fieldArg, paramsArg ), [] );
    paramsArg = { subfield: "m", not_presented_subfield: ["001a"] };
    SafeAssert.equal( "001m: Not mandatory with 001a",
                      FieldRules.subfieldMandatoryIfSubfieldNotPresent( recordArg, fieldArg, paramsArg ), [] );
    paramsArg = { subfield: "m", not_presented_subfield: ["001b"] };
    SafeAssert.equal( "001m: Mandatory without 001b",
                      FieldRules.subfieldMandatoryIfSubfieldNotPresent( recordArg, fieldArg, paramsArg ),
                      [ ValidateErrors.fieldError( "TODO:url", 'Delfelt "m" mangler i felt "001".' ) ] );

    recordArg = {
        fields: [
            { name: "001", indicator: "00",
              subfields: [ { name: "a", value: "xx" } ] },
            { name: "002", indicator: "00",
              subfields: [ { name: "a", value: "xx" } ] },
            { name: "003", indicator: "00",
              subfields: [ { name: "a", value: "xx" } ] }
        ]
    };
    fieldArg = recordArg.fields[0];
    paramsArg = { subfield: "a", not_presented_subfield: ["042abc", "002z", "001b"] };
    SafeAssert.equal( "Test 1", FieldRules.subfieldMandatoryIfSubfieldNotPresent( recordArg, fieldArg, paramsArg ), [] );

    paramsArg = { subfield: "m", not_presented_subfield: ["042abc", "002z", "001a"] };
    SafeAssert.equal( "Test 1", FieldRules.subfieldMandatoryIfSubfieldNotPresent( recordArg, fieldArg, paramsArg ), [] );

} );

UnitTest.addFixture( "subfieldConditionalMandatory", function( ) {
    var record = {};

    var field = {
        name : '001', indicator : '00', subfields : [{
            name : "a", value : "a1Val"
        }, {
            name : "b", value : "b1Val"
        }, {
            name : "c", value : "c1Val"
        }]
    };
    var params = {
        'subfieldConditional' : 'v', 'values' : ['0'], 'subfieldMandatory' : 'a'
    };

    SafeAssert.equal( "1 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['xxx'], 'subfieldMandatory' : 'xxx'
    };

    SafeAssert.equal( "2 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'xxx'
    };

    var errorMessage = "delfelt \"xxx\" mangler og er obligatorisk, n\xe5r delfelt \"a\" har v\xe6rdierne \"a1Val\"";
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    SafeAssert.equal( "3 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [error] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "4 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "5 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [] );

    params = {
        'subfieldConditional' : 'a', 'values' : ['test1', 'test2', 'test3'], 'subfieldMandatory' : 'c'
    };
    SafeAssert.equal( "6 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [] );


    params = {
        'subfieldConditional' : 'a', 'values' : ['a1Val', 'b1Val', 'c1Val'], 'subfieldMandatory' : 'd'
    };
    var errorMessage = "delfelt \"d\" mangler og er obligatorisk, n\xe5r delfelt \"a\" har v\xe6rdierne \"a1Val,b1Val,c1Val\"";
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    SafeAssert.equal( "7 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [error] );
} );

UnitTest.addFixture( "Test RecordRules.fieldDemandsOtherFieldAndSubfield ", function( ) {
    var rec = {
        fields : [{
            name : '001', indicator : '00', subfields : []
        }, {
            name : '002', indicator : '00', subfields : ["a", "b", "c"]
        }, {
            name : '003', indicator : '00', subfields : []
        }]
    };

    var field = {
        name : "096"
    };
    var params = {
        field : "004", subfields : ["a"]
    }
    var message = 'Tilstedev\xe6relsen af felt \"096\" kr\xe6ver at felt : "004" og delfelt : "a" findes i posten';
    var errMissing004 = [ValidateErrors.recordError( ( params.field, params.template ), message )];
    SafeAssert.equal( "1 testing fieldDemandsOtherFieldAndSubfield with invalid 004 field", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), errMissing004 );

    params = {
        field : "001", subfields : ["a", "b", "c"]
    }
    message = 'Tilstedev\xe6relsen af felt \"096\" kr\xe6ver at felt : "001" og delfelt : "a,b,c" findes i posten';
    var errMissingSubfieldABC = [ValidateErrors.recordError( ( params.field, params.template ), message )];
    SafeAssert.equal( "2 testing fieldDemandsOtherFieldAndSubfield with invalid a,b,c subfields", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), errMissingSubfieldABC );

    params = {
        field : "002", subfields : ["a", "b", "c"]
    }
    SafeAssert.equal( "3 testing fieldDemandsOtherFieldAndSubfield with valid params", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), [] );
} );

UnitTest.addFixture( "FieldRules.upperCaseCheck", function( ) {
    var message = '';
    var params = {};
    var record = {};
    var fieldAa = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "A", 'value' : "42"
        }, {
            'name' : "a", 'value' : "42"
        }]
    };

    SafeAssert.equal( "1 FieldRules.upperCaseCheck value", FieldRules.upperCaseCheck( record, fieldAa ), [] );

    var fieldAb = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "A", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    message = 'Delfeltet : "A" skal efterf\xf8lges af et "a" i felt "003"';
    var errNoLowerCaseA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    SafeAssert.equal( "2 FieldRules.upperCaseCheck value", FieldRules.upperCaseCheck( record, fieldAb ), errNoLowerCaseA );

    var fieldaA = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "A", 'value' : "42"
        }]
    };

    message = 'Delfeltet : "A" skal efterf\xf8lges af et "a" i felt "003"';
    var errNoTrailingA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    SafeAssert.equal( "2 FieldRules.upperCaseCheck value", FieldRules.upperCaseCheck( record, fieldaA ), errNoTrailingA );
} );

UnitTest.addFixture( "FieldRules.fieldMustContainSubfield", function( ) {
    var record = {};

    var fieldA003 = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "A", 'value' : "42"
        }, {
            'name' : "a", 'value' : "42"
        }]
    };
    record.fields = [fieldA003];
    SafeAssert.equal( "1 FieldRules.fieldMustContainSubfield with valid field", FieldRules.fieldMustContainSubfield( record, fieldA003 ), [] );

    fieldA003 = {
        "name" : '003', "indicator" : '00', subfields : []
    };

    var errMsg = ['Feltet : "' + "003" + '" skal indeholde delfelter"'];

    record.fields = [fieldA003];
    SafeAssert.equal( "1 FieldRules.fieldMustContainSubfield with valid but empty field ", FieldRules.fieldMustContainSubfield( record, fieldA003 ), errMsg );
} );

UnitTest.addFixture( "FieldRules.subfieldHasValueDemandsOtherSubfield" , function() {
    var record = {};
    var field1 = {
        "name": "001", "indicator": "00", subfields: [{
            "name": "a", "value": "b"
        }, {
            "name": "c", "value": "42"
        }]
    };
    record.fields = [field1];
    var field2 = {
        "name": "002", "indicator": "00", subfields: [{
            "name": "d", "value": "e"
        }, {
            "name": "f", "value": "g"
        }]
    };
    record.fields = [field2];
    var params = { "subfieldConditional": "a", "subfieldConditionalValue": "b", "fieldMandatory": "002", "subfieldMandatory": "d" };
    SafeAssert.equal( "1 subfieldHasValueDemandsOtherSubfield - ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), [] );

    record = {};
    record.fields = [field1];
    var field3 = {
        "name": "003", "indicator": "00", subfields: [{
            "name": "d", "value": "e"
        }, {
            "name": "f", "value": "g"
        }]
    };
    record.fields = [field3];
    var errorMsg = [ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" på felt "001" har værdien "b", derfor er felt "002" og delfelt "d" obligatorisk' )];
    SafeAssert.equal( "2 subfieldHasValueDemandsOtherSubfield - not ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), errorMsg );

    record = {};
    record.fields = [field1];
    var field4 = {
        "name": "002", "indicator": "00", subfields: [{
            "name": "e", "value": "d"
        }, {
            "name": "f", "value": "g"
        }]
    };
    record.fields = [field4];
    var errorMsg = [ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" på felt "001" har værdien "b", derfor er felt "002" og delfelt "d" obligatorisk' )];
    SafeAssert.equal( "3 subfieldHasValueDemandsOtherSubfield - not ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), errorMsg );

    record = {};
    record.fields = [field1];
    var errorMsg = [ValidateErrors.fieldError( "TODO:fixurl", 'delfelt "a" på felt "001" har værdien "b", derfor er felt "002" og delfelt "d" obligatorisk' )];
    SafeAssert.equal( "4 subfieldHasValueDemandsOtherSubfield - not ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), errorMsg );
} );
