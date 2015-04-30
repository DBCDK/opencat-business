//-----------------------------------------------------------------------------
use( "FieldRules" );
use( "UnitTest" );
use( "SafeAssert" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "fieldsIndicator", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

    var record = {};
    var field = {
        name : '001', indicator : '00', subfields : []
    };

    var params00 = {
        indicator : "00"
    };

    SafeAssert.equal( "00: is 00", [], FieldRules.fieldsIndicator( record, field, params00 ) );

    var errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", "00", "XX" );
    var errorXX = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var params01 = {
        indicator : "XX"
    };
    SafeAssert.equal( "00: is not XX", errorXX, FieldRules.fieldsIndicator( record, field, params01 ) );

    var paramsEmpty = {
        indicator : ""
    };

    errorMessage = ResourceBundle.getStringFormat( bundle, "field.indicator.error", "00", "" );
    var errorEmpty = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "00: is not empty", errorEmpty, FieldRules.fieldsIndicator( record, field, paramsEmpty ) );

} );

UnitTest.addFixture( "subfieldsMandatory", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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
    SafeAssert.equal( "1 testing with valid a param", [], FieldRules.subfieldsMandatory( record, field, paramsA ) );

    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "f", "001" );
    var errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsF = {
        'subfields' : ['f']
    };
    SafeAssert.equal( "2 testing with NON valid f param", errorFmissing, FieldRules.subfieldsMandatory( record, field, paramsF ) );

    var paramsABC = {
        'subfields' : ['a', 'b', 'c']
    };
    SafeAssert.equal( "3 testing with valid a,b,c param", [], FieldRules.subfieldsMandatory( record, field, paramsABC ) );

    errorFmissing = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    var paramsABF = {
        'subfields' : ['a', 'b', 'f']
    };
    SafeAssert.equal( "4 testing with NON valid  " + paramsABF.subfields + " param", errorFmissing, FieldRules.subfieldsMandatory( record, field, paramsABF ) );

    var errorXY = [];
    errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "x", "001" );
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfields.rule.error", "y", "001" );
    errorXY.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    var paramsAXY = {
        'subfields' : ['a', 'x', 'y']
    };
    SafeAssert.equal( "5 testing with NON valid  " + paramsAXY.subfields + " param", errorXY, FieldRules.subfieldsMandatory( record, field, paramsAXY ) );

} );

UnitTest.addFixture( "repeatableSubfields", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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
    var errorMessage = ResourceBundle.getStringFormat( bundle, "repeatable.subfields.rule.error", "a", 2 );
    var errors1a = [ValidateErrors.fieldError( "TODO:url", errorMessage )];
    SafeAssert.equal( "repeatableSubfields testing with NON valid " + params1a.subfields + " param", errors1a, FieldRules.repeatableSubfields( record, field, params1a ) );

    var params1b = {
        'subfields' : ['b']
    };
    SafeAssert.equal( "repeatableSubfields testing with valid b" + params1b.subfields + " param", [], FieldRules.repeatableSubfields( record, field, params1b ) );

    var params1ac = {
        'subfields' : ['a', 'c']
    };
    errorMessage = ResourceBundle.getStringFormat( bundle, "repeatable.subfields.rule.error", "a", 2 );
    var errors1ac = [ValidateErrors.fieldError( "TODO:url", errorMessage )];

    SafeAssert.equal( "repeatableSubfields testing with valid ac " + params1ac.subfields + " param", errors1ac, FieldRules.repeatableSubfields( record, field, params1ac ) );

} );

UnitTest.addFixture( "exclusiveSubfield", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );
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
    var error2 = [ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) ) ];
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
    var error3 = [
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "i" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "t" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "e" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "x" ) ),
        ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "exclusive.subfield.rule.error", "a", "b" ) )
    ];

    SafeAssert.equal( "3 exclusiveSubfield test not-ok", FieldRules.exclusiveSubfield( record, field3, undefined ), error3 );

    var field4 = {
        name : '001', indicator : '00', subfields : [{
            name : "b", value : "bVal"
        }]
    };
    SafeAssert.equal( "4 exclusiveSubfield test ok", FieldRules.exclusiveSubfield( record, field4, undefined ), [] );

} );

UnitTest.addFixture( "subfieldConditionalMandatory", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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

    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "xxx", "a", "a1Val" );
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
    var errorMessage = ResourceBundle.getStringFormat( bundle, "mandatory.subfield.conditional.rule.error", "d", "a", "a1Val,b1Val,c1Val" );
    var error = ValidateErrors.fieldError( "TODO:url", errorMessage );
    SafeAssert.equal( "7 Test of subfieldConditionalMandatory", FieldRules.subfieldConditionalMandatory( record, field, params ), [error] );
} );

UnitTest.addFixture( "Test RecordRules.fieldDemandsOtherFieldAndSubfield ", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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
    var message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", "096", "004", "a" );
    var errMissing004 = [ValidateErrors.recordError( "", message )];
    SafeAssert.equal( "1 testing fieldDemandsOtherFieldAndSubfield with invalid 004 field", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), errMissing004 );

    params = {
        field : "001", subfields : ["a", "b", "c"]
    }
    message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", "096", "001", "a,b,c" );
    var errMissingSubfieldABC = [ValidateErrors.recordError( "", message )];
    SafeAssert.equal( "2 testing fieldDemandsOtherFieldAndSubfield with invalid a,b,c subfields", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), errMissingSubfieldABC );

    params = {
        field : "002", subfields : ["a", "b", "c"]
    }
    SafeAssert.equal( "3 testing fieldDemandsOtherFieldAndSubfield with valid params", FieldRules.fieldDemandsOtherFieldAndSubfield( rec, field, params ), [] );
} );

UnitTest.addFixture( "FieldRules.upperCaseCheck", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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

    message = ResourceBundle.getStringFormat( bundle, "uppercase.rule.error", "A", "a", "003" );
    var errNoLowerCaseA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    SafeAssert.equal( "2 FieldRules.upperCaseCheck value", FieldRules.upperCaseCheck( record, fieldAb ), errNoLowerCaseA );

    var fieldaA = {
        "name" : '003', "indicator" : '00', subfields : [{
            'name' : "a", 'value' : "42"
        }, {
            'name' : "A", 'value' : "42"
        }]
    };

    message = ResourceBundle.getStringFormat( bundle, "uppercase.rule.error", "A", "a", "003" );
    var errNoTrailingA = [ValidateErrors.fieldError( 'TODO:fixurl', message )];
    SafeAssert.equal( "3 FieldRules.upperCaseCheck value", FieldRules.upperCaseCheck( record, fieldaA ), errNoTrailingA );
} );

UnitTest.addFixture( "FieldRules.subfieldHasValueDemandsOtherSubfield" , function() {
    var bundle = ResourceBundleFactory.getBundle( FieldRules.BUNDLE_NAME );

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
    var errorMsg = [ ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "subfield.has.value.demands.other.subfield.rule.error", "a", "001", "b", "002", "d" ) ) ];
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
    var errorMsg = [ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "subfield.has.value.demands.other.subfield.rule.error", "a", "001", "b", "002", "d" ) ) ];
    SafeAssert.equal( "3 subfieldHasValueDemandsOtherSubfield - not ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), errorMsg );

    record = {};
    record.fields = [field1];
    var errorMsg = [ValidateErrors.fieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "subfield.has.value.demands.other.subfield.rule.error", "a", "001", "b", "002", "d" ) ) ];
    SafeAssert.equal( "4 subfieldHasValueDemandsOtherSubfield - not ok", FieldRules.subfieldHasValueDemandsOtherSubfield( record, field1, params ), errorMsg );
} );
