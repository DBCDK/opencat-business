//-----------------------------------------------------------------------------
use( "Log" );
use( "StopWatch" );
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
    var cache = undefined;

    /**
     * Loads and returns a template based on its name.
     * 
     * @param {String}   name The name of the template.
     * @param {Function} templateProvider A function that takes a 
     *                   String and returns an Object with the structure 
     *                   of the template given by name.
     * @name TemplateLoader#load
     */
    function load ( name, templateProvider ) {
        Log.trace( "Enter - TemplateLoader.load" );
        var watchFunc = new StopWatch();

        try {
            var result = templateProvider( name );
            watchFunc.lap( "TemplateLoader.load.templateProvider" );

            if ( result === undefined ) {
                throw "Unable to load template '" + name + "'";
            }
            for ( var fieldName in result.fields ) {
                if ( result.fields.hasOwnProperty( fieldName ) ) {
                    var fieldObj = result.fields[fieldName];
                    if ( typeof( fieldObj ) === "string" ) {
                        result.fields[fieldName] = __getObjectFromTemplate( fieldObj, templateProvider );
                    }
                    else {
                        for ( var subfieldName in fieldObj.subfields ) {
                            if ( fieldObj.subfields.hasOwnProperty( subfieldName ) ) {
                                var subfieldObj = fieldObj.subfields[subfieldName];
                                if ( typeof( subfieldObj ) === "string" ) {
                                    fieldObj.subfields[subfieldName] = __getObjectFromTemplate( subfieldObj, templateProvider );
                                }
                                else if ( subfieldObj.hasOwnProperty( "values" ) ) {
                                    if ( typeof( subfieldObj.values ) === "string" ) {
                                        fieldObj.subfields[subfieldName].values = __getObjectFromTemplate( subfieldObj.values, templateProvider );
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        } finally {
            watchFunc.stop( "TemplateLoader.load." + name );
            Log.trace( "Exit - TemplateLoader.load" );
        }
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

    function __getObjectFromTemplate ( name, templateProvider ) {
        Log.trace( "Enter - TemplateLoader.__getObjectFromTemplate( '", name, "', ", templateProvider, " )" );
        var watch = new StopWatch();

        try {
            var index = name.indexOf( "." );
            var templateName = name.substring( 0, index );
            var objName = name.substring( index + 1 );

            return getObjectByName( objName, load( templateName, templateProvider ) );
        } finally {
            watch.stop();
            Log.trace( "Exit - TemplateLoader.__getObjectFromTemplate" );
        }
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
    function getObjectByName ( name, object ) {
        Log.trace( "Enter - TemplateLoader.getObjectByName( '", name, "' ", object, " )" );
        var watchFunc = new StopWatch( "TemplateLoader.getObjectByName" );

        try {
            return __getObjectByName( name, name, object );
        } finally {
            watchFunc.stop();
            Log.trace( "Exit - TemplateLoader.getObjectByName" );
        }
    }

    /**
     * Returns the object for a .-based path that reference to the property of an 
     * object that will be returned.
     * 
     * @param {String} fullName The initial full name of the property to return.
     * @param {String} name The name of the property to return.
     * @param {Object} object The object that contains the property. Directly or indirectly.
     *  
     * @name TemplateLoader#__getObjectByName
     */
    function __getObjectByName ( fullName, name, object ) {
        Log.trace( "Enter - TemplateLoader.__getObjectByName( '", fullName, "', '", name, "', ", object, " )" );
        var watch = new StopWatch( "TemplateLoader.__getObjectByName" );

        try {
            if ( object === null ) {
            }

            if ( object === undefined ) {
                throw "TemplateLoader.__getObjectByName: object can not be undefined";
            }

            if ( name === "" ) {
                throw "TemplateLoader.__getObjectByName: name can not be empty";
            }

            var index = name.indexOf( "." );
            var propName = name;
            if ( index > -1 ) {
                propName = name.substring( 0, index );
            }

            var obj = undefined;
            var foundProperty = false;
            for ( var objName in object ) {
                if ( objName === propName && object.hasOwnProperty( objName ) ) {
                    obj = object[propName];
                    foundProperty = true;
                    break;
                }
                ;
            }
            ;
            if ( !foundProperty ) {
                throw "The property " + objName + " in the path " + fullName + " does not exist.";
            }

            if ( propName === name ) {
                return obj;
            }
            ;

            return __getObjectByName( fullName, name.substring( index + 1 ), obj );
        } finally {
            watch.stop();
            Log.trace( "Exit - TemplateLoader.__getObjectByName" );
        }
    }

    return {
        'load': load,
        'getObjectByName': getObjectByName
    };

}();
