use("Log");
use("AllFieldsMandatoryIfOneExist");
use("ConflictingFields");
use("ConflictingSubfields");
use("FieldDemandsOtherFields");
use("FieldsMandatory");
use("IdFieldExists");
use("MustContainOneOfFields");
use("NonRepeatableFieldSubfieldCombination");
use("OptionalFields");
use("RecordSorted");
use("RepeatableFields");
use("SubfieldsHaveValuesDemandsOtherSubfield");

EXPORTED_SYMBOLS = ['InitializeRecordRules'];

var InitializeRecordRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize() {
        Log.info("Initializing record rules");

        var tmp;
        tmp = AllFieldsMandatoryIfOneExist.__BUNDLE_NAME;
        tmp = ConflictingFields.__BUNDLE_NAME;
        tmp = ConflictingSubfields.__BUNDLE_NAME;
        tmp = FieldDemandsOtherFields.__BUNDLE_NAME;
        tmp = FieldsMandatory.__BUNDLE_NAME;
        tmp = IdFieldExists.__BUNDLE_NAME;
        tmp = MustContainOneOfFields.__BUNDLE_NAME;
        tmp = NonRepeatableFieldSubfieldCombination.__BUNDLE_NAME;
        tmp = OptionalFields.__BUNDLE_NAME;
        tmp = RecordSorted.__BUNDLE_NAME;
        tmp = RepeatableFields.__BUNDLE_NAME;
        tmp = SubfieldsHaveValuesDemandsOtherSubfield.__BUNDLE_NAME;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();