//-----------------------------------------------------------------------------
use( "DoubleRecordFinder" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchTechnicalLiterature", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, but no *a", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, but no *g", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a *g xx",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(a)g/652m: Uden klassem\xe6rke", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: Uden klassem\xe6rke", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *a q *g xx",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)ag/652m: Uden klassem\xe6rke", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx *g xe",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)gg/652m: Uden klassem\xe6rke", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 82.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 82.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 83.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 83.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 84.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 84.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 85.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 85.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 86.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 86.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 87.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 87.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.18"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 88.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.1"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 88.1", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.2"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 88.2", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: sk", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 48.64"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 48.64", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findTechnicalLiterature", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ), [] );

    SolrCore.clear();
    SolrCore.addQuery( "( marc.008a:\"2014\" or marc.008a:\"2015\" or marc.008a:\"2016\" ) and marc.009a:\"a\" and marc.009g:\"xx\" and marc.245a:\"Anton til soes\" and marc.260b:\"Ca\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );

    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ),
        [ { id: "12345678", reason: "008a, 009a, 009g, 245a, 260b" } ]
    );
} );
