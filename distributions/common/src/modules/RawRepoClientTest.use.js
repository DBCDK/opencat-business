use("Marc");
use("RawRepoClient");
use("UnitTest");

UnitTest.addFixture("RawRepoClient", function () {
    RawRepoClientCore.clear();
    Assert.equalValue("recordExists: Empty repo", RawRepoClient.recordExists("12345678", "870970"), false);

    var rec = new Record();
    rec.fromString("001 00 *a 12345678 *b 870970");
    RawRepoClientCore.addRecord(rec);

    Assert.equalValue("recordExists: Record exist", RawRepoClient.recordExists("12345678", "870970"), true);
    Assert.equalValue("recordExists: Record does not exist", RawRepoClient.recordExists("12345678", "870973"), false);

    Assert.equalValue("fetchRecord: Record exist", RawRepoClient.fetchRecord("12345678", "870970").toString(), rec.toString());
    Assert.equalValue("fetchRecord: Record does not exist", RawRepoClient.fetchRecord("12345678", "870973"), undefined);
    RawRepoClientCore.clear();
});
