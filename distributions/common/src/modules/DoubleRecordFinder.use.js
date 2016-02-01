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
     *
     * @param record
     * @return {Array} Array of record ids (faust numbers).
     *
     * @name DoubleRecordFinder#find
     */
    function find( record, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.find()" );

        var result = [];
        try {
            var array = [];

            array.push({
                matcher: __matchSinglePaperOrMusical,
                searcher: __findSinglePaperOrMusical
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

    function __matchSinglePaperOrMusical( record ) {
        Log.trace( "Enter - DoubleRecordFinder.__matchSinglePaperOrMusical()" );

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
                    for( var j = 0; j < field.count(); j++ ) {
                        var subfield = field.subfield( j );

                        if( subfield.name === "m" ) {
                            if( subfield.value === "Uden klassem\xe6rke" ) {
                                found652m = true;
                            }
                            else if( /^(8[2-8])/i.test( subfield.value ) ) {
                                if( [ "88.1", "88.2" ].indexOf( subfield.value ) > -1 ) {
                                    return false;
                                }

                                found652m = true;
                            }
                        }

                        if( subfield.value !== "sk" ) {
                            found652m = true;
                        }
                    }
                }
            }

            return result = found009a && found009g && found652m;
        }
        finally {
            Log.trace( "Enter - DoubleRecordFinder.__matchSinglePaperOrMusical(): ", result );
        }
    }

    function __findSinglePaperOrMusical( record, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.__findSinglePaperOrMusical()" );

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
            Log.trace( "Enter - DoubleRecordFinder.__findSinglePaperOrMusical(): ", result );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Query executor
    //-----------------------------------------------------------------------------

    function __executeQueryAndFindRecords( record, queryFormaters, solrUrl ) {
        Log.trace( "Enter - DoubleRecordFinder.__executeQueryAndFindRecords()" );

        var result = [];
        try {
            var queryElements = [];

            for( var i = 0; i < record.numberOfFields(); i++ ) {
                var field = record.field( i );

                for( var j = 0; j < field.count(); j++ ) {
                    var subfield = field.subfield( j );

                    var formater = queryFormaters[ field.name + subfield.name ];
                    if( formater !== undefined ) {
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
                var index = document.id.indexOf( ":" );

                if( index > -1 ) {
                    result.push(document.id.substring(0, index));
                }
                else {
                    result.push( document.id );
                }
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
        '__matchSinglePaperOrMusical': __matchSinglePaperOrMusical,
        '__findSinglePaperOrMusical': __findSinglePaperOrMusical
    }

}();
