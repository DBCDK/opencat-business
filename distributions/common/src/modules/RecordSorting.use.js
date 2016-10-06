use("Marc");
use("MarcClasses");
use("Log");
use("StringUtil");
use("FieldSorting");

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
     * @param templateProvider
     * @param record
     * @returns {*}
     */
    function sort(templateProvider, record) {
        Log.trace("Enter - RecordSorting.sort");

        try {
            if (record !== null && record !== undefined && record.fields !== undefined) {
                record.fields.sort(function (a, b) {
                    return a.name.localeCompare(b.name, 'dk');
                });

                var template = templateProvider();

                for (var i = 0; i < record.fields.length; i++) {
                    var field = record.fields[i];

                    if (template.fields[field.name] && template.fields[field.name].sorting) {
                        FieldSorting.sort(field, template.fields[field.name].sorting);
                    }
                }
            }

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