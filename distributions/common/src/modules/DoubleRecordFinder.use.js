//-----------------------------------------------------------------------------
use( "ClassificationData" );
use( "Log" );
use( "Marc" );
use( "Solr" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DoubleRecordFinder' ];

//-----------------------------------------------------------------------------
/**
 * Module to find double records in rawrepo for a given record.
 *
 * @namespace
 * @name DoubleRecordFinder
 */
var DoubleRecordFinder = function(  ) {
    /**
     * Finds all double record candidates for a given record.
     *
     * @param record {record}  The record to find double records for.
     * @param solrUrl {String} Url to the solr service to use.
     *
     * @return {Array} Array of objects with found records. See DefaultDoubleRecordHandler#formatMessage
     *                 for an explanation.
     *
     * @name DoubleRecordFinder#find
     */

    /**
     * Contains the value of 250a for fictional books and music
     * @type {undefined}
     */
    var field250a = undefined;
    var solrUrl = undefined;

    function find( record, callSolrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.find()", 0 );

        var result = [];
        solrUrl = callSolrUrl;
        try {
            var array = [];

            array.push({
                matcher: __matchTechnicalLiterature,
                searcher: __findTechnicalLiterature,
                continueOnHit: false
            });
            array.push({
                matcher: __matchFictionBookMusic,
                searcher: __findFictionBookMusicRun,
                continueOnHit: false
            });

            for (var i = 0; i < array.length; i++) {
                var findObj = array[i];

                if (findObj.matcher(record)) {
                    result = result.concat(findObj.searcher(record));
                    if ( ! findObj.continueOnHit ) {
                        return result;
                    }
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.find(): ", result !== undefined ? JSON.stringify(result) : "undef"  );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Paper or Musical - fiction
    //-----------------------------------------------------------------------------

    function __matchFictionBookMusic( record ) {
        Log.trace( "Enter - DoubleRecordFinder.__matchFictionBookMusic()" );

        var result = undefined;
        var subfield = undefined;
        var found009a = false;
        var found009g = false;
        var found652m = false;
        try {
            for( var i = 0; i < record.numberOfFields(); i++ ) {
                var field = record.field(i);
                // 009 check - Possible target for moving to a function
                if (field.name === "009") {
                    for (var j = 0; j < field.count(); j++) {
                        subfield = field.subfield(j);

                        if (subfield.name === "a") {
                            if (found009a) {
                                return false;
                            }
                            if (["a", "c"].indexOf(subfield.value) === -1) {
                                return false;
                            }

                            found009a = true;
                        }
                        if (subfield.name === "g") {
                            if (found009g) {
                                return false;
                            }
                            if (["xx", "xe"].indexOf(subfield.value) === -1) {
                                return false;
                            }
                            found009g = true;
                        }
                    }
                }

                if (field.name === "652") {
                    if (__isFictionLiterature(field)) {
                        found652m = true;
                    }
                }
                if (field.name === "250") {
                    for (var k = 0; k < field.count(); k++) {
                        subfield = field.subfield(k);
                        if (subfield.name === "a") {
                            field250a = subfield.value;
                        }
                    }
                }
            }

            return result = found009a && found009g && found652m;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__matchFictionBookMusic(): ", result !== undefined ? JSON.stringify(result) : "undef"  );
        }
    }

    // TESTING only
    function __findFictionBookMusic( record, newsolrUrl ) {
        solrUrl = newsolrUrl;
        return __findFictionBookMusicRun( record );
    }
    function __findFictionBookMusicRun( record ) {
        var result = undefined;
        var normalized250a = undefined;
        try {
            var formatters = {
                '009a': __querySubfieldFormatter,
                '009g': __querySubfieldFormatter,
                '245a': __querySubfieldValueLengthFormatter( 20 ),
                '260b': __querySubfieldValueLengthFormatter( 2 )
            };

            result = __executeQueryAndFindRecords( record, formatters );
            if ( field250a !== undefined ) {
                normalized250a = Solr.analyse( solrUrl, field250a, "match.field250a" );
            } else {
                // When incoming rec doesn't have a 250a all found are possible matches
                return result;
            }
            var finalResult = [];
            for (var i = 0; i < result.length; i++ ) {
                var workRes = result[i];
                if (workRes.edition !== undefined ) {
                    var normalizedFind250a = Solr.analyse( solrUrl, workRes.edition, "match.field250a" );
                    if (normalized250a === normalizedFind250a ) {
                        finalResult.push( workRes );
                    }
                } else {
                    finalResult.push( workRes );
                }
            }
            return finalResult;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__findTechnicalLiterature(): ", result !== undefined ? JSON.stringify(result) : "undef"  );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Paper or Musical - technical
    //-----------------------------------------------------------------------------

    function __matchTechnicalLiterature( record ) {
        Log.trace( "Enter - DoubleRecordFinder.__matchTechnicalLiterature()" );

        var result = undefined;
        try {
            var found009a = false;
            var found009g = false;
            var found652m = false;

            for( var i = 0; i < record.numberOfFields(); i++ ) {
                var field = record.field( i );
                // 009 check - Possible target for moving to a function
                if( field.name === "009" ) {
                    for( var j = 0; j < field.count(); j++ ) {
                        var subfield = field.subfield( j );

                        if( subfield.name === "a" ) {
                            if( found009a ) {
                                Log.debug( "__matchTechnicalLiterature(): t1" );
                                return false;
                            }
                            if( [ "a", "c" ].indexOf( subfield.value ) === -1 ) {
                                Log.debug( "__matchTechnicalLiterature(): t2" );
                                return false;
                            }

                            found009a = true;
                        }
                        if( subfield.name === "g" ) {
                            if( found009g ) {
                                Log.debug( "__matchTechnicalLiterature(): t3" );
                                return false;
                            }
                            if( [ "xx", "xe" ].indexOf( subfield.value ) === -1 ) {
                                return false;
                            }
                            found009g = true;
                        }
                    }
                }

                if( field.name === "652" ) {
                    if( field.matchValue( /m/, /Uden\sklassem\xe6rke/ ) ) {
                        Log.debug( "Found 652m = 'Uden\sklassem\xe6rke'" );
                        found652m = true;
                    }

                    if( __isTechnicalLiterature( field ) ) {
                        Log.debug( "Found 652 for technical literature" );
                        found652m = true;
                    }
                }
            }

            Log.debug( "__matchTechnicalLiterature(): t4" );
            return result = found009a && found009g && found652m;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__matchTechnicalLiterature(): ", result !== undefined ? JSON.stringify(result) : "undef"  );
        }
    }

    // TESTING only
    function __findTechnicalLiterature( record, newsolrUrl ) {
        solrUrl = newsolrUrl;
        return __findTechnicalLiteratureRun( record );
    }
    function __findTechnicalLiteratureRun( record ) {
        Log.trace( "Enter - DoubleRecordFinder.__findTechnicalLiterature()" );

        var result = undefined;
        try {
            var formatters = {
                '008a': __querySubfieldYearFormatter(),
                '009a': __querySubfieldFormatter,
                '009g': __querySubfieldFormatter,
                '245a': __querySubfieldValueLengthFormatter( 20 ),
                '260b': __querySubfieldValueLengthFormatter( 2 )
            };

            return result = __executeQueryAndFindRecords( record, formatters );
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__findTechnicalLiterature(): ", result !== undefined ? JSON.stringify(result) : "undef" );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Type checkers
    //-----------------------------------------------------------------------------

    function __isFictionLiterature( field ) {
        Log.trace( "Enter - DoubleRecordFinder.__isFictionLiterature()", 0 );

        var result = undefined;
        try {
            if( field.name === "652" ) {
                for( var j = 0; j < field.count(); j++ ) {
                    var subfield = field.subfield( j );

                    if( subfield.name === "m" ) {
                        if( subfield.value === "sk" ) {
                            Log.debug( "__isTechnicalLiterature(): t1" );
                            return result = false;
                        }
                        if( /^(8[2-8])/i.test( subfield.value ) ) {
                            if( subfield.value.indexOf( "88.1") > -1 || subfield.value.indexOf( "88.2") > -1 ) {
                                return result = false;
                            }

                            return result = true;
                        }
                    }
                }
            }

            Log.debug( "__isTechnicalLiterature(): t5" );
            return result = false;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__isFictionLiterature(): ", result !== undefined ? JSON.stringify(result) : "undef"  );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Query executor
    //-----------------------------------------------------------------------------

    function __executeQueryAndFindRecords( record, queryFormatter ) {
        Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords()" );

        var result = [];
        try {
            var reason = [];
            var queryElements = [];

            for( var i = 0; i < record.numberOfFields(); i++ ) {
                var field = record.field( i );

                for( var j = 0; j < field.count(); j++ ) {
                    var subfield = field.subfield( j );

                    var formatter = queryFormatter[ field.name + subfield.name ];
                    if( formatter !== undefined ) {
                        reason.push( field.name + subfield.name );

                        queryElements.push( formatter( field, subfield ) );
                    }
                }
            }

            var query = queryElements.join( " and " );
            Log.debug( "Solr query: ", query );

            if( query === "" ) {
                return result = [];
            }

            var solr = Solr.search( solrUrl, query );
            for( var k = 0; k < solr.response.docs.length; k++ ) {
                var document = solr.response.docs[k];
                var recordId;
                var index = document.id.indexOf( ":" );

                if( index > -1 ) {
                    recordId = document.id.substring(0, index);
                }
                else {
                    recordId = document.id;
                }

                result.push(  {
                    id: recordId,
                    reason: reason.join( ", " ),
                    edition: document["match.250a"]
                } );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__executeQueryAndFindRecords(): ", result );
        }

    }

    //-----------------------------------------------------------------------------
    //                  Query executor
    //-----------------------------------------------------------------------------

    function __querySubfieldFormatter( field, subfield ) {
        Log.trace( "Enter - DoubleRecordFinder.__querySubfieldFormatter()", 0 );
        Log.trace("HIK!", 0);

        var result = undefined;
        try {
            var value = Solr.analyse( solrUrl, subfield.value, "match." + field.name + subfield.name );

            return result = "marc." + field.name + subfield.name + ":\"" + value + "\"";
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__querySubfieldFormatter ", result !== undefined ? JSON.stringify(result) : "undefined" );
        }
    }

    function __querySubfieldYearFormatter() {
        Log.trace( "Enter - DoubleRecordFinder.__querySubfieldYearFormatter()", 0 );

        try {
            return function( field, subfield ) {
                var sf;
                var year = parseInt( subfield.value, 10 );
                var array = [];

                sf = new Subfield( subfield.name, ( year - 1 ).toString() );
                array.push( __querySubfieldFormatter( field, sf ) );

                sf = new Subfield( subfield.name, year.toString() );
                array.push( __querySubfieldFormatter( field, sf ) );

                sf = new Subfield( subfield.name, ( year + 1 ).toString() );
                array.push( __querySubfieldFormatter( field, sf ) );

                return "( " + array.join( " or " ) + " )";
            }
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__querySubfieldYearFormatter()", 0 );
        }
    }

    function __querySubfieldValueLengthFormatter( valueLength ) {
        Log.trace( "Enter - DoubleRecordFinder.__querySubfieldValueLengthFormatter()", 0);

        var result = undefined;
        try {
            return function( field, subfield ) {
                var value = Solr.analyse( solrUrl, subfield.value, "match." + field.name + subfield.name );
                // hvis den uklippede men trimmede strengs længde er større end ønsket længde skal der trunkes
                var value1 = value.substr(0, valueLength );
                if ( value.length > valueLength ) {
                    value1 = value1 + "?";
                }

                return result = "marc." + field.name + subfield.name + ":\"" + value1 + "\"";
            }
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.__querySubfieldValueLengthFormatter(): ", result !== undefined ? JSON.stringify(result) : "undef" );
        }
    }

    return {
        'find': find,

        // Functions is exported so they are accessible from the unittests.
        '__matchTechnicalLiterature': __matchTechnicalLiterature,
        '__findTechnicalLiterature': __findTechnicalLiterature,
        '__matchFictionBookMusic': __matchFictionBookMusic,
        '__findFictionBookMusic': __findFictionBookMusic
    }

}();


