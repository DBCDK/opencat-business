use( "NonRepeatableFieldSubfieldCombination" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test NonRepeatableFieldSubfieldCombination.validateRecord mandatory field exists", function() {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

    var params = { 'subfield': '652m' };

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 44.2\n"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    Assert.equalValue( "Record only contains one field 652m",
        NonRepeatableFieldSubfieldCombination.validateRecord( record, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 44.2\n" +
        "652 00 *m 42.2\n"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    Assert.equalValue( "Record contains two field 652m",
        NonRepeatableFieldSubfieldCombination.validateRecord( record, params ), [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "NonRepeatableFieldSubfieldCombination.validation.error", "652m" ) )] );

} );

