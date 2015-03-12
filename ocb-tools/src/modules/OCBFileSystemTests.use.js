//-----------------------------------------------------------------------------
use( "GenericSettings" );
use( "OCBFileSystem" );
use( "TemplateContainer" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "OCBFileSystem.listFBSSystemTests", function() {
    GenericSettings.setSettings( {
        'javascript.basedir': '/Users/stp/Documents/Projects/data/opencat-business',
        'javascript.install.name': 'fbs'
    } );

    TemplateContainer.setSettings( GenericSettings );

    var temp = TemplateContainer.get( "bog" );

    //var fs = OCBFileSystem.create( { basedir: '/Users/stp/Documents/Projects/data/opencat-business' } );
    //var files = OCBFileSystem.listSystemTestFilesByDistributionName( fs, "fbs" );

    //Assert.equalValue( "Files", files, [ "bog-cases.json", "film-cases.json" ] );
} );
