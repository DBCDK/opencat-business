//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckChangedValue" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckChangedValue.validateSubfield", function() {
    var params;
    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var msg_format = ResourceBundle.getStringFormat( bundle, "check.changed.value.error", "004", "a", "%s", "%s" );

    params = { toValues: [], fromValues: [] };
    SafeAssert.equal( "Empty param values", CheckChangedValue.validateSubfield( { fields: [] }, {}, {}, params ), [] );

    params = { toValues: [ "e", "b" ], fromValues: [ "s", "h" ] };
    SafeAssert.equal( "Params with new empty record", CheckChangedValue.validateSubfield( { fields: [] }, {}, {}, params ), [] );

    var record = {};
    var field = {};
    var subfield = {};
    var marcRecord = undefined;

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b xxx\n" +
        "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "001b is NaN", CheckChangedValue.validateSubfield( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a i"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "New record with type not in fromValues", CheckChangedValue.validateSubfield( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "New record with type in fromValues", CheckChangedValue.validateSubfield( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };
    SafeAssert.equal( "Update record with same record type", CheckChangedValue.validateSubfield( record, field, subfield, params ), [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "e";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with unknown old value and unknown new value",
        CheckChangedValue.validateSubfield( record, field, subfield, params ),
        [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a b"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "e";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with known old value and unknown new value",
        CheckChangedValue.validateSubfield( record, field, subfield, params ),
        [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a i"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "h";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with unknown old value and known new value",
        CheckChangedValue.validateSubfield( record, field, subfield, params ),
        [] );

    marcRecord = new Record();
    marcRecord.fromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *a e"
    );
    RawRepoClientCore.clear();
    RawRepoClientCore.addRecord( marcRecord );

    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 1 ];
    subfield = field.subfields[ 0 ];
    subfield.value = "s";
    params = { fromValues: [ "e", "b" ], toValues: [ "s", "h" ] };

    SafeAssert.equal( "Update record with wrong record type",
        CheckChangedValue.validateSubfield( record, field, subfield, params ),
        [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( msg_format, "e", "s" ) ) ] );
});