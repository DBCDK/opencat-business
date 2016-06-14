use( "ReadFile" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "TemplateOptimizer" );
use( "TemplateLoader" );
use( "UnitTest" );
use( "WriteFile" );

EXPORTED_SYMBOLS = ['TemplateContainer'];

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
                    get( templates[i].schemaName );
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
                result = __load_compiled_template();
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
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
     * @param k
     * @param v
     * @private
     */
    function __compiled_template_reviever(k, v) {
        if(k !== "name") return v;

        this['type'] = TemplateOptimizer.convertRuleTypeNameToFunction(v);
        return v;
    }

    /**
     *
     * @param name template Name
     * @returns {*}
     * @private
     */
    function __load_compiled_template( name ) {
        var templateFileNamePattern = "%s/distributions/%s/compiled_templates/%s.json";
        var result=null;

        // Load template from 'install.name' directory.
        var filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ), name );
        Log.info( "Trying to load template file: ", filename );

        var templateContent = System.readFile( filename );

        if ( templateContent !== null ) {
            try {
                result = JSON.parse( templateContent, __compiled_template_reviever);
                //   TODO: loop the reslt and call
                
            } catch ( ex ) {
                var message = StringUtil.sprintf( "Syntax error in file '%s': %s", filename, ex );
                Log.error( message );
                throw message;
            }
        } else {
            throw StringUtil.sprintf( "Unable to read content from '%s'", filename );
        }
        return result;
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

        try {
            var result = templatesUnoptimized[name];

            if ( result === undefined ) {
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
                } catch ( ex ) {
                    Log.debug( "Unable to load template file: ", ex );

                    // Load template from 'common' directory.
                    filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), "common", name );
                    templateContent = System.readFile( filename );
                    Log.info( "Using template file: " + filename );
                }

                if ( templateContent !== null ) {
                    try {
                        result = JSON.parse( templateContent );
                    } catch ( ex ) {
                        var message = StringUtil.sprintf( "Syntax error in file '%s': %s", filename, ex );
                        Log.error( message );
                        throw message;
                    }
                } else {
                    throw StringUtil.sprintf( "Unable to read content from '%s'", filename );
                }

                if ( result !== undefined ) {
                    templatesUnoptimized[name] = result;
                }
            }

            return result;
        } finally {
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
        Log.trace( "Entering __addDanishLetterAaToTemplate " );
        try {
            for ( var field in unoptimizedTemplate.fields ) {
                if ( unoptimizedTemplate.fields.hasOwnProperty( field ) && unoptimizedTemplate.fields[field].hasOwnProperty( "subfields" ) ) {
                    if ( !unoptimizedTemplate.fields[field].subfields.hasOwnProperty( "getAaTemplate" ) ) {
                        unoptimizedTemplate.fields[field].subfields["\u00E5"] = {
                            "mandatory": false,
                            "repeatable": false
                        };
                    }
                }
            }
        } finally {
            Log.trace( "Exit __addDanishLetterAaToTemplate " );
        }
    }

    function __appendRuleToField ( field ) {
        Log.trace( "Entering __appendRuleToField : " );
        try {
            if ( field.hasOwnProperty( "rules" ) ) {
                field["rules"].push( {"type": "FieldRules.upperCaseCheck"} );
            } else {
                field["rules"] = [{"type": "FieldRules.upperCaseCheck"}];
            }
        } finally {
            Log.trace( "Exit __appendRuleToField : " );
        }
    }

    function __addUppercaseLetterToTemplate ( unoptimizedTemplate ) {
        Log.trace( "Entering __addUppercaseLetterToTemplate : " );
        try {
            var fieldsWithLowerCaseSubfields = __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields( unoptimizedTemplate );
            for ( var fieldKey in fieldsWithLowerCaseSubfields ) {
                if( !fieldsWithLowerCaseSubfields.hasOwnProperty(fieldKey) ) continue;

                if( ! unoptimizedTemplate.fields[fieldKey].hasOwnProperty("rules")) {
                    __appendRuleToField( unoptimizedTemplate.fields[fieldKey] );
                }
                for ( var subfieldKey in fieldsWithLowerCaseSubfields[fieldKey] ) {
                    if( !fieldsWithLowerCaseSubfields[fieldKey].hasOwnProperty( subfieldKey) ) continue;

                    unoptimizedTemplate.fields[fieldKey]["subfields"][subfieldKey] = fieldsWithLowerCaseSubfields[fieldKey][subfieldKey];
                }
            }
        } finally {
            Log.trace( "Exit  __addUppercaseLetterToTemplate : " );
        }
    }

    function __getDefaultSubfieldRepeatable ( unoptimizedTemplate ) {
        Log.trace( "Entering __getDefaultSubfieldRepeatable : " );
        var ret = {};
        try {
            if ( unoptimizedTemplate.hasOwnProperty( "defaults" ) ) {
                if ( unoptimizedTemplate["defaults"].hasOwnProperty( "subfield" ) ) {
                    if ( unoptimizedTemplate["defaults"]["subfield"].hasOwnProperty( "repeatable" ) ) {
                        return ret = unoptimizedTemplate["defaults"]["subfield"]["repeatable"];
                    }
                }
            }
            return {};
        } finally {
            Log.trace( "Exit __getDefaultSubfieldRepeatable : " + JSON.stringify( ret ) );
        }
    }


    function __getRepeatableValue ( field, subfield, unoptimizedTemplate ) {
        Log.trace( "Entering __getRepeatableValue : " );
        var ret;
        try {
            var repeatableDefaultVal = __getDefaultSubfieldRepeatable( unoptimizedTemplate );
            if ( field.subfields[subfield].hasOwnProperty( "repeatable" ) ) {
                return ret = {"repeatable": field.subfields[subfield]["repeatable"]};
            } else {
                return ret = {"repeatable": repeatableDefaultVal};
            }
        } finally {
            Log.trace( "Exit __getRepeatableValue : " + JSON.stringify( ret ) );
        }
    }

    function __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields ( unoptimizedTemplate ) {
        Log.trace( "Entering __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields : " );
        var ret;
        try {
            var fieldsWithLowerCaseSubfields = {};
            for ( var field in unoptimizedTemplate.fields ) {
                if ( unoptimizedTemplate.fields.hasOwnProperty( field ) && unoptimizedTemplate.fields[field].hasOwnProperty( "subfields" ) ) {
                    for ( var subfield in unoptimizedTemplate.fields[field].subfields ) {
                        if ( unoptimizedTemplate.fields[field].subfields.hasOwnProperty( subfield ) ) {
                            if ( subfield.match( /[a-z]|\u00E6|\u00f8/ ) ) {
                                if ( !fieldsWithLowerCaseSubfields.hasOwnProperty( field ) ) {
                                    fieldsWithLowerCaseSubfields[field] = {};
                                }
                                fieldsWithLowerCaseSubfields[field][subfield.toUpperCase()] = __getRepeatableValue( unoptimizedTemplate.fields[field], subfield, unoptimizedTemplate );
                            }
                        }
                    }
                }
            }
            return ret = fieldsWithLowerCaseSubfields;
        } finally {
            Log.trace( "Exit __getLowerCasedSubfieldsWithNonMatchingUpperCaseSubfields : " + JSON.stringify( ret ) );
        }
    }

    return {
        'setSettings': setSettings,
        'initTemplates': initTemplates,
        'getTemplateNames': getTemplateNames,
        'loadTemplate': loadTemplate,
        'get': get,
        'loadTemplateUnoptimized': loadTemplateUnoptimized,
        'getUnoptimized': getUnoptimized,
        'testLoadOfTemplateDoNotUse': testLoadOfTemplateDoNotUse,
        'onlyForTest__addUppercaseLetterToTemplate': __addUppercaseLetterToTemplate,
        'onlyForTest__addDanishLetterAaToTemplate': __addDanishLetterAaToTemplate
    }

}();

UnitTest.addFixture( "TemplateContainer.__addUppercaseLetterToTemplate", function () {

    function getUppercaseTemplates () {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        "A": {
                            "repeatable": false
                        },
                        "B": {
                            "repeatable": true
                        }
                    },
                    "rules": [{"type": "FieldRules.upperCaseCheck"}]
                }
            }
        }
    }

    function getLowerCaseTemplateNoUppercaseFieldsNoRules () {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true,
                        }
                    }
                }
            }
        }
    }

    function getLowerCaseTemplateWithUppercaseFieldsNoRules () {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        "B": {
                            "repeatable": true
                        }
                    }
                }
            }
        }
    }

    var lowerCaseTemplate = getLowerCaseTemplateNoUppercaseFieldsNoRules();
    TemplateContainer.onlyForTest__addUppercaseLetterToTemplate( lowerCaseTemplate );
    Assert.equalValue( "TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", JSON.stringify( lowerCaseTemplate ), JSON.stringify( getUppercaseTemplates() ) );

    var lowerCaseTemplateWithUppercase = getLowerCaseTemplateWithUppercaseFieldsNoRules();
    TemplateContainer.onlyForTest__addUppercaseLetterToTemplate( lowerCaseTemplateWithUppercase );
    Assert.equal( "TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", Object.keys(lowerCaseTemplateWithUppercase["fields"]["002"]["subfields"] ).sort(), Object.keys(getUppercaseTemplates()["fields"]["002"]["subfields"] ).sort() );
} );

UnitTest.addFixture( "TemplateContainer.onlyForTest__addDanishLetterAaToTemplate", function () {

    function getAaTemplate () {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        // getAaTemplate
                        "\u00E5": {
                            "mandatory": false,
                            "repeatable": false
                        }
                    }
                }
            }
        }
    }

    function getLowerCaseTemplate () {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true,
                        }
                    }
                }
            }
        }
    }

    var lowerCaseTemplate = getLowerCaseTemplate();
    TemplateContainer.onlyForTest__addDanishLetterAaToTemplate( lowerCaseTemplate );

    Assert.equalValue( "TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", JSON.stringify( lowerCaseTemplate, undefined, 4 ), JSON.stringify( getAaTemplate(),undefined, 4 ) );
} );