use( "CheckDK5Syntax" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test CheckDK5Syntax", function() {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

    var params = { 'subfield': '652m' };
    var field;
    var subfield;

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 10"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 10.914"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *n 85.4-26"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652n (older notation of *n 85.4 *z 26)",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 78.421:3"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m (older notation of *m 78.421 *v 3)",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m Uden klassemærke"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m NY TITEL"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m sk"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 1"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with too few chars in field 652m",
        CheckDK5Syntax.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", "Syntaksfejl i DK5-klassemærke" )] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 102"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with missing full stop in field 652m",
        CheckDK5Syntax.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", "Syntaksfejl i DK5-klassemærke" )] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 109.14"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with invalid position of full stop in 652m",
        CheckDK5Syntax.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", "Syntaksfejl i DK5-klassemærke" )] );

    params = { 'subfield': '652n' };
    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *n 85. 4\n" +
        "652 00 *o sk"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Iinvalid: Record with blank in field 652n",
        CheckDK5Syntax.validateSubfield( record,field, subfield, params ), [ValidateErrors.subfieldError( "TODO:fixurl", "Syntaksfejl i DK5-klassemærke" )] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 33.26:2"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m including :",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 86-094"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m including - as separator",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 12345678 *b 870970 *c xxx *d yyy *f a\n" +
        "652 00 *m 51:66"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    subfield = field.subfields[0];
    Assert.equalValue( "Record with valid 652m including : as separator",
        CheckDK5Syntax.validateSubfield(record, field, subfield, params), []);


} );

