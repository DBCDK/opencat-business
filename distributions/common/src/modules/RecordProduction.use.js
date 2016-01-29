//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RecordProduction' ];

//-----------------------------------------------------------------------------
/**
 * This module can check if a record in still in production based on its
 * productions codes against a given date.
 *
 * @namespace
 * @name RecordProduction
 */
var RecordProduction = function () {
    var Calendar = Packages.java.util.Calendar;

    /**
     * Checks if a record is under production.
     *
     * @param date
     * @param record
     * @returns {boolean}
     * If conditions result in there should be created enrichments, then return false
     * otherwise true
     * if no 032 do it (false)
     * if any 032*a/*x contains a weekcode older than current and the catalogue code is one of the
     * specified then do it (false)
     * otherwise don't do it (true)
     */
    function checkRecord( date, record ) {
        Log.trace( "Enter - RecordProduction.checkRecord( ", date, ", ", record, " )" );

        var result;
        var num032 = 0;
        try {
            var hasCheckedForProductionDate = false;

            for( var fieldIndex = 0; fieldIndex < record.size(); fieldIndex++ ) {
                var field = record.field( fieldIndex );

                if( field.name !== "032" ) {
                    continue;
                }

                num032++;
                for( var subfieldIndex = 0; subfieldIndex < field.size(); subfieldIndex++ ) {
                    var subfield = field.subfield( subfieldIndex );

                    if( !( subfield.name === "a" || subfield.name === "x" ) ) {
                        continue;
                    }

                    var weekYear = __extractWeekAndYear( subfield.value );
                    if( weekYear === null ) {
                        Log.debug( "Ignore '", subfield.value, "' in calculating production date." );
                        continue;
                    }

                    Log.debug( "Using '", subfield.value, "' in calculating production date." );

                    var productionDate = __calculateFirstProductionDate( weekYear.weekno, weekYear.year );
                    // What to do with 999999 ? - they are handled prior to this function
                    Log.debug( "Compared date:   ", date );
                    Log.debug( "Production date: ", productionDate );

                    hasCheckedForProductionDate = true;
                    if( date.getTime() >= productionDate.getTime() ) {
                        Log.debug( "Record is released from production because of subfield: ", subfield.toString() );
                        return result = false;
                    }
                }
            }
            if ( num032 === 0 ) {
                Log.debug( "Record without 032 detected - always create enrichment" );
                return false;
            }

            if( hasCheckedForProductionDate ) {
                Log.info( "Record is under production. This date was used: ", date );
                return result = true;
            }
            else {
                Log.info( "Record is released from production because no release dates where found." );
                return result = false;
            }
        }
        finally {
            Log.trace( "Exit - RecordProduction.checkRecord(): " + result );
        }
    }

    function __extractWeekAndYear( str ) {
        Log.trace( "Enter - RecordProduction.__extractWeekAndYear( ", str, " )" );

        var result = null;
        try {
            var pattern = /(DBF|DLF|DBI|DMF|DMO|DPF|BKM|GBF|GMO|GPF|FPF|DBR|UTI)(\d\d\d\d)(\d\d)/i;

            var parts = pattern.exec( str );
            if( parts !== null && parts.length === 4 ) {
                result = {
                    weekno: parseInt( parts[ 3 ], 10 ),
                    year: parseInt( parts[ 2 ], 10 )
                };
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecordProduction.__extractWeekAndYear(): " + result );
        }
    }

    function __calculateFirstProductionDate( weekno, year ) {
        Log.trace( "Enter - RecordProduction.__calculateFirstProductionDate( ", weekno, ", ", year, " )" );

        var result = null;
        try {
            var cal = Calendar.getInstance();
            cal.set( Calendar.YEAR, year );
            cal.set( Calendar.WEEK_OF_YEAR, weekno - 1 );
            cal.set( Calendar.DAY_OF_WEEK, Calendar.FRIDAY );

            return result = new Date( cal.get( Calendar.YEAR ), cal.get( Calendar.MONTH ), cal.get( Calendar.DAY_OF_MONTH ) );
        }
        finally {
            Log.trace( "Exit - RecordProduction.__calculateFirstProductionDate(): " + result );
        }
    }

    return {
        'checkRecord': checkRecord,
        '__extractWeekAndYear': __extractWeekAndYear,
        '__calculateFirstProductionDate': __calculateFirstProductionDate
    }
}();
