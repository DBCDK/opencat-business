use("GenericSettings");
use("ResourceBundle");


UnitTest.addFixture("ResourceBundle.properties", function () {
    var settings = {};
    settings['validating.execute.error'] = "Ved validering af posten: %s";
    GenericSettings.setSettings(settings);

    var bundle = ResourceBundle.createWithProperties(Locale.DANISH, GenericSettings);

    SafeAssert.that("Key exist", ResourceBundle.containsKey(bundle, "validating.execute.error"));
    SafeAssert.that("Key does not exist", !ResourceBundle.containsKey(bundle, "validating.execute"));
    Assert.equalValue("Get value of key that exist", ResourceBundle.getString(bundle, "validating.execute.error"), "Ved validering af posten: %s");
    Assert.equalValue("Get value of key that does not exist", ResourceBundle.getString(bundle, "validating.execute"), "");

    Assert.equalValue("Get formated value of key that exist", ResourceBundle.getStringFormat(bundle, "validating.execute.error", "arg"), "Ved validering af posten: arg");
    Assert.equalValue("Get formated value of key that does not exist", ResourceBundle.getStringFormat(bundle, "validating.execute", "arg", 45), "");
});
