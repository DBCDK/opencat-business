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

    function updateClassificationsInRecord(instance, currentCommonMarc, updatingCommonMarc, libraryRecord) {
        return ClassificationData.updateClassificationsInRecord(instance, currentCommonMarc, updatingCommonMarc, libraryRecord);
    }

    function removeClassificationsFromRecord(instance, record) {
        return ClassificationData.removeClassificationsFromRecord(instance, record);
    }

    return {
        'create': create,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord
    };

}();
