//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['FieldRules'];

//-----------------------------------------------------------------------------
/**
 * @file Module for validation rules for fields
 *
 * @namespace
 * @name FieldRules
 *
 */
var FieldRules = function( ) {
    var BUNDLE_NAME = "validation";

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
    function upperCaseCheck( record, field, params, settings ) {
        Log.trace( "Enter - FieldRules.upperCaseCheck( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            for (var i = 0; i < field.subfields.length; i++) {
                var name = field.subfields[i].name;
                if (name.toUpperCase() === name) {// its uppercase
                    if (field.subfields[i + 1] === undefined || name !== field.subfields[i + 1].name.toUpperCase() || field.subfields[i + 1].name.toUpperCase() === field.subfields[i + 1]) {
                        var errorMessage = ResourceBundle.getStringFormat( bundle, "uppercase.rule.error", name, name.toLowerCase(), field.name );
                        result.push(ValidateErrors.fieldError('TODO:fixurl', errorMessage));
                    }
                }
            }
            return result;
        }
        finally {
            Log.trace( "Exit - FieldRules.upperCaseCheck(): ", result );
        }
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
    function fieldDemandsOtherFieldAndSubfield( record, field, params, settings ) {
        Log.trace( "Enter - FieldRules.fieldDemandsOtherFieldAndSubfield( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = null;
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("record.fields", record.fields).instanceOf(Array);
            ValueCheck.check("params.field", params.field);
            ValueCheck.check("field", field);
            ValueCheck.check("field.name", field.name);
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            var message = "";
            var collectedFields = __getFields(record, params.field);

            if (collectedFields.length === 0) {
                message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields );
                return result = [ValidateErrors.fieldError( "", message ) ];
            } else {

                for (var i = 0; i < collectedFields.length; ++i) {
                    var collectedSubFields = {};
                    for (var j = 0; j < collectedFields[i].subfields.length; ++j) {
                        collectedSubFields[collectedFields[i].subfields[j]] = true;
                    }
                    var ct = 0;
                    for (var k = 0; k < params.subfields.length; ++k) {
                        if (collectedSubFields.hasOwnProperty(params.subfields[k])) {
                            ct++;
                        }
                        if (ct === params.subfields.length) {
                            return result = [];
                        }
                    }
                }
            }
            message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields );
            return result = [ ValidateErrors.fieldError( "", message ) ];
        }
        finally {
            Log.trace( "Exit - FieldRules.fieldDemandsOtherFieldAndSubfield(): ", result );
        }
    }

    // helper function
    // function that returns only the fields we are interested in
    // takes a fieldName and a record
    // and returns the fields that matches the name
    function __getFields( record, fieldName ) {
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
    function fieldsIndicator( record, field, params, settings ) {
        Log.trace( "Enter - FieldRules.fieldsIndicator( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            ValueCheck.check("params.indicator", params.indicator);
            if (field.indicator === params.indicator) {
                return result;
            }

            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            var errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", field.indicator, params.indicator );
            var error = ValidateErrors.fieldError("TODO:url", errorMessage);

            return result = [error];
        }
        finally {
            Log.trace( "Exit - FieldRules.fieldsIndicator(): ", result );
        }
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
    function repeatableSubfields( record, field, params, settings ) {
        Log.trace( "Enter - FieldRules.repeatableSubfields( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);
            var counter = {};
            for (var j = 0; j < field.subfields.length; j++) {
                if (params.subfields.indexOf(field.subfields[j].name) !== -1) {
                    if (!counter.hasOwnProperty(field.subfields[j].name)) {
                        counter[field.subfields[j].name] = 1;
                    } else {
                        counter[field.subfields[j].name]++;
                    }
                }
            }

            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );
            for (var i = 0; i < params.subfields.length; ++i) {
                if (counter[params.subfields[i]] > 1) {
                    var errorMessage = ResourceBundle.getStringFormat( bundle, "repeatable.subfields.rule.error", params.subfields[i], counter[params.subfields[i]] );
                    result.push(ValidateErrors.fieldError( "TODO:url", errorMessage ) );
                }
            }
            return result;
        }
        finally {
            Log.trace( "Exit - FieldRules.repeatableSubfields(): ", result );
        }
    }

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
    function subfieldsMandatory( record, field, params, settings ) {
        Log.trace( "Enter - FieldRules.subfieldsMandatory( ", record, ", ", field, ", ", params, ", ", settings, " )" );

        var result = [];
        try {
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            for (var i = 0; i < params.subfields.length; ++i) {
                if (__doesFieldContainSubfield(field, params.subfields[i]) === false) {
                    result.push(ValidateErrors.fieldError("TODO:url", ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", params.subfields[i], field.name ) ) );
                }
            }
            return result;
        }
        finally {
            Log.trace( "Exit - FieldRules.subfieldsMandatory(): ", result );
        }
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
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", params.subfieldMandatory, params.subfieldConditional, params.values );
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
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            // then check for aExclusiveFields
            for ( var j = 0; j < aExclusiveFields.length; ++j ) {
                var name_ = aExclusiveFields[j];
                if ( counts.hasOwnProperty( name_ ) ) {
                    result.push( ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", name_ ) ) );
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

        var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

        var result = [];
        for ( var i = 0 ; i < field.subfields.length ; ++i  ) {
            if ( field.subfields[i].name === params.subfieldConditional && field.subfields[i].value === params.subfieldConditionalValue ) {
                var conditionalField = __getFields( record, params.fieldMandatory );
                var errorMsg = ResourceBundle.getStringFormat( bundle, "subfield.has.value.demands.other.subfield.rule.error", params.subfieldConditional, field.name, params.subfieldConditionalValue, params.fieldMandatory, params.subfieldMandatory );
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
        'BUNDLE_NAME': BUNDLE_NAME,
        'upperCaseCheck' : upperCaseCheck,
        'fieldDemandsOtherFieldAndSubfield' : fieldDemandsOtherFieldAndSubfield,
        'fieldsIndicator' : fieldsIndicator,
        'subfieldsMandatory' : subfieldsMandatory,
        'subfieldConditionalMandatory' : subfieldConditionalMandatory,
        'repeatableSubfields' : repeatableSubfields,
        'exclusiveSubfield' : exclusiveSubfield,
        'subfieldHasValueDemandsOtherSubfield' : subfieldHasValueDemandsOtherSubfield
    };
}( );
