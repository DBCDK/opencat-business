use("Log");
use("Marc");

EXPORTED_SYMBOLS = ['RecordInProduction'];

/**
 * This module can check if a record in still in production based on its
 * productions codes against a given date.
 *
 * @namespace
 * @name RecordInProduction
 */
var RecordInProduction = function () {
    var Calendar = Packages.java.util.Calendar;

    /**
     * Checks if a record is under production.
     *
     * @param date
     * @param record
     * @returns {boolean}
     * If the record is still in production return true
     * otherwise false
     * if no 032 then the record is published - return false
     * if weekcode is 999999 then the record may be in production unless there is another that fits :
     * if any 032*a/*x contains a weekcode older than current and the catalogue code is one of the
     * specified then then the record is published - return false
     * otherwise don't do it (true)
     */
    function checkRecord(date, record) {
        Log.trace("Enter - RecordInProduction.checkRecord( ", date, ", ", record, " )");
        var result = false;
        var num032 = 0;
        try {
            var hasCheckedForProductionDate = false;
            for (var fieldIndex = 0; fieldIndex < record.size(); fieldIndex++) {
                var field = record.field(fieldIndex);

                if (field.name !== "032") {
                    continue;
                }

                num032++;
                // spæn delfelter igennem
                // spring andet end a og x over (der skulle ikke kunne være andre - der er dog set nogle *i i 870971)
                // hvis ÅU er 999999 er det en potentiel inproduction
                // hvis ÅU(modificeret) er ældre end ddÅU så er den ej i produktion uanset evt andet indhold i andre delfelter - exit false
                // slut spæne
                // hvis der ikke var nogle *a/x (hvilket der burde være hvis der et 032) så er den færdig - exit false
                for (var subfieldIndex = 0; subfieldIndex < field.size(); subfieldIndex++) {
                    var subfield = field.subfield(subfieldIndex);

                    if (!( subfield.name === "a" || subfield.name === "x" )) {
                        continue;
                    }

                    var weekYear = __extractWeekAndYear(subfield.value);
                    if (weekYear === null) {
                        Log.debug("Ignore '", subfield.value, "' in calculating production date.");
                        continue;
                    }
                    hasCheckedForProductionDate = true;
                    Log.debug("Using '", subfield.value, "' in calculating production date.");
                    Log.debug("Compared weekYear.year:   ", weekYear.year.toString());
                    Log.debug("Compared weekYear.weekno:   ", weekYear.weekno.toString());

                    if (weekYear.weekno == 99 && weekYear.year == 9999) {
                        Log.debug("Record could be in production because of subfield: ", subfield.toString());
                        continue;
                    }

                    var productionDate = __calculateFirstProductionDate(weekYear.weekno, weekYear.year);
                    Log.debug("Compared date:   ", date);
                    Log.debug("Production date: ", productionDate);

                    if (date.getTime() >= productionDate.getTime()) {
                        Log.debug("Record is released from production because of subfield: ", subfield.toString());
                        return result = false;
                    }
                }
            }
            if (num032 === 0) {
                Log.debug("Record without 032 detected - not in production");
                return false;
            }

            if (hasCheckedForProductionDate) {
                Log.info("Record is under production. This date was used: ", date);
                return result = true;
            } else {
                Log.info("Record is released from production because no release dates where found.");
                return result = false;
            }
        } finally {
            Log.trace("Exit - RecordInProduction.checkRecord(): " + result);
        }
    }

    function __extractWeekAndYear(str) {
        Log.trace("Enter - RecordInProduction.__extractWeekAndYear( ", str, " )");
        var result = null;
        try {
            var pattern = /(DBF|DLF|DBI|DMF|DMO|DPF|BKM|GBF|GMO|GPF|FPF|DBR|UTI)(\d\d\d\d)(\d\d)/i;

            var parts = pattern.exec(str);
            if (parts !== null && parts.length === 4) {
                result = {
                    weekno: parseInt(parts[3], 10),
                    year: parseInt(parts[2], 10)
                };
            }
            return result;
        } finally {
            Log.trace("Exit - RecordInProduction.__extractWeekAndYear(): " + result);
        }
    }

    function __calculateFirstProductionDate(weekno, year) {
        Log.trace("Enter - RecordInProduction.__calculateFirstProductionDate( ", weekno, ", ", year, " )");
        var result = null;
        try {
            var cal = Calendar.getInstance();
            cal.set(Calendar.YEAR, year);
            cal.set(Calendar.WEEK_OF_YEAR, weekno - 1);
            cal.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
            return result = new Date(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
        } finally {
            Log.trace("Exit - RecordInProduction.__calculateFirstProductionDate(): " + result);
        }
    }

    return {
        'checkRecord': checkRecord,
        '__extractWeekAndYear': __extractWeekAndYear,
        '__calculateFirstProductionDate': __calculateFirstProductionDate
    }
}();
