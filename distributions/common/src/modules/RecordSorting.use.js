use("Marc");
use("MarcClasses");
use("Log");
use("StringUtil");

EXPORTED_SYMBOLS = ['RecordSorting'];

var RecordSorting = function () {
    var BUNDLE_NAME = "validation";

    /**
     * This function sorts the fields after the name of the field
     *
     * Sort rule:
     * 001
     * ...
     * 999
     * aXX
     * xXX
     *
     * @param record
     * @returns {*}
     */
    function sort(record) {
        Log.trace("Enter - RecordSorting.sort");

        try {
            record.fields.sort(function (a, b) {
                return a.name.localeCompare(b.name, 'dk');
            });

            return record;
        } finally {
            Log.trace("Exit - RecordSorting.sort");
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'sort': sort
    }

}();