use ("TemplateContainer");
use("UnitTest");

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

    Assert.equalValue("TemplateContainer.onlyForTest__addDanishLetterAaToTemplate()", JSON.stringify(lowerCaseTemplate, undefined, 4), JSON.stringify(getAaTemplate(), undefined, 4));
});
