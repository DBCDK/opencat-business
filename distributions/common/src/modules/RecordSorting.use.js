use("Marc");
use("MarcClasses");
use("Log");
use("StringUtil");
use("FieldSorting");
use("TemplateContainer");
use("ResourceBundleFactory");
use("DanMarc2Converter");

EXPORTED_SYMBOLS = ['RecordSorting'];

var RecordSorting = function () {
    var BUNDLE_NAME = "validation";

    function sortRecord(templateName, record, settings) {
        Log.trace("Enter - RecordSorting.sortRecord");
        var start = new Date().getTime();

        var templateProvider = function () {
            TemplateContainer.setSettings(settings);
            return TemplateContainer.get(templateName);
        };

        try {
            ResourceBundleFactory.init(settings);

            var recordSorted = sort(templateProvider, JSON.parse(record));
            var marc = DanMarc2Converter.convertToDanMarc2(recordSorted);

            return JSON.stringify(DanMarc2Converter.convertFromDanMarc2(marc));
        } finally {
            Log.trace("Exit - RecordSorting.sortRecord");
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.RecordSorting.sortRecord]');
        }
    }

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
        var start = new Date().getTime();
        try {
            if (record !== null && record !== undefined && record.fields !== undefined) {
                record.fields.sort(function (a, b) {
                    return a.name.localeCompare(b.name, 'dk');
                });

                var template = templateProvider();

                for (var i = 0; i < record.fields.length; i++) {
                    var field = record.fields[i];
                    var fieldName = field.name;

                    if (template.fields.hasOwnProperty(fieldName) && template.fields[fieldName].hasOwnProperty('sorting')) {
                        FieldSorting.sort(field, template.fields[field.name].sorting);
                    }
                }
            }

            return record;
        } finally {
            Log.trace("Exit - RecordSorting.sort");
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.RecordSorting.sort]')
        }
    }

    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'sortRecord': sortRecord,
        'sort': sort
    }

}();