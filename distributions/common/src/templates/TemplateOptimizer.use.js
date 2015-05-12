//-----------------------------------------------------------------------------
use( "FieldRules" );
use( "MandatorySubfieldInVolumeWorkRule" );
use( "LookUpRecord" );
use( "RecordRules" );
use( "SubfieldMandatoryIfSubfieldNotPresentRule" );
use( "SubfieldRules" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'TemplateOptimizer' ];

//-----------------------------------------------------------------------------
/**
 * Module to optimize a template.
 *
 * @namespace
 * @name TemplateOptimizer
 *
 */
var TemplateOptimizer = function() {
    var VALID_ERROR_TYPES = [
        "WARNING",
        "ERROR"
    ];

    /**
     * Optimizes a template and returns the result.
     *
     * @param {Object} template The template.
     */
    function optimize( template ) {
        var result = {
            fields: {},
            rules: []
        };

        if( template.rules !== undefined ) {
            result.rules = template.rules;
        }

        var mandatoryNames = [];
        var repeatableNames = [];
        for( var name in template.fields ) {
            if( !template.fields.hasOwnProperty( name ) ) {
                continue;
            }

            var field = template.fields[ name ];
            result.fields[ name ] = optimizeField( field, template.defaults.field, template.defaults.subfield );

            var isMandatory = field.mandatory;
            if( isMandatory === undefined ) {
                isMandatory = template.defaults.field.mandatory;
            }
            if( isMandatory === true ) {
                mandatoryNames.push( name );
            }

            var isRepeatable = field.repeatable;
            if( isRepeatable === undefined ) {
                isRepeatable = template.defaults.field.repeatable;
            }
            if( isRepeatable === true ) {
                repeatableNames.push( name );
            }
        }

        if( mandatoryNames.length > 0 ) {
            result.rules.push( {
                type: RecordRules.fieldsMandatory,
                params: {
                    fields: mandatoryNames
                }
            } );
        }

        if( repeatableNames.length > 0 ) {
            result.rules.push( {
                type: RecordRules.repeatableFields,
                params: {
                    fields: repeatableNames
                }
            } );
        }

        result.rules = convertTypeNameOfAllRules( result.rules );
        return result;
    }

    // TODO: JSDoc
    function optimizeField( field, fieldDefs, subfieldDefs ) {
        Log.info( "optimizeField" );

        var result = {
            "url": field.url,
            "rules": field.rules,
            "subfields": {}
        };

        // Setup url.
        if( result.url === undefined ) {
            result.url = fieldDefs.url;
        }

        // Optimize each subfield in field
        var mandatoryNames = [];
        var repeatableNames = [];
        for( var name in field.subfields ) {
            if( !field.subfields.hasOwnProperty( name ) ) {
                continue;
            }

            var sf = field.subfields[ name ];
            result.subfields[ name ] = optimizeSubfield( sf, subfieldDefs );

            if( sf.mandatory === true ) {
                mandatoryNames.push( name );
            }

            if( sf.repeatable === false ) {
                repeatableNames.push( name );
            }
        }

        // Setup predefined rules in field.
        if( result.rules === undefined ) {
            result.rules = fieldDefs.rules;
        }

        // Add rule for mandatory subfields.
        if( result.rules === undefined ) {
            result.rules = [];
        }
        if( mandatoryNames.length > 0 ) {
            result.rules.push( {
                type: FieldRules.subfieldsMandatory,
                params: {
                    subfields: mandatoryNames
                }
            } );
        }

        if( repeatableNames.length > 0 ) {
            result.rules.push( {
                type: FieldRules.repeatableSubfields,
                params: {
                    subfields: repeatableNames
                }
            } );
        }

        Log.info( "Rules: " + uneval( result.rules ) );
        result.rules = convertTypeNameOfAllRules( result.rules );
        Log.info( "Rules (converted): " + uneval( result.rules ) );

        return result;
    }

    /**
     * Optimizes a sub field according to the properties from the defaults spec and in regard
     * to convert the values property to rules.
     *
     * @param {Object} sf   The object from the template that contains the config for a given subfield.
     * @param {Object} defs The defaults structure for subfields.
     *
     * @return {Array} An array of validation rule objects for the subfield. \
     *
     * TODO: Example of json in and out.
     */
    function optimizeSubfield( sf, defs ) {
        Log.trace( "TemplateOptimizer.optimizeSubfield" );
        var values = sf.values;
        var rules = sf.rules;

        if( values === undefined ) {
            values = defs.values;
        }

        if( rules === undefined ) {
            rules = defs.rules;
        }

        if( rules === undefined ) {
            rules = [];
        }

        if( values !== undefined ) {
            var obj = {
                type: SubfieldRules.checkValue,
                params: { values: values }
            };

            rules.push( obj );
        }

        var res = convertTypeNameOfAllRules( rules );
        return res;
    }

    // TODO: JSDoc
    function setTemplatePropertyOnRule( rule, template ) {
        if( rule === undefined ) {
            return;
        }

        if( rule.params === undefined ) {
            rule.params = { template: template };
            return;
        }

        rule.params.template = template;
    }


    //-----------------------------------------------------------------------------
    //              Helpers
    //-----------------------------------------------------------------------------

    /**
     *
     *
     * @param {Array} rules
     *
     * @returns {Array}
     */
    function convertTypeNameOfAllRules( rules ) {
        Log.info( "convertTypeNameOfAllRules" );
        var res = [];

        for( var i = 0; i < rules.length; i++ ) {
            var obj = rules[ i ];

            if( typeof( rules[ i ].type ) === "string" ) {
                obj.type = convertRuleTypeNameToFunction(rules[i].type);

                __checkRule( rules[ i], rules[ i].type );
            }

            res.push( obj );
        }

        return res;
    }

    function convertRuleTypeNameToFunction( typeName ) {
        Log.info( "convertRuleTypeNameToFunction( " + typeName + " )" );
        switch( typeName ) {

            case "RecordRules.fieldsPosition": return RecordRules.fieldsPosition;
            case "RecordRules.idFieldExists": return RecordRules.idFieldExists;
            case "RecordRules.fieldsMandatory": return RecordRules.fieldsMandatory;
            case "RecordRules.repeatableFields": return RecordRules.repeatableFields;
            case "RecordRules.conflictingFields": return RecordRules.conflictingFields;
            case "RecordRules.conflictingSubfields": return RecordRules.conflictingSubfields;
            case "RecordRules.optionalFields": return RecordRules.optionalFields;
            case "RecordRules.allFieldsMandatoryIfOneExist": return RecordRules.allFieldsMandatoryIfOneExist;

            case "FieldRules.fieldsIndicator": return FieldRules.fieldsIndicator;
            case "FieldRules.subfieldsMandatory": return FieldRules.subfieldsMandatory;
            case "FieldRules.subfieldMandatoryIfSubfieldNotPresent": return SubfieldMandatoryIfSubfieldNotPresentRule.validateField;
            case "FieldRules.subfieldConditionalMandatory": return FieldRules.subfieldConditionalMandatory;
            case "FieldRules.subfieldHasValueDemandsOtherSubfield": return FieldRules.subfieldHasValueDemandsOtherSubfield;
            case "FieldRules.repeatableSubfields": return FieldRules.repeatableSubfields;
            case "FieldRules.exclusiveSubfield": return FieldRules.exclusiveSubfield;
            case "FieldRules.mandatorySubfieldInVolumeWork": return MandatorySubfieldInVolumeWorkRule.validateField;
            case "FieldRules.upperCaseCheck": return FieldRules.upperCaseCheck;

            case "SubfieldRules.subfieldsDemandsOtherSubfields": return SubfieldRules.subfieldsDemandsOtherSubfields;
            case "SubfieldRules.checkReference": return SubfieldRules.checkReference;
            case "SubfieldRules.checkLength": return SubfieldRules.checkLength;
            case "SubfieldRules.checkValue": return SubfieldRules.checkValue;
            case "SubfieldRules.checkFaust": return SubfieldRules.checkFaust;
            case "SubfieldRules.checkISBN10": return SubfieldRules.checkISBN10;
            case "SubfieldRules.checkISBN13": return SubfieldRules.checkISBN13;
            case "SubfieldRules.checkChangedValue": return SubfieldRules.checkChangedValue;
            case "SubfieldRules.checkSubfieldNotUsedInParentRecord": return SubfieldRules.checkSubfieldNotUsedInParentRecord;
            case "SubfieldRules.checkSubfieldNotUsedInChildrenRecords": return SubfieldRules.checkSubfieldNotUsedInChildrenRecords;
            case "SubfieldRules.lookupRecord": return LookUpRecord.validateSubfield;
            case "SubfieldRules.lookupValue": return SubfieldRules.lookupValue;

            default:
                throw ( "Valideringsreglen '" + typeName + "' findes ikke." );
        }
    }

    function __checkRule( rule, ruleName ) {
        Log.trace( "Enter - TemplateOptimizer.__validateRule" );

        try {
            if( rule.hasOwnProperty( "errorType" ) && VALID_ERROR_TYPES.indexOf( rule.errorType ) == -1 ) {
                throw StringUtil.sprintf( "Valideringsreglen '%s' anvender fejltypen '%s' som er ukendt. Skal v\u00E6re en af v\u00E6rdierne: '%s'",
                                          ruleName, rule.errorType, VALID_ERROR_TYPES.join( ", " ) );
            }
        }
        finally {
            Log.trace( "Exit - TemplateOptimizer.__validateRule" );
        }
    }

    return {
        'optimize': optimize,
        'optimizeField': optimizeField,
        'optimizeSubfield': optimizeSubfield,
        'setTemplatePropertyOnRule': setTemplatePropertyOnRule
    };
}();

//-----------------------------------------------------------------------------
UnitTest.addFixture( "TemplateOptimizer.optimize", function() {
    var template = {};
    Assert.equalValue( "Empty template", TemplateOptimizer.optimize( template ), { fields: {}, rules: [] } );

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

    var actual = TemplateOptimizer.optimize( template );
    Assert.equalValue( "Template with mandatory/repeatable fields", actual, {
            fields: {
                "001": TemplateOptimizer.optimizeField( template.fields[ "001" ], template.defaults.field, template.defaults.subfield  ),
                "002": TemplateOptimizer.optimizeField( template.fields[ "002" ], template.defaults.field, template.defaults.subfield  )
            },
            rules: [ {
                type: RecordRules.fieldsMandatory,
                params: {
                    fields: [ "001" ]
                }
            },
            {
                type: RecordRules.repeatableFields,
                params: {
                    fields: [ "002" ]
                }
            }
            ]
        } );
    //Assert.equalValue( "Template with mandatory/repeatable fields", actual.rules.length, 2 );

    template.rules = [ {
        type: RecordRules.fieldsMandatory,
        params: {
            fields: [ "001" ]
        }
    } ];
    Assert.equalValue( "Template with extra record rule", TemplateOptimizer.optimize( template ), {
            fields: {
                "001": TemplateOptimizer.optimizeField( template.fields[ "001" ], template.defaults.field, template.defaults.subfield  ),
                "002": TemplateOptimizer.optimizeField( template.fields[ "002" ], template.defaults.field, template.defaults.subfield  )
            },
            rules: [ {
                type: RecordRules.fieldsMandatory,
                params: {
                    fields: [ "001" ]
                }
            },
            {
                type: RecordRules.fieldsMandatory,
                params: {
                    fields: [ "001" ]
                }
            },
            {
                type: RecordRules.repeatableFields,
                params: {
                    fields: [ "002" ]
                }
            }
            ]
        } );
});

UnitTest.addFixture( "TemplateOptimizer.optimizeField", function() {
    var field = {};
    var fdDefs = {};
    var sfDefs = {};

    Assert.equalValue( "TemplateOptimizer.optimizeField 1", TemplateOptimizer.optimizeField( field, fdDefs, sfDefs ), { url: undefined, rules: [], subfields: {} } );

    field = {
        subfields: {
            "a": {},
            "b": {}
        }
    };

    Assert.equalValue( "TemplateOptimizer.optimizeField 2", TemplateOptimizer.optimizeField( field, fdDefs, sfDefs ),
        {
            url: undefined,
            rules: [],
            subfields: {
                "a": TemplateOptimizer.optimizeSubfield( field.subfields[ "a" ], sfDefs ),
                "b": TemplateOptimizer.optimizeSubfield( field.subfields[ "b" ], sfDefs )
            }
        } );

    field = {
        subfields: {
            "a": { repeatable: true },
            "b": { repeatable: true },
            "c": { repeatable: true },
            "d": { repeatable: false }
        }
    };
    Assert.equalValue( "TemplateOptimizer.optimizeField 3", TemplateOptimizer.optimizeField( field, fdDefs, sfDefs ),
        {
            url: undefined,
            rules: [ {
                type: FieldRules.repeatableSubfields,
                params: {
                    subfields: [ "d" ]
                }
            } ],
            subfields: {
                "a": TemplateOptimizer.optimizeSubfield( field.subfields[ "a" ], sfDefs ),
                "b": TemplateOptimizer.optimizeSubfield( field.subfields[ "b" ], sfDefs ),
                "c": TemplateOptimizer.optimizeSubfield( field.subfields[ "c" ], sfDefs ),
                "d": TemplateOptimizer.optimizeSubfield( field.subfields[ "d" ], sfDefs )
            }
        } );

    field = {
        subfields: {
            "a": { mandatory: true, repeatable: true },
            "b": { mandatory: true, repeatable: true },
            "c": { mandatory: false, repeatable: false },
            "d": { mandatory: false, repeatable: false }
        }
    };

    var expectedResult4 = {
        url: undefined,
        rules: [
            {
                type: FieldRules.subfieldsMandatory,
                params: {
                    subfields: [ "a", "b" ]
                }
            },
            {
                type: FieldRules.repeatableSubfields,
                params: {
                    subfields: [ "c", "d" ]
                }
            } ],
        subfields: {
            "a": TemplateOptimizer.optimizeSubfield( field.subfields[ "a" ], sfDefs ),
            "b": TemplateOptimizer.optimizeSubfield( field.subfields[ "b" ], sfDefs ),
            "c": TemplateOptimizer.optimizeSubfield( field.subfields[ "c" ], sfDefs ),
            "d": TemplateOptimizer.optimizeSubfield( field.subfields[ "d" ], sfDefs )
        }
    };
    var actualResult4 = TemplateOptimizer.optimizeField( field, fdDefs, sfDefs );
    Assert.equalValue( "TemplateOptimizer.optimizeField 4 ", actualResult4, expectedResult4 );
} );

UnitTest.addFixture( "TemplateOptimizer.optimizeSubfield", function() {
    var sf = {};
    var defs = {};

    Assert.equalValue( "Empty subfield and empty defs", TemplateOptimizer.optimizeSubfield( sf, defs ), [] );

    sf = {};
    defs = { mandatory: true };
    Assert.equalValue( "Empty subfield and defs with mandatory", TemplateOptimizer.optimizeSubfield( sf, defs ), [] );

    sf = {};
    defs = { repeatable: true };
    Assert.equalValue( "Empty subfield and defs with repeatable", TemplateOptimizer.optimizeSubfield( sf, defs ), [] );

    sf = { mandatory: false };
    defs = { mandatory: true };
    Assert.equalValue( "subfield with mandatory and defs with mandatory", TemplateOptimizer.optimizeSubfield( sf, defs ), [] );

    sf = { repeatable: false };
    defs = { repeatable: true };
    Assert.equalValue( "subfield with repeatable and defs with repeatable", TemplateOptimizer.optimizeSubfield( sf, defs ), [] );

    sf = {};
    defs = { values: [ "a" ] };
    Assert.equalValue( "Empty subfield and defs with values", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                type: SubfieldRules.checkValue,
                params: { values: defs.values }
            }
        ] );

    sf = { values: [ "1", "2" ] };
    defs = { values: [ "a" ] };
    Assert.equalValue( "subfield with values and defs with values", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                type: SubfieldRules.checkValue,
                params: { values: sf.values }
            }
        ] );

    sf = { values: [ "1", "2" ] };
    defs = { rules: [
            {
                type: "SubfieldRules.checkLength",
                params: { min: 1 }
            }
        ] };
    Assert.equalValue( "subfield with values and defs with rules", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                type: SubfieldRules.checkLength,
                params: { min: 1 }
            },
            {
                type: SubfieldRules.checkValue,
                params: { values: sf.values }
            }
        ] );

    sf = { rules: [
            {
                type: "SubfieldRules.checkLength",
                params: { min: 1 }
            }
        ] };
    defs = { values: [ "1", "2" ] };
    Assert.equalValue( "subfield with rules and defs with values", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                type: SubfieldRules.checkLength,
                params: { min: 1 }
            },
            {
                type: SubfieldRules.checkValue,
                params: { values: defs.values }
            }
        ] );

    sf = { rules: [
            {
                type: "SubfieldRules.checkISBN10"
            }
        ] };
    defs = { rules: [
            {
                type: "SubfieldRules.checkLength",
                params: { min: 1 }
            }
        ] };
    Assert.equalValue( "subfield with rules and defs with rules", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                type: SubfieldRules.checkISBN10
            }
        ] );
});


