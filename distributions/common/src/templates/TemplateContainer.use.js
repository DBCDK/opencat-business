//-----------------------------------------------------------------------------
use( "ReadFile" );
use( "TemplateOptimizer" );
use( "TemplateLoader" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TemplateContainer' ];

//-----------------------------------------------------------------------------
/**
 * Container of all templates for the Validate Web Service.
 * 
 * @namespace
 * @name TemplateContainer
 * 
 */
var TemplateContainer = function() {
    var templates = {};
    var templatesUnoptimized = {};
    var settings;

	function setSettings( newSettings ) {
		settings = newSettings;
	}

    /**
     * Gets the names of the templates as an Array
     * 
     * @return {Array} An Array with the names of the templates.
     */
    function getTemplateNames() {
    	Log.trace( "Enter - getTemplateNames()" );
    	
    	try {
	    	var rootDir = new Packages.java.io.File( StringUtil.sprintf( "%s/%s/templates", settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ) ) ); 
	    	var files = rootDir.listFiles();
	    	var result = [];
	    	
	    	Log.debug( "Using install dir: ", rootDir.getAbsolutePath() );
	    	
	    	for( var i = 0; i < files.length; i++ ) {
	    		if( !files[i].isFile() ) {
	    			continue;
	    		}
	    		
	    		var filepath = files[i].getAbsolutePath();
	    		var filename = files[i].getName();
	    		
	    		if( !filename.endsWith( "json" ) ) {
	    			continue;
	    		}
	    		
	    		Log.debug( "Checking file: ", filename, " -> ", filepath );
	    		
	    		var schema = { schemaName: "", schemaInfo: "" };
	    		
	    		schema.schemaName = filename.substr( 0, filename.lastIndexOf( "." ) );
	    		var templateObj = JSON.parse( System.readFile( filepath ) );
	    		if( templateObj.hasOwnProperty( 'description' ) ) {
	    			schema.schemaInfo = templateObj.description;
	    		}
	    		
	    		Log.debug( "Found template '", schema.schemaName, "' -> '", schema.schemaInfo, "'" );
	    		result.push( schema );
	    	}
	    	
	    	return result;
	    }
	    finally {
	    	Log.trace( "Exit - getTemplateNames()" );
	    }
    	/*
        return [ 
            {
                schemaName: "bog",
                schemaInfo: "Enkeltst\u00E5ende post for en bog"
            },
            {
                schemaName: "bogbind",
                schemaInfo: "Bindpost for en bog"
            },
            {
                schemaName: "bogsektion",
                schemaInfo: "Sektionspost for en bog"
            },
            {
                schemaName: "boghoved",
                schemaInfo: "Hovedpost for en bog"
            },
            {
                schemaName: "lokalpost",
                schemaInfo: "Validering af lokalpost eller p\u00E5h\u00E6ngspost"
            }
        ];
        */
    }

    /**
     * Loads a template from a json file and returns it.
     * 
     * The template file is assumed to be placed in the same directory as this 
     * file with the extension "json".
     *  
     * @param {Object} name The name of the template.
     * 
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error. 
     */
    function loadTemplate( name ) {
        return TemplateOptimizer.optimize( loadTemplateUnoptimized( name, settings ) );
    };

    /**
     * Returns the optimized template by name.
     * 
     * If the template has not been loaded it will be loaded first and 
     * optimized.
     *  
     * @param {Object} name The of the template.
     */
    function get( name ) {
        var result = templates[ name ];
        if( result === undefined ) {
            result = loadTemplate( name );
            if( result !== undefined ) {
                templates[ name ] = result;
            }
        };
        
        return result;
    };

    /**
     * Helper function to koads a template from a json file and returns it.
     * 
     * The template file is assumed to be placed in the same directory as this 
     * file with the extension "json".
     *  
     * @param {String} name The name of the template.
     * 
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error. 
     */
    function __loadUnoptimizedTemplate( name ) {
    	Log.trace( "Enter - __loadUnoptimizedTemplate( name, settings )" );
    	
    	try {
	        var result = templatesUnoptimized[ name ];
	        
	        if( result === undefined ) {
				
	            if( !settings.containsKey( 'javascript.basedir' ) ) {
	                throw "Settings does not contain the key 'javascript.basedir'";
	            }
	            if( !settings.containsKey( 'javascript.install.name' ) ) {
	                throw "Settings does not contain the key 'javascript.install.name'";
	            }
	            
	            var templateFileNamePattern = "%s/%s/templates/%s.json";
	            var templateContent = null;
            	var filename = "";
	            try {
	            	// Load template from 'install.name' directory.
	            	filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ), name );
	            	templateContent = System.readFile( filename );
	            	Log.info( "Using template file: " + filename );
	            }
	            catch( ex ) {
	            	Log.debug( "Unable to load template file: ", ex );
	            	
	            	// Load template from 'common' directory.
	            	filename = StringUtil.sprintf( templateFileNamePattern, settings.get( 'javascript.basedir' ), "common", name );
	            	templateContent = System.readFile( filename );
	            	Log.info( "Using template file: " + filename );	            	
	            }
	
	            if ( templateContent !== null ) {
	                result = JSON.parse( templateContent );
	            }
	            else {
	            	throw StringUtil.sprintf( "Unable to read content from '%s'", filename );
	            }
	            
	            if( result !== undefined ) {
	                templatesUnoptimized[ name ] = result;
	            }
	        };
	        
	        return result;
		}
		finally {
			Log.trace( "Exit - __loadUnoptimizedTemplate( name, settings )" );
		}
    }
    
    /**
     * Loads a template from a json file and returns it.
     * 
     * The template file is assumed to be placed in the same directory as this 
     * file with the extension "json".
     *  
     * @param {Object} name The name of the template.
     * 
     * @return {Object} A json object that contains the configuration of
     *         the requested template. Or undefined in case of an error. 
     */
    function loadTemplateUnoptimized( name ) {
        return TemplateLoader.load( name, __loadUnoptimizedTemplate );
    };

    /**
     * Returns the unoptimized template by name.
     * 
     * If the template has not been loaded it will be loaded first and cached.
     *  
     * @param {Object} name The of the template.
     */
    function getUnoptimized( name ) {
        var result = templatesUnoptimized[ name ];
        if( result === undefined ) {
            result = loadTemplateUnoptimized( name, settings );
            if( result !== undefined ) {
                templatesUnoptimized[ name ] = result;
            }
        };
        
        return result;
    };

    // Function used to test templates, DO NOT USE
    function testLoadOfTemplateDoNotUse( name ) {
        var template = TemplateLoader.load( name, __testLoadOptimizedTemplateDoNotUse );
        var res = TemplateOptimizer.optimize( template );
        return res;
    };

    function __testLoadOptimizedTemplateDoNotUse( name ) {
        var stringContent = System.readFile( name + ".json" );
        var jsonContent = JSON.parse(stringContent);
        return jsonContent;
    };


    return {
    	'setSettings': setSettings,
        'getTemplateNames': getTemplateNames,
        'loadTemplate': loadTemplate,
        'get': get,
        'loadTemplateUnoptimized': loadTemplateUnoptimized,
        'getUnoptimized': getUnoptimized,
        'testLoadOfTemplateDoNotUse': testLoadOfTemplateDoNotUse
    };
    
}();

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Test TemplateContainer.get", function() {
    var temp = TemplateContainer.get( "us-book" );
    Assert.that( "1", temp !== undefined );    
    Assert.that( "2", temp.fields !== undefined );    
    Assert.that( "3", temp.fields[ "001" ] !== undefined );    
    Assert.that( "4", temp.fields[ "001" ].mandatory === undefined );    
});
