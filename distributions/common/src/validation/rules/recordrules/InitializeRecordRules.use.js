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

        AllFieldsMandatoryIfOneExist();
        ConflictingFields();
        ConflictingSubfields();
        FieldDemandsOtherFields();
        FieldsMandatory();
        IdFieldExists();
        MustContainOneOfFields();
        NonRepeatableFieldSubfieldCombination();
        OptionalFields();
        RecordSorted();
        RepeatableFields();
        SubfieldsHaveValuesDemandsOtherSubfield();
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();