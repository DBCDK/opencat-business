//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckReference" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( CheckReference.validateSubfield, function( ) {
    var bundle = ResourceBundleFactory.getBundle( CheckReference.__BUNDLE_NAME );

    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }]
        }, {
            name: '910', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            },{
                'name': "z", 'value': "710"
            }]
        }]
    };

    var subfield = {
        'name' : "z", 'value' : "710"
    };

    SafeAssert.equal( "1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield( record, undefined, subfield ), [] );


    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: []
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            }]
        }, {
            name: '710', indicator: '00', subfields: [{
                'name': "\u00E5", 'value': "42"
            }]
        }, {
            name: '910', indicator: '00', subfields: [{
                'name': "a", 'value': "42"
            },{
                'name': "z", 'value': "710"
            }]
        }]
    };

    var subfield = {
        'name' : "z", 'value' : "710"
    };
    // TODO ask ljl about this , makes no sense, atleast in regards to the error message.
    SafeAssert.equal( "1 CheckReference.validateSubfield field exists and with a 710 field with danish aa", CheckReference.validateSubfield( record, undefined, subfield ), [] );

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
                'name' : "\u00E5", 'value' : "12345"
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
                'name' : "\u00E5", 'value' : "12345"
            }]
        }]
    };

    var subfield = {
        'name' : "a", 'value' : "001"
    };
    SafeAssert.equal( "1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield( record, undefined, subfield ), [] );
    subfield = {
        'name' : "a", 'value' : "005"
    };

    var error005Missing = [ ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.field", "005" ) ) ];
    SafeAssert.equal( "2 CheckReference.validateSubfield field exists", CheckReference.validateSubfield( record, undefined, subfield ), error005Missing );

    subfield = {
        'name' : "a", 'value' : "005/12345"
    };
    SafeAssert.equal( "2,1 CheckReference.validateSubfield field exists", CheckReference.validateSubfield( record, undefined, subfield ), error005Missing );

    subfield = {
        'name' : "a", 'value' : "003/12345"
    };
    SafeAssert.equal( "3 CheckReference.validateSubfield , valid check that value after forwardslash is present in subfield \u00E5", CheckReference.validateSubfield( record, undefined, subfield ), [] );

    subfield = {
        'name' : "a", 'value' : "003/23456"
    };

    var error003missing2345 = [ValidateErrors.subfieldError( "TODO:fixurl", 'Mangler værdien:"23456" i delfelt \u00E5 , for et "003" felt' )];
    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c)"
    };
    SafeAssert.equal( "5 CheckReference.validateSubfield valid value with forwardslashval and parenthesis", CheckReference.validateSubfield( record, undefined, subfield ), [] );

    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c,d)"
    };
    var err004MissingD = [ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "d" ) )];
    SafeAssert.equal( "6 CheckReference.validateSubfield valid value with forwardslash val and parenthesis, missing d", CheckReference.validateSubfield( record, undefined, subfield ), err004MissingD );

    var errD = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "d" ) );
    var errE = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "e" ) );
    var errF = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "f" ) );
    var errG = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "g" ) );
    var errH = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 1, "004", "h" ) );

    var errFTwo = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 2, "004", "f" ) );
    var errGTwo = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 2, "004", "g" ) );
    var errHTwo = ValidateErrors.subfieldError ("TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.ref.missing.subfield", 2, "004", "h" ) );

    var errArr = [errD,errE,errF,errG,errH,errFTwo,errGTwo,errHTwo];
    subfield = {
        'name' : "a", 'value' : "004/12345(a,b,c,d,e,f,g,h)"
    };
    SafeAssert.equal( "7 CheckReference.validateSubfield valid value with forward slash val and parenthesis, missing d", CheckReference.validateSubfield( record, undefined, subfield ), errArr );

    subfield = {'name': 'a', 'value': '004'};
    SafeAssert.equal( "8 CheckReference.validateSubfield error, valid value without forward slash but no field without 'å' subfield", CheckReference.validateSubfield( record, undefined, subfield ), [] );

    record = {
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
                'name' : "\u00E5", 'value' : "1"
            }, {
                'name' : "b", 'value' : "42"
            }, {
                'name' : "c", 'value' : "42"
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
                'name' : "\u00E5", 'value' : "12345"
            }]
        }]
    };

    subfield = {'name': 'a', 'value': '004/1(c1, c2)'};
    var errorMessage = [ValidateErrors.subfieldError( 'TODO:fixurl', ResourceBundle.getStringFormat( bundle, "check.ref.subfield.not.repeated", "c", "004", 2 ) ) ];
    SafeAssert.equal( "9 CheckReference.validateSubfield error, subfield not repeated correctly", CheckReference.validateSubfield( record, undefined, subfield ), errorMessage );

    record = {
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
                'name' : "\u00E5", 'value' : "1"
            }, {
                'name' : "b", 'value' : "42"
            }, {
                'name' : "c", 'value' : "42"
            }, {
                'name' : "c", 'value' : "42"
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
                'name' : "\u00E5", 'value' : "12345"
            }]
        }]
    };

    subfield = {'name': 'a', 'value': '004/1(c1,c2,b)'};
    var errorMessage = [ValidateErrors.subfieldError( 'TODO:fixurl', 'delfelt "c" er ikke gentaget på felt "004" "2" gange' )];
    SafeAssert.equal( "10 CheckReference.validateSubfield ok, subfield repeated correctly", CheckReference.validateSubfield( record, undefined, subfield ), [] );
} );