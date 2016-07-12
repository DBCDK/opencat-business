//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
// use( "Assert" );
use( "FieldsIndicatorMakesSubfieldRepeatable" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "FieldsIndicatorMakesSubfieldRepeatable", function () {
    var bundle = ResourceBundleFactory.getBundle( FieldsIndicatorMakesSubfieldRepeatable.BUNDLE_NAME );
    var bundleKey = "field.indicator.subfield.repeated.error";

    var record = {};
    var field = {
        name: '001', indicator: '00', subfields: []
    };


    var field = {
        name: '001', indicator: '00', subfields: []
    };

    var params = {
        "indicators": ["01"],
        "subfieldNames": ["a"]
    };

    SafeAssert.equal( "testing with valid indicator", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );

    var field = {
        name: '001', indicator: '00', subfields: []
    };

    var params = {
        "indicators": ["00"],
        "subfieldNames": ["a"]
    };

    SafeAssert.equal( "testing with valid subfieldName", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '001', indicator: '01', subfields: [{
            name: "a", value: "a1Val"
        }, {
            name: "a", value: "a2Val"
        }, {
            name: "b", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["01"],
        "subfieldNames": ["a"]
    };

    SafeAssert.equal( "testing with valid indicator 01 and repeated a", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '001', indicator: '00', subfields: [{
            name: "a", value: "a1Val"
        }, {
            name: "a", value: "a2Val"
        }, {
            name: "b", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["01"],
        "subfieldNames": ["a"]
    };

    var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, params.subfieldNames, params.indicators );
    var error = [ValidateErrors.fieldError( "TODO:url", errorMessage )];

    SafeAssert.equal( "testing with invalid indicator and a repeated", error, FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '001', indicator: '00', subfields: [{
            name: "a", value: "a1Val"
        }, {
            name: "a", value: "a2Val"
        }, {
            name: "b", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["01"],
        "subfieldNames": ["a"]
    };

    var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, params.subfieldNames, params.indicators );
    var error = [ValidateErrors.fieldError( "TODO:url", errorMessage )];

    SafeAssert.equal( "testing with invalid indicator and a repeated", error, FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '860', indicator: '04', subfields: [{
            name: "c", value: "a1Val"
        }, {
            name: "c", value: "a2Val"
        }, {
            name: "z", value: "b1Val"
        }, {
            name: "z", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["04"],
        "subfieldNames": ["c", "z"]
    };


    SafeAssert.equal( "Huins test from userstory 1951", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '860', indicator: '00', subfields: [{
            name: "c", value: "a1Val"
        }, {
            name: "c", value: "a2Val"
        }, {
            name: "z", value: "b1Val"
        }, {
            name: "z", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["04"],
        "subfieldNames": ["c", "z"]
    };

    var error = [];
    for ( var i = 0; i < params.subfieldNames.length; i++ ) {
        var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, params.subfieldNames[i], params.indicators );
        error.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    }

    SafeAssert.equal( "Huins test 1 from userstory 1951", error, FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    var field = {
        name: '860', indicator: '00', subfields: [{
            name: "c", value: "a1Val"
        }, {
            name: "c", value: "a2Val"
        }, {
            name: "z", value: "b1Val"
        }, {
            name: "z", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["03", "04", "05"],
        "subfieldNames": ["c", "z"]
    };

    params.indicators.forEach( function ( indicator ) {
        field.indicator = indicator;
        SafeAssert.equal( "Huins test 2  with valid indicators from userstory 1951", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );
    } );

    var field = {
        name: '860', indicator: '00', subfields: [{
            name: "c", value: "a1Val"
        }, {
            name: "c", value: "a2Val"
        }, {
            name: "z", value: "b1Val"
        }, {
            name: "z", value: "b1Val"
        }]
    };

    var params = {
        "indicators": ["03", "04", "05"],
        "subfieldNames": ["c", "z"]
    };

    var error = [];
    params.subfieldNames.forEach( function ( sf ) {
        var errorMessage = ResourceBundle.getStringFormat( bundle, bundleKey, sf, params.indicators );
        error.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
    } );

    SafeAssert.equal( "Huins test 2 with invalid indicators from userstory 1951", error, FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );


    params.indicators.forEach( function ( indicator ) {
        field.indicator = indicator;
        SafeAssert.equal( "Huins test 2  with valid indicators from userstory 1951", [], FieldsIndicatorMakesSubfieldRepeatable.validateField( record, field, params ) );
    } );


} );
