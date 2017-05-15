use("TemplateOptimizer");
use("UnitTest");


UnitTest.addFixture("TemplateOptimizer.optimize", function () {
    var template = {};
    Assert.equalValue("Empty template", TemplateOptimizer.optimize(template), {fields: {}, rules: []});

    template = {
        defaults: {
            field: {
                mandatory: false,
                repeatable: true
            },
            subfield: {
                mandatory: false,
                repeatable: true
            }
        },
        fields: {
            "001": {
                mandatory: true,
                repeatable: false,
                subfields: {
                    "a": {},
                    "b": {}
                }
            },
            "002": {
                subfields: {
                    "a": {},
                    "b": {}
                }
            }
        },
        rules: []
    };

    var actual = TemplateOptimizer.optimize(template);
    Assert.equalValue("Template with mandatory/repeatable fields", actual, {
        fields: {
            "001": TemplateOptimizer.optimizeField("001", template.fields["001"], template.defaults.field, template.defaults.subfield),
            "002": TemplateOptimizer.optimizeField("002", template.fields["002"], template.defaults.field, template.defaults.subfield)
        },
        rules: [{
            name: "FieldsMandatory.validateRecord",
            type: FieldsMandatory.validateRecord,
            params: {
                fields: ["001"]
            }
        },
            {
                name: "RepeatableFields.validateRecord",
                type: RepeatableFields.validateRecord,
                params: {
                    fields: ["002"]
                }
            }
        ]
    });
    //Assert.equalValue( "Template with mandatory/repeatable fields", actual.rules.length, 2 );

    template.rules = [{
        type: FieldsMandatory.validateRecord,
        params: {
            fields: ["001"]
        }
    }];
    /*
     Assert.equalValue( "Template with extra record rule", TemplateOptimizer.optimize( template ), {
     fields: {
     "001": TemplateOptimizer.optimizeField( "001", template.fields[ "001" ], template.defaults.field, template.defaults.subfield  ),
     "002": TemplateOptimizer.optimizeField( "002", template.fields[ "002" ], template.defaults.field, template.defaults.subfield  )
     },
     rules: [ {
     name: "FieldsMandatory.validateRecord",
     type: FieldsMandatory.validateRecord,
     params: {
     fields: [ "001" ]
     }
     },
     {
     name: "FieldsMandatory.validateRecord",
     type: FieldsMandatory.validateRecord,
     params: {
     fields: [ "001" ]
     }
     },
     {
     name: "FieldsMandatory.validateRecord",
     type: RepeatableFields.validateRecord,
     params: {
     fields: [ "002" ]
     }
     }
     ]
     } );

     */
});

UnitTest.addFixture("TemplateOptimizer.optimizeField", function () {
    var field = {};
    var fdDefs = {};
    var sfDefs = {};

    Assert.equalValue("TemplateOptimizer.optimizeField 1", TemplateOptimizer.optimizeField(field, fdDefs, sfDefs), {
        url: undefined,
        rules: [],
        subfields: {}
    });

    field = {
        subfields: {
            "a": {},
            "b": {}
        }
    };

    Assert.equalValue("TemplateOptimizer.optimizeField 2", TemplateOptimizer.optimizeField("xxx", field, fdDefs, sfDefs),
        {
            url: undefined,
            rules: [],
            subfields: {
                "a": TemplateOptimizer.optimizeSubfield(field.subfields["a"], sfDefs),
                "b": TemplateOptimizer.optimizeSubfield(field.subfields["b"], sfDefs)
            }
        });

    field = {
        subfields: {
            "a": {repeatable: true},
            "b": {repeatable: true},
            "c": {repeatable: true},
            "d": {repeatable: false}
        }
    };
    Assert.equalValue("TemplateOptimizer.optimizeField 3", TemplateOptimizer.optimizeField("xxx", field, fdDefs, sfDefs),
        {
            url: undefined,
            rules: [{
                name: "RepeatableSubfields.validateField",
                type: RepeatableSubfields.validateField,
                params: {
                    subfields: ["d"]
                }
            }],
            subfields: {
                "a": TemplateOptimizer.optimizeSubfield(field.subfields["a"], sfDefs),
                "b": TemplateOptimizer.optimizeSubfield(field.subfields["b"], sfDefs),
                "c": TemplateOptimizer.optimizeSubfield(field.subfields["c"], sfDefs),
                "d": TemplateOptimizer.optimizeSubfield(field.subfields["d"], sfDefs)
            }
        });

    field = {
        subfields: {
            "a": {mandatory: true, repeatable: true},
            "b": {mandatory: true, repeatable: true},
            "c": {mandatory: false, repeatable: false},
            "d": {mandatory: false, repeatable: false}
        }
    };

    var expectedResult4 = {
        url: undefined,
        rules: [
            {
                name: "SubfieldsMandatory.validateField",
                type: SubfieldsMandatory.validateField,
                params: {
                    subfields: ["a", "b"]
                }
            },
            {
                name: "RepeatableSubfields.validateField",
                type: RepeatableSubfields.validateField,
                params: {
                    subfields: ["c", "d"]
                }
            }],
        subfields: {
            "a": TemplateOptimizer.optimizeSubfield(field.subfields["a"], sfDefs),
            "b": TemplateOptimizer.optimizeSubfield(field.subfields["b"], sfDefs),
            "c": TemplateOptimizer.optimizeSubfield(field.subfields["c"], sfDefs),
            "d": TemplateOptimizer.optimizeSubfield(field.subfields["d"], sfDefs)
        }
    };
    var actualResult4 = TemplateOptimizer.optimizeField(field, fdDefs, sfDefs);
    //Assert.equalValue( "TemplateOptimizer.optimizeField 4 ", actualResult4, expectedResult4 );
});

UnitTest.addFixture("TemplateOptimizer.optimizeSubfield", function () {
    var sf = {};
    var defs = {};

    Assert.equalValue("Empty subfield and empty defs", TemplateOptimizer.optimizeSubfield(sf, defs), []);

    sf = {};
    defs = {mandatory: true};
    Assert.equalValue("Empty subfield and defs with mandatory", TemplateOptimizer.optimizeSubfield(sf, defs), []);

    sf = {};
    defs = {repeatable: true};
    Assert.equalValue("Empty subfield and defs with repeatable", TemplateOptimizer.optimizeSubfield(sf, defs), []);

    sf = {mandatory: false};
    defs = {mandatory: true};
    Assert.equalValue("subfield with mandatory and defs with mandatory", TemplateOptimizer.optimizeSubfield(sf, defs), []);

    sf = {repeatable: false};
    defs = {repeatable: true};
    Assert.equalValue("subfield with repeatable and defs with repeatable", TemplateOptimizer.optimizeSubfield(sf, defs), []);

    sf = {};
    defs = {values: ["a"]};
    Assert.equalValue("Empty subfield and defs with values", TemplateOptimizer.optimizeSubfield(sf, defs), [
        {
            name: "CheckValue.validateSubfield",
            type: CheckValue.validateSubfield,
            params: {values: defs.values}
        }
    ]);

    sf = {values: ["1", "2"]};
    defs = {values: ["a"]};
    Assert.equalValue("subfield with values and defs with values", TemplateOptimizer.optimizeSubfield(sf, defs), [
        {
            name: "CheckValue.validateSubfield",
            type: CheckValue.validateSubfield,
            params: {values: sf.values}
        }
    ]);

    sf = {values: ["1", "2"]};
    defs = {
        rules: [
            {
                type: "SubfieldRules.checkLength",
                params: {min: 1}
            }
        ]
    };
    Assert.equalValue("subfield with values and defs with rules", TemplateOptimizer.optimizeSubfield(sf, defs), [
        {
            type: CheckLength.validateSubfield,
            params: {min: 1},
            name: "SubfieldRules.checkLength"
        },
        {
            name: "CheckValue.validateSubfield",
            type: CheckValue.validateSubfield,
            params: {values: sf.values}
        }
    ]);

    sf = {
        rules: [
            {
                type: "SubfieldRules.checkLength",
                params: {min: 1}
            }
        ]
    };
    defs = {values: ["1", "2"]};
    Assert.equalValue("subfield with rules and defs with values", TemplateOptimizer.optimizeSubfield(sf, defs), [
        {
            type: CheckLength.validateSubfield,
            params: {min: 1},
            name: "SubfieldRules.checkLength"
        },
        {
            name: "CheckValue.validateSubfield",
            type: CheckValue.validateSubfield,
            params: {values: defs.values}
        }
    ]);

    sf = {
        rules: [
            {
                type: "SubfieldRules.checkISBN10"
            }
        ]
    };
    defs = {
        rules: [
            {
                type: "SubfieldRules.checkLength",
                params: {min: 1}
            }
        ]
    };
    Assert.equalValue("subfield with rules and defs with rules", TemplateOptimizer.optimizeSubfield(sf, defs), [
        {
            type: CheckISBN10.validateSubfield, name: "SubfieldRules.checkISBN10"
        }
    ]);
});
