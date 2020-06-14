use("Log");
use("CheckValueUnlessHasSubfield");
use("ExclusiveSubfield");
use("ExclusiveSubfieldParameterized");
use("FieldDemandsOtherFieldAndSubfield");
use("FieldsIndicator");
use("FieldsIndicatorMakesSubfieldRepeatable");
use("RepeatableSubfields");
use("SubfieldHasValueDemandsOtherSubfield");
use("SubfieldsMandatory");
use("SubfieldMandatoryIfSubfieldNotPresentRule");
use("UpperCaseCheck");

EXPORTED_SYMBOLS = ['InitializeFieldRules'];

var InitializeFieldRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize() {
        Log.info("Initializing field rules");

        __callWithTryCatch(CheckValueUnlessHasSubfield.validateField);
        __callWithTryCatch(ExclusiveSubfield.validateField);
        __callWithTryCatch(ExclusiveSubfieldParameterized.validateField);
        __callWithTryCatch(FieldDemandsOtherFieldAndSubfield.validateField);
        __callWithTryCatch(FieldsIndicator.validateField);
        __callWithTryCatch(FieldsIndicatorMakesSubfieldRepeatable.validateField);
        __callWithTryCatch(RepeatableSubfields.validateField);
        __callWithTryCatch(SubfieldHasValueDemandsOtherSubfield.validateField);
        __callWithTryCatch(SubfieldsMandatory.validateField);
        __callWithTryCatch(SubfieldMandatoryIfSubfieldNotPresentRule.validateField);
        __callWithTryCatch(UpperCaseCheck.validateField);
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