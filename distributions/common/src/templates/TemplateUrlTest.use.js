/**
 * Created by mvs on 11/29/16.
 */
use("TemplateUrl");
use("UnitTest");
use("SafeAssert");

UnitTest.addFixture("Test TemplateUrl", function () {
    var fieldName = "001";
    var template = {"fields": {"001": {"url": "www.hest.dk"}}};
    SafeAssert.equal("testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField(fieldName, template), "www.hest.dk");

    var fieldName = "001";
    var template = {"fields": {"001": ""}};
    SafeAssert.equal("testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField(fieldName, template), "");
});