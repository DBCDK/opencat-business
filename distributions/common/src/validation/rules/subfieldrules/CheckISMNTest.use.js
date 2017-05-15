use("CheckISMN");
use("GenericSettings");
use("ResourceBundle");
use("UnitTest");

UnitTest.addFixture("CheckISMN.validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(CheckISMN.__BUNDLE_NAME);
    var record = {};
    var field = {};
    var params = undefined;

    var subfield = {'name': "ismn", 'value': "9790706785431"};
    Assert.equalValue("1 CheckISMN.validateSubfield with valid ismn number", CheckISMN.validateSubfield(record, field, subfield, params), []);

    subfield = {'name': "ismn", 'value': "9790706785432"};
    var error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.invalid.error", "ismn", "9790706785432"))];
    Assert.equalValue("2 CheckISMN.validateSubfield with invalid ismn number (checksum)", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "979-0706-8543-1"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.numbers.error", "ismn"))];
    Assert.equalValue("3 CheckISMN.validateSubfield with invalid chars (-)", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "979070678543"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.length.error", "ismn"))];
    Assert.equalValue("4 CheckISMN.validateSubfield with wrong length (too short)", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "97907067854311"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.length.error", "ismn"))];
    Assert.equalValue("5 CheckISMN.validateSubfield with wrong length (too long)", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "979070678543X"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.numbers.error", "ismn"))];
    Assert.equalValue("6 CheckISMN.validateSubfield with invalid char (X)", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "M-001-11485-1"};
    Assert.equalValue("7 CheckISMN.validateSubfield with valid ismn number", CheckISMN.validateSubfield(record, field, subfield, params), []);

    subfield = {'name': "ismn", 'value': "M0-01-11485-1"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.hyphenpos.error", "ismn"))];
    Assert.equalValue("8 CheckISMN.validateSubfield with invalid ismn number", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "M--00111485-1"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.hyphenpos.error", "ismn"))];
    Assert.equalValue("9 CheckISMN.validateSubfield with invalid ismn number", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "M-00111485--1"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.hyphenpos.error", "ismn"))];
    Assert.equalValue("10 CheckISMN.validateSubfield with invalid ismn number", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "M-001114885-1"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.hyphens.error", "ismn"))];
    Assert.equalValue("11 CheckISMN.validateSubfield with invalid ismn number", CheckISMN.validateSubfield(record, field, subfield, params)[0], error[0]);

    subfield = {'name': "ismn", 'value': "M-001-11148-51"};
    error = [ValidateErrors.subfieldError("TODO:fixurl", ResourceBundle.getStringFormat(bundle, "check.ismn.length.error", "ismn"))];
    Assert.equalValue("12 CheckISMN.validateSubfield with invalid ismn number", CheckISMN.validateSubfield(record, field, subfield, params), error);
});