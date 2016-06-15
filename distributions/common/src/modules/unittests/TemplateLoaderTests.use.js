//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "Log" );
use ( "TemplateLoader");
//-----------------------------------------------------------------------------

UnitTest.addFixture( "TemplateLoader.getObjectByName", function() {
    Assert.exception( "From undefined", 'TemplateLoader.getObjectByName( "x", undefined )' );
    Assert.exception( "From null", 'TemplateLoader.getObjectByName( "x", null )' );
    Assert.exception( "Empty name", 'TemplateLoader.getObjectByName( "", { x: \"v\" } )' );
    Assert.exception( "Property not found", 'TemplateLoader.getObjectByName( "y", { x: \"v\" } )' );
    Assert.exception( "Path not found", 'TemplateLoader.getObjectByName( "x.y.z", { x: { v: { z: "v" } } } )' );
    Assert.equalValue( "Get value", TemplateLoader.getObjectByName( "x", { x: "v" } ), "v" );
    Assert.equalValue( "Get value with path", TemplateLoader.getObjectByName( "x.y.z", { x: { y: { z: "v" } } } ), "v" );
});


UnitTest.addFixture( "TemplateLoader.load", function() {

    function singleTemplate( name ) {
        return {
            "defaults":{
                "field":{
                    "indicator":"00",
                    "mandatory":false,
                    "repeatable":true
                },
                "subfield":{
                    "mandatory":false,
                    "repeatable":true
                }
            },
            "fields":{
                "001":{
                    "url":"http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                    "mandatory":true,
                    "repeatable":false,
                    "sorting":"abcdf",
                    "subfields":{
                        "a":{
                            "mandatory":true,
                            "repeatable":false
                        }
                    }
                }

            },
            "rules": []
        };
    }
    TemplateLoader.UnitTestReset();
    Assert.equalValue( "No includes", TemplateLoader.load( "bog", singleTemplate ), singleTemplate( "bog" ) );

    function includeFieldTemplate( name ) {
        switch( name ) {
            case "bog": return {
                "defaults":{
                    "field":{
                        "indicator":"00",
                        "mandatory":false,
                        "repeatable":true
                    },
                    "subfield":{
                        "mandatory":false,
                        "repeatable":true
                    }
                },
                "fields":{
                    "001": "danmarc2.fields.001"
                },
                "rules": []
            };

            case "danmarc2": return singleTemplate( "danmarc2" );
        }
    }
    TemplateLoader.UnitTestReset();
    Assert.equalValue( "Include field", TemplateLoader.load( "bog", includeFieldTemplate ).fields[ "001" ], singleTemplate( "danmarc2" ).fields[ "001" ] );

    function includeSubfieldTemplate( name ) {
        switch( name ) {
            case "bog": return {
                "defaults":{
                    "field":{
                        "indicator":"00",
                        "mandatory":false,
                        "repeatable":true
                    },
                    "subfield":{
                        "mandatory":false,
                        "repeatable":true
                    }
                },
                "fields":{
                    "001": {
                        "url":"http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory":true,
                        "repeatable":false,
                        "sorting":"abcdf",
                        "subfields":{
                            "b": "danmarc2.fields.001.subfields.a"
                        }
                    }
                },
                "rules": []
            };

            case "danmarc2": return singleTemplate( "danmarc2" );
        }
    }
    TemplateLoader.UnitTestReset();
    var includeSubFIeldTemplateResult = TemplateLoader.load( "bog", includeSubfieldTemplate );
    Assert.equalValue( "Include subfield", includeSubFIeldTemplateResult.fields[ "001" ]["subfields"][ "b" ], singleTemplate( "danmarc2" ).fields[ "001" ]["subfields"][ "a" ]);

    function includeSubfieldWithStringInValuesTemplate( name ) {
        switch( name ) {
            case "bog": return {
                "defaults":{
                    "field":{
                        "indicator":"00",
                        "mandatory":false,
                        "repeatable":true
                    },
                    "subfield":{
                        "mandatory":false,
                        "repeatable":true
                    }
                },
                "fields":{
                    "001": {
                        "url":"http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory":true,
                        "repeatable":false,
                        "sorting":"abcdf",
                        "subfields":{
                            "v":{
                                "values":"danmarc2.fields.001.subfields.a"
                            }
                        }
                    }
                },
                "rules": []
            };

            case "danmarc2": return singleTemplate( "danmarc2" );
        }

        TemplateLoader.UnitTestReset();
        Assert.equalValue( "Include subfield from object", TemplateLoader.load( "bog", includeSubfieldWithStringInValuesTemplate ).fields[ "001" ]["subfields"]["v"]["values"], singleTemplate( "danmarc2" ).fields[ "001" ]["subfields"][ "a" ] );
    }
});
