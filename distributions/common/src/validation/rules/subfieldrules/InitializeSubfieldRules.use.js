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

        var tmp;
        tmp = Check035.__BUNDLE_NAME;
        tmp = CheckChangedValue.__BUNDLE_NAME;
        tmp = CheckDateFormat.__BUNDLE_NAME;
        tmp = CheckEAN13.__BUNDLE_NAME;
        tmp = CheckFaust.__BUNDLE_NAME;
        tmp = CheckISBN10.__BUNDLE_NAME;
        tmp = CheckISBN13.__BUNDLE_NAME;
        tmp = CheckISMN.__BUNDLE_NAME;
        tmp = CheckISSN.__BUNDLE_NAME;
        tmp = CheckLength.__BUNDLE_NAME;
        tmp = CheckLix.__BUNDLE_NAME;
        tmp = CheckReference.__BUNDLE_NAME;
        tmp = CheckSubfieldNotUsedInChildrenRecords.__BUNDLE_NAME;
        tmp = CheckSubfieldNotUsedInParentRecord.__BUNDLE_NAME;
        tmp = CheckValue.__BUNDLE_NAME;
        tmp = CheckYear.__BUNDLE_NAME;
        tmp = LookUpRecord.__BUNDLE_NAME;
        tmp = LookupValue.__BUNDLE_NAME;
        tmp = MandatorySubfieldInVolumeWorkRule.__BUNDLE_NAME;
        tmp = SubfieldAllowedIfSubfieldValueInOtherFieldExists.__BUNDLE_NAME;
        tmp = SubfieldCannotContainValue.__BUNDLE_NAME;
        tmp = SubfieldConditionalMandatoryField.__BUNDLE_NAME;
        tmp = SubfieldMandatoryIfSubfieldNotPresentRule.__BUNDLE_NAME;
        tmp = SubfieldsDemandsOtherSubfields.__BUNDLE_NAME;
        tmp = SubfieldValueExcludesField.__BUNDLE_NAME;
        tmp = SubfieldValueMakesFieldsAllowed.__BUNDLE_NAME;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();