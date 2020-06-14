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

        var tmp;
        tmp = CheckValueUnlessHasSubfield;
        tmp = ExclusiveSubfield;
        tmp = ExclusiveSubfieldParameterized;
        tmp = FieldDemandsOtherFieldAndSubfield;
        tmp = FieldsIndicator;
        tmp = FieldsIndicatorMakesSubfieldRepeatable;
        tmp = RepeatableSubfields;
        tmp = SubfieldConditionalMandatoryField;
        tmp = SubfieldHasValueDemandsOtherSubfield;
        tmp = SubfieldsMandatory;
        tmp = UpperCaseCheck;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();