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
        tmp = AllFieldsMandatoryIfOneExist;
        tmp = ConflictingFields;
        tmp = ConflictingSubfields;
        tmp = FieldDemandsOtherFields;
        tmp = FieldsMandatory;
        tmp = IdFieldExists;
        tmp = MustContainOneOfFields;
        tmp = NonRepeatableFieldSubfieldCombination;
        tmp = OptionalFields;
        tmp = RecordSorted;
        tmp = RepeatableFields;
        tmp = SubfieldsHaveValuesDemandsOtherSubfield;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();