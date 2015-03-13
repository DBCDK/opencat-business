/**
 * @file Module which provides operations to query a Solr installation.
 */
EXPORTED_SYMBOLS = ['SolrCore'];

//-----------------------------------------------------------------------------
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
 * @namespace SolrCore
 */
var SolrCore = function( ) {
    var queries = {};

    /**
     * Method to return the number of documents found for a given query string.
     *
     * @syntax SolrCore.numFound( url, query );
     * @param {String} url   Url to the solr installation including core selection:
     * 						 <server>/solr/<core-name> or similary.
     * @param {String} query Solr query to execute.
     *
     * @return {Number} Number of solr documents found.
     *
     * @name SolrCore#numFound
     */
    function numFound( url, query ) {
        Log.trace( "Enter - SolrCore.numFound" );

        try {
            var numFound = queries[ query ];
            if( numFound === undefined ) {
                throw StringUtil.sprintf( "Unable to lookup value for query: %s", query );
            }

            return numFound;
        }
        finally {
            Log.trace( "Exit - SolrCore" );
        }
    }

    function clear() {
        queries = {};
    }

    function addQuery( query, numFound ) {
        queries[ query ] = numFound;
    }

    return {
        'numFound': numFound,
        'clear': clear,
        'addQuery': addQuery
    }
}();
