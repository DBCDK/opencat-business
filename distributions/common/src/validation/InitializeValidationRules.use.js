use("Log");
use("InitializeFieldRules");
use("InitializeRecordRules");
use("InitializeSubfieldRules");
use("Marc");
use("DanMarc2Converter");
use("ValidatorEntryPoint");

EXPORTED_SYMBOLS = ['InitializeValidationRules'];

var InitializeValidationRules = function () {
    var __BUNDLE_NAME = "validation";

    function initialize(settings) {
        InitializeFieldRules.initialize();
        InitializeRecordRules.initialize();
        InitializeSubfieldRules.initialize();

        __initializeRecord(settings);
    }

    function __initializeRecord(settings) {
        var record = {
            fields: [
                {
                    name: "001",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "4 557 839 9"},
                        {name: "b", value: "870970"},
                        {name: "c", value: "20140812140502"},
                        {name: "d", value: "20140728"},
                        {name: "f", value: "a"}
                    ]
                },
                {
                    name: "002",
                    indicator: "00",
                    subfields: [
                        {name: "b", value: "710100"},
                        {name: "c", value: "9 338 547 0"},
                        {name: "x", value: "71010093385470"}
                    ]
                },
                {
                    name: "004",
                    indicator: "00",
                    subfields: [
                        {name: "r", value: "c"},
                        {name: "a", value: "e"}
                    ]
                },
                {
                    name: "008",
                    indicator: "00",
                    subfields: [
                        {name: "t", value: "s"},
                        {name: "u", value: "f"},
                        {name: "a", value: "2010"},
                        {name: "b", value: "xx"},
                        {name: "l", value: "eng"},
                        {name: "v", value: "0"}
                    ]
                },
                {
                    name: "009",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "s"},
                        {name: "b", value: "a"},
                        {name: "g", value: "xx"}
                    ]
                },
                {
                    name: "023",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "4011222331687"}
                    ]
                },
                {
                    name: "039",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "bla"}
                    ]
                },
                {
                    name: "245",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "ABC of the BLUES"},
                        {name: "c", value: "the ultimate collection from the delta to the big cities"}
                    ]
                },
                {
                    name: "260",
                    indicator: "00",
                    subfields: [
                        {name: "b", value: "Membran Music Ltd."},
                        {name: "c", value: "[2010]"}
                    ]
                },
                {
                    name: "300",
                    indicator: "00",
                    subfields: [
                        {name: "n", value: "52 cd'er"},
                        {name: "d", value: "1"},
                        {name: "d", value: "1"}
                    ]
                },
                {
                    name: "531",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "Indhold:"}
                    ]
                },
                {
                    name: "652",
                    indicator: "00",
                    subfields: [
                        {name: "m", value: "78.792"},
                        {name: "v", value: "2"}
                    ]
                },
                {
                    name: "666",
                    indicator: "00",
                    subfields: [
                        {name: "m", value: "blues"},
                        {name: "l", value: "USA"}
                    ]
                },
                {
                    name: "700",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "Blackwell"},
                        {name: "h", value: "Scrapper"}
                    ]
                },
                {
                    name: "770",
                    indicator: "00",
                    subfields: [
                        {name: "å", value: "1111"},
                        {name: "a", value: "Arnold"},
                        {name: "h", value: "Kokomo"}
                    ]
                },
                {
                    name: "795",
                    indicator: "00",
                    subfields: [
                        {name: "å", value: "1111"},
                        {name: "a", value: "Backfence Picket Blues"}
                    ]
                },
                {
                    name: "900",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "Arnold"},
                        {name: "h", value: "James"},
                        {name: "z", value: "770/1111"}
                    ]
                },
                {
                    name: "996",
                    indicator: "00",
                    subfields: [
                        {name: "a", value: "710100"}
                    ]
                }
            ]
        }

        var templateProvider = function () {
            TemplateContainer.setSettings(settings);
            return TemplateContainer.get("dbcsingle");
        };

        Validator.doValidateRecord(record, templateProvider, settings);
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'initialize': initialize
    };
}();