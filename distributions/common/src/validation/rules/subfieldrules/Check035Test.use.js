use( "Check035" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test Check035", function() {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

    var params = { 'subfield': '035a' };
    var field;
    var subfield;

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00 *a(DK-870970)5-45454"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with legal 035a",
        Check035.validateSubfield(record, field, subfield, params), []);

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00 *a(8709-70kjik)"
    );


    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with legal 035a",
        Check035.validateSubfield(record, field, subfield, params), []);

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00 *a(8709-70kjik)klp(jk.)"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with legal 035a",
        Check035.validateSubfield(record, field, subfield, params), []);


    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00*a (870970kjik"
            );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 035a",
        Check035.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check035.validation.error") )] );



    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00*a 870970kjik"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 035a",
        Check035.validateSubfield( record, field, subfield,  params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check035.validation.error" ) )] );

} );

