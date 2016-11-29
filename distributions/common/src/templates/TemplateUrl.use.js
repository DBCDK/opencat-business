EXPORTED_SYMBOLS = ['TemplateUrl'];

/**
 * Module to optimize a template.
 * @namespace
 * @name TemplateOptimizer
 */

var TemplateUrl = function () {
    /**
     * Optimizes a template and returns the result.
     *
     * @param {Object} template The template.
     */

    function getUrlForField(fieldName, template) {
        if (template === undefined) {
            return "";
        }
        if (template.fields[fieldName] === undefined) {
            return "";
        }
        return template.fields[fieldName].url || "";
    }

    return {
        'getUrlForField': getUrlForField
    };
}();


		