// -----------------------------------------------------------------------------
use( "Log" );

// -----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OpenAgencyClientCore' ];

// -----------------------------------------------------------------------------
/**
 * This module implements access to retrieve features by the OpenAgency service.
 *
 * The purpose of this core module is to be able to use the OpenAgencyClient module for
 * unittests in a JS environment without access to an actual OpenAgency service.
 *
 * @namespace
 * @name OpenAgencyClientCore
 */
var OpenAgencyClientCore = function() {
    /**
     * Cache of features.
     *
     * Each object is a map from agencyId to an Array of feature names.
     *
     * @type {{}}
     */
    var features = {};

    function addFeatures( agencyId, featureNames ) {
        Log.trace( "Enter - OpenAgencyClientCore.addFeatures()" );

        try {
            features[ agencyId ] = featureNames;
        }
        finally {
            Log.trace( "Exit - OpenAgencyClientCore.addFeatures()" );
        }
    }

    function clearFeatures() {
        features = {};
    }

    function hasFeature( agencyId, featureName ) {
        Log.trace( "Enter - OpenAgencyClientCore.hasFeature()" );

        try {
            var featureNames = features[ agencyId ];
            if( featureNames === undefined ) {
                return false;
            }

            return featureNames.indexOf( featureName ) > -1;
        }
        finally {
            Log.trace( "Exit - OpenAgencyClientCore.hasFeature()" );
        }

    }

    return {
        'addFeatures': addFeatures,
        'clearFeatures': clearFeatures,
        'hasFeature': hasFeature
    }
}();
