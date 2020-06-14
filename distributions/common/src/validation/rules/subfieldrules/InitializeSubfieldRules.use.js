use("Log");
use("Check035");
use("CheckChangedValue");
use("CheckDateFormat");
use("CheckEAN13");
use("CheckFaust");
use("CheckISBN10");
use("CheckISBN13");
use("CheckISMN");
use("CheckISSN");
use("CheckLength");
use("CheckLix");
use("CheckReference");
use("CheckSubfieldNotUsedInChildrenRecords");
use("CheckSubfieldNotUsedInParentRecord");
use("CheckValue");
use("CheckYear");
use("LookUpRecord");
use("LookupValue");
use("MandatorySubfieldInVolumeWorkRule");
use("SubfieldAllowedIfSubfieldValueInOtherFieldExists");
use("SubfieldCannotContainValue");
use("SubfieldConditionalMandatoryField");
use("SubfieldMandatoryIfSubfieldNotPresentRule");
use("SubfieldsDemandsOtherSubfields");
use("SubfieldValueExcludesField");
use("SubfieldValueMakesFieldsAllowed");

EXPORTED_SYMBOLS = ['InitializeSubfieldRules'];

var InitializeSubfieldRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize() {
        Log.info("Initializing subfield rules");

        __callWithTryCatch(Check035.validateSubfield);
        __callWithTryCatch(CheckChangedValue.validateSubfield);
        __callWithTryCatch(CheckDateFormat.validateSubfield);
        __callWithTryCatch(CheckEAN13.makeCheck);
        __callWithTryCatch(CheckFaust.validateSubfield);
        __callWithTryCatch(CheckISBN10.validateSubfield);
        __callWithTryCatch(CheckISBN13.validateSubfield);
        __callWithTryCatch(CheckISMN.validateSubfield);
        __callWithTryCatch(CheckISSN.validateSubfield);
        __callWithTryCatch(CheckLength.validateSubfield);
        __callWithTryCatch(CheckLix.validateSubfield);
        __callWithTryCatch(CheckReference.validateSubfield);
        __callWithTryCatch(CheckSubfieldNotUsedInChildrenRecords.validateSubfield);
        __callWithTryCatch(CheckSubfieldNotUsedInParentRecord.validateSubfield);
        __callWithTryCatch(CheckValue.validateSubfield);
        __callWithTryCatch(CheckYear.validateSubfield);
        __callWithTryCatch(LookUpRecord.validateSubfield);
        __callWithTryCatch(LookupValue.validateSubfield);
        __callWithTryCatch(SubfieldAllowedIfSubfieldValueInOtherFieldExists.validateSubfield);
        __callWithTryCatch(SubfieldCannotContainValue.validateSubfield);
        __callWithTryCatch(SubfieldConditionalMandatoryField.validateSubfield);
        __callWithTryCatch(SubfieldMandatoryIfSubfieldNotPresentRule.validateField);
        __callWithTryCatch(SubfieldsDemandsOtherSubfields.validateSubfield);
        __callWithTryCatch(SubfieldValueExcludesField.validateSubfield);
        __callWithTryCatch(SubfieldValueMakesFieldsAllowed.validateSubfield);
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