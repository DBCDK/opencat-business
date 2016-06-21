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

    record = RecordUtil.createFromString( StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s", UpdateConstants.COMMON_AGENCYID ) );
    commonRecord = RecordUtil.createFromString( StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s", UpdateConstants.RAWREPO_COMMON_AGENCYID ) );
    enrightmentRecord = record.clone();
    enrightmentRecord.field( "001" ).subfield( "b" ).value = UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID;

    actual = BasisSplitter.splitCompleteBasisRecord( record );
    Assert.equalValue( "Simple split with *b: Common record", actual[ 0 ].toString(), commonRecord.toString() );
    Assert.equalValue( "Simple split with *b: Enrightment record", actual[ 1 ].toString(), enrightmentRecord.toString() );

    record = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "996 00 *a text\n"
    );
    commonRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_COMMON_AGENCYID ) +
        "004 00 *r n *a e\n" +
        "996 00 *a text\n"
    );
    enrightmentRecord = RecordUtil.createFromString(
        StringUtil.sprintf( "001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID ) +
        "004 00 *r n *a e\n"
    );

    actual = BasisSplitter.splitCompleteBasisRecord( record );
    Assert.equalValue( "Split with no 996: Common record", actual[ 0 ].toString(), commonRecord.toString() );
    Assert.equalValue( "Split with no 996: Enrightment record", actual[ 1 ].toString(), enrightmentRecord.toString() );
} );
