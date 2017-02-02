use("OpenAgencyClient");

EXPORTED_SYMBOLS = ['AuthenticateTemplate'];

/**
 * Module to authenticate a template for an agency.
 *
 * @namespace
 * @name AuthenticateTemplate
 */
var AuthenticateTemplate = function () {
    var templateMapping = null;

    function canAuthenticate(templateName, groupId, template, libraryType, settings) {
        Log.trace("Enter - AuthenticateTemplate.canAuthenticate( '", groupId, "', ", template, " )");
        var result = undefined;
        try {
            var featureIsOk = false;
            if (!template.hasOwnProperty('template')) {
                return result = false;
            }

            var templateSettings = template.template;
            if (!templateSettings.hasOwnProperty('features')) {
                return result = false;
            }

            var featureNames = templateSettings.features;
            for (var i = 0; i < featureNames.length; i++) {
                var name = featureNames[i];
                if (name === "all") {
                    featureIsOk = true;
                    break;
                }

                if (OpenAgencyClient.hasFeature(groupId, name)) {
                    featureIsOk = true;
                    break;
                }
            }

            if (featureIsOk) {
                return result = _groupUseTemplate(templateName, libraryType, settings);
            } else {
                return result = false;
            }
        } finally {
            Log.trace("Exit - AuthenticateTemplate.canAuthenticate(): ", result);
        }
    }

    function _groupUseTemplate(templateName, libraryType, settings) {
        Log.info('Checking if libraryGroup ' + libraryType + ' can use template ' + templateName);
        if (templateMapping === null) {
            Log.info('Template mappings are not loaded, so do that now');
            templateMapping = _loadTemplateMapping(settings);
        }

        var allowedTemplateGroups = templateMapping['libraryToTemplateGroups'][libraryType]['templateGroups'];
        Log.info('Allowed templateGroup for ' + libraryType + ': ' + allowedTemplateGroups);
        var templateGroups = templateMapping['templateGroups'];

        for (var i = 0; i < allowedTemplateGroups.length; i++) {
            if (templateGroups[allowedTemplateGroups[i]]['templates'].indexOf(templateName) > -1) {
                Log.info('Template group found! LibraryGroup ' + libraryType + ' can use template ' + templateName);
                return true;
            }
        }

        Log.info('Template group NOT found! ' + libraryType + ' cannot use template ' + templateName);
        return false;
    }

    function _loadTemplateMapping(settings) {
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

    return {
        'canAuthenticate': canAuthenticate
    }
}();
