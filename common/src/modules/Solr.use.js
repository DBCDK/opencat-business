/**
 * @file Module which provides operations to query a Solr installation.
 */
EXPORTED_SYMBOLS = ['Solr'];

//-----------------------------------------------------------------------------
use( "Http" );
use( "Config");
use( "Exception" );
use( "ValueCheck" );
use( "Log" );

//-----------------------------------------------------------------------------
/**
 * Provide operations to lookup entires in a Solr installation.
 *
 * The module does not make use of the Config module to be able to use more than
 * one Solr installation at the same time.
 * 
 * @namespace Solr
 */
var Solr = function( ) {
	/**
	 * Method to return the number of documents found for a given query string.
	 * 
	 * @syntax Solr.numFound( url, query );
	 * @param {String} url   Url to the solr installation including core selection:
	 * 						 <server>/solr/<core-name> or similary.
	 * @param {String} query Solr query to execute.
	 * 
	 * @return {Number} Number of solr documents found.
	 * 
	 * @name Solr#numFound
	 */
	function numFound( url, query ) {
		Log.trace( "Enter - Solr.numFound" );
		try {
			var solr_url = url + "/select";
			var solr_params = {
				q: query,   	// Query parameter for solr.
				indent: true,
				wt: "json"  	// Result type for solr.
			}
			
			var solr = JSON.parse( Http.get( solr_url, solr_params, {}, false ) );
			ValueCheck.checkThat( "solr", solr ).type( "object" );
			ValueCheck.checkThat( "solr.response", solr.response ).type( "object" );
			
			// This one is not explicitly nessasary, but it is nice to known that we always returns
			// a number and not undefined for instance.
			ValueCheck.checkThat( "solr.response.numFound", solr.response.numFound ).type( "number" );
			
			return solr.response.numFound;
		}
		finally {
			Log.trace( "Exit - Solr" );
		}
	}
	
	return {
		'numFound': numFound
	}
}();
