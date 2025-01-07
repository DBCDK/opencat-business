use("SolrCore");
use("Log");

EXPORTED_SYMBOLS = ['Solr'];

/**
 * Provide operations to lookup entires in a Solr installation.
 *
 * The module does not make use of the Config module to be able to use more than
 * one Solr installation at the same time.
 *
 * @namespace Solr
 */
var Solr = function () {
    function analyse(url, text, index) {
        Log.trace("Enter - Solr.analyse, url:" + url + ", text: " + text + ", index: " + index);
        try {
            var solr = SolrCore.analyse(url, text, index);
            if (solr.responseHeader.status === 0) {
                var solrIndexArray = solr.analysis.field_names[index].index;
                var solrIndexObject = solrIndexArray[solrIndexArray.length - 1];

                Log.debug("Solr analysis object: ", JSON.stringify(solrIndexArray));
                if (typeof( solrIndexObject ) === "string") {
                    Log.debug("Return solrIndexObject: ", solrIndexObject);
                    return solrIndexObject;
                } else if (typeof( solrIndexObject ) === "object") {
                    if (solrIndexObject instanceof Array) {
                        var v = solrIndexObject[solrIndexObject.length - 1].text;
                        Log.debug("Return solrIndexObject Array value: ", v);
                        return v;
                    }
                }
                Log.warn("Unable to decode analysis value from solr response:\n", JSON.stringify(solr));
                return text;
            } else {
                // what is a reasonable action here ?
                var errStr = ( "Failed to perform solr analysis - url: ", url, " index: ", index, " text :<", text, "> error : ", solr.error.msg );
                Log.warn(errStr);
                throw errStr;
            }
        } catch (ex) {
            Log.warn("EXCEPTION :Failed to perform solr analysis - url: ", url, " index: ", index, " text :<", text, ">");
            Log.trace("EX", JSON.stringify(ex));
            throw ex;
        } finally {
            Log.trace("Exit - Solr.analyse");
        }
    }

    function search(url, query) {
        Log.trace("Enter - Solr.search");
        try {
            return SolrCore.search(url, query);
        } finally {
            Log.trace("Exit - Solr.search");
        }
    }

    /**
     * Method to return the number of documents found for a given query string.
     *
     * @syntax Solr.numFound( url, query );
     * @param {String} url   Url to the solr installation including core selection:
     *                         <server>/solr/<core-name> or similary.
     * @param {String} query Solr query to execute.
     *
     * @return {Number} Number of solr documents found.
     *
     * @name Solr#numFound
     */
    function numFound(url, query) {
        Log.trace("Enter - Solr.numFound");
        try {
            return SolrCore.numFound(url, query);
        } finally {
            Log.trace("Exit - Solr.numfound");
        }
    }

    return {
        'analyse': analyse,
        'search': search,
        'numFound': numFound
    }
}();
