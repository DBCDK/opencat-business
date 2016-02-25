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
    var analysis = [];

    function analyse( url, text, index ) {
        Log.trace( "Enter - SolrCoreTEST.analyse" );
        try {
            Log.debug( "Analyse: ", index + ":" + text );
            for( var i = 0; i < analysis.length; i++ ) {
                Log.debug( "Analyse results: ", analysis[i].query );
                if( analysis[i].query === index + ":" + text ) {
                    Log.trace("analyse found ", JSON.stringify( analysis[i].response) );
                    return analysis[i].response;
                }
            }

            throw StringUtil.sprintf( "Unable to lookup value for analysis: %s", index + text );
        }
        finally {
            Log.trace( "Exit - SolrCoreTEST.analyse()", 0 );
        }
    }

    function search( url, query ) {
        Log.trace( "Enter - SolrCoreTEST.search()" );

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
            Log.trace( "Exit - SolrCoreTEST.search()" );
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
        Log.trace( "Enter - SolrCoreTEST.numFound()" );

        try {
            return search().response.numFound;
        }
        finally {
            Log.trace( "Exit - SolrCoreTEST.numFound()" );
        }
    }

    function clear() {
        responses = [];
        analysis = [];
    }

    function addAnalyse( query, response ) {
        Log.trace( "Enter - SolrCoreTEST.addAnalyse()" );

        analysis.push( {query: query, response: response } );
        Log.debug( "Add analyse: ", query );

        Log.trace( "Exit - SolrCoreTEST.addAnalyse()" );

    }

    function addQuery( query, response ) {
        Log.trace( "Enter - SolrCoreTEST.addQuery()" );

        responses.push( {query: query, response: response } );
        Log.debug( "Add query: ", query );

        Log.trace( "Exit - SolrCoreTEST.addQuery()" );

    }

    return {
        'analyse': analyse,
        'search': search,
        'numFound': numFound,
        'clear': clear,
        'addAnalyse': addAnalyse,
        'addQuery': addQuery
    }
}();
