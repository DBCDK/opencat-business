/**
 * @file Module which provides operations to query a Solr installation.
 */
EXPORTED_SYMBOLS = ['Solr'];

//-----------------------------------------------------------------------------
use( "SolrCore" );
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
	function search( url, query ) {
		Log.trace( "Enter - Solr.numFound" );
		try {
			return SolrCore.search( url, query );
		}
		finally {
			Log.trace( "Exit - Solr" );
		}
	}

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
            return SolrCore.numFound( url, query );
		}
		finally {
			Log.trace( "Exit - Solr" );
		}
	}
	
	return {
        'search': search,
		'numFound': numFound
	}
}();
