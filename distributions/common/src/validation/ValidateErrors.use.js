use("UnitTest");

EXPORTED_SYMBOLS = ['ValidateErrors'];

/**
 * Module to create objects with validate errors for the Validate web service.
 *
 * @namespace
 * @name ValidateErrors
 *
 */
var ValidateErrors = function () {
    var that = {};

    /**
     * Creates a validate error for an generel record error.
     *
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     *
     * @return A json with the error type for a record error.
     */
    function recordError(url, message, pid) {
        return __error(url, message, pid);
    }

    /**
     * Creates a validate error for an generel field error.
     *
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     *
     * @return A json with the error type for a field error.
     */
    function fieldError(url, message, pid) {
        return __error(url, message, pid);
    }

    /**
     * Creates a validate error for an generel subfield error.
     *
     * @param {String} url     Url to a description of the error.
     * @param {String} message Error message
     *
     * @return A json with the error type for a field error.
     */
    function subfieldError(url, message, pid) {
        return __error(url, message, pid);
    }

    function __error(url, message, pid) {
        if (url === undefined) {
            if (pid === undefined) {
                return __errorWoUrl(message);
            } else {
                return __errorWoUrlWPid(message, pid);
            }
        } else {
            if (pid === undefined) {
                return __errorWUrl(url, message);
            } else {
                return __errorWUrlWPid(url, message, pid);
            }
        }
    }

    function __errorWUrl(url, message) {
        return {
            type: "ERROR",
            params: {
                param: [
                    {
                        key: "message",
                        value: message
                    },
                    {
                        key: "url",
                        value: url
                    }
                ]
            }
        };
    }

    function __errorWUrlWPid(url, message, pid) {
        return {
            type: "ERROR",
            params: {
                param: [
                    {
                        key: "message",
                        value: message
                    },
                    {
                        key: "url",
                        value: url
                    },
                    {
                        key: "pid",
                        value: pid
                    }
                ]
            }
        };
    }

    function __errorWoUrl(message) {
        return {
            type: "ERROR",
            params: {
                param: [
                    {
                        key: "message",
                        value: message
                    }
                ]
            }
        };
    }

    function __errorWoUrlWPid(message,pid) {
        return {
            type: "ERROR",
            params: {
                param: [
                    {
                        key: "message",
                        value: message
                    },
                    {
                        key: "pid",
                        value: pid
                    }
                ]
            }
        };
    }

    return {
        'recordError': recordError,
        'fieldError': fieldError,
        'subfieldError': subfieldError
    };
}();

UnitTest.addFixture("Test ValidateErrors.recordError", function () {
    Assert.equalValue("ValidateErrors.recordError", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                }
            ]
        }
    }, ValidateErrors.recordError("url", "message"));

    Assert.equalValue("ValidateErrors.recordError wPid", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                },
                {
                    key: "pid",
                    value: "pid"
                }
            ]
        }
    }, ValidateErrors.recordError("url", "message", "pid"));

    Assert.equalValue("ValidateErrors.fieldError", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                }
            ]
        }
    }, ValidateErrors.fieldError("url", "message"));

    Assert.equalValue("ValidateErrors.fieldError wPid", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                },
                {
                    key: "pid",
                    value: "pid"
                }
            ]
        }
    }, ValidateErrors.fieldError("url", "message", "pid"));

    Assert.equalValue("ValidateErrors.subfieldError", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                }
            ]
        }
    }, ValidateErrors.subfieldError("url", "message"));

    Assert.equalValue("ValidateErrors.subfieldError wPid", {
        type: "ERROR",
        params: {
            param: [
                {
                    key: "message",
                    value: "message"
                },
                {
                    key: "url",
                    value: "url"
                },
                {
                    key: "pid",
                    value: "pid"
                }
            ]
        }
    }, ValidateErrors.subfieldError("url", "message", "pid"));
});
