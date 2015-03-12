//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'OCBTestCaseRepository' ];

//-----------------------------------------------------------------------------
/**
 *
 *
 * @namespace
 * @name OCBTestCaseRepository
 *
 */
var OCBTestCaseRepository = function() {
    function create() {
        return {
            testcases: []
        }
    }

    function addFromArray( instance, array ) {
        instance.testcases = instance.testcases.concat( array );
    }

    return {
        'create': create,
        'addFromArray': addFromArray
    }

}();
