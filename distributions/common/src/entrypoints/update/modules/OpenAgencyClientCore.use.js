//-----------------------------------------------------------------------------
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OpenAgencyClientCore' ];

//-----------------------------------------------------------------------------
var OpenAgencyClientCore = function() {
    var features = {
        auth_root: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_ROOT,
        auth_common_notes: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_COMMON_NOTES,
        auth_common_subjects: Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.AUTH_COMMON_SUBJECTS
    };

    function hasFeature( agencyId, featureName ) {
        Log.trace( "Enter - OpenAgencyClientCore.hasFeature()" );

        var result;
        try {
            var context = new Packages.javax.naming.InitialContext();
            var serviceProvider = context.lookup( "java:global/updateservice-app-1.0-SNAPSHOT/updateservice-ws-1.0-SNAPSHOT/OpenAgencyService" );

            return result = serviceProvider.hasFeature( agencyId, features[ featureName ] );
        }
        finally {
            Log.trace( "Exit - OpenAgencyClientCore.hasFeature(): " + result );
        }

    }

    return {
        'hasFeature': hasFeature
    }
}();
