use( "Builder" );
use( "SafeAssert" );
use( "TemplateContainer" );
use( "UnitTest" );

UnitTest.addFixture( "Builder.buildRecord", function() {
    var record = {
        "leader": ["0", "0", "0", "0", "0", "n", " ", " ", " ", " ", "2", "2", "0", "0", "0", "0", "0", "0", " ", " ", "4", "5", "0", "0"],
        "fields": [
            {
                "name": "001",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "a",
                        "value": "580829379"
                    }, {
                        "name": "b",
                        "value": ""
                    }, {
                        "name": "c",
                        "value": ""
                    }, {
                        "name": "d",
                        "value": ""
                    }, {
                        "name": "f",
                        "value": "a"
                    }
                ]
            }
        ]
    };

    var template = {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            }
        }
    };

    var record2 = {
        "leader": ["0", "0", "0", "0", "0", "n", " ", " ", " ", " ", "2", "2", "0", "0", "0", "0", "0", "0", " ", " ", "4", "5", "0", "0"],
        "fields": [
            {
                "name": "001",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "a",
                        "value": "580829379"
                    }
                ]
            }, {
                "name": "002",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "z",
                        "value": ""
                    }
                ]
            }, {
                "name": "003",
                "indicator": ["0", "0"],
                "subfields": [ ]
            }, {
                "name": "042",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "c",
                        "value": ""
                    }
                ]
            }
        ]
    };

    var template2 = {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": false,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "002": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "b": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "z": {
                        "mandatory": true,
                        "repeatable": false
                    }
                }
            },
            "003": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": false,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "z": {
                        "mandatory": false,
                        "repeatable": false
                    }
                }
            },
            "042": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": false,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "z": {
                        "mandatory": false,
                        "repeatable": false
                    }
                }
            }
        }
    };

    var record3 = {
        "leader": ["0", "0", "0", "0", "0", "n", " ", " ", " ", " ", "2", "2", "0", "0", "0", "0", "0", "0", " ", " ", "4", "5", "0", "0"],
        "fields": [
            {
                "name": "001",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "a",
                        "value": "580829379"
                    }, {
                        "name": "b",
                        "value": ""
                    }, {
                        "name": "c",
                        "value": ""
                    }, {
                        "name": "d",
                        "value": ""
                    }, {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "300",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };

    var template3 = {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "settings": {
            "extrafields": ["300a"]
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "300": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": false,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": false,
                        "repeatable": false
                    }
                }
            }
        }
    };

    var record4 = {
        "leader": ["0", "0", "0", "0", "0", "n", " ", " ", " ", " ", "2", "2", "0", "0", "0", "0", "0", "0", " ", " ", "4", "5", "0", "0"],
        "fields": [
            {
                "name": "001",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "a",
                        "value": "580829379"
                    }, {
                        "name": "b",
                        "value": ""
                    }, {
                        "name": "c",
                        "value": ""
                    }, {
                        "name": "d",
                        "value": ""
                    }, {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "300",
                "indicator": ["0", "0"],
                "subfields": [
                    {
                        "name": "b",
                        "value": ""
                    }, {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };

    var template4 = {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "settings": {
            "extrafields": ["300b"]
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "300": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": false,
                "repeatable": false,
                "sorting": "ba",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false
                    }
                }
            }
        }
    };

    var faustProvider = function () {
        return '580829379';
    };
    var templateProvider = function() { return template; };
    Assert.equalValue( "1 BuildRecord test", Builder.buildRecord( templateProvider, faustProvider ), record );
    var templateProvider2 = function() { return template2; };
    Assert.equalValue( "2 BuildRecord test", Builder.buildRecord( templateProvider2, faustProvider ), record2 );
    var templateProvider3 = function() { return template3; };
    Assert.equalValue( "3 BuildRecord test", Builder.buildRecord( templateProvider3, faustProvider ), record3 );
    var templateProvider4 = function() { return template4; };
    Assert.equalValue( "4 BuildRecord test", Builder.buildRecord( templateProvider4, faustProvider ), record4 );
});

UnitTest.addFixture( "Builder.__convertSubfields", function() {
    var template =
    {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "002": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "003": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "004": {
                "url": "",
                "mandatory": true,
                "repeatable": false,
                "subfields": {
                    "r": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "n",
                            "c"
                        ]
                    },
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "e",
                            "h",
                            "s",
                            "b"
                        ]
                    }
                }
            },
            "005": {
                "url": "",
                "mandatory": false,
                "repeatable": false,
                "subfields": {}
            }
        }
    };

    var fieldInput = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var fieldOutput = [
        {
            "name": "b",
            "value": ""
        }, {
            "name": "c",
            "value": ""
        }, {
            "name": "f",
            "value": ""
        }
    ];

    var mandatorySubfieldsObj = {"a": false, "b": true, "c": true, "d": false, "f": true};

    var result = {};
    result["subfields"] = fieldOutput;
    result["mandatorySubfields"] = mandatorySubfieldsObj;
    var faustProvider = function () {
        return '580829379';
    };
    Assert.equalValue( "1 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );
    faustProvider = function() {return undefined;};
    Assert.equalValue( "2 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );

    var fieldInput2= {
        "name": "005",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var result2 = {};
    result2["subfields"] = [];
    result2["mandatorySubfields"] = {};
    Assert.equalValue( "3 __convertSubfields test", Builder.__convertSubfields( template, fieldInput2, faustProvider ), result2 );
});

UnitTest.addFixture( "Builder.__convertSubfields #2 faust tests", function() {
    var template =
    {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "002": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "003": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "004": {
                "url": "",
                "mandatory": true,
                "repeatable": false,
                "subfields": {
                    "r": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "n",
                            "c"
                        ]
                    },
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "e",
                            "h",
                            "s",
                            "b"
                        ]
                    }
                }
            },
            "005": {
                "url": "",
                "mandatory": false,
                "repeatable": false,
                "subfields": {}
            }
        }
    };

    var fieldInput = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var fieldOutput = [
        {
            "name": "b",
            "value": ""
        }, {
            "name": "c",
            "value": ""
        }, {
            "name": "f",
            "value": ""
        }
    ];

    var mandatorySubfieldsObj = {"a": false, "b": true, "c": true, "d": false, "f": true};

    var result = {};
    result["subfields"] = fieldOutput;
    result["mandatorySubfields"] = mandatorySubfieldsObj;
    var faustProvider = function () {
        return '580829379';
    };

    use("Print");


    Assert.equalValue( "1 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );
    faustProvider = function() { return undefined; };
    Assert.equalValue( "2 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );

    var fieldInput2= {
        "name": "005",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var result2 = {};
    result2["subfields"] = [];
    result2["mandatorySubfields"] = {};
    faustProvider = function() { return "58082937"; };
    Assert.equalValue( "3 __convertSubfields test", Builder.__convertSubfields( template, fieldInput2, faustProvider ), result2 );
});

UnitTest.addFixture( "Builder.__buildMissingSubfields", function() {
    var fieldInput = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }
        ]
    };

    var fieldOutput = [
        {
            "name": "a",
            "value": ""
        }, {
            "name": "d",
            "value": ""
        }
    ];

    var fieldInput2 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }
        ]
    };

    var fieldOutput2 = [
        {
            "name": "a",
            "value": "580829379"
        }, {
            "name": "d",
            "value": ""
        }, {
            "name": "f",
            "value": "a"
        }
    ];

    var fieldInput3 = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }
        ]
    };

    var fieldOutput3 = [
        {
            "name": "a",
            "value": ""
        }, {
            "name": "d",
            "value": ""
        }, {
            "name": "f",
            "value": ""
        }
    ];

    var mandatorySubfields = {"a": false, "b": true, "c": true, "d": false, "f": true};
    var mandatorySubfields2 = {"a": false, "b": true, "c": true, "d": false, "f": false};
    var mandatorySubfields3 = {"a": false, "b": true, "c": true, "d": false, "f": false};

    var faustProvider = function (type) {
        return type === 'faust' ? '58082937' : '580829379'
    };
    var faustProviderUndefined = function() { return undefined; };
    var template = {
        "fields": {
            "001": {
                "mandatory": true,
                "repeatable": false,
                "subfields": {
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [ "a" ]
                    }
                }
            },
            "002": {
                "mandatory": true,
                "repeatable": false,
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false
                    }
                }
            }
        }
    };
    Assert.equalValue( "1 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields, fieldInput, faustProvider ), fieldOutput );
    Assert.equalValue( "2 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields2, fieldInput2, faustProvider ), fieldOutput2 );
    Assert.equalValue( "3 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields3, fieldInput3, faustProvider ), fieldOutput3 );
    Assert.equalValue( "4 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields3, fieldInput3, faustProviderUndefined ), fieldOutput3 );
});

UnitTest.addFixture( "Builder.__listeAsObject", function() {
    var listIn = ["001", "002", "003"];
    var objectOut = {"001": true, "002": true, "003": true};

    var listIn2 = [];
    var objectOut2 = {};

    var listIn3 = ["001"];
    var objectOut3 = {"001": true};

    Assert.equalValue( "1 __listeAsObject test", Builder.__listeAsObject( listIn, true ), objectOut );
    Assert.equalValue( "2 __listeAsObject test", Builder.__listeAsObject( listIn2, true ), objectOut2 );
    Assert.equalValue( "3 __listeAsObject test", Builder.__listeAsObject( listIn3, true ), objectOut3 );
    objectOut = {"001": false, "002": false, "003": false};
    Assert.equalValue( "4 __listeAsObject test", Builder.__listeAsObject( listIn, false ), objectOut );
});

UnitTest.addFixture( "Builder.__subfieldsInTemplate", function() {
    var template =
    {
        "defaults": {
            "field": {
                "indicator": "00",
                "mandatory": false,
                "repeatable": true
            },
            "subfield": {
                "mandatory": false,
                "repeatable": true
            }
        },
        "fields": {
            "001": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    },
                    "g": {
                        "mandatory": false,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    },
                    "h": {
                        "mandatory": false,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    },
                    "j": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "002": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "003": {
                "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                "mandatory": true,
                "repeatable": false,
                "sorting": "abcdf",
                "subfields": {
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "rules": [
                            {
                                "type": "SubfieldRules.checkFaust"
                            },
                            {
                                "type": "SubfieldRules.checkLength",
                                "params": {
                                    "min": 8
                                }
                            }
                        ]
                    },
                    "b": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "c": {
                        "mandatory": false,
                        "repeatable": false
                    },
                    "d": {
                        "mandatory": true,
                        "repeatable": false
                    },
                    "f": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "a"
                        ]
                    }
                }
            },
            "004": {
                "url": "",
                "mandatory": true,
                "repeatable": false,
                "subfields": {
                    "r": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "n",
                            "c"
                        ]
                    },
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "e",
                            "h",
                            "s",
                            "b"
                        ]
                    }
                }
            },
            "005": {
                "url": "",
                "mandatory": false,
                "repeatable": false,
                "subfields": {
                    "r": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "n",
                            "c"
                        ]
                    },
                    "a": {
                        "mandatory": true,
                        "repeatable": false,
                        "values": [
                            "e",
                            "h",
                            "s",
                            "b"
                        ]
                    }
                }
            }
        }
    };

    var subfieldsObj = {"a": false, "b": false, "c": false, "d": false, "f": false, "g": false, "h": false, "j": false};

    Assert.equalValue( "1 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "001" ), subfieldsObj );
    Assert.equalValue( "2 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "042" ), {} );
    subfieldsObj = {"r": false, "a": false};
    Assert.equalValue( "3 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "005" ), subfieldsObj );
});

UnitTest.addFixture( "Builder.__isFunction", function() {
    var template = {};
    var templateProvider = function() {return template; };

    Assert.equalValue( "1 __isFunction test", Builder.__isFunction( templateProvider ), true );
    Assert.equalValue( "2 __isFunction test", Builder.__isFunction( template ), false );
    Assert.equalValue( "3 __isFunction test", Builder.__isFunction( undefined ), false );
});

UnitTest.addFixture( "Builder.__isFaustEnabledForTemplate", function() {
    var template = {};
    Assert.equalValue( "1 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": ""};
    Assert.equalValue( "2 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": { "lookupfaust": "false" } };
    Assert.equalValue( "3 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": { "lookupfaust": false } };
    Assert.equalValue( "4 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), false );

    template = { "settings": { "lookupfaust": true } };
    Assert.equalValue( "5 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );
});
