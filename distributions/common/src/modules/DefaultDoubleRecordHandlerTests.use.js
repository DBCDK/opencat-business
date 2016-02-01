//-----------------------------------------------------------------------------
use( "DefaultDoubleRecordHandler" );
use( "GenericSettings" );
use( "RecordUtil" );
use( "SolrCore" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultDoubleRecordHandler.checkAndSendMails", function() {
    GenericSettings.setSettings( {
        'solr.XXurl': "http://unknown.dbc.dk:8080/solr/raapost-index"
    });

    var record;

    record = RecordUtil.createFromString( [
        "001 00 *a 12345678 *b 191919",
        "009 00 *h ws",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n") );
    DefaultDoubleRecordHandler.checkAndSendMails( record, GenericSettings );
} );
