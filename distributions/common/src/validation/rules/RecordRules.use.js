//-----------------------------------------------------------------------------
use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "TemplateUrl" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['RecordRules'];

//-----------------------------------------------------------------------------
/**
 * Module for validation rules for an entire record.
 * @file RecordRules is part of the jsValidation , and validates on record level
 * @namespace
 * @name RecordRules
 *
 */

var RecordRules = function( ) {
    var BUNDLE_NAME = "validation";

    /**
     * Checks if the fields are lexically sorted
     * @syntax RecordRules.recordSorted(  record , params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing an array keyed on fields
     * @name RecordRules.recordSorted
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function recordSorted ( record, params ) {
        Log.trace ( "Enter - RecordRules.recordSorted( ", record, ", ", params, " )" );

        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("record.fields", record.fields).instanceOf(Array);

            var result = [];
            var previous = "000";
            for (var i = 0; i < record.fields.length; ++i) {
                if (record.fields[i].name < previous) {
                    var message = ResourceBundle.getStringFormat( bundle, "record.sorted.error", record.fields[i].name );
                    return result = [ValidateErrors.recordError(TemplateUrl.getUrlForField(record.fields[i].name, params.template), message)];
                }
                previous = record.fields[i].name;
            }
            return result;
        }
        finally {
            Log.trace( "Exit - RecordRules.recordSorted(): ", result );
        }
    }

    /**
     * Checks if a record contains field 001.
     * @syntax RecordRules.idFieldExists(  record, params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing atleast an array keyed on fields
     * @name RecordRules.repeatableFields
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function idFieldExists( record, params ) {
        Log.trace ( "RecordRules.idFieldExists");

        // ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );
        if ( record !== undefined && record.fields !== undefined ) {
            for ( var i = 0; i < record.fields.length; i++ ) {
                var field = record.fields[i];
                if ( field.name === "001" ) {
                    return [];
                }
            }
        }

        return [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )];
    }


    /**
     * fieldsMandatory , checks if a record contains the field in the params array.
     * @syntax RecordRules.fieldsMandatory (  record, params  )
     * @param {Object} record The record as a json.
     * @param {Object} params , an object containing atleast an array keyed on fields. The array should contain the mandatory field names
     * @name RecordRules.fieldsMandatory
     * @return an array which is empty with no errors present, or contains the appropiate errors
     * @method
     */
    function fieldsMandatory( record, params ) {
        Log.trace ( "Enter - RecordRules.fieldsMandatory( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            Log.debug( "Checking fields: ", params.fields );
            for (var i = 0; i < params.fields.length; ++i) {
                if (__recordContainsField(record, params.fields[i]) !== true) {
                    Log.debug( "Fields: ", params.fields[i], " was not found in record:\n", uneval( record ) );
                    result.push(ValidateErrors.recordError(TemplateUrl.getUrlForField(params.fields[i], params.template),
                                ResourceBundle.getStringFormat( bundle, "field.mandatory.error", params.fields[i] ) ) );
                }
            }
            return result;
        }
        finally {
            Log.trace ( "Exit - RecordRules.fieldsMandatory(): ", result );
        }
    }

    /**
     * Checks that a maximum of the of the fields given as a parameter is
     * present in the record.
     * @syntax RecordRules.conflictingFields(record, params)
     * @param {object} record
     * @param {object} params should contain an array of conflicting fieldnames. The array must be keyed on fields
     * // TODO
     * @return {object}
     * @name RecordRules.conflictingFields
     * @method
     */
    function conflictingFields( record, params ) {
        Log.trace ( "Enter - RecordRules.conflictingFields( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("params.fields", params.fields).instanceOf(Array);
            var foundFields = {};
            var result = [];
            for (var i = 0; i < record.fields.length; i++) {
                if (!foundFields.hasOwnProperty(foundFields[record.fields[i].name])) {
                    foundFields[record.fields[i].name] = 1;
                } else {
                    foundFields[record.fields[i].name]++;
                }
            }
            var found = {'counter': 0};
            for (var j = 0; j < params.fields.length; ++j) {
                if (foundFields.hasOwnProperty(params.fields[j])) {
                    found.counter++;
                    if (found.counter > 1) {
                        result.push(ValidateErrors.recordError("", ResourceBundle.getStringFormat( bundle, "fields.conflicting.error", params.fields[j], found.name ) ) );
                    } else {
                        found.name = params.fields[j];
                    }
                }
            }
            return result;
        }
        finally {
            Log.trace ( "Exit - RecordRules.conflictingFields(): ", result );
        }
    }

    /**
     * Checks that only fields from the template are used.
     * @syntax RecordRules.optionalFields( record, params )
     * @param {object} record
     * @param {object} params should contain an array of usable fields. The array must be keyed on fields
     * @return {object}
     * @name RecordRules.optionalFields
     * @method
     */
    function optionalFields( record, params ) {
        Log.trace ( "Enter - RecordRules.optionalFields( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("params.fields", params.fields).instanceOf(Array);

            var positiveFields = params;
            var negativeFields = [];
            for (var i = 0; i < record.fields.length; ++i) {
                if (positiveFields.fields.indexOf(record.fields[i].name) === -1) {
                    negativeFields.push(record.fields[i].name);
                }
            }
            if (negativeFields.length > 0) {
                result = [ValidateErrors.recordError("", ResourceBundle.getStringFormat( bundle, "fields.optional.error", negativeFields ) ) ];
            }
            return result;
        }
        finally {
            Log.trace ( "Enter - RecordRules.optionalFields(): ", result );
        }
    }

    /**
     * Checks that only allowed fields are repeated in the record.
     * @syntax RecordRules.repeatableFields( record, params )
     * @param {object} record
     * @param {object} params must contain a key 'fields' with an array of fields that can repeat
     * params example:
     * {'fields': []}
     * {'fields': ['002']}
     * {'fields': ['002','003','004','042','666','999']}
     * @return {object}
     * @name RecordRules.repeatableFields
     * @method
     */
    function repeatableFields( record, params ) {
        Log.trace ( "Enter - RecordRules.repeatableFields( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.check("params.fields", params['fields']).instanceOf(Array);

            var foundFields = {};
            var result = [];
            for (var i = 0; i < record.fields.length; i++) {
                if (!foundFields.hasOwnProperty(record['fields'][i]['name'])) {
                    foundFields[record['fields'][i]['name']] = 1;
                } else {
                    foundFields[record['fields'][i]['name']]++;
                }
            }
            var paramsFields = params['fields'];
            var paramsValues = {};
            for (var j = 0; j < paramsFields.length; ++j) {
                paramsValues[paramsFields[j]] = 1;
            }
            // saves an iteration , via Object.keys
            for (var key in foundFields) {
                if (foundFields.hasOwnProperty(key)) {
                    if (paramsValues[key] === undefined && foundFields[key] > 1) {
                        result.push(ValidateErrors.recordError("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", key, foundFields[key] ) ) );
                    }
                }
            }
            return result;
        }
        finally {
            Log.trace ( "Exit - RecordRules.repeatableFields(): ", result );
        }
    }

    /**
     * Validation rule to checks that a subfield is not presented in the record at the
     * same time as another subfield.
     *
     * @syntax RecordRules.conflictingSubfields( record, params )
     *
     * @param {Object} record A DanMarc2 record as descriped in DanMarc2Converter
     * @param {Object} params Object of parameters. The property 'subfields' is an
     *                 Array of field/subfield names on the form <fieldname><subfieldname>.
     *
     * @return {Array}
     *
     * @name RecordRules.conflictingSubfields
     * @method
     */
    function conflictingSubfields( record, params ) {
        Log.trace ( "Enter - RecordRules.conflictingSubfields( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.subfields", params.subfields ).instanceOf( Array );

            // Convert to Record so we can use its utility functions.
            var marc = DanMarc2Converter.convertToDanMarc2( record );

            // Array of found subfields. If this array contains 2 or more items, when we
            // have a validation error.
            var foundSubfields = [];

            for( var i = 0; i < params.subfields.length; i++ ) {
                var arg = params.subfields[ i ];
                if( arg.length !== 4 ) {
                    Log.debug( ResourceBundle.getString( bundle, "conflictingSubfields.params.subfields.error" ), arg, params.subfields );
                    throw ResourceBundle.getStringFormat( bundle, "conflictingSubfields.params.subfields.error", arg, params.subfields );
                }
                var fieldName = arg.substr( 0, 3 );
                var subfieldName = arg[ 3 ];

                marc.eachField( new RegExp( fieldName ), function( field ) {

                    field.eachSubField( new RegExp( subfieldName ), function( field, subfield ) {

                        if( foundSubfields.indexOf( arg ) == -1 ) {
                            foundSubfields.push( arg )
                        }
                    })
                });

                if( foundSubfields.length > 1 ) {
                    var message = ResourceBundle.getStringFormat( bundle, "conflictingSubfields.validation.error", foundSubfields[0], foundSubfields[1] );
                    return result = [ ValidateErrors.recordError( "TODO:fixurl", message ) ];
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecordRules.conflictingSubfields(): ", result );
        }
    }

    /**
     * Verifies that if one of the fields from params is present, all must be present.
     * @syntax RecordRules.allFieldsMandatoryIfOneExist( record, params )
     * @param {object} record
     * @param {object} params must contain a key 'fields' with an array of fields that must be present
     * params example:
     * {'fields': ['008','009','038','039','100','110','239','245','652']}
     * @return {object}
     * @name RecordRules.allFieldsMandatoryIfOneExist
     * @method
     */
    function allFieldsMandatoryIfOneExist( record, params) {
        Log.trace ( "Enter - RecordRules.allFieldsMandatoryIfOneExist( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );

            var totalFieldsFound = 0;
            var foundFields = [];
            var field;
            var totalFieldsToCheckFor = params.fields.length;
            for ( var i = 0 ; i < totalFieldsToCheckFor ; ++i ) {
                field = params.fields[i];
                if ( __recordContainsField( record, field ) ) {
                    totalFieldsFound += 1;
                    foundFields.push( { name: field, value: true } );
                } else {
                    foundFields.push( { name: field, value: false } );
                }
            }
            if ( totalFieldsFound > 0 && totalFieldsFound < totalFieldsToCheckFor ) {
                foundFields.forEach( function(f){
                    if ( f.value === false ) {
                        var message = ResourceB undle.getStringFormat( bundle, "field.mandatory.error", f.name );
                        result.push( ValidateErrors.recordError( "TODO:fixurl", message ) );
                    }
                });
            }
            return result;
        } finally {
            Log.trace( "Exit - RecordRules.allFieldsMandatoryIfOneExist(): ", result );
        }

    }

    function __recordContainsField( record, fieldName ) {
        Log.trace ( "RecordRules.__recordContainsField" );
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                return true;
            }
        }
        return false;
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'recordSorted' : recordSorted,
        'idFieldExists' : idFieldExists,
        'fieldsMandatory' : fieldsMandatory,
        'repeatableFields': repeatableFields,
        'conflictingFields' : conflictingFields,
        'conflictingSubfields': conflictingSubfields,
        'optionalFields' : optionalFields,
        'allFieldsMandatoryIfOneExist' : allFieldsMandatoryIfOneExist
    };

}( );
