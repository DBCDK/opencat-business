//-----------------------------------------------------------------------------
use( "Print" );
use( "TemplateContainer" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TemplateTest' ];

//-----------------------------------------------------------------------------
var TemplateTest = function() {

    var templates = ['bog', 'bogbind', 'boghoved', 'bogsektion', 'dbc', 'film', 'lokalpost', 'musik', 'netlydbog', 'netlydboghoved', 'netlydbogbind', 'netpublikation', 'supplementspost' ];

    function testTemplates() {
        var result = true;
        var template;
        for ( var i = 0; i < templates.length && result === true; i++ ) {
			print( "Testing template " + templates[i] + "\n" )
            template = TemplateContainer.testLoadOfTemplateDoNotUse( templates[i] );
            if ( template === undefined  ) {
                result = false;
            }
            print( " ... Done\n" )
        }
        return result;
    };

    return {
        'testTemplates': testTemplates
    };
}();
//-----------------------------------------------------------------------------
UnitTest.addFixture( "Test TemplateTest.testTemplates", function() {
    var testResult = TemplateTest.testTemplates();
    SafeAssert.equal(" Test af skabelon loading", testResult, true);
});
//-----------------------------------------------------------------------------
