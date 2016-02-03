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
var DoubleRecordFinder = function() {
    /**
     * Finds all double record candidates for a given record.
     *
     * @param record {Record}  The record to find double records for.
     * @param sorlUrl {String} Url to the solr service to use.
     *
     * @return {Array} Array of objects with found records. See DefaultDoubleRecordHandler#formatMessage
     *                 for an explanation.
     *
     * @name DoubleRecordFinder#find
     */
    function find( record, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.find()" );

        var result = [];
        try {
            var array = [];

            array.push({
                matcher: __matchTechnicalLiterature,
                searcher: __findTechnicalLiterature
            });

            for (var i = 0; i < array.length; i++) {
                var findObj = array[i];

                if (findObj.matcher(record)) {
                    result = result.concat(findObj.searcher(record, solrUrl));
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DoubleRecordFinder.find(): ", result );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Paper or Musical
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
                if( field.name === "009" ) {
                    for( var j = 0; j < field.count(); j++ ) {
                        var subfield = field.subfield( j );

                        if( subfield.name === "a" ) {
                            if( found009a ) {
                                return false;
                            }
                            if( [ "a", "c" ].indexOf( subfield.value ) === -1 ) {
                                return false;
                            }

                            found009a = true;
                        }
                        if( subfield.name === "g" ) {
                            if( found009g ) {
                                return false;
                            }
                            found009g = true;
                        }
                    }
                }

                if( field.name === "652" ) {
                    if( field.matchValue( /m/, /Uden\sklassem\xe6rke/ ) ) {
                        found652m = true;
                    }

                    if( !__isFictionLiterature( field ) ) {
                        found652m = true;
                    }
                }
            }

            return result = found009a && found009g && found652m;
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__matchTechnicalLiterature(): ", result );
        }
    }

    function __findTechnicalLiterature( record, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.__findTechnicalLiterature()" );

        var result = undefined;
        try {
            var formaters = {
                '008a': __querySubfieldYearFormater(),
                '009a': __querySubfieldFormater,
                '009g': __querySubfieldFormater,
                '245a': __querySubfieldValueLengthFormater( 20 ),
                '260b': __querySubfieldValueLengthFormater( 2 )
            };

            return result = __executeQueryAndFindRecords( record, formaters, solrUrl );
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__findTechnicalLiterature(): ", result );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Type checkers
    //-----------------------------------------------------------------------------

    function __isFictionLiterature( field ) {
        Log.trace( "Enter - DoubleRecordFinder.__isFictionLiterature()" );

        var result = undefined;
        try {
            if( field.name === "652" ) {
                for( var j = 0; j < field.count(); j++ ) {
                    var subfield = field.subfield( j );

                    if( subfield.name === "m" ) {
                        if( subfield.value === "sk" ) {
                            return result = true;
                        }
                        else if( /^(8[2-8])/i.test( subfield.value ) ) {
                            if( [ "88.1", "88.2" ].indexOf( subfield.value ) > -1 ) {
                                return result = false;
                            }

                            return result = true;
                        }
                    }
                }
            }
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__isFictionLiterature(): ", result );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Query executor
    //-----------------------------------------------------------------------------

    function __executeQueryAndFindRecords( record, queryFormaters, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords()" );

        var result = [];
        try {
            var reason = [];
            var queryElements = [];

            for( var i = 0; i < record.numberOfFields(); i++ ) {
                var field = record.field( i );

                for( var j = 0; j < field.count(); j++ ) {
                    var subfield = field.subfield( j );

                    var formater = queryFormaters[ field.name + subfield.name ];
                    if( formater !== undefined ) {
                        reason.push( field.name + subfield.name );

                        queryElements.push( formater( field, subfield ) );
                    }
                }
            }

            var query = queryElements.join( " and " );
            Log.debug( "Solr query: ", query );

            if( query === "" ) {
                return result = [];
            }

            var solr = Solr.search( solrUrl, query );
            for( var i = 0; i < solr.response.docs.length; i++ ) {
                var document = solr.response.docs[i];
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
                    reason: reason.join( ", " )
                } );
            }

            return result;
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords(): ", result );
        }

    }

    //-----------------------------------------------------------------------------
    //                  Query executor
    //-----------------------------------------------------------------------------

    function __querySubfieldFormater( field, subfield ) {
        Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords()" );

        var result = undefined;
        try {
            var Normalizer = Java.type("java.text.Normalizer");

            var value = subfield.value;
            value = value.replace(/\[|\]|\u00A4/g, "");
            value = Normalizer.normalize( value, Normalizer.Form.NFD ).replaceAll( "[\\p{InCombiningDiacriticalMarks}]", "" );

            return result = "marc." + field.name + subfield.name + ":\"" + value + "\"";
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords(): ", result );
        }
    }

    function __querySubfieldYearFormater() {
        Log.trace( "Enter - DoubleRecordFinder.__querySubfieldValueLengthFormater()" );

        try {
            return function( field, subfield ) {
                var sf;
                var year = parseInt( subfield.value, 10 );
                var array = [];

                sf = new Subfield( subfield.name, ( year - 1 ).toString() );
                array.push( __querySubfieldFormater( field, sf ) );

                sf = new Subfield( subfield.name, year.toString() );
                array.push( __querySubfieldFormater( field, sf ) );

                sf = new Subfield( subfield.name, ( year + 1 ).toString() );
                array.push( __querySubfieldFormater( field, sf ) );

                return "( " + array.join( " or " ) + " )";
            }
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__querySubfieldValueLengthFormater()" );
        }
    }

    function __querySubfieldValueLengthFormater( valueLength ) {
        Log.trace( "Enter - DoubleRecordFinder.__querySubfieldValueLengthFormater()" );

        try {
            return function( field, subfield ) {
                var sf = new Subfield( subfield.name, subfield.value.substring( 0, valueLength ) );

                return __querySubfieldFormater( field, sf );
            }
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__querySubfieldValueLengthFormater()" );
        }
    }

    return {
        'find': find,

        // Functions is exported so they are accessible from the unittests.
        '__matchTechnicalLiterature': __matchTechnicalLiterature,
        '__findTechnicalLiterature': __findTechnicalLiterature
    }

}();
