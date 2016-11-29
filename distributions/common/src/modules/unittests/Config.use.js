/** @file The Config module gives access to the system configuration placed in ConfigSettings. */

// This is the actual module where the settings are in.
use( "ConfigSettings" );

// Other modules this one depends on
use( "Immutable" );
use( "ES5" ); // Object.create...
use( "Log" );
use( "UnitTest" );
use( "System.Util" );
use( "Global" );

EXPORTED_SYMBOLS = [ 'Config' ];

/**
 * Module for getting access to ConfigSettings.
 * 
 * This module gives access to settings for the different modules 
 *
 * *TODO:* Mbd thinks cbo owes a bit of documentation on this module... 
 * 
 * @name Config
 * @namespace  */
var Config = function( ) {
    var config_handle = ConfigSettings;
    delete Global.ConfigSettings;
    var that = Object.create( config_handle );

    // Used to check that Config is immutable.
    that.unit_test_flag = "original";

    // We need to hang stuff we want to unittest on a variable that is
    // part of that, then we remove it later
    that.__ut = {};

    // Accesss __ut through this property, or loose it later!
    var impl = that.__ut;

    // Log n' throw
    that.Error = function( message ) {
        Log.error( message );
        throw Error( message );
    };

    // check config var is file and executable
    that.isFileAndExecutable = function( varname ) {
        var filename = that.get( varname );
        if ( !System.Util.isFile( filename ) ) {
            that.Error( "Configuration Error " + varname + " " + filename + " (file) does not exist" );
        }
        if ( !System.Util.isExecutable( filename ) ) {
            that.Error( "Configuration Error " + varname + " " + filename + " (file) is not executable" );
        }
    };


    // if name is a string like "foo.bar.baz", get the subproperty that.foo.bar.baz
    // (split the name on '.', and then repeatedly subscript that.
    // TODO: maybe move this into Util library
    // TODO: Document this.
    that.__ut.repeatedSubscript = function( obj, name ) {
        return name.split( '.' ).reduce( function( obj, name ) {
                return obj && obj[ name ];
            }, obj );
    };

    that.has = function( name ) {
        var property = impl.repeatedSubscript( that, name );
        return !( property === undefined );
    };

    // Main interface to config: 
    /**
     * Returns config property.
     * 
     * This should be used to access configuration, they should not be used
     * directly. It raises an exception if the property is undefined 
     * 
     * @typeFromOldDoc {method}
     * @syntax get( name )
     * @param name name of config property
     * @return config property
     * @example get( "BibliographicData" )get( "Mail.mta" )
     * @name Config.get
     * @method
     */
    that.get = function( name ) {
        // see http://bugs.dbc.dk/show_bug.cgi?id=10086
        var property = impl.repeatedSubscript( that, name );
        if ( property === undefined ) {
            that.Error( "Configuration is invalid: ConfigSettings." + name + " is undefined" );
        }
        return property;
    };

    that.demandDefined = function( name ) {
        var property = impl.repeatedSubscript( that, name );
        // Log.trace( "  name is " + name + " and value is '" + property + "'" );
        if ( property === undefined ) {
            that.Error( "Configuration is invalid: ConfigSettings." + name + " is undefined" );
        }
        return property;
    };

    return that;
}( );

// We do not want people to be able to change Config. 
// ConfigSettings is immutable, so that is no problem.
System.makeImmutable( Config );
