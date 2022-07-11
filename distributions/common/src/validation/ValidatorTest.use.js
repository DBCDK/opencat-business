use("GenericSettings");
use("UnitTest");
use("Validator");

UnitTest.addFixture("Validator.doValidateRecord (Full test)", function () {
    // TODO: Ehh what???
    return;
    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    },
                    {
                        name: "b",
                        value: "870970"
                    },
                    {
                        name: "c",
                        value: "12072013"
                    },
                    {
                        name: "d",
                        value: "12072013101735"
                    },
                    {
                        name: "f",
                        value: "d"
                    }
                ]
            },
            {
                name: "004",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "e"
                    },
                    {
                        name: "r",
                        value: "n"
                    }
                ]
            }
        ]
    };

    var tempAsString = readFile("templates/bog.json");
    var template = TemplateOptimizer.optimize(JSON.parse(tempAsString));

    Assert.equalValue("", template.fields["001"].rules.length, 1);
    Assert.equalValue("", Validator.doValidateRecord(record, function () {
        return template;
    }, GenericSettings), []);
});

UnitTest.addFixture("Validator.doValidateRecord", function () {
    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            }
        ]
    };

    var template = {
        fields: {
            "001": {
                subfields: {
                    "a": {}
                }
            }
        },
        rules: []
    };
    Assert.equalValue("Full record with no errors", Validator.doValidateRecord(record, function () {
        return template;
    }, GenericSettings), []);

    template = {
        fields: {
            "001": {
                subfields: {
                    "a": {}
                }
            }
        },
        rules: [
            {
                type: function (record, params) {
                    return [ValidateErrors.subfieldError("url", "message")];
                }
            }
        ]
    };
    Assert.equalValue("Validate record with error", Validator.doValidateRecord(record, function () {
            return template;
        }, GenericSettings),
        [ValidateErrors.subfieldError("url", "message")]);

    template = {
        fields: {
            "001": {
                subfields: {
                    "a": {}
                }
            }
        },
        rules: [
            {
                type: function (record, params) {
                    return [ValidateErrors.subfieldError("url", "message")];
                },
                errorType: "WARNING"
            }
        ]
    };

    var valWarning = ValidateErrors.subfieldError("url", "message");
    valWarning.type = "WARNING";
    Assert.equalValue("Validate record with warnings",
        Validator.doValidateRecord(record, function () {
            return template;
        }, GenericSettings),
        [valWarning]);
});

UnitTest.addFixture("Validator.__validateField", function () {
    var bundle = ResourceBundleFactory.getBundle(Validator.BUNDLE_NAME);

    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            }
        ]
    };
    var template = {fields: {}, rules: []};

    Assert.equalValue("Test 1", Validator.__validateField(record, record.fields[0], function () {
            return template;
        }, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "wrong.field", "001"))]);

    template = {
        fields: {
            "001": {
                subfields: {
                    "a": {}
                }
            }
        },
        rules: []
    };
    Assert.equalValue("Test 2", Validator.__validateField(record, record.fields[0], function () {
        return template;
    }, GenericSettings), []);

    template = {
        fields: {
            "001": {
                url: "url",
                subfields: {
                    "a": {}
                },
                rules: [
                    {
                        type: function (record, field, params) {
                            return [ValidateErrors.subfieldError("url", "message")];
                        }
                    }
                ]

            }
        },
        rules: []
    };
    Assert.equalValue("Test 3 - unknown rule", Validator.__validateField(record, record.fields[0], function () {
            return template;
        }, GenericSettings),
        []);
});

UnitTest.addFixture("Validator.__validateSubfield", function () {
    var bundle = ResourceBundleFactory.getBundle(Validator.BUNDLE_NAME);

    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "A",
                        value: "12345678"
                    },
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            }
        ]
    };
    var template = {fields: {}, rules: []};

    Assert.equalValue("Test 1", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[0],
        function () {
            return template;
        }, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "wrong.field", "001"))]);

    template = {
        fields: {
            "001": {
                subfields: {
                    "g": []
                }
            }
        },
        rules: []
    };
    Assert.equalValue("Test 2", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[1],
        function () {
            return template;
        }, GenericSettings),
        [ValidateErrors.subfieldError("", ResourceBundle.getStringFormat(bundle, "wrong.subfield", "a", "001"))]);

    template = {
        fields: {
            "001": {
                subfields: {
                    "a": []
                }
            }
        },
        rules: []
    };
    Assert.equalValue("Test 3", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[0],
        function () {
            return template;
        }, GenericSettings),
        []);
    Assert.equalValue("Test 3", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[1],
        function () {
            return template;
        }, GenericSettings),
        []);

    template = {
        fields: {
            "001": {
                url: "url",
                subfields: {
                    "a": [
                        {
                            type: function (record, field, subfield, params) {
                                return [ValidateErrors.subfieldError("url", "message")];
                            }
                        }
                    ]
                }
            }
        },
        rules: []
    };
    Assert.equalValue("Test 4", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[0],
        function () {
            return template;
        }, GenericSettings), []);
    Assert.equalValue("Test 4", Validator.__validateSubfield(record, record.fields[0], record.fields[0].subfields[1],
        function () {
            return template;
        }, GenericSettings),
        [ValidateErrors.subfieldError("url", "message")]);
});

UnitTest.addFixture("Subfield values must not contain chars with a unicode less then 32", function () {
    var bundle = ResourceBundleFactory.getBundle(Validator.BUNDLE_NAME);

    var template = {
        fields: {
            "042": {
                subfields: {
                    "a": []
                }
            }
        },
        rules: []
    };

    var templateProvider = function () {
        return template;
    };

    var generateRecord = function (value) {
        var subfield = {'name': 'a', 'value': value};
        var field = {'name': '042', 'indicator': '00', 'subfields': [subfield]};
        return [field];
    };

    var record = generateRecord('\n');
    Assert.equal("Subfield value with line break - only line break",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('\nabcdef');
    Assert.equal("Subfield value with line break - start with line break",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('abc\ndef');
    Assert.equal("Subfield value with line break - line break in the middel of the string",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('abcdef\n');
    Assert.equal("Subfield value with line break - end with line break",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('abc\tdef');
    Assert.equal("Subfield value with tab",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('abc' + String.fromCharCode(0) + 'def');
    Assert.equal("Subfield value with lowest numbered not-accepted char",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('abc' + String.fromCharCode(31) + 'def');
    Assert.equal("Subfield value with highest numbered not-accepted char",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "invalid.char", "a", "042"))]);

    record = generateRecord('aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZæÆøØåÅ 1234567890_-:;><≥≤Éé¢$”‰{}[]¿?§!¡¯#€%&/()=` °∑é®†¥ü|œπ‘~öä¬∆‹«©ƒ∂ßªΩ…ç√∫ñµ‚‚·—÷„˛');
    Assert.equal("Subfield value with acceptable chars",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        []);
});
UnitTest.addFixture("Subfield å must contain a number", function () {
    var bundle = ResourceBundleFactory.getBundle(Validator.BUNDLE_NAME);

    var template = {
        fields: {
            "042": {
                subfields: {
                    "å": []
                }
            }
        },
        rules: []
    };

    var templateProvider = function () {
        return template;
    };

    var record = [
        {'name': '042', 'indicator': '00', 'subfields': [{'name': 'å', 'value': 'julemand'}]}
    ];

    Assert.equal("Subfield value with acceptable chars",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "subfield.value.must.be.number", "042", "julemand"))]);

    record = [
        {'name': '042', 'indicator': '00', 'subfields': [{'name': 'å', 'value': '1'}]}
    ];

    Assert.equal("Subfield value with acceptable chars",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        []);

    record = [
        {'name': '042', 'indicator': '00', 'subfields': [{'name': 'å', 'value': '42'}]}
    ];

    Assert.equal("Subfield value with acceptable chars",
        Validator.__validateSubfield(record, record[0], record[0]['subfields'][0], templateProvider, GenericSettings),
        []);
});
UnitTest.addFixture("Check self reference", function () {
    var bundle = ResourceBundleFactory.getBundle(Validator.BUNDLE_NAME);

    var record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "011",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "013",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "014",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "015",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "016",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "017",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "018",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            }
        ]
    };

    Assert.equal("Find all errors",
        Validator.__checkSelfReference(record),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "011", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "013", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "014", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "015", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "016", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "017", "a")),
            ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "018", "a"))
        ]);


    record = {
        fields: [
            {
                name: "001",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "011",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "11111111"
                    }
                ]
            },
            {
                name: "011",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "22222222"
                    }
                ]
            },
            {
                name: "011",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "12345678"
                    }
                ]
            },
            {
                name: "011",
                indicator: "00",
                subfields: [
                    {
                        name: "a",
                        value: "33333333"
                    }
                ]
            }
        ]
    };


    Assert.equal("Find error in duplicate field",
        Validator.__checkSelfReference(record),
        [ValidateErrors.fieldError("", ResourceBundle.getStringFormat(bundle, "record.self.reference", "011", "a"))]);

});
