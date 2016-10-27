use("Log");
use("GenericSettings");
use("ResourceBundle");
use("SafeAssert");

UnitTest.addFixture("ResourceBundle.properties", function () {
    Log.trace("Enter - Fixture: ResourceBundle.properties");

    try {
        var settings = {};
        settings['validating.execute.error'] = "Ved validering af posten: %s";
        GenericSettings.setSettings(settings);

        var bundle = ResourceBundle.createWithProperties(Locale.DANISH, GenericSettings);

        SafeAssert.that("Key exist", ResourceBundle.containsKey(bundle, "validating.execute.error"));
        SafeAssert.that("Key does not exist", !ResourceBundle.containsKey(bundle, "validating.execute"));
        SafeAssert.equal("Get value of key that exist", ResourceBundle.getString(bundle, "validating.execute.error"), "Ved validering af posten: %s");
        SafeAssert.equal("Get value of key that does not exist", ResourceBundle.getString(bundle, "validating.execute"), "");

        SafeAssert.equal("Get formated value of key that exist", ResourceBundle.getStringFormat(bundle, "validating.execute.error", "arg"), "Ved validering af posten: arg");
        SafeAssert.equal("Get formated value of key that does not exist", ResourceBundle.getStringFormat(bundle, "validating.execute", "arg", 45), "");
    }
    finally {
        Log.trace("Exit - Fixture: ResourceBundle.properties");
    }
});
