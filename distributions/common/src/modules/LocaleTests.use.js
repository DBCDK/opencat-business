use("Locale");


UnitTest.addFixture("Locale.DANISH", function () {
    Assert.equalValue("Locale.DANISH", Locale.DANISH, Locale.create('da', 'DK'));
});

UnitTest.addFixture("Locale.create", function () {
    Assert.equalValue("Locale.create", Locale.create('da', 'DK'), {country: 'DK', language: 'da'});
});

UnitTest.addFixture("Locale.toString", function () {
    var instance = Locale.create('da', 'DK');
    Assert.equalValue("Locale.toString", Locale.toString(instance), 'da_DK');
});
