//-----------------------------------------------------------------------------
use( "TypeCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OCBFileSystem' ];

//-----------------------------------------------------------------------------
/**
 *
 *
 * @namespace
 * @name OCBFileSystem
 *
 */
var OCBFileSystem = function() {
    var DISTRIBUTION_DIR = "distributions";
    var SYSTEM_TESTS_DIR = "system-tests";
    var SYSTEM_TESTS_PATH = "%s/" + DISTRIBUTION_DIR + "/%s/" + SYSTEM_TESTS_DIR;

    function create( settings ) {
        return {
            basedir: settings.basedir
        }
    }

    function listFiles( dir ) {
        Log.trace( "Enter - OCBFileSystem.listFiles()" );

        var result = [];
        try {
            Log.debug( "Dir: ", dir );

            var file = new Packages.java.io.File( dir );
            var files = file.listFiles();

            for( var i = 0; i < files.length; i++ ) {
                if( !files[i].isFile() ) {
                    continue;
                }

                result.push( String( files[i].getName() ) );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - OCBFileSystem.listFiles(): ", result );
        }
    }

    function listSystemTestFilesByDistributionName( instance, distname ) {
        Log.trace( "Enter - OCBFileSystem.listFiles()" );

        var result = [];
        try {
            TypeCheck.checkString(distname, "OCBFileSystem.listSystemTestsByDistributionName: distname must be a String");

            var path = StringUtil.sprintf(SYSTEM_TESTS_PATH, instance.basedir, distname);
            result = listFiles( path ).filter( __isSystemTestFile );
            return result;
        }
        finally {
            Log.trace( "Exit - OCBFileSystem.listFiles(): ", result );
        }
    }

    function __isSystemTestFile( element, index, array ) {
        Log.trace( "Enter - __isSystemTestFile()" );

        try {
            return /\.json$/.test( element );
        }
        finally {
            Log.trace( "Exit - __isSystemTestFile()" );
        }
    }

    return {
        'create': create,
        'listSystemTestFilesByDistributionName': listSystemTestFilesByDistributionName
    }

}();
