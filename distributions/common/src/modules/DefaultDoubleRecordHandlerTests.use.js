use( "DefaultDoubleRecordHandler" );
use( "DoubleRecordMailServiceClientCore" );
use( "GenericSettings" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

UnitTest.addFixture( "DefaultDoubleRecordHandler.checkAndSendMails", function() {
    var __bundle = ResourceBundleFactory.getBundle( DefaultDoubleRecordHandler.__BUNDLE_NAME );

    GenericSettings.setSettings( {
        'solr.url': "http://unknown.dbc.dk:8080/solr/raapost-index"
    });

    var record;

    record = RecordUtil.createFromString( [
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015"
    ].join( "\n") );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
    Assert.equalValue( "No 001", DoubleRecordMailServiceClientCore.receivedMessages(), [] );

    DoubleRecordMailServiceClientCore.clearMessages();
    SolrCore.clear();

    record = RecordUtil.createFromString( [
        "001 00 *a 12345678 *b 191919",
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n" ) );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
    Assert.equalValue( "009, but no *a", DoubleRecordMailServiceClientCore.receivedMessages(), [] );

    DoubleRecordMailServiceClientCore.clearMessages();
    SolrCore.clear();

    SolrCore.addQuery( "(( match.008a:\"2014\" OR match.008a:\"2015\" OR match.008a:\"2016\" ) AND match.009a:\"a\" AND match.009g:\"xx\" AND match.245a:antontilsoes AND match.260b:ca*) AND marc.001b:870970",
        { response: { docs: [ { id: "12345678:870970" } ] } } );
    SolrCore.addAnalyse( "match.008a:2014", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2014" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2015", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2015" } ] ] } } } } );
    SolrCore.addAnalyse( "match.008a:2016", { responseHeader: { status: 0 }, analysis: { field_names: { "match.008a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "2016" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009a:a", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "a" } ] ] } } } } );
    SolrCore.addAnalyse( "match.009g:xx", { responseHeader: { status: 0 }, analysis: { field_names: { "match.009g": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "xx" } ] ] } } } } );
    SolrCore.addAnalyse( "match.245a:Anton til soes", { responseHeader: { status: 0 }, analysis: { field_names: { "match.245a": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "antontilsoes" } ] ] } } } } );
    SolrCore.addAnalyse( "match.260b:Cadeau", { responseHeader: { status: 0 }, analysis: { field_names: { "match.260b": {index: [ "org.apache.lucene.analysis.core.LowerCaseFilter",[ { text: "cadeau" } ] ] } } } } );

    record = RecordUtil.createFromString( [
        "001 00 *a 3 458 795 6 *b 191919",
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
    Assert.equalValue( "Full record", JSON.stringify( DoubleRecordMailServiceClientCore.receivedMessages() ),
        JSON.stringify( [ {
            subject: ResourceBundle.getStringFormat( __bundle, "mail.subject", "3 458 795 6", "191919" ),
            body: ResourceBundle.getStringFormat( __bundle, "mail.body.header", "3 458 795 6", "191919" ) +
                  ResourceBundle.getStringFormat( __bundle, "mail.body.double.record.line", "12345678", "008a, 009a, 009g, 245a, 260b" ) +
                  ResourceBundle.getString( __bundle, "mail.body.footer" )
        } ] ) );

    DoubleRecordMailServiceClientCore.clearMessages();
    SolrCore.clear();
} );
