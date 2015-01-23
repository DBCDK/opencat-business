//-----------------------------------------------------------------------------
use( "GenericSettings" );
use( "ReadFile" );
use( "TemplateContainer" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "TemplateContainer.get", function() {
    GenericSettings.setSettings( {
        'javascript.basedir': new Packages.java.io.File( ".").getAbsolutePath() + "/../",
        'javascript.install.name': 'fbs'
    } );

    TemplateContainer.setSettings( GenericSettings );

    var temp = TemplateContainer.get( "bog" );
    Assert.that( "1", temp !== undefined );
    Assert.that( "2", temp.fields !== undefined );
    Assert.that( "3", temp.fields[ "001" ] !== undefined );
    Assert.that( "4", temp.fields[ "001" ].mandatory === undefined );

    TemplateContainer.setSettings( undefined );
});
