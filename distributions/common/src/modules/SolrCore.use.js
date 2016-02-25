/**
 * @file Module which provides operations to query a Solr installation.
 */
EXPORTED_SYMBOLS = ['SolrCore'];

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
 * @namespace SolrCore
 */
var SolrCore = function( ) {
    /**
     * Performs an analysis of a search string in a solr instance and returns the response as an object.
     *
     * @syntax SolrCore.analyse( url, text, index );
     * @param {String} url   Url to the solr installation including core selection:
     * 						 <server>/solr/<core-name> or similary.
     * @param {String} text The text that you want to analyse
     * @param {String} index The index that the text should be analysed against.
     *
     * @return {String} The resulting string of the analysis.
     *
     * @name SolrCore#analyse
     *
     * Example :
     * ivs193.dbc.dk:8080/solr/raw-repo-index/analysis/field?indent=on&wt=json&
     *        analysis.fieldvalue=a W %24%2F(%3D%3D%3Ds d Dâe æøåÆØÅ è ó öÔÛÜNge%0A%0A&analysis.fieldname=match.250a&
     * Response :
     * {
  "responseHeader":{
    "status":0,
    "QTime":1},
  "analysis":{
    "field_types":{},
    "field_names":{
      "match.250a":{
        "index":[
          "org.apache.lucene.analysis.charfilter.MappingCharFilter","a W $/(===s d Dae æøåÆØÅ e o øOUYNge\n\n",
          "org.apache.lucene.analysis.pattern.PatternReplaceCharFilter","aWsdDaeæøåÆØÅeoøOUYNge",
          "org.apache.lucene.analysis.pattern.PatternTokenizer",[
              {
                  "text":"aWsdDaeæøåÆØÅeoøOUYNge",
                  "raw_bytes":"[61 57 73 64 44 61 65 c3 a6 c3 b8 c3 a5 c3 86 c3 98 c3 85 65 6f c3 b8 4f 55 59 4e 67 65]",
                  "start":0,
                  "end":38,
                  "position":1,
                  "positionHistory":[1],
                  "type":"word"
              }
          ],
          "org.apache.lucene.analysis.core.LowerCaseFilter",[
              {
                  "text":"awsddaeæøåæøåeoøouynge",
                  "raw_bytes":"[61 77 73 64 64 61 65 c3 a6 c3 b8 c3 a5 c3 a6 c3 b8 c3 a5 65 6f c3 b8 6f 75 79 6e 67 65]",
                  "position":1,
                  "positionHistory":[1,1],
                  "start":0,
                  "end":38,
                  "type":"word"
              }
          ]
        ]}}}}

     * Response on error :
     * {
  "responseHeader":{
    "status":400,
    "QTime":12},
  "error":{
    "msg":"undefined field match.260d",
    "code":400}}
     */
    function analyse( url, text, index ) {
        Log.trace( "Enter - SolrCore.analyse" );

        var solr_url = undefined;
        var solr_params = undefined;
        try {
            solr_url = url + "/analysis/field";
            solr_params = {
                "analysis.fieldvalue": text,
                "analysis.fieldname": index,
                indent: true,
                wt: "json"  	// Result type for solr.
            };

            var solr = JSON.parse( Http.get( solr_url, solr_params, {}, false ) );
            ValueCheck.checkThat( "solr", solr ).type( "object" );
            return solr;

        }
        catch( ex ) {
            Log.warn( "Failed to perform solr analysis - url: ", solr_url, " index: ", index, " text :<", text, ">" );
            throw ex;
        }
        finally {
            Log.trace( "Exit - SolrCore" );
        }
    }

    function search( url, query ) {
        Log.trace( "Enter - SolrCore.search" );

        var solr_url = undefined;
        var solr_params = undefined;
        try {
            solr_url = url + "/select";
            solr_params = {
                q: query,   	// Query parameter for solr.
                indent: true,
                wt: "json"  	// Result type for solr.
            };

            var solr = JSON.parse( Http.get( solr_url, solr_params, {}, false ) );
            ValueCheck.checkThat( "solr", solr ).type( "object" );

            return solr;
        }
        catch( ex ) {
            Log.warn( "Failed to perform solr search: ", solr_url, "?q=", solr_params.q );
            throw ex;
        }
        finally {
            Log.trace( "Exit - SolrCore" );
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
        Log.trace( "Enter - SolrCore.numFound" );
        try {
            var solr = search( url, query );
            ValueCheck.checkThat( "solr.response", solr.response ).type( "object" );

            // This one is not explicitly nessasary, but it is nice to known that we always returns
            // a number and not undefined for instance.
            ValueCheck.checkThat( "solr.response.numFound", solr.response.numFound ).type( "number" );

            return solr.response.numFound;
        }
        finally {
            Log.trace( "Exit - SolrCore" );
        }
    }

    return {
        'search': search,
        'numFound': numFound,
        'analyse': analyse
    }
}();
