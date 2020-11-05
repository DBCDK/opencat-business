//-----------------------------------------------------------------------------
use( "TypeCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OCBTestCase' ];

//-----------------------------------------------------------------------------
/**
 * This module represent a OCB-Tools Testcase.
 *
 * @namespace
 * @name OCBTestCase
 *
 */
var OCBTestCase = function() {
    function createByObject( obj ) {
        TypeCheck.checkObject( obj, "En OCB TestCase skal initialiseres fra et objekt." );
        TypeCheck.checkProperty( obj, "name", "En OCB TestCase skal initialiseres med et navn." );

        return {
            name: obj.name,
            description: obj.description
        }
    }

    function getName( testCase ) {
        return testCase.name;
    }

    function getDescription( testCase ) {
        return testCase.description;
    }

    return {
        'createByObject': createByObject,
        'getName': getName,
        'getDescription': getDescription
    }

}();
