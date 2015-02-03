//-----------------------------------------------------------------------------
use( "BasisSplitter" );
use( "UnitTest" );
use( "Print" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "BasisSplitter.splitCompleteBasisRecord", function() {
    var record;
    var enrightmentRecord;
    var commonRecord;
    var actual;

    record = RecordUtil.createFromString( "001 00 *a 1 234 567 8 *b 870970" );
    commonRecord = record.clone();
    enrightmentRecord = record.clone();
    enrightmentRecord.field( "001" ).subfield( "b" ).value = "010100";

    actual = BasisSplitter.splitCompleteBasisRecord( record );
    Assert.equalValue( "Simple split with *b: Common record", actual[ 0 ].toString(), commonRecord.toString() );
    Assert.equalValue( "Simple split with *b: Enrightment record", actual[ 1 ].toString(), enrightmentRecord.toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *r n *a e\n" +
        "s10 00 *a text\n"
    );
    commonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 870970\n" +
        "004 00 *r n *a e\n" +
        "996 00 *a text\n"
    );
    enrightmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 010100\n" +
        "s10 00 *a text\n"
    );

    actual = BasisSplitter.splitCompleteBasisRecord( record );
    print( actual[ 1 ].toString() );
    Assert.equalValue( "Split with no 996: Common record", actual[ 0 ].toString(), commonRecord.toString() );
    Assert.equalValue( "Split with no 996: Enrightment record", actual[ 1 ].toString(), enrightmentRecord.toString() );
} );
