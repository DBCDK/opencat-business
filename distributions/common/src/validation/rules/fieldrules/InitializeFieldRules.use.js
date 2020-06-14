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
        tmp = CheckValueUnlessHasSubfield.__BUNDLE_NAME;
        tmp = ExclusiveSubfield.BUNDLE_NAME;
        tmp = ExclusiveSubfieldParameterized.BUNDLE_NAME;
        tmp = FieldDemandsOtherFieldAndSubfield.BUNDLE_NAME;
        tmp = FieldsIndicator.BUNDLE_NAME;
        tmp = FieldsIndicatorMakesSubfieldRepeatable.BUNDLE_NAME;
        tmp = RepeatableSubfields.BUNDLE_NAME;
        tmp = SubfieldConditionalMandatoryField.__BUNDLE_NAME;
        tmp = SubfieldHasValueDemandsOtherSubfield.__BUNDLE_NAME;
        tmp = SubfieldsMandatory.BUNDLE_NAME;
        tmp = UpperCaseCheck.__BUNDLE_NAME;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();