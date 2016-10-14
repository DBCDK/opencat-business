use("Log");
use("Marc");

EXPORTED_SYMBOLS = ['RecordLookupField'];

/**
 *
 *
 * @namespace
 * @name RecordLookupField
 */
var RecordLookupField = function () {
    function createFromRecord(marcRecord, fieldMatcher) {
        Log.trace("Enter - RecordLookupField.createFromRecord( ", marcRecord, ", ", fieldMatcher, " )");
        var result = {};
        try {
            marcRecord.eachField(fieldMatcher, function (field) {
                if (!result.hasOwnProperty(field.name)) {
                    result[field.name] = [];
                }

                result[field.name].push({
                    indicator: field.indicator,
                    subfields: __extractSubfieldsInSortedOrder(field)
                });
            });
            return result;
        } finally {
            Log.trace("Exit - RecordLookupField.createFromRecord() ", result);
        }
    }

    function createFromField(field) {
        Log.trace("Enter - RecordLookupField.createFromField( ", field, " )");
        var result = {};
        try {
            if (!result.hasOwnProperty(field.name)) {
                result[field.name] = [];

                result[field.name].push({
                    indicator: field.indicator,
                    subfields: __extractSubfieldsInSortedOrder(field)
                });
            }
            return result;
        } finally {
            Log.trace("Exit - RecordLookupField.createFromRecord() ", result);
        }
    }

    function containsField(instance, field) {
        Log.trace("Enter - RecordLookupField.containsField( ", instance, ", ", field, " )");
        var result = null;
        try {
            if (!instance.hasOwnProperty(field.name)) {
                return result = false;
            }

            for (var i = 0; i < instance[field.name].length; i++) {
                if (__isFieldEqual(instance[field.name][i], field)) {
                    return result = true;
                }
            }
            return result = false;
        } finally {
            Log.trace("Exit - RecordLookupField.containsField() ", result);
        }
    }

    function __isFieldEqual(instanceField, field) {
        Log.trace("Enter - RecordLookupField.__isFieldEqual( ", instanceField, ", ", field, " )");
        var result = true;
        try {
            if (instanceField.indicator !== field.indicator) {
                Log.trace("Different indicators");
                return result = false;
            }

            if (instanceField.subfields.length !== field.size()) {
                Log.trace("Different number of subfields");
                return result = false;
            }

            var subfields = __extractSubfieldsInSortedOrder(field);
            for (var i = 0; i < instanceField.subfields.length; i++) {
                var isf = instanceField.subfields[i];
                var sf = subfields[i];
                Log.trace("Compare '", isf, "' with '", sf, "'");

                if (isf.name !== sf.name) {
                    Log.trace("Different subfield name");
                    return result = false;
                }

                if (isf.value !== sf.value) {
                    Log.trace("Different subfield value");
                    return result = false;
                }
            }
            return result = true;
        } finally {
            Log.trace("Exit - RecordLookupField.__isFieldEqual(): ", result);
        }
    }

    function __extractSubfieldsInSortedOrder(field) {
        Log.trace("Enter - RecordLookupField.__extractSubfieldsInSortedOrder( ", field, " )");
        var result = [];
        try {
            field.eachSubField(/./, function (field, subfield) {
                result.push(subfield);
            });
            result.sort(__sortSubfields);
            return result;
        } finally {
            Log.trace("Exit - RecordLookupField.__extractSubfieldsInSortedOrder(): ", result);
        }
    }

    function __sortSubfields(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    }

    return {
        'createFromRecord': createFromRecord,
        'createFromField': createFromField,
        'containsField': containsField
    };
}();
