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

    function checkRecord( date, record ) {
        Log.trace( "Enter - RecordProduction.checkRecord( ", date, ", ", record, " )" );

        var result;
        try {
            for( var fieldIndex = 0; fieldIndex < record.size(); fieldIndex++ ) {
                var field = record.field( fieldIndex );

                if( field.name !== "032" ) {
                    continue;
                }

                for( var subfieldIndex = 0; subfieldIndex < field.size(); subfieldIndex++ ) {
                    var subfield = field.subfield( subfieldIndex );

                    if( !( subfield.name === "a" || subfield.name === "x" ) ) {
                        continue;
                    }

                    var weekYear = __extractWeekAndYear( subfield.value );
                    if( weekYear === null ) {
                        continue;
                    }

                    var productionDate = __calculateFirstProductionDate( weekYear.weekno, weekYear.year );
                    Log.debug( "current date < production date ==> ", date, " < ", productionDate );
                    if( date.getTime() < productionDate.getTime() ) {
                        return result = true;
                    }
                }
            }

            return result = false;
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
            cal.set( Calendar.DAY_OF_WEEK, Calendar.MONDAY );

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
