use("Locale");
use("SafeAssert");

UnitTest.addFixture("Locale.DANISH", function () {
    SafeAssert.equal("Locale.DANISH", Locale.DANISH, Locale.create('da', 'DK'));
});

UnitTest.addFixture("Locale.create", function () {
    SafeAssert.equal("Locale.create", Locale.create('da', 'DK'), {country: 'DK', language: 'da'});
});

UnitTest.addFixture("Locale.toString", function () {
    var instance = Locale.create('da', 'DK');
    SafeAssert.equal("Locale.toString", Locale.toString(instance), 'da_DK');
});
