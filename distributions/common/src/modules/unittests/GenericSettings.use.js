//-----------------------------------------------------------------------------
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'GenericSettings' ];

//-----------------------------------------------------------------------------
/**
 * GenericSettings is a module to give access to settings with a map interface.
 * 
 * The settings is in this implementation stored in a local map.
 */
var GenericSettings = function() {
   /**
    * Map with setting values.
    */ 
    var settings = {};
    
    /******************************************************************************
     *                      Public Settings interface
     ******************************************************************************
     *
     * This block of functions implementents the interface that a Settings module
     * should always have.
     * 
     ******************************************************************************/
    
    /**
     * Checks if a setting with a key exists.
     * 
     * @param {String} key The key to check for.
     * 
     * @return {Boolean} true if a setting with the key exists, false otherwise.
     * 
     * @name GenericSettings#containsKey
     */
    function containsKey( key ) {
        var result;
        try {
            Log.trace( "Enter - GenericSettings.containsKey()" );
            Log.trace( "  key = " + key );

            ValueCheck.checkThat( "key", key ).type( 'string' );
            result = settings[ key ] !== undefined;
            return result;
        }
        finally {
            Log.trace( "Exit - GenericSettings.containsKey(): " + uneval( result ) );
        }
    }
    
    /**
     * Returns the setting value associated with a key.
     * 
     * @param {String} key The key to find the setting value for.
     * 
     * @return The value associated with the key. The value can have any type.
     * @name GenericSettings#get
     */
    function get( key ) {
        var result;
        
        try {
            Log.trace( "Enter - GenericSettings.get()" );
            Log.trace( "  key = " + key );

            ValueCheck.checkThat( "key", key ).type( 'string' );
            result = settings[ key ];
            return result;
        }
        finally {
            Log.trace( "Exit - GenericSettings.get(): " + uneval( result ) );
        }
    }
    
    /******************************************************************************
     *                      Public Testing interface
     ******************************************************************************
     *
     * This block of functions implementents extra functionality so this module
     * can be used to mock settings in unittests.
     * 
     ******************************************************************************/

    /**
     * Sets the settings in this module.
     * 
     * @param newSettings {Object} Object with settings as a map: String -> Object.
     * @name GenericSettings#setSettings
     */
    function setSettings( newSettings ) {
        try {
            Log.trace( "Enter - GenericSettings.setSettings()" );
            Log.trace( "  newSettings = " + uneval( newSettings ) );

            ValueCheck.checkThat( "newSettings", newSettings ).type( 'object' );
            settings = newSettings;
        }
        finally {
            Log.trace( "Exit - GenericSettings.setSettings()" );
        }
    }
    
    return {
        'containsKey': containsKey,
        'get': get,
        'setSettings': setSettings
    };
    
}();
