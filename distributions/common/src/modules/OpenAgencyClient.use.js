// -----------------------------------------------------------------------------
use( "Log" );
use( "OpenAgencyClientCore" );

// -----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OpenAgencyClient' ];

// -----------------------------------------------------------------------------
/**
 * This module implements access to retrieve features by the OpenAgency service.
 *
 * The features is implmentated in OpenAgencyClientCore
 *
 * @namespace
 * @name OpenAgencyClient
 */
var OpenAgencyClient = function() {
    function hasFeature( agencyId, featureName ) {
        Log.trace( "Enter - OpenAgencyClient.hasFeature()" );

        var result;
        try {
            return result = OpenAgencyClientCore.hasFeature( agencyId, featureName );
        }
        finally {
            Log.trace( "Exit - OpenAgencyClient.hasFeature(): " + result );
        }

    }

    return {
        'hasFeature': hasFeature
    }
}();
