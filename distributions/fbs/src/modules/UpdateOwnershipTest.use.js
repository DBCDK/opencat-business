//-----------------------------------------------------------------------------
use( "UpdateOwnership" );
use( "RecordUtil" );
use( "SafeAssert" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "UpdateOwnership.mergeRecord", function() {
    var record;
    var curRecord;
    var expected;

    SafeAssert.equal( "Record is null", UpdateOwnership.mergeRecord( null, null ), null );
    SafeAssert.equal( "Record is undefined", UpdateOwnership.mergeRecord( undefined, null ), undefined );

    record = new Record;
    expected = new Record;
    SafeAssert.equal( "Current record is null", UpdateOwnership.mergeRecord( record, null ), expected );
    SafeAssert.equal( "Current record is undefined", UpdateOwnership.mergeRecord( record, undefined ), expected );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    expected = record.clone();
    SafeAssert.equal( "New record (no current record)", UpdateOwnership.mergeRecord( record, undefined ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n"
    );
    expected = record.clone();
    SafeAssert.equal( "Update record. Current record: No 996 ", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    expected = record.clone();
    SafeAssert.equal( "Update record. Current record: 996a (Same value)", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400 *o 700150"
    );
    expected = curRecord.clone();
    SafeAssert.equal( "Update record. Current record: 996a (Same value) with 996o", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400 *m 500400 *m 600500 *o 700150"
    );
    expected = curRecord.clone();
    SafeAssert.equal( "Update record. Current record: 996a (Same value) with 996m/o", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726500"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726500 *o 700400"
    );
    SafeAssert.equal( "Update record. Current record: 996a (Changed value)", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726850"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726500 *o 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726850 *m 726500 *o 700400"
    );
    SafeAssert.equal( "Update record. Current record: 996a, 996o (Changed value)", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 730250"
    );
    curRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 726850 *m 726500 *o 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970 *c xxx *d yyy *f a\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a 730250 *m 726850 *m 726500 *o 700400"
    );
    SafeAssert.equal( "Update record. Current record: 996a, 996m, 996o (Changed value)", UpdateOwnership.mergeRecord( record, curRecord ).toString(), expected.toString() );
} );
