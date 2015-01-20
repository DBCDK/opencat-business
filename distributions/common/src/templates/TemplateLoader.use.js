//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TemplateLoader' ];

//-----------------------------------------------------------------------------
/**
 * Module to load a template and suptitute fields and subfields from other 
 * templates.
 * 
 * @namespace
 * @name TemplateLoader
 * 
 */
var TemplateLoader = function() {
    /**
     * Loads and returns a template based on its name.
     * 
     * @param {String}   name The name of the template.
     * @param {Function} templateProvider A function that takes a 
     *                   String and returns an Object with the structure 
     *                   of the template given by name.
     * @name TemplateLoader#load
     */
    function load( name, templateProvider ) {
        var result = templateProvider( name );
        if( result === undefined ) {
            throw "Unable to load template '" + name +"'";
        }
        for( var fieldName in result.fields ) {            
            if( result.fields.hasOwnProperty( fieldName ) ) {
                var fieldObj = result.fields[ fieldName ];
                if( typeof( fieldObj ) === "string" ) {
                    result.fields[ fieldName ] = __getObjectFromTemplate( fieldObj, templateProvider );
                }
                else {
                    for( var subfieldName in fieldObj.subfields ) {            
                        if( fieldObj.subfields.hasOwnProperty( subfieldName ) ) {
                            var subfieldObj = fieldObj.subfields[ subfieldName ];
                            if( typeof( subfieldObj ) === "string" ) {
                                fieldObj.subfields[ subfieldName ] = __getObjectFromTemplate( subfieldObj, templateProvider );
                            };
                        };
                    };
                };
            };
        };
     
        return result;   
    }
    
    /**
     * Returns the object for a .-based path where the first part of the path 
     * is the template name. The rest of the path reference to the object of the 
     * template that will be returned.
     * 
     * @param {String}   name The name of the template.
     * @param {Function} templateProvider A function that takes a 
     *                   String and returns an Object with the structure 
     *                   of the template given by name.
     * @name TemplateLoader#__getObjectFromTemplate
     */
    function __getObjectFromTemplate( name, templateProvider ) {
        var index = name.indexOf( "." );
        var templateName = name.substring( 0, index );
        var objName = name.substring( index + 1 );
        
        return getObjectByName( objName, templateProvider( templateName ) );
    }
    
    /**
     * Returns the object for a .-based path that reference to the property of an 
     * object that will be returned.
     * 
     * @param {String} name The name of the property to return.
     * @param {Object} object The object that contains the property. Directly or indirectly.
     *  
     * @name TemplateLoader#getObjectByName
     */
    function getObjectByName( name, object ) {
        return __getObjectByName( name, name, object );
    }
    
    /**
     * Returns the object for a .-based path that reference to the property of an 
     * object that will be returned.
     * 
     * @param {String} fullName The initial full name of the property to return.
     * @param {String} name The name of the property to return.
     * @param {Object} object The object that contains the property. Directly or indirectly.
     *  
     * @name TemplateLoader#getObjectByName
     */
    function __getObjectByName( fullName, name, object ) {
        if( object === null ) {
            throw "TemplateLoader.__getObjectByName: object can not be null";
        }

        if( object === undefined ) {
            throw "TemplateLoader.__getObjectByName: object can not be undefined";
        }
        
        if( name === "" ) {
            throw "TemplateLoader.__getObjectByName: name can not be empty";
        }

        var index = name.indexOf( "." );
        var propName = name;        
        if( index > -1 ) {
            propName = name.substring( 0, index );
        }
        
        var obj = undefined;
        var foundProperty = false;
        for( var objName in object ) {            
            if( objName === propName && object.hasOwnProperty( objName ) ) {
                obj = object[ propName ];
                foundProperty = true;
                break;
            };
        };
        if( !foundProperty ) {
            throw "The property " + objName + " in the path " + fullName + " does not exist.";
        }
        
        if( propName === name ) {
            return obj;
        };
        
        return __getObjectByName( fullName, name.substring( index + 1 ), obj );
    }

    return {
        'load': load,
        'getObjectByName': getObjectByName
    };
    
}();

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
                            "repeatable":false,
                        }
                    }
                }
                    
            },
            "rules": []
        };
    };
    
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
    };
    
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
                            "a": "danmarc2.fields.001.subfields.a"
                        }
                    }                        
                },
                "rules": []
            };
            
            case "danmarc2": return singleTemplate( "danmarc2" );
        }
    };
    
    Assert.equalValue( "Include subfield", TemplateLoader.load( "bog", includeSubfieldTemplate ).fields[ "001" ][ "a" ], singleTemplate( "danmarc2" ).fields[ "001" ][ "a" ] );
});
