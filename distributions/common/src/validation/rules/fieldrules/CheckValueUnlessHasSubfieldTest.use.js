use( "CheckValueUnlessHasSubfield" );
use( "GenericSettings" );
use( "ResourceBundle" );
use( "UnitTest" );

UnitTest.addFixture( "Test CheckValueUnlessHasSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckValueUnlessHasSubfield.__BUNDLE_NAME );

    var params = { subfield: "2" , values: ["eng", "bob"]};
    var field;

    var marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00 *aeng"
    );

    var record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with legal 041, first value in allowed values", CheckValueUnlessHasSubfield.validateField(record, field, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00 *abob"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with legal 041, second value in allowed values", CheckValueUnlessHasSubfield.validateField(record, field, params), []);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00 *abob*deng"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with legal 041, two allowed values", CheckValueUnlessHasSubfield.validateField(record, field, params), []);


    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*akkk"
            );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with illegal field 041a", CheckValueUnlessHasSubfield.validateField( record,field, params ), [ValidateErrors.fieldError( "TODO:fixurl", "Værdien 'kkk' i felt '041' delfelt 'a' er ikke en del af de valide værdier: 'eng', 'bob'")]);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00 *a eng *d kkk"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with illegal field 041a as second subfield", CheckValueUnlessHasSubfield.validateField( record,field, params ), [ValidateErrors.fieldError( "TODO:fixurl", "Værdien 'kkk' i felt '041' delfelt 'd' er ikke en del af de valide værdier: 'eng', 'bob'")]);

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*a 870970kjik*2"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with illegal field 041, but subfield 2 present so no validation", CheckValueUnlessHasSubfield.validateField(record, field, params), []);


    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "041 00*a jik*2\n" +
        "041 00*ddam"
    );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[1];
    Assert.equalValue( "Record with one illegal field 041a, but subfield 2 present so no validation and one illegal subfield a to be validated illegal - first subfield", CheckValueUnlessHasSubfield.validateField(record, field, params), []);

    field = record.fields[2];
    Assert.equalValue( "Record with one illegal field 041a, but subfield 2 present so no validation and one illegal subfield a to be validated illegal - second subbfield", CheckValueUnlessHasSubfield.validateField(record, field, params), [ValidateErrors.fieldError( "TODO:fixurl", "Værdien 'dam' i felt '041' delfelt 'd' er ikke en del af de valide værdier: 'eng', 'bob'")]);
} );

