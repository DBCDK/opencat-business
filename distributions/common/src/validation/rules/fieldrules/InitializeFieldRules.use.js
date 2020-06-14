use("Log");
use("CheckValueUnlessHasSubfield");
use("ExclusiveSubfield");
use("ExclusiveSubfieldParameterized");
use("FieldDemandsOtherFieldAndSubfield");
use("FieldsIndicator");
use("FieldsIndicatorMakesSubfieldRepeatable");
use("RepeatableSubfields");
use("SubfieldConditionalMandatoryField");
use("SubfieldHasValueDemandsOtherSubfield");
use("SubfieldsMandatory");
use("UpperCaseCheck");

EXPORTED_SYMBOLS = ['InitializeFieldRules'];

var InitializeFieldRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize() {
        Log.info("Initializing field rules");

        CheckValueUnlessHasSubfield();
        ExclusiveSubfield();
        ExclusiveSubfieldParameterized();
        FieldDemandsOtherFieldAndSubfield();
        FieldsIndicator();
        FieldsIndicatorMakesSubfieldRepeatable();
        RepeatableSubfields();
        SubfieldConditionalMandatoryField();
        SubfieldHasValueDemandsOtherSubfield();
        SubfieldsMandatory();
        UpperCaseCheck();
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();