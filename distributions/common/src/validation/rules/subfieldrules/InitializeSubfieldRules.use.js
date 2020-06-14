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
        tmp = Check035;
        tmp = CheckChangedValue;
        tmp = CheckDateFormat;
        tmp = CheckEAN13;
        tmp = CheckFaust;
        tmp = CheckISBN10;
        tmp = CheckISBN13;
        tmp = CheckISMN;
        tmp = CheckISSN;
        tmp = CheckLength;
        tmp = CheckLix;
        tmp = CheckReference;
        tmp = CheckSubfieldNotUsedInChildrenRecords;
        tmp = CheckSubfieldNotUsedInParentRecord;
        tmp = CheckValue;
        tmp = CheckYear;
        tmp = LookUpRecord;
        tmp = LookupValue;
        tmp = MandatorySubfieldInVolumeWorkRule;
        tmp = SubfieldAllowedIfSubfieldValueInOtherFieldExists;
        tmp = SubfieldCannotContainValue;
        tmp = SubfieldConditionalMandatoryField;
        tmp = SubfieldMandatoryIfSubfieldNotPresentRule;
        tmp = SubfieldsDemandsOtherSubfields;
        tmp = SubfieldValueExcludesField;
        tmp = SubfieldValueMakesFieldsAllowed;
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();