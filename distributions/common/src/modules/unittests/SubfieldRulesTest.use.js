//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldRules module.
 */

//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "SubfieldRules" );
use( "UnitTest" );
use ( 'GenericSettings' )
//-----------------------------------------------------------------------------

UnitTest.addFixture( "SubfieldRules.subfieldCannotContainValue", function() {
    var record = {};
    var field = {};
    var subfield = {
        'name': "a",
        'value': "42"
    };
    var params ={values:[]};

    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldRules.subfieldCannotContainValue(record, field, subfield, params), []);
    
    var errorMsg = [{type:"CDTOValidationResponseSuccessEntryCollectionRecordFieldSubFieldUnstructuredValidationError", params:{url:"TODO:fixurl", message:"Delfelt \"a\" har v\xe6rdien \"42\" hvilket ikke er tilladt"}}]; 
    params = {values:["42"]};
    SafeAssert.equal("subfieldCannotContainValue with value that is not allowed", SubfieldRules.subfieldCannotContainValue(record, field, subfield, params), errorMsg);
    params = {values:[42]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldRules.subfieldCannotContainValue(record, field, subfield, params), errorMsg);
    
    params = {values:["30","x"]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldRules.subfieldCannotContainValue(record, field, subfield, params), []);
    params = {values:["42", "x"]};
    SafeAssert.equal("subfieldCannotContainValue with empty params array", SubfieldRules.subfieldCannotContainValue(record, field, subfield, params), errorMsg);
})

UnitTest.addFixture( "SubfieldRules.checkLength", function() {
    var record = {};
    var field = {};
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var paramsEqual = {'min': 2, 'max': 2};
    SafeAssert.equal("checkLength validates ok", SubfieldRules.checkLength(record, field, subfield, paramsEqual), []);

    var paramsNotEqualOk = {'min': 2, 'max': 40000};
    SafeAssert.equal("checkLength validates ok", SubfieldRules.checkLength(record, field, subfield, paramsNotEqualOk), []);

    var paramsWrong = {'min': 3, 'max': 2};
    Assert.exception("checkLength wrong parameters", 'SubfieldRules.checkLength(record, field, subfield, paramsWrong)');

    var paramsNoValues = {};
    Assert.exception("checkLength no parameters", 'SubfieldRules.checkLength(record, field, subfield, noParams)');

    var paramsValueTooShort = {'min': 4};
    var errorVal1 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "a" er mindre end "4" tegn langt' )];
    SafeAssert.equal("length of value to short", SubfieldRules.checkLength(record, field, subfield, paramsValueTooShort), errorVal1);

    var paramsValueTooLong = {'max': 1};
    var errorVal2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "a" er mere end "1" tegn langt' )];
    SafeAssert.equal("length of value to short", SubfieldRules.checkLength(record, field, subfield, paramsValueTooLong), errorVal2);
});

UnitTest.addFixture( "SubfieldRules.checkValue", function() {
    var record = {};
    var field = {};
    var subfield = {
        'name': "b",
        'value': "870970"
    };

    var paramsHasValue = {'values': [1, 2, 3, 4, "870970"]};
    SafeAssert.equal("value is correct", SubfieldRules.checkValue(record, field, subfield, paramsHasValue), []);

    var paramsNoValues = {'values': []};
    var errorVal1 = [ValidateErrors.subfieldError( "TODO:fixurl", 'værdien er "870970" og er ikke end del af de valide værdier: ""' )];
    SafeAssert.equal("value is not correct", SubfieldRules.checkValue(record, field, subfield, paramsNoValues), errorVal1);

    var paramsNoMatchingValues = {'values': [1, 2, 3, 4, 5]};
    var errorVal2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'værdien er "870970" og er ikke end del af de valide værdier: "1", "2", "3", "4", "5"' )];
    SafeAssert.equal("value is not correct", SubfieldRules.checkValue(record, field, subfield, paramsNoMatchingValues), errorVal2);
});

UnitTest.addFixture( "SubfieldRules.checkFaust", function() {
    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "faust", 'value': "50984508" };
    SafeAssert.equal( "1 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "faust", 'value': "43640224" };
    SafeAssert.equal( "2 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield2, params ), [] );

    var subfield3 = {'name': "faust", 'value': "50984507" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "faust" med værdien "50984507" er ikke et gyldigt faustnummer' )];
    SafeAssert.equal( "3 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield3, params ), error3 );

    var subfield4 = {'name': "faust", 'value': "50984508A" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "faust" må kun bestå af tal' )];
    SafeAssert.equal( "4 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield4, params ), error4 );

    var subfield5 = {'name': "faust", 'value': "42" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "faust" er mindre end 8 tegn langt' )];
    SafeAssert.equal( "5 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield5, params ), error5 );

    var subfield6 = {'name': "faust", 'value': "5098 4508" };
    SafeAssert.equal( "6 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "faust", 'value': " 5 0 9 8  4 5 0 8  " };
    SafeAssert.equal( "7 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield7, params ), [] );

    var subfield8 = {'name': "faust", 'value': "22438980" };
    SafeAssert.equal( "8 SubfieldRules.checkFaust with valid faust number", SubfieldRules.checkFaust( record, field, subfield8, params ), [] );
});

UnitTest.addFixture( "SubfieldRules.checkISBN10", function() {
    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "isbn10", 'value': "0-201-53082-1" };
    SafeAssert.equal( "1 SubfieldRules.checkISBN10 with valid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "isbn10", 'value': "0-201-53082-2" };
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn10" med værdien "0-201-53082-2" er ikke et korrekt ISBN10 tal' )];
    SafeAssert.equal( "2 SubfieldRules.checkISBN10 with invalid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield2, params ), error2 );

    var subfield3 = {'name': "isbn10", 'value': "0-201-53082-42" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn10" skal bestå af 10 tegn' )];
    SafeAssert.equal( "3 SubfieldRules.checkISBN10 with invalid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield3, params ), error3 );

    var subfield4 = {'name': "isbn10", 'value': "0-201-53082" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn10" skal bestå af 10 tegn' )];
    SafeAssert.equal( "4 SubfieldRules.checkISBN10 with invalid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield4, params ), error4 );

    var subfield5 = {'name': "isbn10", 'value': "0-201-53O82-1" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn10" må kun bestå af tal' )];
    SafeAssert.equal( "5 SubfieldRules.checkISBN10 with invalid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield5, params ), error5 );

    var subfield6 = {'name': "isbn10", 'value': "0-8044-2957-X" };
    SafeAssert.equal( "1 SubfieldRules.checkISBN10, valid isbn10 number with trailing x", SubfieldRules.checkISBN10( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "isbn10", 'value': "0-8044-2967-X" };
    var error7 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn10" med værdien "0-8044-2967-X" er ikke et korrekt ISBN10 tal' )];
    SafeAssert.equal( "2 SubfieldRules.checkISBN10 with invalid isbn10 number", SubfieldRules.checkISBN10( record, field, subfield7, params ), error7 );
});

UnitTest.addFixture( "SubfieldRules.checkISBN13", function() {
    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "isbn13", 'value': "5-705467-007641" };
    SafeAssert.equal( "1 SubfieldRules.checkISBN13 with valid isbn13 number", SubfieldRules.checkISBN13( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "isbn13", 'value': "5-705467-007642" };
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn13" med værdien "5-705467-007642" er ikke et korrekt ISBN13 tal' )];
    SafeAssert.equal( "2 SubfieldRules.checkISBN13 with invalid isbn13 number", SubfieldRules.checkISBN13( record, field, subfield2, params ), error2 );

    var subfield3 = {'name': "isbn13", 'value': "5-705467-0076411" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn13" skal bestå af 13 tegn' )];
    SafeAssert.equal( "3 SubfieldRules.checkISBN13 with invalid isbn13 number", SubfieldRules.checkISBN13( record, field, subfield3, params ), error3 );

    var subfield4 = {'name': "isbn13", 'value': "5-705467-00764" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn13" skal bestå af 13 tegn' )];
    SafeAssert.equal( "3 SubfieldRules.checkISBN13 with invalid isbn13 number", SubfieldRules.checkISBN13( record, field, subfield4, params ), error4 );

    var subfield5 = {'name': "isbn13", 'value': "5-705467-0O7641" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "isbn13" må kun bestå af tal' )];
    SafeAssert.equal( "3 SubfieldRules.checkISBN13 with invalid isbn13 number", SubfieldRules.checkISBN13( record, field, subfield5, params ), error5 );
});

UnitTest.addFixture( "SubfieldRules.checkChangedValue", function() {
    var params;
    var msg_format = "Posttypen (felt 004a) m\u00E5 ikke \u00E6ndre sig fra %s til %s";

    params = { toValues: [], fromValues: [] };
    SafeAssert.equal( "Empty param values", SubfieldRules.checkChangedValue( { fields: [] }, {}, {}, params ), [] );

    params = { toValues: [ "e", "b" ], fromValues: [ "s", "h" ] };
    SafeAssert.equal( "Params with new empty record", SubfieldRules.checkChangedValue( { fields: [] }, {}, {}, params ), [] );

    var record = {};
    var field = {};
    var subfield = {};
    var marcRecord = undefined;

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b xxx\n" +
            "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "001b is NaN", SubfieldRules.checkChangedValue( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "New record with type not in fromValues", SubfieldRules.checkChangedValue( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a e"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "New record with type in fromValues", SubfieldRules.checkChangedValue( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "Update record with same record type", SubfieldRules.checkChangedValue( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "e";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with unknown old value and unknown new value",
                      SubfieldRules.checkChangedValue( record, field, subfield, params ),
                      [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a b"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "e";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with known old value and unknown new value",
                      SubfieldRules.checkChangedValue( record, field, subfield, params ),
                      [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "h";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with unknown old value and known new value",
                      SubfieldRules.checkChangedValue( record, field, subfield, params ),
                      [] );

    marcRecord = new Record();
    marcRecord.fromString(
            "001 00 *a 1 234 567 8 *b 870970\n" +
            "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "s";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with wrong record type",
                      SubfieldRules.checkChangedValue( record, field, subfield, params ),
                      [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( msg_format, "e", "s" ) ) ] );
});

UnitTest.addFixture( "SubfieldRules.checkSubfieldNotUsedInParentRecord", function() {
    function callRule( record, field, subfield ) {
        return SubfieldRules.checkSubfieldNotUsedInParentRecord( record, field, subfield, undefined, undefined );
    }

    // Case: No parent record.
    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    var field = record.fields[2];
    var subfield = field.subfields[0];
    SafeAssert.equal( "No parent record", callRule( record, field, subfield ), [] );

    // Case: Parent record -> 001b Not-A-Number
    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 234 567 8 *b 870qqq *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8\n" +
        "008 00 *t xx"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[3];
    subfield = field.subfields[0];
    SafeAssert.equal( "Parent record: 001b Not-A-Number", callRule( record, field, subfield ), [] );

    // Case: Parent record -> Subfield not used.
    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8\n" +
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[3];
    subfield = field.subfields[0];
    SafeAssert.equal( "Parent record: Subfield not used", callRule( record, field, subfield ), [] );

    // Case: Parent record -> Subfield is used in parent record.
    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a h\n" +
        "008 00 *t xx"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a b\n" +
        "014 00 *a 1 234 567 8\n" +
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[3];
    subfield = field.subfields[0];

    var message = StringUtil.sprintf( "Delfelt %s m\u00E5 ikke anvendes i posten '%s', da " +
                                      "delfeltet allerede er anvendt i flerbindsv\u00E6rket.",
                                      "008t", "1 234 567 8" );
    SafeAssert.equal( "Parent record: Subfield is used in parent record", callRule( record, field, subfield ), [ ValidateErrors.subfieldError( "TODO:fixurl", message ) ] );
} );

UnitTest.addFixture( "SubfieldRules.checkSubfieldNotUsedInChildrenRecords", function() {
    function callRule(record, field, subfield) {
        return SubfieldRules.checkSubfieldNotUsedInChildrenRecords( record, field, subfield, undefined, undefined );
    }


    // Case: No children.
    RawRepoClientCore.clear();

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    var field = record.fields[2];
    var subfield = field.subfields[0];
    SafeAssert.equal( "No children", callRule( record, field, subfield ), [] );

    // Case: Subfield not used in any children.
    RawRepoClientCore.clear();

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 256 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 512 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[2];
    subfield = field.subfields[0];
    SafeAssert.equal( "Subfield not used in any children", callRule( record, field, subfield ), [] );

    // Case: Subfield used in one child record.
    RawRepoClientCore.clear();

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 256 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 2 512 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx\n" +
        "014 00 *a 1 234 567 8"
    );
    RawRepoClientCore.addRecord( marcRecord );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *a i\n" +
        "008 00 *t xx"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[2];
    subfield = field.subfields[0];
    SafeAssert.equal( "Subfield used in one child record", callRule( record, field, subfield ),
                      [ ValidateErrors.subfieldError( "TODO:fixurl", "Delfelt 008t m\u00E5 kun anvendes i en post i et flerbindsv\u00E6k" ) ] );
} );

UnitTest.addFixture( "SubfieldRules.lookupValue", function() {
    Assert.exception( "No params", "SubfieldRules.lookupValue( {}, {}, {}, undefined, undefined )" );
    Assert.exception( "Params: No register", "SubfieldRules.lookupValue( {}, {}, {}, {}, undefined )" );
    Assert.exception( "Params: Wrong register type", "SubfieldRules.lookupValue( {}, {}, {}, { register: 1 }, undefined )" );
    Assert.exception( "Params: No exist", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a' }, undefined )" );
    Assert.exception( "Params: Wrong exist type", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a', exist: 3 }, undefined )" );
    Assert.exception( "No settings", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a', exist: true }, undefined )" );
    
    GenericSettings.setSettings( {} );
    Assert.exception( "Settings: No solr.url", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );

    var settings = {};
    settings[ 'solr.url' ] = undefined;
    GenericSettings.setSettings( settings );
    Assert.exception( "Settings: solr.url is undefined", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );

    settings[ 'solr.url' ] = 37;
    GenericSettings.setSettings( settings );
    Assert.exception( "Settings: solr.url has wrong type", "SubfieldRules.lookupValue( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );

    settings[ 'solr.url' ] = "http://localhost:12100/solr/raw-repo-index";
    GenericSettings.setSettings( settings );

    var record = {};
    var field = {};
    var subfield = {};
    var marcRecord = undefined;

    var exist_message = "V\u00E6rdien %s (delfelt %s%s) kan ikke findes i en eksisterende post.";
    var notexist_message = "V\u00E6rdien %s (delfelt %s%s) findes allerede i en eksisterende post.";

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 06605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: true };
    SafeAssert.equal( "001a must exist: OK", SubfieldRules.lookupValue( record, field, subfield, params, GenericSettings ), [] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 76605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: true };
    SafeAssert.equal( "001a must exist: Failure", SubfieldRules.lookupValue( record, field, subfield, params, GenericSettings ),
            [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( exist_message, "76605141", "001", "a" ) ) ] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 76605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: false };
    SafeAssert.equal( "001a must not exist: OK", SubfieldRules.lookupValue( record, field, subfield, params, GenericSettings ), [] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 06605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: false };
    SafeAssert.equal( "001a must not exist: Failure", SubfieldRules.lookupValue( record, field, subfield, params, GenericSettings ),
            [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( notexist_message, "06605141", "001", "a" ) ) ] );

});

UnitTest.addFixture( "SubfieldRules.__checkLengthMin", function() {
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var params1 = {'min': 1};
    SafeAssert.equal( "1 SubfieldRules.__checkLengthMin, ok test", SubfieldRules.__checkLengthMin( subfield, params1 ), [] );

    var params2 = {'min': 42};
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "a" er mindre end "42" tegn langt' )];
    SafeAssert.equal( "2 SubfieldRules.__checkLengthMin, error test", SubfieldRules.__checkLengthMin( subfield, params2 ), error2 );
} );

UnitTest.addFixture( "SubfieldRules.__checkLengthMax", function() {
    var subfield = {
        'name': "a",
        'value': "42"
    };

    var params1 = {'max': 42};
    SafeAssert.equal( "1 SubfieldRules.__checkLengthMax, ok test", SubfieldRules.__checkLengthMax( subfield, params1 ), [] );

    var params2 = {'max': 1};
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", 'delfelt "a" er mere end "1" tegn langt' )];
    SafeAssert.equal( "2 SubfieldRules.__checkLengthMax, error test", SubfieldRules.__checkLengthMax( subfield, params2 ), error2 );
} );

UnitTest.addFixture( "SubfieldRules.__isNumber", function() {
    var params1 = "42";
    SafeAssert.equal( "1 SubfieldRules.__isNumber, true", SubfieldRules.__isNumber(params1), true );

    var params2 = "4S2";
    SafeAssert.equal( "1 SubfieldRules.__isNumber, true", SubfieldRules.__isNumber(params2), false );

    var params3 = "42O";
    SafeAssert.equal( "1 SubfieldRules.__isNumber, true", SubfieldRules.__isNumber(params3), false );

} );

UnitTest.addFixture( "SubfieldRules.checkReference", function( ) {

    var record = {
        fields : [{
            name : '001', indicator : '00', subfields : []
        }, {
            name : '002', indicator : '00', subfields : []
        }, {
            name : '003', indicator : '00', subfields : []
        }, {
            name : '003', indicator : '00', subfields : [{
                'name' : "a", 'value' : "42"
            }, {
                'name' : "\u00E5", 'value' : "12345"
            }]
        }, {
            name : '004', indicator : '00', subfields : [{
                'name' : "a", 'value' : "42"
            }, {
                'name' : "b", 'value' : "42"
            }, {
                'name' : "c", 'value' : "42"
            }, {
                'name' : "å", 'value' : "12345"
            }]
        },{
            name : '004', indicator : '00', subfields : [{
                'name' : "a", 'value' : "42"
            }, {
                'name' : "b", 'value' : "42"
            }, {
                'name' : "c", 'value' : "42"
            }, {
                'name' : "d", 'value' : "42"
            },{
                'name' : "e", 'value' : "42"
            },{
                'name' : "å", 'value' : "12345"
            }]
        }]
    };

    var subfield = {
        'name' : "a", 'value' : "001"
    };
    SafeAssert.equal( "1 SubfieldRules.checkReference field exists", SubfieldRules.checkReference( record, undefined, subfield ), [] );
    subfield = {
        'name' : "a", 'value' : "005"
    };

    var error005Missing = [ValidateErrors.subfieldError( "TODO:fixurl", 'field nr :"005" findes ikke i posten' )];
    SafeAssert.equal( "2 SubfieldRules.checkReference field exists", SubfieldRules.checkReference( record, undefined, subfield ), error005Missing );

    subfield = {
        'name' : "a", 'value' : "005/12345"
    };
    SafeAssert.equal( "2,1 SubfieldRules.checkReference field exists", SubfieldRules.checkReference( record, undefined, subfield ), error005Missing );

    subfield = {
        'name' : "a", 'value' : "003/12345"
    };
    //SafeAssert.equal( "3 SubfieldRules.checkReference , valid check that value after forwardslash is present in subfield å", SubfieldRules.checkReference( record, undefined, subfield ), [] );

    subfield = {
        'name' : "a", 'value' : "003/23456"
    };
    var error003missing2345 = [ValidateErrors.subfieldError( "TODO:fixurl", 'Mangler værdien:"23456" i delfelt å , for et "003" felt' )];
    //SafeAssert.equal( "4 SubfieldRules.checkReference, valid check that value after forwardslash is present in subfield å ", SubfieldRules.checkReference( record, undefined, subfield ), error003missing2345 );
    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c)"
    };

    SafeAssert.equal( "5 SubfieldRules.checkReference valid value with forwardslashval and parenthesis", SubfieldRules.checkReference( record, undefined, subfield ), [] );
    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c,d)"
    };
    var err004MissingD = [ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "d"')];
    SafeAssert.equal( "6 SubfieldRules.checkReference valid value with forwardslash val and parenthesis, missing d", SubfieldRules.checkReference( record, undefined, subfield ), err004MissingD );

    var errD = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "d"');
    var errE = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "e"');
    var errF = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "f"');
    var errG = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "g"');
    var errH = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "1", felt :"004" mangler delfeltet "h"');

    var errFTwo = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "2", felt :"004" mangler delfeltet "f"');
    var errGTwo = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "2", felt :"004" mangler delfeltet "g"');
    var errHTwo = ValidateErrors.subfieldError ("TODO:fixurl",'I nummer "2", felt :"004" mangler delfeltet "h"');

    var errArr = [errD,errE,errF,errG,errH,errFTwo,errGTwo,errHTwo];
    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c,d,e,f,g,h)"
    };
    SafeAssert.equal( "7 SubfieldRules.checkReference valid value with forwardslash val and parenthesis, missing d", SubfieldRules.checkReference( record, undefined, subfield ), errArr );
} );

UnitTest.addFixture( "SubfieldRules.subfieldsDemandsOtherSubfields", function( ) {
    var record = {
    };
    var fieldab = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    var subfield = {
        'name' : "a", 'value' : ""
    };


    SafeAssert.equal( "1 SubfieldRules.subfieldsDemandsOtherSubfields valid value", SubfieldRules.subfieldsDemandsOtherSubfields( record, fieldab, subfield ), [] );
    //var error003a = [ValidateErrors.subfieldError( "TODO:fixurl", 'I felt :"004" mangler delfeltet "d"' )];

    subfield = {
        'name' : "b", 'value' : ""
    };

    var fielda = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }]
    };

    subfield = {
        'name' : "a", 'value' : ""
    };
    var errMsg = 'Feltet "003" skal indeholde andre delfelter end delfelt "a"';
    var errContainsBandA = [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )];
    SafeAssert.equal( "3 SubfieldRules.subfieldsDemandsOtherSubfields valid value", SubfieldRules.subfieldsDemandsOtherSubfields( record, fielda, subfield ), errContainsBandA );
});

UnitTest.addFixture( "SubfieldRules.subfieldConditionalMandatoryField", function( ) {
   var rec = {
        fields : [{
            name : '001', indicator : '00', subfields : []
        }, {
            name : '002', indicator : '00', subfields : ["a", "b", "c"]
        }, {
            name : '010', indicator : '00', subfields : []
        }]
    };

    var fieldab = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "b", 'value' : "42"
        }]
    };

    var subfield = {
        'name' : "b", 'value' : "not42"
    };

    params = { 'subfieldValue': '42', 'fieldMandatory': '010' };
    SafeAssert.equal( "1 SubfieldRules.subfieldConditionalMandatoryField valid value", SubfieldRules.subfieldConditionalMandatoryField( rec, fieldab, subfield, params ), [] );

    subfield = {
        'name' : "b", 'value' : "42"
    };
    params = { 'subfieldValue': '42', 'fieldMandatory': '010' };
    SafeAssert.equal( "2 SubfieldRules.subfieldConditionalMandatoryField valid value but nonexisting conditional subfield", SubfieldRules.subfieldConditionalMandatoryField( rec, fieldab, subfield, params ), [] );

    subfield = {
        'name' : "b", 'value' : "42"
    };

    var errMsg = 'Delfelt "b" har værdien "42" og felt "011" er derfor obligatorisk';
    var err = [ValidateErrors.subfieldError( "TODO:fixurl", errMsg )];
    params = {'subfieldValue': '42', 'fieldMandatory': '011' };
    SafeAssert.equal( "3 SubfieldRules.subfieldConditionalMandatoryField valid value but nonexisting conditional subfield", SubfieldRules.subfieldConditionalMandatoryField( rec, fieldab, subfield, params ), err );

});

