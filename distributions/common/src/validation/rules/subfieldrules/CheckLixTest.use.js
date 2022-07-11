use( "CheckLix" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test CheckLix", function() {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

    var params = { 'subfield': '042a' };
    var field;
    var subfield;

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "042 00 *a10"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with legal 042a",
        CheckLix.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "042 00*a10.2"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 042a",
        CheckLix.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", "Felt 042 delfelt a overholder ikke syntaksen. Skal være heltal" )] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00 *a 8-10"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 042a",
        CheckLix.validateSubfield( record, field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "checkLix.validation.error") )] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "035 00*a 2,5"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with illegal field 042a",
        CheckLix.validateSubfield( record, field, subfield,  params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "checkLix.validation.error" ) )] );

} );

