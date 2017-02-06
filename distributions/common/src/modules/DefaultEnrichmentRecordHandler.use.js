use("RecategorizationNoteFieldFactory");
use("Log");
use("Marc");
use("RecordUtil");
use("ResourceBundleFactory");
use("ResourceBundle");

EXPORTED_SYMBOLS = ['DefaultEnrichmentRecordHandler'];

/**
 * Module to implement entrypoints for the update logic in DBC and FBS
 * installations.
 *
 * @namespace
 * @name DefaultEnrichmentRecordHandler
 */
var DefaultEnrichmentRecordHandler = function () {

    // Fix for story #1911 ,
    // adding a y08 field with subfield value *a UPDATE posttypeskift
    function __getY08PosttypeSkiftField() {
        Log.trace("Enter - __getY08PosttypeSkift()");
        var ret;
        try {
            var y08Field = new Field("y08", "00");
            y08Field.append(new Subfield("a", "UPDATE posttypeskift"));
            return ret = y08Field;
        } finally {
            Log.trace("Exit - __getY08PosttypeSkift() : " + ret.toString());
        }
    }

    function doRecategorizationThings(commonRecord, enrichmentRecord, newRecord) {
        Log.trace("Enter - DefaultValidatorEntryPoint.doRecategorizationThings()");
        var result;
        try {
            var commonMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(commonRecord));
            var enrichmentMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(enrichmentRecord));
            var newMarc = DanMarc2Converter.convertToDanMarc2(JSON.parse(newRecord));
            result = __doRecategorizationThings(commonMarc, enrichmentMarc, newMarc);
            result = JSON.stringify(DanMarc2Converter.convertFromDanMarc2(result));
            return result;
        } finally {
            Log.trace("Exit - DefaultValidatorEntryPoint.doRecategorizationThings(): " + result);
        }
    }

    function __doRecategorizationThings(currentCommonMarc, updatingCommonMarc, enrichmentRecord) {
        var record = enrichmentRecord.clone();
        if (__isRecategorization(currentCommonMarc, updatingCommonMarc)) {
            Log.info("Record is a recategorization.");
            record = __removeClassificationsFromRecord(record);
            var field = RecategorizationNoteFieldFactory.newNoteField(currentCommonMarc, updatingCommonMarc);
            if (field !== undefined) {
                record = RecordSorter.insertField(record, field);
                record = RecordSorter.insertField(record, __getY08PosttypeSkiftField())
            }
        } else {
            Log.info("Record is not a recategorization.");
        }
        return record;
    }

    function __removeClassificationsFromRecord(record) {
        var result = undefined;
        result = new Record;
        record.eachField(/./, function (field) {
            if (!UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS.test(field.name)) {
                result.append(field);
            }
        });

        return result;
    }

    function __isRecategorization(currentCommonRecord, updatingCommonRecord) {
        Log.trace("Enter - DefaultEnrichmentRecordHandler.__isRecategorization()");
        var result;
        try {
            if (updatingCommonRecord.matchValue(/004/, /a/, /e/)) {
                if (currentCommonRecord.matchValue(/004/, /a/, /b/)) {
                    return result = true;
                }
            }

            if (updatingCommonRecord.matchValue(/004/, /a/, /b/)) {
                if (currentCommonRecord.matchValue(/004/, /a/, /e/)) {
                    return result = true;
                }
            }

            if (updatingCommonRecord.matchValue(/008/, /t/, /p/)) {
                if (!currentCommonRecord.matchValue(/008/, /t/, /p/)) {
                    return result = true;
                }
            }
            else if (currentCommonRecord.matchValue(/008/, /t/, /p/)) {
                return result = true;
            }

            var bundle = ResourceBundleFactory.getBundle("categorization-codes");
            var currentMaterialField = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(bundle, currentCommonRecord, "009", /a|g/);
            var updatingMaterialField = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(bundle, updatingCommonRecord, "009", /a|g/);

            if (currentMaterialField === undefined && updatingMaterialField === undefined) {
                return result = false;
            }
            if (currentMaterialField === undefined && updatingMaterialField !== undefined) {
                return result = true;
            }
            if (currentMaterialField !== undefined && updatingMaterialField === undefined) {
                return result = true;
            }

            // At this point 009 a|g is defined in both records
            var currentA = [], currentG = [];
            var updatingA = [], updatingG = [];

            currentMaterialField.eachSubField(/a/, function (field, subField) {
                currentA.push(subField.value);
            });

            currentMaterialField.eachSubField(/g/, function (field, subField) {
                currentG.push(subField.value);
            });

            updatingMaterialField.eachSubField(/a/, function (field, subField) {
                updatingA.push(subField.value);
            });

            updatingMaterialField.eachSubField(/g/, function (field, subField) {
                updatingG.push(subField.value);
            });

            var aDiffers = currentA.sort().concat().join("") !== updatingA.sort().concat().join("");
            var gDiffers = currentG.sort().concat().join("") !== updatingG.sort().concat().join("");

            if (currentA.length !== updatingA.length || currentG.length !== updatingG.length || aDiffers || gDiffers) {
                return result = true;
            }

            var record_lookup = RecordLookupField.createFromField(currentMaterialField);
            if (RecordLookupField.containsField(record_lookup, updatingMaterialField)) {
                return result = false;
            }
            return result = false;
        } finally {
            Log.trace("Exit - DefaultEnrichmentRecordHandler.__isRecategorization(): ", result);
        }
    }

    return {
        'doRecategorizationThings': doRecategorizationThings
    }
}();
