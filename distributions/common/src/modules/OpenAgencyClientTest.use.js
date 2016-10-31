use("OpenAgencyClient");
use("UnitTest");

UnitTest.addFixture("OpenAgencyClient.Features", function () {
    Assert.not("Feature not found in empty set", OpenAgencyClient.hasFeature("010100", "auth_root"));

    OpenAgencyClientCore.addFeatures("010100", ["auth_root", "use_enrichments"]);
    Assert.that("Feature found for known agency", OpenAgencyClient.hasFeature("010100", "auth_root"));
    Assert.not("Feature not found for known agency", OpenAgencyClient.hasFeature("010100", "xxx"));

    Assert.not("Feature not found for unknown agency", OpenAgencyClient.hasFeature("710300", "xxx"));

    OpenAgencyClientCore.clearFeatures();
    Assert.not("Lookup feature after clearFeatures", OpenAgencyClient.hasFeature("010100", "auth_root"));
});

