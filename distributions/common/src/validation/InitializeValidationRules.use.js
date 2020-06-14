use("Log");
use("InitializeFieldRules");
use("InitializeRecordRules");
use("InitializeSubfieldRules");

EXPORTED_SYMBOLS = ['InitializeValidationRules'];

var InitializeValidationRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize() {
        InitializeFieldRules.initialize();
        InitializeRecordRules.initialize();
        InitializeSubfieldRules.initialize();
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();