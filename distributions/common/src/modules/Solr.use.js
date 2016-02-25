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
	function analyse( url, text, index ) {
		Log.trace( "Enter - Solr.analyse", url + " " + text + " " + index );
		try {
			var solr = SolrCore.analyse( url, text, index );
			if ( solr.responseHeader.status == 0 ) {
				var solrindex = solr.analysis.field_names[index].index;
				return solrindex[solrindex.length - 1].text;
			} else {
				// what is a reasonable action here ?
				var errStr = ( "Failed to perform solr analysis - url: ", url, " index: ", index, " text :<", text, "> error : ", solr.error.msg );
				Log.warn( errStr );
				throw errStr;
			}
		}
		catch( ex ) {
			Log.warn( "EXCEPTION :Failed to perform solr analysis - url: ", url, " index: ", index, " text :<", text, ">" );
            Log.trace("EX", JSON.stringify(ex));
			throw ex;
		}
		finally {
			Log.trace( "Exit - Solr.analyse" );
		}
	}

	function search( url, query ) {
		Log.trace( "Enter - Solr.search" );
		try {
			return SolrCore.search( url, query );
		}
		finally {
			Log.trace( "Exit - Solr.search" );
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
			Log.trace( "Exit - Solr.numfound" );
		}
	}
	
	return {
		'analyse': analyse,
        'search': search,
		'numFound': numFound
	}
}();
