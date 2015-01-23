//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the Validator module.  
 */

//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "GenericSettings" );
use( "Validator" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Validator.validateRecord (Full test)", function() {
    return;
    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "1 234 567 8"
                    },
                    {
                        name: "b",
                        value: "870970"
                    },
                    {
                        name: "c",
                        value: "12072013"
                    },
                    {
                        name: "d",
                        value: "12072013101735"
                    },
                    {
                        name: "f",
                        value: "d"
                    }
                ]
            }, 
            {
                name: "004",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "e"
                    },
                    {
                        name: "r",
                        value: "n"
                    }
                ]
            } 
        ]
    };
    
    var tempAsString = readFile( "templates/bog.json" );
    var template = TemplateOptimizer.optimize( JSON.parse( tempAsString ) );

    Assert.equalValue( "", template.fields[ "001" ].rules.length, 1 ); 
    Assert.equalValue( "", Validator.validateRecord( record, function() { return template; }, GenericSettings ), [] ); 
} );

UnitTest.addFixture( "Validator.validateRecord", function() {
    var record = {
        fields: [ 
            {
                name: "001",
                indicator: "00",
                subfields: [ 
                    {
                        name: "a",
                        value: "1 234 567 8"
                    } 
                ]
            } 
        ]
    };

    var template = {
        fields: {
            "001": { 
                subfields: {
                    "a": {}
                }
            }
        },
        rules: []
    };
    Assert.equalValue( "Full record with no errors", Validator.validateRecord( record, function() { return template; }, GenericSettings ), [] );    

    template = {
        fields: {
            "001": { 
                subfields: {
                    "a": {}
                }                
            }
        },
        rules: [
            {
                type: function( record, params ) {
                    return [ ValidateErrors.subfieldError( "url", "message" ) ];
                }
            }
        ]
    };
    Assert.equalValue( "Validate record with error", Validator.validateRecord( record, function() { return template; }, GenericSettings ),
                                                    [ ValidateErrors.subfieldError( "url", "message" ) ] );

    template = {
        fields: {
            "001": {
                subfields: {
                    "a": {}
                }
            }
        },
        rules: [
            {
                type: function( record, params ) {
                    return [ ValidateErrors.subfieldError( "url", "message" ) ];
                },
                errorType: "WARNING"
            }
        ]
    };

    var valWarning = ValidateErrors.subfieldError( "url", "message" );
    valWarning.type = "WARNING";
    Assert.equalValue( "Validate record with warnings",
                       Validator.validateRecord( record, function() { return template; }, GenericSettings ),
                       [ valWarning ] );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Validator.validateField", function() {
    var record = {
        fields: [ 
            {
                name: "001",
                indicator: "00",
                subfields: [ 
                    {
                        name: "a",
                        value: "1 234 567 8"
                    } 
                ]
            } 
        ]
    };
    var template = { fields: {}, rules: [] };
    
    Assert.equalValue( "Test 1", Validator.validateField( record, record.fields[ 0 ], function() { return template; }, GenericSettings ), 
                                                       [ ValidateErrors.fieldError( "", "Felt '001' kan ikke anvendes i denne skabelon." ) ] );    

    template = {
        fields: {
            "001": { 
                subfields: {
                    "a": {}
                }
            }
        },
        rules: []
    };
    Assert.equalValue( "Test 2", Validator.validateField( record, record.fields[ 0 ], function() { return template; }, GenericSettings ), [] );    

    template = {
        fields: {
            "001": {
                url: "url",
                subfields: {
                    "a": {}
                },
                rules: [
                    {
                        type: function( record, field, params ) {
                            return [ ValidateErrors.subfieldError( "url", "message" ) ];
                        }
                    }
                ]
                
            }
        },
        rules: []
    };
    Assert.equalValue( "Test 3", Validator.validateField( record, record.fields[ 0 ], function() { return template; }, GenericSettings ), 
                                                       [ ValidateErrors.subfieldError( "url", "message" ) ] );    
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Validator.validateSubfield", function() {
    var record = {
        fields: [ 
            {
                name: "001",
                indicator: "00",
                subfields: [ 
                    {
                        name: "A",
                        value: "1 234 567 8"
                    }, 
                    {
                        name: "a",
                        value: "1 234 567 8"
                    } 
                ]
            } 
        ]
    };
    var template = { fields: {}, rules: [] };
    
    Assert.equalValue( "Test 1", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 0 ], 
                                                       function() { return template; }, GenericSettings ), 
                                                       [ ValidateErrors.fieldError( "", "Felt '001' kan ikke anvendes i denne skabelon." ) ] );    

    template = {
        fields: {
            "001": { 
                subfields: {
                    "g": []
                }
            }
        },
        rules: []
    };
    Assert.equalValue( "Test 2", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 1 ], 
                                                       function() { return template; }, GenericSettings ), 
                                                       [ ValidateErrors.subfieldError( "", "Delfelt 'a' kan ikke anvendes paa felt '001' i denne skabelon." ) ] );    

    template = {
        fields: {
            "001": { 
                subfields: {
                    "a": []
                }
            }
        },
        rules: []
    };
    Assert.equalValue( "Test 3", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 0 ], 
                                                       function() { return template; }, GenericSettings ), 
                                                       [] );    
    Assert.equalValue( "Test 3", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 1 ], 
                                                       function() { return template; }, GenericSettings ), 
                                                       [] );    

    template = {
        fields: {
            "001": {
                url: "url",
                subfields: {
                    "a": [
                            {
                                type: function( record, field, subfield, params ) {
                                    return [ ValidateErrors.subfieldError( "url", "message" ) ];
                                }
                            }
                        ]
                }
            }
        },
        rules: []
    };
    Assert.equalValue( "Test 4", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 0 ], 
                                                       function() { return template; }, GenericSettings ), [] );    
    Assert.equalValue( "Test 4", Validator.validateSubfield( record, record.fields[ 0 ], record.fields[ 0 ].subfields[ 1 ], 
                                                       function() { return template; }, GenericSettings ), 
                                                       [ ValidateErrors.subfieldError( "url", "message" ) ] );    
} );
