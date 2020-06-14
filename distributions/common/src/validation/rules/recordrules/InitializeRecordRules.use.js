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

        __callWithTryCatch(AllFieldsMandatoryIfOneExist.validateRecord);
        __callWithTryCatch(ConflictingFields.validateRecord);
        __callWithTryCatch(ConflictingSubfields.validateRecord);
        __callWithTryCatch(FieldDemandsOtherFields.validateRecord);
        __callWithTryCatch(FieldsMandatory.validateRecord);
        __callWithTryCatch(IdFieldExists.validateRecord);
        __callWithTryCatch(MustContainOneOfFields.validateRecord);
        __callWithTryCatch(NonRepeatableFieldSubfieldCombination.validateRecord);
        __callWithTryCatch(OptionalFields.validateRecord);
        __callWithTryCatch(RecordSorted.validateRecord);
        __callWithTryCatch(RepeatableFields.validateRecord);
        __callWithTryCatch(SubfieldsHaveValuesDemandsOtherSubfield.validateRecord);
    }

    function __callWithTryCatch(func) {
        try {
            func();
        } catch (ex) {
            // Do nothing
        }
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();