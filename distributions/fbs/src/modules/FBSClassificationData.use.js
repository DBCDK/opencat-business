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
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord
    };

}();
