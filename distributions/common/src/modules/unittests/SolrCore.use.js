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
    var responses = [];

    function search( url, query ) {
        Log.trace( "Enter - SolrCore.search()" );

        try {
            for( var i = 0; i < responses.length; i++ ) {
                Log.debug( "Query: ", responses[i].query );
                if( responses[i].query === query ) {
                    return responses[i].response;
                }
            }

            throw StringUtil.sprintf( "Unable to lookup value for query: %s", query );
        }
        finally {
            Log.trace( "Exit - SolrCore.search()" );
        }
    }

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
        Log.trace( "Enter - SolrCore.numFound()" );

        try {
            return search().response.numFound;
        }
        finally {
            Log.trace( "Exit - SolrCore.numFound()" );
        }
    }

    function clear() {
        responses = [];
    }

    function addQuery( query, response ) {
        Log.trace( "Enter - SolrCore.addQuery()" );

        responses.push( {query: query, response: response } );
        Log.debug( "Add query: ", query );

        Log.trace( "Exit - SolrCore.addQuery()" );

    }

    return {
        'search': search,
        'numFound': numFound,
        'clear': clear,
        'addQuery': addQuery
    }
}();
