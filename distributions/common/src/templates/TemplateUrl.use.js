//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TemplateUrl' ];

//-----------------------------------------------------------------------------
/**
 * Module to optimize a template.
 * @namespace
 * @name TemplateOptimizer
 */

var TemplateUrl = function( ) {
    /**
     * Optimizes a template and returns the result.
     *
     * @param {Object} template The template.
     */

    function getUrlForField( fieldName, template ) {
        if ( template === undefined ) {
            return ""; 
        }
        if ( template.fields[fieldName] === undefined  ) {
            return ""; 
        }
        return template.fields[fieldName].url || "";
    };

    return {
        'getUrlForField' : getUrlForField
    };

}( ); 

use( "UnitTest" );
use( "SafeAssert" );

UnitTest.addFixture( "Test TemplateUrl", function( ) {
    
        var fieldName = "001";
        var template = {"fields" : {"001" : {"url": "www.hest.dk"} }  };
        SafeAssert.equal( "testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField( fieldName, template ), "www.hest.dk");
        
        var fieldName = "001";
        var template = {"fields" : {"001" : ""}};
        SafeAssert.equal( "testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField( fieldName, template ), "");
});
		