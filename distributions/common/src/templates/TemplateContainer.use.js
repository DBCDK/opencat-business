//-----------------------------------------------------------------------------
use( "ReadFile" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "TemplateOptimizer" );
use( "TemplateLoader" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['TemplateContainer'];

//-----------------------------------------------------------------------------
/**
 * Container of all templates for the Validate Web Service.
 *
 * @namespace
 * @name TemplateContainer
 *
 */
var TemplateContainer = function () {
    var BUNDLE_NAME = "templates";

    var templates = {};
    var templatesUnoptimized = {};
    var settings;

    function setSettings ( newSettings ) {
        settings = newSettings;
    }

    /**
     * Loads and init all templates.
     */
    function initTemplates () {
        Log.trace( "Enter - TemplateContainer.initTemplates()" );

        try {
            var templates = getTemplateNames();
            for ( var i = 0; i < templates.length; i++ ) {
                var watch = new StopWatch( "javascript.env.create.templates." + templates[i].schemaName );

                try {
                    get( templates[i].schemaName )
                }
                finally {
                    watch.stop();
                }
            }
        }
        finally {
            Log.trace( "Exit - TemplateContainer.initTemplates()" );
        }
    }

    /**
     * Gets the names of the templates as an Array
     *
     * @return {Array} An Array with the names of the templates.
     */
    function getTemplateNames () {
        Log.trace( "Enter - getTemplateNames()" );

        try {
            var rootDir = new Packages.java.io.File( StringUtil.sprintf( "%s/distributions/%s/templates", settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ) ) );
            var files = rootDir.listFiles();
            var result = [];

            Log.debug( "Using install dir: ", rootDir.getAbsolutePath() );

            for ( var i = 0; i < files.length; i++ ) {
                if ( !files[i].isFile() ) {
                    continue;
                }

                var filepath = files[i].getAbsolutePath();
                var filename = files[i].getName();

                if ( !filename.endsWith( "json" ) ) {
                    continue;
                }

                Log.debug( "Checking file: ", filename, " -> ", filepath );

                var schema = {schemaName: "", schemaInfo: ""};

                schema.schemaName = filename.substr( 0, filename.lastIndexOf( "." ) );
                var templateObj = JSON.parse( System.readFile( filepath ) );
                if ( templateObj.hasOwnProperty( 'template' ) ) {
                    if ( templateObj.template.hasOwnProperty( 'description' ) ) {
                        schema.schemaInfo = templateObj.template.description;
                    }
                }

                Log.debug( "Found template '", schema.schemaName, "' -> '", schema.schemaInfo, "'" );
                result.push( schema );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - getTemplateNames()" );
        }
    }

    /**
     * Loads a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {Object} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function loadTemplate ( name ) {
        var template = loadTemplateUnoptimized( name, settings );

        var watch = new StopWatch( "TemplateOptimizer.optimize." + name );
        try {
            return TemplateOptimizer.optimize( template );
        }
        finally {
            watch.stop();
        }
    }

    /**
     * Returns the optimized template by name.
     *
     * If the template has not been loaded it will be loaded first and
     * optimized.
     *
     * @param {Object} name The of the template.
     */
    function get ( name ) {
        var watch = new StopWatch( "javascript.TemplateContainer.get" );

        try {
            var result = templates[name];
            if ( result === undefined ) {
                result = loadTemplate( name );
                if ( result !== undefined ) {
                    templates[name] = result;
                }
            }

            return result;
        }
        finally {
            watch.stop();
        }
    }

    /**
     * Helper function to koads a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {String} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function __loadUnoptimizedTemplate ( name ) {
        Log.trace( "Enter - __loadUnoptimizedTemplate( name )" );
        var watch = new StopWatch();
        var watchTag = "javascript.TemplateContainer.__loadUnoptimizedTemplate." + name;

        try {
            var result = templatesUnoptimized[name];

            if ( result === undefined ) {
                watchTag += ".miss";
                var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

                if ( !settings.containsKey( 'javascript.basedir' ) ) {
                    throw ResourceBundle.getStringFormat( bundle, "templates.settings.missing.key", "javascript.basedir" );
                }
                if ( !settings.containsKey( 'javascript.install.name' ) ) {
                    throw ResourceBundle.getStringFormat( bundle, "templates.settings.missing.key", "javascript.install.name" );
                }

                var templateFileNamePattern = "%s/distributions/%s/templates/%s.json";
                var templateContent = null;
                var filename = "";
                try {
                    // Load template from 'install.name' directory.
                    filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ), name );
                    Log.info( "Trying to load template file: ", filename );

                    templateContent = System.readFile( filename );
                }
                catch ( ex ) {
                    Log.debug( "Unable to load template file: ", ex );

                    // Load template from 'common' directory.
                    filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), "common", name );
                    templateContent = System.readFile( filename );
                    Log.info( "Using template file: " + filename );
                }

                if ( templateContent !== null ) {
                    try {
                        result = JSON.parse( templateContent );
                    }
                    catch ( ex ) {
                        var message = StringUtil.sprintf( "Syntax error in file '%s': %s", filename, ex );
                        Log.error( message );
                        throw message;
                    }
                }
                else {
                    throw StringUtil.sprintf( "Unable to read content from '%s'", filename );
                }

                if ( result !== undefined ) {
                    templatesUnoptimized[name] = result;
                }
            }
            else {
                watchTag += ".hit";
            }

            return result;
        }
        finally {
            watch.stop( watchTag );
            Log.trace( "Exit - __loadUnoptimizedTemplate( name, settings )" );
        }
    }

    /**
     * Loads a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {Object} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function loadTemplateUnoptimized ( name ) {
        var unoptimizedTemplate = TemplateLoader.load( name, __loadUnoptimizedTemplate );
        __addDanishLetterAaToTemplate( unoptimizedTemplate );
        __addUppercaseLetterToTemplate( unoptimizedTemplate );
        return unoptimizedTemplate;
    }

    /**
     * Returns the unoptimized template by name.
     *
     * If the template has not been loaded it will be loaded first and cached.
     *
     * @param {Object} name The of the template.
     */
    function getUnoptimized ( name ) {
        var result = templatesUnoptimized[name];
        if ( result === undefined ) {
            result = loadTemplateUnoptimized( name, settings );
            if ( result !== undefined ) {
                templatesUnoptimized[name] = result;
            }
        }

        return result;
    }

    // Function used to test templates, DO NOT USE
    function testLoadOfTemplateDoNotUse ( name ) {
        var template = TemplateLoader.load( name, __testLoadOptimizedTemplateDoNotUse );
        return TemplateOptimizer.optimize( template );
    }


    function __testLoadOptimizedTemplateDoNotUse ( name ) {
        var stringContent = System.readFile( name + ".json" );
        return JSON.parse( stringContent );
    }

    function __addDanishLetterAaToTemplate ( unoptimizedTemplate ) {
        for ( var field in unoptimizedTemplate.fields ) {
            if ( unoptimizedTemplate.fields.hasOwnProperty( field ) && unoptimizedTemplate.fields[field].hasOwnProperty( "subfields" ) ) {
                if ( !unoptimizedTemplate.fields[field].subfields.hasOwnProperty( "\u00E5" ) ) {
                    unoptimizedTemplate.fields[field].subfields["\u00E5"] = {
                        "mandatory": false,
                        "repeatable": false
                    };
                }
            }
        }
    }


    function __addUppercaseLetterToTemplate ( unoptimizedTemplate ) {
        var fieldsWithLowerCaseSubfields = __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields( unoptimizedTemplate )
        for ( var fieldKey in fieldsWithLowerCaseSubfields ) {
            for ( var subfieldKey in fieldsWithLowerCaseSubfields[fieldKey] ) {
                unoptimizedTemplate.fields[fieldKey]["subfields"][subfieldKey] = fieldsWithLowerCaseSubfields[fieldKey][subfieldKey]
            }
        }
    }

    function __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields ( unoptimizedTemplate ) {
        var repeatableDefaultVal = unoptimizedTemplate["defaults"]["subfield"]["repeatable"];
        var fieldsWithLowerCaseSubfields = {};

        function __getRepeatableValue ( field, subfield ) {
            if ( field.subfields[subfield].hasOwnProperty( "repeatable" ) ) {
                return {"repeatable": field.subfields[subfield]["repeatable"]};
            } else {
                return {"repeatable": repeatableDefaultVal};
            }
        }

        for ( var field in unoptimizedTemplate.fields ) {
            if ( unoptimizedTemplate.fields.hasOwnProperty( field ) && unoptimizedTemplate.fields[field].hasOwnProperty( "subfields" ) ) {
                for ( var subfield in unoptimizedTemplate.fields[field].subfields ) {
                    if ( unoptimizedTemplate.fields[field].subfields.hasOwnProperty( subfield ) ) {
                        if ( subfield.match( /[a-z]|\u00E6|\u00f8/ ) ) {
                            var subfieldUpper = subfield.toUpperCase();
                            if (!fieldsWithLowerCaseSubfields.hasOwnProperty( field)) {
                                fieldsWithLowerCaseSubfields[field]={};
                            }
                            fieldsWithLowerCaseSubfields[field][subfieldUpper] = __getRepeatableValue( unoptimizedTemplate.fields[field], subfield )
                        }
                    }
                }
            }
        }
        return fieldsWithLowerCaseSubfields;
    }


    return {
        'setSettings': setSettings,
        'initTemplates': initTemplates,
        'getTemplateNames': getTemplateNames,
        'loadTemplate': loadTemplate,
        'get': get,
        'loadTemplateUnoptimized': loadTemplateUnoptimized,
        'getUnoptimized': getUnoptimized,
        'testLoadOfTemplateDoNotUse': testLoadOfTemplateDoNotUse
    }

}();
