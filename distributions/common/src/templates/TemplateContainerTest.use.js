use ("TemplateContainer");
use("UnitTest");
use("SafeAssert");

UnitTest.addFixture("TemplateContainer.__addUppercaseLetterToTemplate", function () {

    function getUppercaseTemplates() {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        "A": {
                            "repeatable": false
                        },
                        "B": {
                            "repeatable": true
                        }
                    },
                    "rules": [{"type": "FieldRules.upperCaseCheck"}]
                }
            }
        }
    }

    function getLowerCaseTemplateNoUppercaseFieldsNoRules() {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true,
                        }
                    }
                }
            }
        }
    }

    function getLowerCaseTemplateWithUppercaseFieldsNoRules() {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        "B": {
                            "repeatable": true
                        }
                    }
                }
            }
        }
    }

    var lowerCaseTemplate = getLowerCaseTemplateNoUppercaseFieldsNoRules();
    TemplateContainer.onlyForTest__addUppercaseLetterToTemplate(lowerCaseTemplate);
    Assert.equalValue("TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", JSON.stringify(lowerCaseTemplate), JSON.stringify(getUppercaseTemplates()));

    var lowerCaseTemplateWithUppercase = getLowerCaseTemplateWithUppercaseFieldsNoRules();
    TemplateContainer.onlyForTest__addUppercaseLetterToTemplate(lowerCaseTemplateWithUppercase);
    Assert.equal("TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", Object.keys(lowerCaseTemplateWithUppercase["fields"]["002"]["subfields"]).sort(), Object.keys(getUppercaseTemplates()["fields"]["002"]["subfields"]).sort());
});

UnitTest.addFixture("TemplateContainer.onlyForTest__addDanishLetterAaToTemplate", function () {

    function getAaTemplate() {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true
                        },
                        // getAaTemplate
                        "\u00E5": {
                            "mandatory": false,
                            "repeatable": false
                        }
                    }
                }
            }
        }
    }

    function getLowerCaseTemplate() {
        return {
            "defaults": {
                "subfield": {
                    "mandatory": false,
                    "repeatable": true
                }
            },
            "fields": {
                "002": {
                    "subfields": {
                        "a": {
                            "mandatory": true,
                            "repeatable": false
                        },
                        "b": {
                            "mandatory": true,
                        }
                    }
                }
            }
        }
    }

    var lowerCaseTemplate = getLowerCaseTemplate();
    TemplateContainer.onlyForTest__addDanishLetterAaToTemplate(lowerCaseTemplate);

    Assert.equalValue("TemplateContainer.onlyForTest__addUppercaseLetterToTemplate()", JSON.stringify(lowerCaseTemplate, undefined, 4), JSON.stringify(getAaTemplate(), undefined, 4));
});
