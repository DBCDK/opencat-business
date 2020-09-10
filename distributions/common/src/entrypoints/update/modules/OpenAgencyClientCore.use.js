use("Log");

EXPORTED_SYMBOLS = ['OpenAgencyClientCore'];

var OpenAgencyClientCore = function () {
    var JNDI_NAME = "java:global/opencat-business-1.0-SNAPSHOT/OpenAgencyService";
    var JNDI_NAME_DEPRECATED = "java:global/updateservice-2.0-SNAPSHOT/OpenAgencyService";
    var SERVICE_PROVIDER = getServiceProvider();

    function getServiceProvider() {
        var context = new Packages.javax.naming.InitialContext();
        var serviceProvider;

        try {
            serviceProvider = context.lookup(JNDI_NAME);
        } catch (e) {
            Log.debug(JNDI_NAME+" not found. Trying "+JNDI_NAME_DEPRECATED)
            serviceProvider = context.lookup(JNDI_NAME_DEPRECATED);
        }
        return serviceProvider;
    }

    var features = {
        create_enrichments: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.CREATE_ENRICHMENTS,
        use_enrichments: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.USE_ENRICHMENTS,
        auth_common_notes: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_COMMON_NOTES,
        auth_common_subjects: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_COMMON_SUBJECTS,
        auth_dbc_records: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_DBC_RECORDS,
        auth_public_lib_common_record: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_PUBLIC_LIB_COMMON_RECORD,
        auth_ret_record: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_RET_RECORD,
        auth_root: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_ROOT
    };

    function hasFeature(agencyId, featureName) {
        Log.trace("Enter - OpenAgencyClientCore.hasFeature()");
        var result;
        try {

            return result = SERVICE_PROVIDER.hasFeature(agencyId, features[featureName]);
        } finally {
            Log.trace("Exit - OpenAgencyClientCore.hasFeature(): " + result);
        }
    }

    return {
        'hasFeature': hasFeature
    }
}();
