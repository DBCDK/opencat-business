use( "Builder" );
use( "SafeAssert" );
use( "TemplateContainer" );
use( "UnitTest" );

UnitTest.addFixture( "Builder.buildRecord", function() {
    var record = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "58082937"
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
            }
        }
    };

    var record2 = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "58082937"
                    }
                ]
            }, {
                "name": "002",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "z",
                        "value": ""
                    }
                ]
            }, {
                "name": "003",
                "indicator": "00",
                "subfields": []
            }, {
                "name": "042",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "c",
                        "value": ""
                    }
                ]
            }
        ]
    };

    var template2 =
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

    var templateProvider = function() { return template; };
    var faustProvider = function() { return function() { return "58082937"; } };
    SafeAssert.equal( "1 BuildRecord test", Builder.buildRecord( templateProvider, faustProvider ), record );
    var templateProvider2 = function() { return template2; };
    SafeAssert.equal( "2 BuildRecord test", Builder.buildRecord( templateProvider2, faustProvider ), record2 );
});

UnitTest.addFixture( "Builder.convertRecord", function() {
    var record = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "58082937"
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
            },{
                "name": "002",
                "indicator": "00",
                "subfields": []
            },{
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": ""
                    }
                ]
            }
        ]
    };

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
                "sorting": "abc",
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
            }
        }
    };

    var recordResult = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "42"
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
            },{
                "name": "002",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    },{
                        "name": "b",
                        "value": ""
                    },{
                        "name": "c",
                        "value": ""
                    }
                ]
            },{
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": ""
                    },{
                        "name": "a",
                        "value": ""
                    }
                ]
            },{
                "name": "005",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": ""
                    },{
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };

    var record2 = {
        "fields": [
            {
                "name": "001"
            },{
                "name": "002"
            },{
                "name": "004"
            }
        ]
    };

    var templateProvider = function() { return template; };
    var faustProvider = function() { return function() { return "42"; } };
    SafeAssert.equal( "1 convertRecord test", Builder.convertRecord( templateProvider, record, faustProvider ), recordResult );
    SafeAssert.equal( "2 convertRecord test", Builder.convertRecord( templateProvider, record2, faustProvider ), recordResult );
});

UnitTest.addFixture( "Builder.__buildField", function() {
    var field001 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
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

    };

    var field004 = {
        "name": "004",
        "indicator": "00",
        "subfields": [
            {
                "name": "r",
                "value": ""
            }, {
                "name": "a",
                "value": ""
            }
        ]
    };

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
            }
        }
    };

    var faustProvider = function() { return function() { return "58082937"; } };
    SafeAssert.equal( "1 buildField test", Builder.__buildField( template, "001", faustProvider ), field001 );
    SafeAssert.equal( "2 buildField test", Builder.__buildField( template, "004", faustProvider ), field004 );
});

UnitTest.addFixture( "Builder.__buildSubfield", function() {
    var subfielda1 = {
        "name": "a",
        "value": "58082937"
    };
    var subfielda2 = {
        "name": "a",
        "value": ""
    };
    var subfieldb = {
        "name": "b",
        "value": ""
    };
    var subfieldf = {
        "name": "f",
        "value": "a"
    };

    var faustProvider = function() { return function() { return "58082937"; } };
    var template = {};
    SafeAssert.equal( "1 buildSubfield test", Builder.__buildSubfield( template, "a", "001", faustProvider ), subfielda1 );
    SafeAssert.equal( "2 buildSubfield test", Builder.__buildSubfield( template, "a", "002", faustProvider ), subfielda2 );
    SafeAssert.equal( "3 buildSubfield test", Builder.__buildSubfield( template, "b", "001", faustProvider ), subfieldb );
    SafeAssert.equal( "4 buildSubfield test", Builder.__buildSubfield( template, "f", "001", faustProvider ), subfieldf );
});

UnitTest.addFixture( "Builder.__getMandatoryFieldsFromUnoptimizedTemplate", function() {
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
            }
        }
    };
    SafeAssert.equal( "1 __getMandatoryFieldsFromUnoptimizedTemplate test", Builder.__getMandatoryFieldsFromUnoptimizedTemplate( template ), ["001", "004"] );
});

UnitTest.addFixture( "Builder.__getMandatorySubfieldsFromUnoptimizedTemplate", function() {
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
            }
        }
    };

    SafeAssert.equal( "1 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "001"), ["a", "b", "c", "d", "f"] );
    SafeAssert.equal( "2 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "004" ), ["r", "a"] );
    SafeAssert.equal( "3 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "042" ), [] );
});

UnitTest.addFixture( "Builder.__sortRecord", function() {
    var record = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };
    var recordSorted = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    }, {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": []
            }
        ]
    };
    var record2 = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "ø",
                        "value": ""
                    }, {
                        "name": "z",
                        "value": ""
                    }, {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "æ",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };
    var record2Sorted = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "ø",
                        "value": ""
                    }, {
                        "name": "z",
                        "value": ""
                    }, {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "æ",
                        "value": ""
                    }
                ]
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };

    SafeAssert.equal( "1 __sortRecord test", Builder.__sortRecord( record ), recordSorted );
    SafeAssert.equal( "2 __sortRecord test", Builder.__sortRecord( recordSorted ), recordSorted );
    SafeAssert.equal( "3 __sortRecord test", Builder.__sortRecord( record2 ), record2Sorted );
    SafeAssert.equal( "4 __sortRecord test", Builder.__sortRecord( record2Sorted ), record2Sorted );
});

UnitTest.addFixture( "Builder.__convertField", function() {
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
            }
        }
    };
    var fieldInput = {
        "name": "001",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
            }, {
                "name": "f",
                "value": "a"
            }
        ]
    };
    var fieldOutput = {
        "name": "001",
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
                "value": "a"
            }, {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "d",
                "value": ""
            }
        ]
    };
    var fieldInput2 = {
        "name": "001"
    };
    var fieldOutput2 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
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
    };

    var fieldInput3 = {
        "name": "004"
    };
    var fieldOutput3 = {
        "name": "004",
        "indicator": "00",
        "subfields": [
            {
                "name": "r",
                "value": ""
            }, {
                "name": "a",
                "value": ""
            }
        ]
    };
    var faustProvider = function() { return function() { return "58082937"; } };
    SafeAssert.equal( "1 __convertField test", Builder.__convertField( template, fieldInput, faustProvider ), fieldOutput );
    SafeAssert.equal( "2 __convertField test", Builder.__convertField( template, fieldInput2, faustProvider ), fieldOutput2 );
    SafeAssert.equal( "3 __convertField test", Builder.__convertField( template, fieldInput3, faustProvider ), fieldOutput3 );
    faustProvider = function() {return undefined;};
    SafeAssert.equal( "4 __convertField test", Builder.__convertField( template, fieldInput3, faustProvider ), fieldOutput3 );
});

UnitTest.addFixture( "Builder.__verifyIndicator", function() {
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
            }
        }
    };
    var templateWithoutIndicator =
    {
        "defaults": {
            "field": {
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
            }
        }
    };

    var field = {
        "name": "001",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
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
    };
    var fieldWithIndicator = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
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
    };

    SafeAssert.equal( "1 __verifyIndicator test", Builder.__verifyIndicator( template, field ), fieldWithIndicator );
    SafeAssert.equal( "2 __verifyIndicator test", Builder.__verifyIndicator( templateWithoutIndicator, field ), fieldWithIndicator );
});

UnitTest.addFixture( "Builder.__getIndicatorFromUnoptimizedTemplate", function() {
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
            }
        }
    };
    var templateWithoutIndicator =
    {
        "defaults": {
            "field": {
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
            }
        }
    };

    SafeAssert.equal( "1 __getIndicatorFromUnoptimizedTemplate test", Builder.__getIndicatorFromUnoptimizedTemplate( template ), "00" );
    SafeAssert.equal( "2 __getIndicatorFromUnoptimizedTemplate test", Builder.__getIndicatorFromUnoptimizedTemplate( templateWithoutIndicator ), "00" );
});

UnitTest.addFixture( "Builder.__buildMissingFields", function() {
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

    var missingFields = [
        {
            "name": "002",
            "indicator": "00",
            "subfields": [
                {
                    "name": "a",
                    "value": ""
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
                    "value": ""
                }
            ]
        }, {
            "name": "003",
            "indicator": "00",
            "subfields": [
                {
                    "name": "a",
                    "value": ""
                }, {
                    "name": "b",
                    "value": ""
                }, {
                    "name": "d",
                    "value": ""
                }, {
                    "name": "f",
                    "value": ""
                }
            ]
        }
    ];

    var faustProvider = function() { return function() { return "58082937"; } };
    var mandatoryFields = {"001": true, "002": false, "003": false, "004": true};
    SafeAssert.equal( "1 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), missingFields );
    mandatoryFields = {"001": true, "002": true, "003": true, "004": true};
    SafeAssert.equal( "2 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), [] );
    mandatoryFields = {};
    SafeAssert.equal( "3 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), [] );
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
    var faustProvider = function() { return function() { return "58082937"; } };
    SafeAssert.equal( "1 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );
    faustProvider = function() {return undefined;};
    SafeAssert.equal( "2 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );

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
    SafeAssert.equal( "3 __convertSubfields test", Builder.__convertSubfields( template, fieldInput2, faustProvider ), result2 );
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
    var faustProvider = function() { return function() { return "58082937"; } };

    use("Print");


    SafeAssert.equal( "1 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );
    faustProvider = function() {return function() { return undefined; } };
    SafeAssert.equal( "2 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );

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
    faustProvider = function() { return function() { return "58082937"; } };
    SafeAssert.equal( "3 __convertSubfields test", Builder.__convertSubfields( template, fieldInput2, faustProvider ), result2 );
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
            "value": "58082937"
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

    var faustProvider = function() { return function() { return "58082937"; } };
    var faustProviderUndefined = function() { return function() { return undefined; } };
    var template = {};

    SafeAssert.equal( "1 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields, fieldInput, faustProvider ), fieldOutput );
    SafeAssert.equal( "2 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields2, fieldInput2, faustProvider ), fieldOutput2 );
    SafeAssert.equal( "3 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields3, fieldInput3, faustProvider ), fieldOutput3 );
    SafeAssert.equal( "4 __buildMissingSubfields test", Builder.__buildMissingSubfields( template, mandatorySubfields3, fieldInput3, faustProviderUndefined ), fieldOutput3 );
});

UnitTest.addFixture( "Builder.__listeAsObject", function() {
    var listIn = ["001", "002", "003"];
    var objectOut = {"001": true, "002": true, "003": true};

    var listIn2 = [];
    var objectOut2 = {};

    var listIn3 = ["001"];
    var objectOut3 = {"001": true};

    SafeAssert.equal( "1 __listeAsObject test", Builder.__listeAsObject( listIn, true ), objectOut );
    SafeAssert.equal( "2 __listeAsObject test", Builder.__listeAsObject( listIn2, true ), objectOut2 );
    SafeAssert.equal( "3 __listeAsObject test", Builder.__listeAsObject( listIn3, true ), objectOut3 );
    objectOut = {"001": false, "002": false, "003": false};
    SafeAssert.equal( "4 __listeAsObject test", Builder.__listeAsObject( listIn, false ), objectOut );
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

    SafeAssert.equal( "1 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "001" ), subfieldsObj );
    SafeAssert.equal( "2 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "042" ), {} );
    subfieldsObj = {"r": false, "a": false};
    SafeAssert.equal( "3 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "005" ), subfieldsObj );
});

UnitTest.addFixture( "Builder.__isFunction", function() {
    var template = {};
    var templateProvider = function() {return template; };

    SafeAssert.equal( "1 __isFunction test", Builder.__isFunction( templateProvider ), true );
    SafeAssert.equal( "2 __isFunction test", Builder.__isFunction( template ), false );
    SafeAssert.equal( "3 __isFunction test", Builder.__isFunction( undefined ), false );
});

UnitTest.addFixture( "Builder.__isFaustEnabledForTemplate", function() {
    var template = {};
    SafeAssert.equal( "1 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": ""};
    SafeAssert.equal( "2 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": { "lookupfaust": "false" } };
    SafeAssert.equal( "3 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );

    template = { "settings": { "lookupfaust": false } };
    SafeAssert.equal( "4 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), false );

    template = { "settings": { "lookupfaust": true } };
    SafeAssert.equal( "5 __isFaustEnabledForTemplate" , Builder.__isFaustEnabledForTemplate( template ), true );
});
