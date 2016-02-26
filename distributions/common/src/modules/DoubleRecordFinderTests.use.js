//-----------------------------------------------------------------------------
use( "DoubleRecordFinder" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

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
        "021 00 *a 12345678",
    ].join( "\n") );
    Assert.equalValue( "021 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "021 00 *e 12345678",
    ].join( "\n") );
    Assert.equalValue( "021 e", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "021 00 *x 12345678",
    ].join( "\n") );
    Assert.equalValue( "021 x", DoubleRecordFinder.__matchNumbers( record ), false );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "022 00 *a 12345678",
    ].join( "\n") );
    Assert.equalValue( "022 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "024 00 *a 12345678",
    ].join( "\n") );
    Assert.equalValue( "024 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "028 00 *a 12345678",
    ].join( "\n") );
    Assert.equalValue( "028 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "023 00 *a 12345678",
    ].join( "\n") );
    Assert.equalValue( "023 a", DoubleRecordFinder.__matchNumbers( record ), true );

    record = RecordUtil.createFromString( [
        "009 00 *a s",
        "023 00 *b 12345678",
    ].join( "\n") );
    Assert.equalValue( "023 b", DoubleRecordFinder.__matchNumbers( record ), true );

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
UnitTest.addFixture( "DoubleRecordFinder.__findTechnicalLiterature", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    Assert.equalValue( "Empty record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ), [] );

    SolrCore.clear();
    SolrCore.addQuery( "( marc.008a:\"2014\" or marc.008a:\"2015\" or marc.008a:\"2016\" ) and marc.009a:\"a\" and marc.009g:\"xx\" and marc.245a:\"antontilsoes\" and marc.260b:\"ca?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.008a:2014", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ { text: "2014" } ] } } } } );
    SolrCore.addAnalyse( "match.008a:2015", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ { text: "2015" } ] } } } } );
    SolrCore.addAnalyse( "match.008a:2016", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ { text: "2016" } ] } } } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ { text: "a" } ] } } } } );
    SolrCore.addAnalyse( "match.009g:xx", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ { text: "xx" } ] } } } } );
    SolrCore.addAnalyse( "match.245a:Anton til soes", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ { text: "antontilsoes" } ] } } } } );
    SolrCore.addAnalyse( "match.260b:Cadeau", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ { text: "cadeau" } ] } } } } );

    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findTechnicalLiterature( record, solrUrl ),
        [ { id: "12345678", reason: "008a, 009a, 009g, 245a, 260b", edition:undefined, composed:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findFictionBookMusic", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    SolrCore.clear();
    SolrCore.addQuery( "marc.009a:\"a\" and marc.009g:\"xe\" and marc.245a:\"troffelspisernesmare?\" and marc.260b:\"fa?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ { text: "a" } ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ { text: "xe" } ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ { text: "troffelspisernesmareridt" } ] } } } } );
    SolrCore.addAnalyse( "match.260b:Fantagraphic Books", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ { text: "fantagraphicBooks" } ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findFictionBookMusic( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 260b", edition:undefined, composed:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findComposedMaterials", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    SolrCore.clear();
    SolrCore.addQuery( "marc.009a:\"v\" and marc.009g:\"xe\" and marc.245a:\"troffelspisernesmare?\" and marc.260b:\"fa?\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:v", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ { text: "v" } ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ { text: "xe" } ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ { text: "troffelspisernesmareridt" } ] } } } } );
    SolrCore.addAnalyse( "match.260b:Fantagraphic Books", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ { text: "fantagraphicBooks" } ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a v *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findFictionBookMusic( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a, 260b", edition:undefined, composed:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findMusic538", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    SolrCore.clear();
    SolrCore.addQuery( "marc.009a:\"s\" and marc.009g:\"xe\" and marc.538g:\"troffelspisernesmareridt\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ { text: "s" } ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ { text: "xe" } ] } } } } );
    SolrCore.addAnalyse( "match.538g:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.538g": {index: [ { text: "troffelspisernesmareridt" } ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "538 00 *g Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusic538( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 538g", edition:undefined, composed:undefined } ]
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findMusic245", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    SolrCore.clear();
    SolrCore.addQuery( "marc.009a:\"s\" and marc.009g:\"xe\" and marc.245a:\"troffelspisernesmareridt\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.009a:s", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ { text: "s" } ] } } } } );
    SolrCore.addAnalyse( "match.009g:xe", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ { text: "xe" } ] } } } } );
    SolrCore.addAnalyse( "match.245a:Troffelspisernes mareridt", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ { text: "troffelspisernesmareridt" } ] } } } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findMusic245( record, solrUrl ),
        [ { id: "12345678", reason: "009a, 009g, 245a", edition:undefined, composed:undefined } ]
    );
} );


//-----------------------------------------------------------------------------
UnitTest.addFixture( "DoubleRecordFinder.__findNumbers", function() {
    var solrUrl = "http://unknown.dbc.dk:8080/solr/raapost-index";
    var record;

    record = new Record;
    SolrCore.clear();
    SolrCore.addAnalyse( "match.021a:12345678", { responseHeader: { status: 0 }, analysis: { field_names: { "match.021a": {index: [ { text: "12345678" } ] } } } } );
    SolrCore.addAnalyse( "match.023ab:12345678", { responseHeader: { status: 0 }, analysis: { field_names: { "match.023ab": {index: [ { text: "12345678" } ] } } } } );
    SolrCore.addAnalyse( "match.023ab:87654321", { responseHeader: { status: 0 }, analysis: { field_names: { "match.023ab": {index: [ { text: "87654321" } ] } } } } );
    SolrCore.addQuery( "marc.021a:\"12345678\" or marc.023ab:\"12345678\" or marc.023ab:\"87654321\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a s *g xe",
        "021 00 *a 12345678",
        "023 00 *a 12345678 *b 87654321",
        "245 00 *a Troffelspisernes mareridt",
        "260 00 *a Seattle, Wash. *b Fantagraphic Books",
    ].join( "\n") );
    Assert.equalValue( "Full record", DoubleRecordFinder.__findNumbers( record, solrUrl ),
        [ { id: "12345678", reason: "021a, 023a, 023b", edition:undefined, composed:undefined } ]
    );
} );




