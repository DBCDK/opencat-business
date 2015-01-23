//-----------------------------------------------------------------------------
use( "RawRepoClientCore" );
use( "RawRepoMerger" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RawRepoMerger.mergeRecord", function() {
    var record;
    var rawRepoRecord;
    var expected;

    record = new Record;
    rawRepoRecord = new Record;
    expected = new Record;

    Assert.equalValue( "Empty records", RawRepoMerger.mergeRecord( record, rawRepoRecord ), expected );

    record.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p"
    ].join( "\n" ) );
    expected = record.clone();
    Assert.equalValue( "Empty rawrepo record", RawRepoMerger.mergeRecord( record, rawRepoRecord ), expected );

    record.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p"
    ].join( "\n" ) );
    rawRepoRecord.fromString( [
        "z99 00 *a stp"
    ].join( "\n" ) );
    expected.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p",
        "z99 00 *a stp"
    ].join( "\n" ) );
    Assert.equalValue( "Full records. No 996", RawRepoMerger.mergeRecord( record, rawRepoRecord ), expected );

    record.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p",
        "996 00 *a 700400"
    ].join( "\n" ) );
    rawRepoRecord.fromString( [
        "z99 00 *a stp"
    ].join( "\n" ) );
    expected.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p",
        "996 00 *a 700400",
        "s10 00 *a 700400",
        "z99 00 *a stp"
    ].join( "\n" ) );
    Assert.equalValue( "Full records. With 996 and no s10", RawRepoMerger.mergeRecord( record, rawRepoRecord ), expected );

    record.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p",
        "996 00 *a 700400"
    ].join( "\n" ) );
    rawRepoRecord.fromString( [
        "s10 00 *a 870970",
        "z99 00 *a stp"
    ].join( "\n" ) );
    expected.fromString( [
        "001 00 *a 12345678 *b 870970",
        "004 00 *r n *a e",
        "008 00 *t p",
        "996 00 *a 700400",
        "s10 00 *a 700400",
        "z99 00 *a stp"
    ].join( "\n" ) );
    Assert.equalValue( "Full records. With 996 and s10", RawRepoMerger.mergeRecord( record, rawRepoRecord ), expected );
} );
