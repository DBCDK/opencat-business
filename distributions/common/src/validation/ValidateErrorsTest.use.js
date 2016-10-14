use("UnitTest");

UnitTest.addFixture("Test ValidateErrors.recordError", function () {
    Assert.equalValue("ValidateErrors.recordError", {
        type: "ERROR",
        urlForDocumentation: "url",
        message: "message"
    }, ValidateErrors.recordError("url", "message"));

    Assert.equalValue("ValidateErrors.fieldError", {
        type: "ERROR",
        urlForDocumentation: "url",
        message: "message"
    }, ValidateErrors.fieldError("url", "message"));

    Assert.equalValue("ValidateErrors.subfieldError", {
        type: "ERROR",
        urlForDocumentation: "url",
        message: "message"
    }, ValidateErrors.subfieldError("url", "message"));
});
