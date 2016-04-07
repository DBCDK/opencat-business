//-----------------------------------------------------------------------------
use( "DoubleRecordFinder" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchVolumes", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchVolumes( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, but no *a", DoubleRecordFinder.__matchVolumes( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n *a e",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, *a but no b", DoubleRecordFinder.__matchVolumes( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n *a b",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, *a with b", DoubleRecordFinder.__matchVolumes( record ), true );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchSections", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchSections( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, but no *a", DoubleRecordFinder.__matchSections( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n *a e",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, *a but no s", DoubleRecordFinder.__matchSections( record ), false );

    record = RecordUtil.createFromString( [
        "004 00 *r n *a s",
        "014 00 *a 5 000 259 4",
        "245 00 *n 5 *o The ¤nineteenth century*eedited by David Baguley"
    ].join( "\n") );
    Assert.equalValue( "004, *a with s", DoubleRecordFinder.__matchSections( record ), true );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchNumbers", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchNumbers( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "No 021,022,023,024,028 fields", DoubleRecordFinder.__matchNumbers( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "021 00 *a 12345678"
    ].join( "\n") );
    Assert.equalValue( "021 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "021 00 *e 12345678"
    ].join( "\n") );
    Assert.equalValue( "021 e", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "021 00 *x 12345678"
    ].join( "\n") );
    Assert.equalValue( "021 x", DoubleRecordFinder.__matchNumbers( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "022 00 *a 12345678"
    ].join( "\n") );
    Assert.equalValue( "022 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "024 00 *a 12345678"
    ].join( "\n") );
    Assert.equalValue( "024 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "028 00 *a 12345678"
    ].join( "\n") );
    Assert.equalValue( "028 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "023 00 *a 12345678"
    ].join( "\n") );
    Assert.equalValue( "023 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "023 00 *b 12345678"
    ].join( "\n") );
    Assert.equalValue( "023 b", DoubleRecordFinder.__matchNumbers( record ), true );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchSoundMovieMultimedia", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klasem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, but no *a", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *as", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a *a s",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *a twice and a v", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a r *g xe",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009 *a r and g xe", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a m *g xe",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009 *a m and g xe", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a t *g xe",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009 *a t and g xe", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a t *g tk",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009 *a t and g tk", DoubleRecordFinder.__matchSoundMovieMultimedia( record ), true );

} );
//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchMusic", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, but no *a", DoubleRecordFinder.__matchMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *as", DoubleRecordFinder.__matchMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a a *a s",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *a twice and a v", DoubleRecordFinder.__matchMusic( record ), false );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchComposedMaterials", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchComposedMaterials( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, but no *a", DoubleRecordFinder.__matchComposedMaterials( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a v",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *av", DoubleRecordFinder.__matchComposedMaterials( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a a *a b",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *a twice", DoubleRecordFinder.__matchComposedMaterials( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a a *a v",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "009, *a twice and a v", DoubleRecordFinder.__matchComposedMaterials( record ), false );

} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchSimpleLiterature", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__matchSimpleLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
    ].join( "\n") );
    Assert.equalValue( "009, but no *a", DoubleRecordFinder.__matchSimpleLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a",
    ].join( "\n") );
    Assert.equalValue( "009, but no *g", DoubleRecordFinder.__matchSimpleLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a *g xx",
    ].join( "\n") );
    Assert.equalValue( "Found 009a(a)g", DoubleRecordFinder.__matchSimpleLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g", DoubleRecordFinder.__matchSimpleLiterature( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *a q *g xx",
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)ag", DoubleRecordFinder.__matchSimpleLiterature( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx *g xe",
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)gg", DoubleRecordFinder.__matchSimpleLiterature( record ), false );

} );

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
        "652 00 *m 88.11"
    ].join( "\n") );
    Assert.equalValue( "Found 009a(c)g/652m: 88.18", DoubleRecordFinder.__matchTechnicalLiterature( record ), true );

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

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *n 86.4 *z 096",
        "652 00 *o 84"
    ].join( "\n") );
    Assert.equalValue( "Fixtion Literature STP", DoubleRecordFinder.__matchTechnicalLiterature( record ), false );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__matchFictionBookMusic", function() {
    var record;

    record = new Record;
    Assert.equalValue( "Fiction Empty record", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Fiction 009, but no *a", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    Assert.equalValue( "Fiction 009, but no *g", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a a *g xx",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(a)g/652m: sk", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: sk", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *a q *g xx",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)ag/652m: sk", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx *g xe",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)gg/652m: sk", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 82.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 82.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 83.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 83.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 84.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 84.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 85.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 85.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 86.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 86.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 87.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 87.18", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.18"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 88.18", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.1"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 88.1", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 88.2"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 88.2", DoubleRecordFinder.__matchFictionBookMusic( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m sk"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: sk", DoubleRecordFinder.__matchFictionBookMusic( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a c *g xx",
        "652 00 *m 48.64"
    ].join( "\n") );
    Assert.equalValue( "Fiction Found 009a(c)g/652m: 48.64", DoubleRecordFinder.__matchFictionBookMusic( record ), false );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findSimpleLiterature", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__findSimpleLiterature( record, solrUrl ), [] );

    SolrCore.clear();
    SolrCore.addQuery( "( match.008a:\"2014\" or match.008a:\"2015\" or match.008a:\"2016\" ) and match.009a:\"a\" and match.009g:\"xx\" and match.245a:\"antontilsoes\" and match.260b:\"ca?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.008a:2014", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2014" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2015", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2015" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2016", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2016" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "a" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xx", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xx" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Anton til soes", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "antontilsoes" } ] ] } } } } );
    SolrCore.addAnalyse( "match.260b:Cadeau", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "cadeau" } ] ] } } } } );

    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findSimpleLiterature( record, solrUrl ),
        [ { id: "12345678", reason: "008a, 009a, 009g, 245a, 260b", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findTechnicalLiterature", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ), [] );

    SolrCore.clear();
    SolrCore.addQuery( "( match.008a:\"2014\" or match.008a:\"2015\" or match.008a:\"2016\" ) and match.009a:\"a\" and match.009g:\"xx\" and match.245a:\"antontilsoes\" and match.260b:\"ca?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.008a:2014", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2014" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2015", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2015" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2016", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2016" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "a" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xx", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xx" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Anton til soes", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "antontilsoes" } ] ] } } } } );
    SolrCore.addAnalyse( "match.260b:Cadeau", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "cadeau" } ] ] } } } } );

    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ),
        [ { id: "12345678", reason: "008a, 009a, 009g, 245a, 260b", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findFictionBookMusic", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"a\" and match.009g:\"xe\" and match.245a:\"troffelspisernesmare?\" and match.260b:\"fa?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "a" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    SolrCore.addAnalyse( "match.260b:Fantagraphic Books", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "fantagraphicBooks" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findFictionBookMusic( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 260b", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findComposedMaterials", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"v\" and match.009g:\"xe\" and match.245a:\"troffelspisernesmare?\" and match.260b:\"fa?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:v", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "v" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    SolrCore.addAnalyse( "match.260b:Fantagraphic Books", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "fantagraphicBooks" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a v *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findFictionBookMusic( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 260b", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findMusic538", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"s\" and match.009g:\"xe\" and match.538g:\"troffelspisernesmare?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "s" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.538g:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.538g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "538 00 *g Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusic538( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 538g", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findMusicGeneral", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"s\" and match.009g:\"xe\" and match.100a:\"3rdearexperience\" and match.245a:\"troffelspisernesmare?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addQuery( "match.009a:\"s\" and match.009g:\"xe\" and match.110a:\"3rdearexperience\" and match.245a:\"troffelspisernesmare?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "s" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    SolrCore.addAnalyse( "match.110a:3rd Ear Experience", { responseHeader: { status: 0 }, analysis: { field_names: { "match.110a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "3rdearexperience" } ] ] } } } } );
    SolrCore.addAnalyse( "match.100a:3rd Ear Experience", { responseHeader: { status: 0 }, analysis: { field_names: { "match.100a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "3rdearexperience" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "110 00 *A3 ear experience*a3rd Ear Experience",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusicGeneral( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 110a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "100 00 *A3 ear experience*a3rd Ear Experience",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusicGeneral( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 100a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findMusic245", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"s\" and match.009g:\"xe\" and match.245a:\"troffelspisernesmare?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "s" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusic245( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findNumbers", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addAnalyse( "match.021a:12345678", { responseHeader: { status: 0 }, analysis: { field_names: { "match.021a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "12345678" } ] ] } } } } );
    SolrCore.addAnalyse( "match.023ab:12345678", { responseHeader: { status: 0 }, analysis: { field_names: { "match.023ab": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "12345678" } ] ] } } } } );
    SolrCore.addAnalyse( "match.023ab:87654321", { responseHeader: { status: 0 }, analysis: { field_names: { "match.023ab": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "87654321" } ] ] } } } } );
    SolrCore.addQuery( "match.021a:\"12345678\" or match.023ab:\"12345678\" or match.023ab:\"87654321\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "021 00 *a 12345678",
        "023 00 *a 12345678 *b 87654321",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findNumbers( record, solrUrl ),
        [ { id: "12345678", reason: "021a, 023a, 023b", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findSoundMovieMultimedia", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"r\" and match.009g:\"xe\" and match.245a:\"troffelspisernesmare?\" and match.245ø:\"1cd\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:r", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "r" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245ø:1 cd", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245ø": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "1cd" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a r *g xe",
        "245 00 *a Troffelspisernes mareridt *ø 1 cd",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findSoundMovieMultimedia( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 245ø", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findSoundMovieMultimediaGeneral", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.009a:\"r\" and match.009g:\"xe\" and match.245a:\"troffelspisernesmare?\" and match.300e:\"2mapper402mikrokort\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:r", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "r" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xe" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "troffelspisernesmareridt" } ] ] } } } } );
    SolrCore.addAnalyse( "match.300e:2 mapper (402 mikrokort)", { responseHeader: { status: 0 }, analysis: { field_names: { "match.300e": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2mapper402mikrokort" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a r *g xe",
        "245 00 *a Troffelspisernes mareridt *ø 1 cd",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
        "300 00 *e2 mapper (402 mikrokort)"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findSoundMovieMultimediaGeneral( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 300e", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findSections", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.004a:\"s\" and match.014a:\"50002594\" and match.245n:\"3band\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addQuery( "match.004a:\"s\" and match.014a:\"50002594\" and match.245a:\"griechenland\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.004a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.004a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "s" } ] ] } } } } );
    SolrCore.addAnalyse( "match.014a:5 000 259 4", { responseHeader: { status: 0 }, analysis: { field_names: { "match.014a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "50002594" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Griechenland", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "griechenland" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245n:3. Band", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245n": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "3band" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "004 00 *r n *a s",
        "014 00 *a 5 000 259 4",
        "009 00 *a r *g xe",
        "245 00 *n 3. Band *a Griechenland *c die hellenistische Welt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findSections( record, solrUrl, true ),
        [ { id: "12345678", reason: "004a, 014a, 245n", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined },
            { id: "12345678", reason: "004a, 014a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
    record = RecordUtil.createFromString( [
        "004 00 *r n *a s",
        "014 00 *a 5 000 259 4",
        "009 00 *a r *g xe",
        "245 00 *a Griechenland *c die hellenistische Welt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findSections( record, solrUrl, false ),
        [ { id: "12345678", reason: "004a, 014a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findVolumes", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    SolrCore.clear();
    SolrCore.addQuery( "match.004a:\"b\" and match.014a:\"50002594\" and match.245g:\"3band\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addQuery( "match.004a:\"b\" and match.014a:\"50002594\" and match.245a:\"griechenland\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.004a:b", { responseHeader: { status: 0 }, analysis: { field_names: { "match.004a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "b" } ] ] } } } } );
    SolrCore.addAnalyse( "match.014a:5 000 259 4", { responseHeader: { status: 0 }, analysis: { field_names: { "match.014a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "50002594" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Griechenland", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "griechenland" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245g:3. Band", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "3band" } ] ] } } } } );
    record = RecordUtil.createFromString( [
        "004 00 *r n *a b",
        "014 00 *a 5 000 259 4",
        "009 00 *a r *g xe",
        "245 00 *g 3. Band *a Griechenland *c die hellenistische Welt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findVolumes( record, solrUrl, true ),
        [ { id: "12345678", reason: "004a, 014a, 245g", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined },
            { id: "12345678", reason: "004a, 014a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
    record = RecordUtil.createFromString( [
        "004 00 *r n *a b",
        "014 00 *a 5 000 259 4",
        "009 00 *a r *g xe",
        "245 00 *a Griechenland *c die hellenistische Welt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books"
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findVolumes( record, solrUrl, false ),
        [ { id: "12345678", reason: "004a, 014a, 245a", edition:undefined, composed:undefined, sectioninfo:undefined, volumeinfo:undefined } ]
    );
} );



