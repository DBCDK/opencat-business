use("UnitTest");
use("CheckDateFormat");

UnitTest.addFixture("CheckDateFormat.validateSubfield - check *c", function () {
    var bundle = ResourceBundleFactory.getBundle(CheckDateFormat.__BUNDLE_NAME);
    var record;
    var field;
    var subfield;
    var params = {allowLong: true};
    var msg = {type: "ERROR", urlForDocumentation: "TODO:fixurl", message: null};

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c xxxxxxxxxxxxxx"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "xxxxxxxxxxxxxx");
    Assert.equalValue("Check *c - forkert datoformat - tekst", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 12345678"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "12345678");
    Assert.equalValue("Check *d (short) - forkert datoformat - ikke dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161332"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "20161332");
    Assert.equalValue("Check *d (short) - forkert datoformat - for 'stor' dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 12345678910012"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "12345678910012");
    Assert.equalValue("Check *d - forkert datoformat - ikke dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161332256161"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "20161332256161");
    Assert.equalValue("Check *d - forkert datoformat - for 'stor' dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c xxxxxxxxxxxxxxx"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.length", "xxxxxxxxxxxxxxx", [8, 14].join(", "));
    Assert.equalValue("Check *c - forkert længde - for lang", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c xxxxxxxxxxxxx"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.length", "xxxxxxxxxxxxx", [8, 14].join(", "));
    Assert.equalValue("Check *c - forkert længde - for kort", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161101"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *c - OK 1", CheckDateFormat.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c 19700101"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *c - OK 2", CheckDateFormat.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161101112142"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *c - OK 3", CheckDateFormat.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c 19700101000000"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *c - OK 4", CheckDateFormat.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c 20210328020044"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *c - OK 5", CheckDateFormat.validateSubfield(record, field, subfield, params), []);
});

UnitTest.addFixture("CheckDateFormat.validateSubfield - check *d", function () {
    var bundle = ResourceBundleFactory.getBundle(CheckDateFormat.__BUNDLE_NAME);
    var record;
    var field;
    var subfield;
    var params = {allowLong: false};
    var msg = {type:"ERROR", urlForDocumentation:"TODO:fixurl", message: null};

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d xxxxxxxx"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "xxxxxxxx");
    Assert.equalValue("Check *d (short) - forkert datoformat - tekst", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 12345678"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "12345678");
    Assert.equalValue("Check *d (short) - forkert datoformat - ikke dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161332"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.format", "20161332");
    Assert.equalValue("Check *d (short) - forkert datoformat - for 'stor' dato", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d xxxxxxx"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.length", "xxxxxxx", [8]);
    Assert.equalValue("Check *d (short) - forkert længde - for kort", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 123456789"));
    field = record.fields[0];
    subfield = field.subfields[2];
    msg.message = ResourceBundle.getStringFormat(bundle, "check.date.format.invalid.length", "123456789", [8]);
    Assert.equalValue("Check *d (short) - forkert længde - for lang", CheckDateFormat.validateSubfield(record, field, subfield, params), [msg]);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *d 20161101"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *d (short) - OK 1", CheckDateFormat.validateSubfield(record, field, subfield, params), []);

    record = DanMarc2Converter.convertFromDanMarc2(RecordUtil.createFromString("001 00 *a 50984508 *b 710100 *c 19700101"));
    field = record.fields[0];
    subfield = field.subfields[2];
    Assert.equalValue("Check *d (short) - OK 2", CheckDateFormat.validateSubfield(record, field, subfield, params), []);
});