EXPORTED_SYMBOLS = ['RecordRules'];
//-----------------------------------------------------------------------------
use( "TemplateUrl" );
use( "ValidateErrors" );
use( "ValueCheck" );
use( "Exception" );
use( "Log" );
//-----------------------------------------------------------------------------
/**
 * Module for validation rules for an entire record.
 * @file RecordRules is part of the jsValidation , and validates on record level
 * @namespace
 * @name RecordRules
 *
 */

var RecordRules = function( ) {

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
        Log.trace ( "RecordRules.recordSorted");
        ValueCheck.check( "record.fields", record.fields ).instanceOf( Array );
        var ret = [];
        var previous = "000";
        for ( var i = 0 ; i < record.fields.length ; ++i ) {
            if ( record.fields[i].name < previous ) {
                var message = 'Felt "' + record.fields[i].name + '" har forkert position i posten';
                return [ValidateErrors.recordError( TemplateUrl.getUrlForField( record.fields[i].name, params.template ), message )];
            }
            previous = record.fields[i].name;
        }
        return [];
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
        Log.trace ( "RecordRules.fieldsMandatory" );
        ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );
        var result = [];
        for ( var i = 0 ; i < params.fields.length ; ++i ) {
            if ( __recordContainsField( record, params.fields[i] ) !== true ) {
                result.push( ValidateErrors.recordError( TemplateUrl.getUrlForField( params.fields[i], params.template ),
                    'Field "' + params.fields[i] + '" mangler i posten' ) );
            }
        }
        return result;
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
        Log.trace( "RecordRules.conflictingFields" );

        ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );
        var foundFields = {};
        var result = [];
        for ( var i = 0; i < record.fields.length; i++ ) {
            if ( !foundFields.hasOwnProperty( foundFields[record.fields[i].name] ) ) {
                foundFields[record.fields[i].name] = 1;
            } else {
                foundFields[record.fields[i].name]++;
            }
        }
        var found = {'counter' : 0 };
        for ( var j = 0; j < params.fields.length; ++j ) {
            if ( foundFields.hasOwnProperty( params.fields[j] ) ) {
                found.counter++;
                if ( found.counter > 1 ) {
                    result.push (ValidateErrors.recordError( "", 'Følgende felt er til stede: "' + params.fields[j] + '" sammen med "' + found.name + '"' ));
                } else {
                    found.name = params.fields[j];
                }
            }
        }
        return result;
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
        Log.trace( "RecordRules.optionalFields" );
        ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );
        var positiveFields = params;
        var negativeFields = [];
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( positiveFields.fields.indexOf( record.fields[i].name ) === -1 ) {
                negativeFields.push( record.fields[i].name );
            }
        }
        var result = [];
        if ( negativeFields.length > 0 ) {
            result = [ValidateErrors.recordError( "", 'Følgende felter må ikke være i posten: "' + negativeFields + '"' )];
        }
        return result;
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
        Log.trace( "RecordRules.repeatableFields" );
        ValueCheck.check( "params.fields", params['fields'] ).instanceOf( Array );

        var foundFields = {};
        var result = [];
        for ( var i = 0; i < record.fields.length; i++ ) {
            if ( !foundFields.hasOwnProperty( record['fields'][i]['name'] ) ) {
                foundFields[record['fields'][i]['name']] = 1;
            } else {
                foundFields[record['fields'][i]['name']]++;
            }
        }
        var paramsFields = params['fields'];
        var paramsValues = {};
        for ( var j = 0; j < paramsFields.length; ++j ) {
            paramsValues[paramsFields[j]] = 1;
        }
        // saves an iteration , via Object.keys
        for (var key in foundFields ) {
            if  ( foundFields.hasOwnProperty ( key ) ) {
                if  ( paramsValues[key] === undefined && foundFields[key] > 1 ){
                    result.push( ValidateErrors.recordError( "TODO:fixurl", 'Feltet "' + key  + '" er til stede ' + foundFields[key]+ ' gange, men må ikke gentages' ) );
                }
            }
        }
        return result;
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
        Log.trace( "Enter - RecordRules.conflictingSubfields" );

        try {
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
                    Log.debug( "Argument is not a field/subfield: %s in param %s", arg, params.subfields );
                    throw StringUtil.sprintf( "Argument is not a field/subfield: %s in param %s", arg, params.subfields );
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
                    var message = StringUtil.sprintf( "Delfelt %s m\u00E5 ikke anvendes sammen med delfelt %s", foundSubfields[0], foundSubfields[1] );
                    return [ ValidateErrors.recordError( "TODO:fixurl", message ) ];
                }
            }

            return [];
        }
        finally {
            Log.trace( "Exit - RecordRules.conflictingSubfields" );
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
        Log.trace( "Enter - RecordRules.allFieldsMandatoryIfOneExist" );
        try {
            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );

            var result = [];
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
                        var message = StringUtil.sprintf( "Felt %s blev ikke fundet", f.name );
                        result.push( ValidateErrors.recordError( "TODO:fixurl", message ) );
                    }
                });
            }
            return result;
        } finally {
            Log.trace( "Exit - RecordRules.allFieldsMandatoryIfOneExist" );
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

//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );

UnitTest.addFixture( "Test RecordRules.idFieldExists", function( ) {
    Assert.equalValue( "Empty object", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], RecordRules.idFieldExists( {} ) );
    Assert.equalValue( "Empty record", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], RecordRules.idFieldExists( {
        fields : []
    } ) );
    Assert.equalValue( "Valid record", [], RecordRules.idFieldExists( {
        fields : [{
            name : "001",
            indicator : "00",
            subfields : [{
                name : "a",
                value : "1 234 567 8"
            }]
        }]
    } ) );
} );

UnitTest.addFixture( "Test RecordRules.fieldsMandatory", function( ) {
    var record = {
        fields : [{
            name : '001',
            indicator : '00',
            subfields : []
        }, {
            name : '002',
            indicator : '00',
            subfields : []
        }, {
            name : '003',
            indicator : '00',
            subfields : []
        }]
    };

    var params00123 = {
        'fields' : ['001', '002', '003']
    };
    SafeAssert.equal( "1 testing with valid " + params00123 + " param", RecordRules.fieldsMandatory( record, params00123 ), [] );

    var errorMissing004 = [ValidateErrors.recordError( "", 'Field "004" mangler i posten' )];
    var params00124 = { 'fields' : ['001', '002', '004'] };
    SafeAssert.equal( "2 testing with invalid " + params00124 + " param", RecordRules.fieldsMandatory( record, params00124 ), errorMissing004 );

    var errorMissing000 = ValidateErrors.recordError( "", 'Field "000" mangler i posten' );
    var errorMissing005 = ValidateErrors.recordError( "", 'Field "005" mangler i posten' );
    errorMissing004 = ValidateErrors.recordError( "", 'Field "004" mangler i posten' );
    var errors = [errorMissing000, errorMissing005, errorMissing004];
    var params00054 = {
        'fields' : ['000', '005', '004']
    };
    SafeAssert.equal( "3 testing with invalid " + errors + " param", RecordRules.fieldsMandatory( record, params00054 ), errors );
} );

UnitTest.addFixture( "Test RecordRules.conflictingFields", function( ) {
    var record = {
        fields : [{
            name : '001'
        }, {
            name : '002'
        }, {
            name : '003'
        }, {
            name : '004'
        }, {
            name : '005'
        }, {
            name : '006'
        }, {
            name : '007'
        }, {
            name : '008'
        }, {
            name : '009'
        }, {
            name : '010'
        }]
    };
    var recordFieldUndef = {
        fields : undefined
    };
    var recordUndef = undefined;

    var params1 = {'fields' : ['001'] };
    SafeAssert.equal( "1 testing with valid " + params1 + " param", RecordRules.conflictingFields( record, params1 ), [] );

    var params2 = {'fields' : []};
    Assert.exception( "2 testing with empty param", 'RecordRules.conflictingFields(record, params2)' );

    var params3 = {'fields' : ['001']};
    Assert.exception( "3 testing with empty record.fields", 'RecordRules.conflictingFields(recordFieldUndef, params3)' );

    var params4 = {'fields' : ['001']};
    Assert.exception( "4 testing with empty record", 'RecordRules.conflictingFields(recordUndef, params4)' );

    var params5 = {'fields' : ['001', '002', '003']};
    var errorVal5 = ValidateErrors.recordError( "", 'Følgende felt er til stede: "002" sammen med "001"' );
    var errorVal6 = ValidateErrors.recordError( "", 'Følgende felt er til stede: "003" sammen med "001"' );
    var errorTooMany = [errorVal5,errorVal6];
    SafeAssert.equal( "length of value to short 1", RecordRules.conflictingFields( record, params5 ), errorTooMany);

    var params6 = {'fields' : ['001', '011', '012', '013', '014', '015', '016']};
    SafeAssert.equal( "length of value to short 2", RecordRules.conflictingFields( record, params6 ), [] );
} );

UnitTest.addFixture( "Test RecordRules.optionalFields", function( ) {
    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }, {
            'name' : '004'
        }, {
            'name' : '005'
        }, {
            'name' : '006'
        }, {
            'name' : '007'
        }, {
            'name' : '008'
        }, {
            'name' : '009'
        }, {
            'name' : '010'
        }]
    };
    var recordFieldUndef = {
        fields : undefined
    };

    var params1 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']};
    SafeAssert.equal( "1 testing with valid params", RecordRules.optionalFields( record, params1 ), [] );

    var params2 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020']};
    SafeAssert.equal( "2 testing with valid params", RecordRules.optionalFields( record, params2 ), [] );

    var params3 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009']};
    var error3 = [ValidateErrors.recordError( "", 'Følgende felter må ikke være i posten: "010"' )];
    SafeAssert.equal( "3 testing with valid params", RecordRules.optionalFields( record, params3 ), error3 );

    var params4 = [];
    Assert.exception( "4 testing with empty params", 'RecordRules.optionalFields(record, params4)' );

    var params5 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']};
    SafeAssert.equal( "5 testing with empty record", RecordRules.optionalFields( record, params5 ), [] );
} );

UnitTest.addFixture( "Test RecordRules.repeatableFields", function( ) {
    var record1 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}]};
    var params1 = {'fields': ['003']};
    SafeAssert.equal( "1 testing with valid params and data", RecordRules.repeatableFields( record1, params1 ), [] );

    var record2 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}, {'name': '003'}]};
    var params2 = {'fields': ['001','004']};
    var error2 = [ValidateErrors.recordError( "TODO:fixurl", 'Feltet "003" er til stede 3 gange, men må ikke gentages' )];
    SafeAssert.equal( "2 testing with valid params, error in data", RecordRules.repeatableFields( record2, params2 ), error2 );

    var record3 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'}, {'name': '003'},
        {'name': '004'}, {'name': '004'}, {'name': '005'}, {'name': '006'}, {'name': '007'},
        {'name': '008'}, {'name': '009'}, {'name': '010'}, {'name': '010'}, {'name': '010'}]};
    var params3 = {'fields': ['002','004','010']};
    SafeAssert.equal( "3 testing with valid params and data", RecordRules.repeatableFields( record3, params3 ), [] );

    var record4 = {'fields': [{'name': '001'}]};
    var params4 = {'fields': ['002','003','004','005','006','007','008','009','010']};
    SafeAssert.equal( "4 testing with valid params and data", RecordRules.repeatableFields( record4, params4 ), [] );

    var record5 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'},
        {'name': '003'}, {'name': '003'}, {'name': '006'}, {'name': '006'}]};
    var params5 = {'fields': ['001','004','005']};
    var error5 = [];
    error5.push(ValidateErrors.recordError( "TODO:fixurl", 'Feltet "002" er til stede 3 gange, men må ikke gentages' ));
    error5.push(ValidateErrors.recordError( "TODO:fixurl", 'Feltet "003" er til stede 2 gange, men må ikke gentages' ));
    error5.push(ValidateErrors.recordError( "TODO:fixurl", 'Feltet "006" er til stede 2 gange, men må ikke gentages' ));
    SafeAssert.equal( "5 testing with valid params, error in data", RecordRules.repeatableFields( record5, params5 ), error5 );

    var record6 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}]};
    var params6 = {'fields': []};
    SafeAssert.equal( "6 testing with valid params and data", RecordRules.repeatableFields( record6, params6 ), [] );
} );

UnitTest.addFixture( "RecordRules.conflictingSubfields", function( ) {
    var record1 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}]};
    var params1 = {'fields': ['003']};
} );

UnitTest.addFixture( "Test RecordRules.recordSorted", function( ) {
    var recordCorrect = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }]
    };

    SafeAssert.equal( "1 testing with valid record", RecordRules.recordSorted( recordCorrect, {}), [] );

    var recordBad = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '003'
        }, {
            'name' : '002'
        }]
    };
    var errMsg = [ValidateErrors.recordError( "", 'Felt \"002\" har forkert position i posten' )];
    SafeAssert.equal( "2 testing with invalid record", RecordRules.recordSorted( recordBad, {} ), errMsg );

    var recordBad = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '003'
        }, {
            'name' : '002'
        }, {
            'name' : '001'
        }]
    };
    var errMsg = [ValidateErrors.recordError( "", 'Felt \"002\" har forkert position i posten' )];
    SafeAssert.equal( "3 testing with invalid record", RecordRules.recordSorted( recordBad, {} ), errMsg );

    var recordGood = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '001'
        }, {
            'name' : '001'
        }, {
            'name' : '001'
        }]
    };
    SafeAssert.equal( "4 testing with valid record", RecordRules.recordSorted( recordGood, {} ), [] );

} );
UnitTest.addFixture( "RecordRules.allFieldsMandatoryIfOneExist", function( ) {

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }, {
            'name' : '004'
        }]
    };
    var params = { fields: [ '001', '002', '003', '004' ]};
    var expectedResult = [];
    var actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 1", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [ValidateErrors.recordError( "TODO:fixurl", "Felt 003 blev ikke fundet" )];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 2", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '042'
        }]
    };
    expectedResult = [];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 3", actualResult, expectedResult );

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [
        ValidateErrors.recordError( "TODO:fixurl", "Felt 002 blev ikke fundet" ),
        ValidateErrors.recordError( "TODO:fixurl", "Felt 003 blev ikke fundet" ),
    ];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 4", actualResult, expectedResult );
} );
