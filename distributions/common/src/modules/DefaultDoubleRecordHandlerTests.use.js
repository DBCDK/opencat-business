//-----------------------------------------------------------------------------
use( "DefaultDoubleRecordHandler" );
use( "DoubleRecordMailServiceClientCore" );
use( "GenericSettings" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultDoubleRecordHandler.checkAndSendMails", function() {
    var __bundle = ResourceBundleFactory.getBundle( DefaultDoubleRecordHandler.__BUNDLE_NAME );

    GenericSettings.setSettings( {
        'solr.url': "http://unknown.dbc.dk:8080/solr/raapost-index"
    });

    var record;

    //-----------------------------------------------------------------------------
    record = RecordUtil.createFromString( [
        "008 00 *t m *u f *a 2015 *b dk *d aa *d y *l dan *o b *x 02 *v 0",
        "009 00 *a a *g xx",
        "245 00 *a Anton til soes",
        "260 00 *& 1 *a Vinderup *b Cadeau *c 2015"
    ].join( "\n") );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
    Assert.equalValue( "No 001", DoubleRecordMailServiceClientCore.receivedMessages(), [] );

    DoubleRecordMailServiceClientCore.clearMessages();
    SolrCore.clear();

    //-----------------------------------------------------------------------------
    record = RecordUtil.createFromString( [
        "001 00 *a 12345678 *b 191919",
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n" ) );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
    Assert.equalValue( "009, but no *a", DoubleRecordMailServiceClientCore.receivedMessages(), [] );

    DoubleRecordMailServiceClientCore.clearMessages();
    SolrCore.clear();

    //-----------------------------------------------------------------------------
    SolrCore.addQuery( "( marc.008a:\"2014\" or marc.008a:\"2015\" or marc.008a:\"2016\" ) and marc.009a:\"a\" and marc.009g:\"xx\" and marc.245a:\"Anton til soes\" and marc.260b:\"Ca\"",
        { response: { docs: [ { id: "12345678:870970" } ] } } );

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
