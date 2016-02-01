//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DefaultDoubleRecordHandler' ];

//-----------------------------------------------------------------------------
/**
 * Module execute the checks of double records and sending a mail with any hits.
 *
 * The lookup of double records is done by the module DoubleRecordFinder. Mails are
 * sent by the module XXX.
 *
 * @namespace
 * @name DefaultEnrichmentRecordHandler
 */
var DefaultDoubleRecordHandler = function() {
    function checkAndSendMails( record, settings ) {
        Log.trace( "Enter - DefaultDoubleRecordHandler.checkAndSendMails()" );

        try {
            if( !settings.containsKey( 'solr.url' ) ) {
                Log.error( "SOLR has not been configured. Missing key 'solr.url' in settings." );
                return;
            }

            var ids = DoubleRecordFinder.find( record, settings.get( 'solr.url' ) );
            var idField = record.getFirstFieldAsField( /001/ );

            var logMessage = StringUtil.sprintf( "Double records for record {%s:%s}: %s",
                             idField.getFirstValue( /a/ ), idField.getFirstValue( /b/ ), JSON.stringify( ids ) );
            Log.info( logMessage );
        }
        finally {
            Log.trace( "Exit - DefaultDoubleRecordHandler.checkAndSendMails()" );
        }
    }

    return {
        'checkAndSendMails': checkAndSendMails
    }
}();
