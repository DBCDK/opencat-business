var JavaFile = Java.type( "java.io.File" );

function getAbsolutePath() {
    // Double .getParent one for . and one for ..
    return new JavaFile( "." ).getAbsoluteFile().getParentFile().getParentFile().getCanonicalPath();
}


function getCompiledOutDirFromSettings( settings ) {
    return StringUtil.sprintf( "%s/distributions/%s/compiled_templates", settings.get( 'javascript.basedir' ), settings.get( 'javascript.install.name' ) );
}


function createDirectoryIfDontExist( dir ) {
    var directory = new JavaFile( dir );
    if ( !directory.exists() ) {
        printn( "Creating output Directory : " + dir );
        directory.mkdir();
    }
}


function main() {

    use( "StopWatch" );
    var stopWatch = new StopWatch( "transpile-templates" );
    stopWatch.lap( "1. Load Packages" );
    use( "Print" );

// Todo: moved TemplateLoader and TemplateOptimizer out of TemplateContainer
    use( "TemplateContainer" );
    use( "GenericSettings" );
    use( "WriteFile" );

    stopWatch.lap( "2. setup" );

    var antCompiledTemplates = 0;
    var configuration = JSON.parse( System.readFile( System.arguments[0] ) );
    var templateBaseDir = getAbsolutePath();
    printn( templateBaseDir );

    printn( JSON.stringify( configuration ) );


    for ( var k = 0; k < configuration.installNames.length; k++ ) {
        var installName = configuration.installNames[k];
        printn( " compiling templates for name : " + installName );


        printn( templateBaseDir );

        GenericSettings.setSettings( {
            'javascript.basedir'     : templateBaseDir,
            'javascript.install.name': installName
        } );
        ResourceBundleFactory.init( GenericSettings );
        TemplateContainer.setSettings( GenericSettings );

        var outputDirectory = getCompiledOutDirFromSettings( GenericSettings );
        createDirectoryIfDontExist( outputDirectory );


        stopWatch.lap( "3. lookup templates: " + installName );
        var templateNames = TemplateContainer.getTemplateNames();
        printn( "Found " + templateNames.length + " for " + installName );
        printn( "Output Directory is: " + outputDirectory );


        for ( var i = 0; i < templateNames.length; ++i ) {
            print( "." );
            var templateName = templateNames[i].schemaName;
            stopWatch.lap( "4. Template " + installName + "/" + templateName );
            var template = TemplateContainer.loadTemplate( templateName );
            System.writeFile( outputDirectory + "/" + templateName + ".json", JSON.stringify( template ) );

            ++antCompiledTemplates;
        }
        printn( "\ndone with: " + installName );
    }

    printn( " Done Compiling " + antCompiledTemplates + " Templates" );
    printn( stopWatch.stop() );


}