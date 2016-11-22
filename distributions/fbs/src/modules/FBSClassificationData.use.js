use("ClassificationData");
use("Log");
use("RecordLookupField");

EXPORTED_SYMBOLS = ['FBSClassificationData'];

var FBSClassificationData = function () {
    function create(fieldsRegExp) {
        return {
            fields: fieldsRegExp
        }
    }

    function isRecordInProduction( marc ) {
        return ClassificationData.isRecordInProduction( marc );
    }

    function hasClassificationData( instance, marc ) {
        return ClassificationData.hasClassificationData( instance, marc );
    }

    function hasClassificationsChanged(instance, oldMarc, newMarc) {
        return ClassificationData.hasClassificationsChanged(instance, oldMarc, newMarc);
    }

    function updateClassificationsInRecord(instance, currentCommonMarc, updatingCommonMarc, libraryRecord) {
        return ClassificationData.updateClassificationsInRecord(instance, currentCommonMarc, updatingCommonMarc, libraryRecord);
    }

    function removeClassificationsFromRecord(instance, record) {
        return ClassificationData.removeClassificationsFromRecord(instance, record);
    }

    return {
        'create': create,
        'isRecordInProduction': isRecordInProduction,
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord
    };

}();
