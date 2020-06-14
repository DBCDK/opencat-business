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

        Check035();
        CheckChangedValue();
        CheckDateFormat();
        CheckEAN13();
        CheckFaust();
        CheckISBN10();
        CheckISBN13();
        CheckISMN();
        CheckISSN();
        CheckLength();
        CheckLix();
        CheckReference();
        CheckSubfieldNotUsedInChildrenRecords();
        CheckSubfieldNotUsedInParentRecord();
        CheckValue();
        CheckYear();
        LookUpRecord();
        LookupValue();
        MandatorySubfieldInVolumeWorkRule();
        SubfieldAllowedIfSubfieldValueInOtherFieldExists();
        SubfieldCannotContainValue();
        SubfieldConditionalMandatoryField();
        SubfieldMandatoryIfSubfieldNotPresentRule();
        SubfieldsDemandsOtherSubfields();
        SubfieldValueExcludesField();
        SubfieldValueMakesFieldsAllowed();
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();