use("OpenAgencyClient");

EXPORTED_SYMBOLS = ['AuthenticateTemplate'];

/**
 * Module to authenticate a template for an agency.
 *
 * @namespace
 * @name AuthenticateTemplate
 */
var AuthenticateTemplate = function () {
    function canAuthenticate(groupId, template) {
        Log.trace("Enter - AuthenticateTemplate.canAuthenticate( '", groupId, "', ", template, " )");
        var result = undefined;
        try {
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
                    return result = true;
                }

                if (OpenAgencyClient.hasFeature(groupId, name)) {
                    return result = true;
                }
            }
            return result = false;
        } finally {
            Log.trace("Exit - AuthenticateTemplate.canAuthenticate(): ", result);
        }
    }

    return {
        'canAuthenticate': canAuthenticate
    }
}();
