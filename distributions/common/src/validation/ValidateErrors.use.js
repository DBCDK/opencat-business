//-----------------------------------------------------------------------------
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'ValidateErrors' ];

//-----------------------------------------------------------------------------
/**
 * Module to create objects with validate errors for the Validate web service.
 * 
 * @namespace
 * @name ValidateErrors
 * 
 */
var ValidateErrors = function() {
    var that = {};
    
    /**
     * Creates a validate error for an generel record error.
     * 
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     * 
     * @return A json with the error type for a record error.
     */
    that.recordError = function( url, message ) {
        return {
            type: "ERROR",
            params: {
                url: url,
                message: message
            }
        };
    };

    /**
     * Creates a validate error for an generel field error.
     * 
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     * 
     * @return A json with the error type for a field error.
     */
    that.fieldError = function( url, message ) {
        return {
            type: "ERROR",
            params: {
                url: url,
                message: message
            }
        };
    };

    /**
     * Creates a validate error for an generel subfield error.
     * 
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     * 
     * @return A json with the error type for a field error.
     */
    that.subfieldError = function( url, message ) {
        return {
            type: "ERROR",
            params: {
                url: url,
                message: message
            }
        };
    };
    return that;
}();

//-----------------------------------------------------------------------------

UnitTest.addFixture( "Test ValidateErrors.recordError", function( ) {
    Assert.equalValue( "ValidateErrors.recordError", {
        type : "ERROR",
        params : {
            url : "url",
            message : "message"
        }
    }, ValidateErrors.recordError( "url", "message" ) );

    Assert.equalValue( "ValidateErrors.fieldError", {
        type : "ERROR",
        params : {
            url : "url",
            message : "message"
        }
    }, ValidateErrors.fieldError( "url", "message" ) );

    Assert.equalValue( "ValidateErrors.subfieldError", {
        type : "ERROR",
        params : {
            url : "url",
            message : "message"
        }
    }, ValidateErrors.subfieldError( "url", "message" ) );
} );

// TODO: test fieldError

// TODO: test subfieldError