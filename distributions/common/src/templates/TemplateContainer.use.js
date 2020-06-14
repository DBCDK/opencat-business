use("ReadFile");
use("ResourceBundle");
use("ResourceBundleFactory");
use("TemplateOptimizer");
use("TemplateLoader");
use("UnitTest");
use("WriteFile");

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
    var templateMapping = null;
    var settings;

    function setSettings(newSettings) {
        settings = newSettings;
    }

    /**
     * Loads and init all templates.
     */
    function initTemplates() {
        Log.trace("Enter - TemplateContainer.initTemplates()");

        try {
            // Load template mappings during startup so the values are cached
            templateMapping = __loadTemplateMapping(settings);

            var templateNames = getTemplateNames("dataio");
            for (var i = 0; i < templateNames.length; i++) {
                getCompiledTemplateByFolder(templateNames[i].schemaName, "dataio");
                // loadTemplateUnoptimized caches the templates to this.templatesUnoptimized
                loadTemplateUnoptimized(templateNames[i].schemaName);
            }

            templateNames = getTemplateNames("fbs");
            for (var j = 0; j < templateNames.length; j++) {
                getCompiledTemplateByFolder(templateNames[j].schemaName, "fbs");
                // loadTemplateUnoptimized caches the templates to this.templatesUnoptimized
                loadTemplateUnoptimized(templateNames[j].schemaName);
            }

            Log.debug('--------------------- initTemplates ---------------------');
            Log.debug('templates:');
            Log.debug(Object.keys(templates));
            Log.debug('');
            Log.debug('templateMapping:');
            Log.debug(JSON.stringify(templateMapping));
            Log.debug('');
            Log.debug('templatesUnoptimized');
            Log.debug(Object.keys(templatesUnoptimized));
            Log.debug('');
            Log.debug('--------------------- initTemplates ---------------------');

        } finally {
            Log.trace("Exit - TemplateContainer.initTemplates()");
        }
    }

    function getTemplateNamesAll() {
        Log.trace("Enter - getTemplateNamesAll()");

        try {
            var result = [];

            result.concat(getTemplateNames("dataio"));
            result.concat(getTemplateNames("fbs"));

            return result;
        } finally {
            Log.trace("Exit - getTemplateNamesAll()");
        }
    }

    /**
     * Gets the names of the templates as an Array
     *
     * @return {Array} An Array with the names of the templates.
     */
    function getTemplateNames(templateFolder) {
        Log.trace("Enter - getTemplateNames()");

        try {
            var result = [];

            var rootDir = new Packages.java.io.File(StringUtil.sprintf("%s/distributions/%s/templates", settings.get('javascript.basedir'), templateFolder));
            var files = rootDir.listFiles();

            for (var i = 0; i < files.length; i++) {
                if (!files[i].isFile()) {
                    continue;
                }

                var filepath = files[i].getAbsolutePath();
                var filename = files[i].getName();

                if (!filename.endsWith("json")) {
                    continue;
                }

                Log.debug("Checking file: ", filename, " -> ", filepath);

                var schema = {schemaName: "", schemaInfo: ""};

                schema.schemaName = filename.substr(0, filename.lastIndexOf("."));
                var templateObj = JSON.parse(System.readFile(filepath));
                if (templateObj.hasOwnProperty('template')) {
                    if (templateObj.template.hasOwnProperty('description')) {
                        schema.schemaInfo = templateObj.template.description;
                    }
                }

                Log.debug("Found template '", schema.schemaName, "' -> '", schema.schemaInfo, "'");
                result.push(schema);
            }

            return result;
        } finally {
            Log.trace("Exit - getTemplateNames()");
        }
    }

    /**
     * Loads a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {string} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function loadTemplate(name) {
        Log.trace("Enter - TemplateContainer.loadTemplate()");

        try {
            var template = loadTemplateUnoptimized(name);

            return TemplateOptimizer.optimize(template);
        } finally {
            Log.trace("Exit - TemplateContainer.loadTemplate()");
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
    function get(name) {
        Log.trace("Enter - TemplateContainer.get()");
        var start = new Date().getTime();

        try {
            var result = templates[name];
            Log.debug('Template was cached? ' + (result !== undefined))
            if (result === undefined) {
                result = __load_compiled_template(name);
                if (result !== undefined) {
                    templates[name] = result;
                }
            }

            return result;
        } finally {
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.TemplateContainer.get]');
            Log.trace("Exit - TemplateContainer.get()");
        }
    }

    function getCompiledTemplateByFolder(name, templateFolder) {
        Log.trace("Enter - TemplateContainer.getCompiledTemplateByFolder()");

        try {
            var result = templates[name];
            if (result === undefined) {
                result = __load_compiled_template(name, templateFolder);
                if (result !== undefined) {
                    templates[name] = result;
                }
            }

            return result;
        } finally {
            Log.trace("Exit - TemplateContainer.getCompiledTemplateByFolder()");
        }
    }

    function getSchemas(templateSet, libraryRules, settings) {
        Log.trace("Enter - TemplateContainer.getSchemas()");

        var schemas = [];

        try {
            if (templateMapping === null) {
                Log.debug('templateMapping is null - loading template mappings');
                templateMapping = __loadTemplateMapping(settings);
            }

            var libraryTemplateGroups = templateMapping['libraryToTemplateGroups'][templateSet]['templateGroups'];
            var templateGroups = templateMapping['templateGroups'];
            var templateNames = [];

            for (var i = 0; i < libraryTemplateGroups.length; i++) {
                templateNames = templateNames.concat(templateGroups[libraryTemplateGroups[i]]['templates']);
            }

            // Now we have all the potential templates the templateSet can use.
            // Next we have to load those templates and filter on library rules.
            for (var j = 0; j < templateNames.length; j++) {
                var templateName = templateNames[j];
                var template = loadTemplateUnoptimized(templateName);

                if (__checkTemplateFeatures(templateName, template, libraryRules)) {
                    var schema = {schemaName: templateName, schemaInfo: ""};

                    if (template.template.hasOwnProperty('description')) {
                        schema.schemaInfo = template.template.description;
                    }

                    schemas.push(schema);
                }
            }

            return schemas;
        } finally {
            Log.trace("Exit - TemplateContainer.getSchemas()");
        }
    }

    function __checkTemplateFeatures(templateName, template, libraryRules) {
        if (!template.hasOwnProperty('template')) {
            Log.info("Schema '" + templateName + "' can not be used because the property 'template' is missing in the schema");
            return false;
        }
        var templateSettings = template.template;
        if (!templateSettings.hasOwnProperty('features')) {
            Log.info("Schema '" + templateName + "' can not be used because the property 'template.features' is missing in the schema");
            return false;
        }
        var featureNames = templateSettings.features;
        for (var k = 0; k < featureNames.length; k++) {
            var name = featureNames[k];

            if (name !== "all" && !libraryRules.contains(name)) {
                Log.info("Schema '" + templateName + "' can not be used because feature '" + name + "' is not in the library rules: " + libraryRules);
                return false;
            }
        }

        return true;
    }

    function __loadTemplateMapping(settings) {
        Log.info('__loadTemplateMapping');
        var templateFileNamePattern = "%s/distributions/common/templateMapping.json";
        var result = null;

        var fileName = StringUtil.sprintf(templateFileNamePattern, settings.get('javascript.basedir'));
        Log.debug("Trying to load templateMapping file: ", fileName);
        var templateContent = System.readFile(fileName);
        Log.debug('Loaded templateMapping');

        if (templateContent !== null) {
            try {
                result = JSON.parse(templateContent);
                Log.debug('Content from templateMappings: ' + JSON.stringify(result));
            } catch (ex) {
                var message = StringUtil.sprintf("Syntax error in file '%s': %s", fileName, ex);
                Log.error(message);
                throw message;
            }
        } else {
            throw StringUtil.sprintf("Unable to read content from '%s'", filename);
        }
        return result;
    }

    /**
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
     * @param k
     * @param v
     * @private
     */
    function __compiled_template_reviver(k, v) {
        if (k !== "name") return v;

        this['type'] = TemplateOptimizer.convertRuleTypeNameToFunction(v);
        if (this['type'] === undefined) {
            return undefined;
        } else {
            return v;
        }
    }

    /**
     *
     * @param name template Name
     * @param templateFolder where to look for templates
     * @returns {*}
     * @private
     */
    function __load_compiled_template(name, templateFolder) {
        var templateFileNamePattern = "%s/distributions/%s/compiled_templates/%s.json";
        var result = null;

        // Load template from 'install.name' directory.
        var filename = StringUtil.sprintf(templateFileNamePattern, settings.get('javascript.basedir'), templateFolder, name);
        Log.debug("Trying to load template file: ", filename);

        var templateContent = System.readFile(filename);

        if (templateContent !== null) {
            try {
                result = JSON.parse(templateContent, __compiled_template_reviver);
            } catch (ex) {
                var message = StringUtil.sprintf("Syntax error in file '%s': %s", filename, ex);
                Log.error(message);
                throw message;
            }
        } else {
            throw StringUtil.sprintf("Unable to read content from '%s'", filename);
        }
        return result;
    }

    /**
     * Helper function to load a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {String} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function __loadUnoptimizedTemplate(name) {
        Log.trace("Enter - __loadUnoptimizedTemplate( name )");

        try {
            var result = templatesUnoptimized[name];

            if (result === undefined) {

                if (!settings.containsKey('javascript.basedir')) {
                    var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                    throw ResourceBundle.getStringFormat(bundle, "templates.settings.missing.key", "javascript.basedir");
                }

                var templateFileNamePattern = "%s/distributions/%s/templates/%s.json";
                var templateContent = null;
                var filename = "";
                try {
                    try {
                        // Load template from 'install.name' directory.
                        filename = StringUtil.sprintf(templateFileNamePattern, settings.get('javascript.basedir'), "dataio", name);
                        Log.debug("Trying to load template file: ", filename);

                        templateContent = System.readFile(filename);
                    } catch (ex) {
                        Log.debug("Loading from dataio failed - trying under fbs instead");
                        filename = StringUtil.sprintf(templateFileNamePattern, settings.get('javascript.basedir'), "fbs", name);
                        Log.debug("Trying to load template file: ", filename);

                        templateContent = System.readFile(filename);
                    }

                } catch (ex) {
                    Log.debug("Unable to load template file: ", ex);

                    // Load template from 'common' directory.
                    filename = StringUtil.sprintf(templateFileNamePattern, settings.get('javascript.basedir'), "common", name);
                    templateContent = System.readFile(filename);
                    Log.debug("Using template file: " + filename);
                }

                if (templateContent !== null) {
                    try {
                        result = JSON.parse(templateContent);
                    } catch (ex) {
                        var message = StringUtil.sprintf("Syntax error in file '%s': %s", filename, ex);
                        Log.error(message);
                        throw message;
                    }
                } else {
                    throw StringUtil.sprintf("Unable to read content from '%s'", filename);
                }

                if (result !== undefined) {
                    templatesUnoptimized[name] = result;
                }
            }

            return result;
        } finally {
            Log.trace("Exit - __loadUnoptimizedTemplate( name, settings )");
        }
    }

    /**
     * Loads a template from a json file and returns it.
     *
     * The template file is assumed to be placed in the same directory as this
     * file with the extension "json".
     *
     * @param {string} name The name of the template.
     *
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error.
     */
    function loadTemplateUnoptimized(name) {
        var unoptimizedTemplate = TemplateLoader.load(name, __loadUnoptimizedTemplate);
        __addDanishLetterAaToTemplate(unoptimizedTemplate);
        return unoptimizedTemplate;
    }

    /**
     * Returns the unoptimized template by name.
     *
     * If the template has not been loaded it will be loaded first and cached.
     *
     * @param {string} name The of the template.
     */
    function getUnoptimized(name) {
        var result = templatesUnoptimized[name];
        if (result === undefined) {
            result = loadTemplateUnoptimized(name);
            if (result !== undefined) {
                templatesUnoptimized[name] = result;
            }
        }
        return result;
    }

    // Function used to test templates, DO NOT USE
    function testLoadOfTemplateDoNotUse(name) {
        var template = TemplateLoader.load(name, __testLoadOptimizedTemplateDoNotUse);
        return TemplateOptimizer.optimize(template);
    }


    function __testLoadOptimizedTemplateDoNotUse(name) {
        var stringContent = System.readFile(name + ".json");
        return JSON.parse(stringContent);
    }

    function __addDanishLetterAaToTemplate(unoptimizedTemplate) {
        Log.trace("Entering __addDanishLetterAaToTemplate ");
        try {
            for (var field in unoptimizedTemplate.fields) {
                if (unoptimizedTemplate.fields.hasOwnProperty(field) && unoptimizedTemplate.fields[field].hasOwnProperty("subfields")) {
                    if (!unoptimizedTemplate.fields[field].subfields.hasOwnProperty("getAaTemplate")) {
                        unoptimizedTemplate.fields[field].subfields["\u00E5"] = {
                            "mandatory": false,
                            "repeatable": false
                        };
                    }
                }
            }
        } finally {
            Log.trace("Exit __addDanishLetterAaToTemplate ");
        }
    }

    return {
        'setSettings': setSettings,
        'initTemplates': initTemplates,
        'getTemplateNames': getTemplateNames,
        'getTemplateNamesAll': getTemplateNamesAll,
        'loadTemplate': loadTemplate,
        'get': get,
        'loadTemplateUnoptimized': loadTemplateUnoptimized,
        'getUnoptimized': getUnoptimized,
        'testLoadOfTemplateDoNotUse': testLoadOfTemplateDoNotUse,
        'onlyForTest__addDanishLetterAaToTemplate': __addDanishLetterAaToTemplate,
        'getSchemas': getSchemas,
        'templateMappings': templateMapping
    }

}();