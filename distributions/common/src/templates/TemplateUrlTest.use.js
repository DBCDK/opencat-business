/**
 * Created by mvs on 11/29/16.
 */
use("TemplateUrl");
use("UnitTest");


UnitTest.addFixture("Test TemplateUrl", function () {
    var fieldName = "001";
    var template = {"fields": {"001": {"url": "www.hest.dk"}}};
    Assert.equalValue("testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField(fieldName, template), "www.hest.dk");

    fieldName = "001";
    template = {"fields": {"001": ""}};
    Assert.equalValue("testing getUrlForFieldWithValidParams", TemplateUrl.getUrlForField(fieldName, template), "");
});