use("AuthenticateTemplate");
use("TemplateContainer");
use("Validator");

EXPORTED_SYMBOLS = ['ValidatorEntryPoint'];

/**
 * Module to contain entry points for the validator API between Java and
 * JavaScript.
 *
 * @namespace
 * @name ValidatorEntryPoint
 */
var ValidatorEntryPoint = function () {
    function initTemplates(settings) {
        ResourceBundleFactory.init(settings);
        ResourceBundleFactory.getBundle('categorization-codes');
        ResourceBundleFactory.getBundle('default-auth');
        ResourceBundleFactory.getBundle('double-record');
        ResourceBundleFactory.getBundle('enrichments');
        ResourceBundleFactory.getBundle('templates');
        ResourceBundleFactory.getBundle('validation');
        TemplateContainer.setSettings(settings);
        TemplateContainer.initTemplates();
    }

    /**
     * Gets the names of the templates as an Array
     *
     * @return {JSON} A json with the names of the templates. The names is returned
     *                as an Array.
     */
    function getValidateSchemas(templateSet, libraryRules, settings) {
        Log.trace("Enter - ValidatorEntryPoint.getValidateSchemas( '", templateSet, "', '", libraryRules, "', ", settings, " )");
        var result = undefined;
        try {
            ResourceBundleFactory.init(settings);
            TemplateContainer.setSettings(settings);

            var list = TemplateContainer.getSchemas(templateSet, libraryRules, settings);
            return result = JSON.stringify(list);
        } finally {
            Log.trace("Exit - ValidatorEntryPoint.getValidateSchemas(): ", result);
        }
    }

    /**
     * Checks if a template exists by its name.
     *
     * @param {String} name The name of the template.
     * @param {String} groupId The groupdId from the request
     * @param {String} libraryType The LibraryType based on the groupId
     * @param {Object} settings The settings object
     *
     * @return {Boolean} true if the template exists, false otherwise.
     */
    function checkTemplate(name, groupId, libraryType, settings) {
        Log.trace(StringUtil.sprintf("Enter - checkTemplate( '%s' )", name));
        var result = null;
        try {
            ResourceBundleFactory.init(settings);
            TemplateContainer.setSettings(settings);
            var templateObj = TemplateContainer.getUnoptimized(name, libraryType, settings);
            if (templateObj !== undefined) {
                return result = AuthenticateTemplate.canAuthenticate(name, groupId, templateObj, libraryType, settings);
            }
            return result = false;
        } catch (ex) {
            Log.debug("Caught exception -> returning false. The exception was: ", ex);
            result = false;
            return result;
        } finally {
            Log.trace("Exit - checkTemplate(): " + result);
        }
    }

    /**
     * Validates a record with a given template.
     *
     * @param {String} templateName The name of the template to use.
     * @param {String} record       The record to validator as a json.
     * @param {Object} settings The settings object
     *
     * @return {String} A json string with an array of validation errors.
     */
    function doValidateRecord(templateName, record, settings) {
        Log.trace("Enter - doValidateRecord()");
        try {
            var rec = JSON.parse(record);
            var templateProvider = function () {
                TemplateContainer.setSettings(settings);
                return TemplateContainer.get(templateName);
            };

            var result = null;
            try {
                ResourceBundleFactory.init(settings);
                result = Validator.doValidateRecord(rec, templateProvider, settings);
            } catch (ex) {
                var msg = StringUtil.sprintf("ValidatorEntryPoint systemfejl ved validering: %s", ex);
                result = [ValidateErrors.recordError("", msg)];
            }
            return JSON.stringify(result);
        } finally {
            Log.trace("Exit - doValidateRecord()");
        }
    }

    return {
        'initTemplates': initTemplates,
        'getValidateSchemas': getValidateSchemas,
        'checkTemplate': checkTemplate,
        'doValidateRecord': doValidateRecord
    }
}();

