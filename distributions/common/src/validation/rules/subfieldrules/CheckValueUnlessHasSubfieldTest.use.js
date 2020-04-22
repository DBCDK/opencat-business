use( "CheckValueUnlessHasSubfield" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test CheckValueUnlessHasSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

    var params = { 'subfield': '041a' };
    var field;
    var subfield;

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00 *aeng"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with legal 041", CheckValueUnlessHasSubfield.validateSubfield(record, field, subfield, params), []);

   marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*akkk"
            );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 041a", CheckValueUnlessHasSubfield.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getSting(bundle, "Record with illegal field 041a"))]);


    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*a 870970kjik*2"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 041, but subfield 2 present so no validation", CheckValueUnlessHasSubfield.validateSubfield(record, field, subfield, params), []);


    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*a jik*2\n" +
        "041 00*ddam"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with one illegal field 041a, but subfield 2 present so no validation and one illegal subfield a to be validated illegal ", CheckValueUnlessHasSubfield.validateSubfield(record, field, subfield, params), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getSting(bundle, "Record with illegal field 041a"))]);
} );

