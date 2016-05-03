//-----------------------------------------------------------------------------
//use
//-----------------------------------------------------------------------------
use( "StopWatch" );
use( "UnitTest" );

//subfield rules
use("CheckSubfieldNotUsedInChildrenRecords");
use("LookupValue");
use("SubfieldMandatoryIfSubfieldNotPresentRule");
use("CheckISMN");
use("CheckISSN");
use("CheckISBN10");
use("CheckISBN13");
use("LookUpRecord");
use("CheckValue");
use("MandatorySubfieldInVolumeWorkRule");
use("CheckLength");
use("CheckFaust");
use("SubfieldConditionalMandatoryField");
use("CheckChangedValue");
use("SubfieldCannotContainValue");
use("SubfieldsDemandsOtherSubfields");
use("CheckSubfieldNotUsedInParentRecord");
use("CheckReference");

//field rules
use("FieldDemandsOtherFieldAndSubfield");
use("SubfieldConditionalMandatory");
use("UpperCaseCheck");
use("RepeatableSubfields");
use("ExclusiveSubfield");
use("SubfieldHasValueDemandsOtherSubfield");
use("FieldsIndicator");
use("SubfieldsMandatory");

//record rules
use("OptionalFields");
use("ConflictingFields");
use("RecordSorted");
use("RepeatableFields");
use("IdFieldExists");
use("ConflictingSubfields");
use("FieldDemandsOtherFields");
use("AllFieldsMandatoryIfOneExist");
use("FieldsMandatory");

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
    var __BUNDLE_NAME = "templates";

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
        Log.trace( "Enter -- TemplateOptimizer.optimize()" );
        var watchFunc = new StopWatch( "TemplateOptimizer.optimize" );

        var result = {
            fields: {},
            rules: []
        };

        try {
            if (template.rules !== undefined) {
                result.rules = template.rules;
            }

            var mandatoryNames = [];
            var repeatableNames = [];
            for (var name in template.fields) {
                if (!template.fields.hasOwnProperty(name)) {
                    continue;
                }

                var field = template.fields[name];
                result.fields[name] = optimizeField( name, field, template.defaults.field, template.defaults.subfield);

                var isMandatory = field.mandatory;
                if (isMandatory === undefined) {
                    isMandatory = template.defaults.field.mandatory;
                }
                if (isMandatory === true) {
                    mandatoryNames.push(name);
                    Log.debug("Adding mandatory name '", name, "'. New mandatoryNames: ", JSON.stringify(mandatoryNames) );
                }

                var isRepeatable = field.repeatable;
                if (isRepeatable === undefined) {
                    isRepeatable = template.defaults.field.repeatable;
                }
                if (isRepeatable === true) {
                    repeatableNames.push(name);
                }
            }

            if (mandatoryNames.length > 0) {
                mandatoryNames.sort();

                Log.debug("mandatoryNames: ", JSON.stringify(mandatoryNames));
                result.rules.push({
                    name: "FieldsMandatory.validateRecord",
                    type: FieldsMandatory.validateRecord,
                    params: {
                        fields: mandatoryNames
                    }
                });
            }

            if (repeatableNames.length > 0) {
                repeatableNames.sort();
                result.rules.push({
                    name: "RepeatableFields.validateRecord",
                    type: RepeatableFields.validateRecord,
                    params: {
                        fields: repeatableNames
                    }
                });
            }

            result.rules = convertTypeNameOfAllRules(result.rules);
            return result;
        }
        finally {
            watchFunc.stop();
            Log.trace( "Exit -- TemplateOptimizer.optimize(): ", result );
        }
    }

    // TODO: JSDoc
    function optimizeField( fieldName, field, fieldDefs, subfieldDefs ) {
        Log.trace( "Enter -- TemplateOptimizer.optimizeField()" );
        var watchFunc = new StopWatch( "TemplateOptimizer.optimizeField" );

        var result = undefined;
        try {
            result = {
                "url": field.url,
                "rules": field.rules,
                "subfields": {}
            };

            // Setup url.
            if (result.url === undefined) {
                result.url = fieldDefs.url;
            }

            // Optimize each subfield in field
            var mandatoryNames = [];
            var repeatableNames = [];
            for (var name in field.subfields) {
                if (!field.subfields.hasOwnProperty(name)) {
                    continue;
                }

                var sf = field.subfields[name];
                Log.debug("Optimize subfield(", fieldName, " *", name, "): " );
                result.subfields[name] = optimizeSubfield(sf, subfieldDefs);
                Log.debug("Subfield rules (", fieldName, " *", name, "): " + __formatRuleNames( result.subfields[name].rules ) );

                if (sf.mandatory === true) {
                    Log.debug("Push mandatory");
                    mandatoryNames.push(name);
                }

                if (sf.repeatable === false) {
                    Log.debug("Push repeatable");
                    repeatableNames.push(name);
                }
                Log.debug("Loop for");
            }

            // Setup predefined rules in field.
            if (result.rules === undefined) {
                result.rules = fieldDefs.rules;
            }

            // Add rule for mandatory subfields.
            if (result.rules === undefined) {
                result.rules = [];
            }
            if (mandatoryNames.length > 0) {
                result.rules.push({
                    name: "SubfieldsMandatory.validateField",
                    type: SubfieldsMandatory.validateField,
                    params: {
                        subfields: mandatoryNames
                    }
                });
            }

            if (repeatableNames.length > 0) {
                result.rules.push({
                    name: "RepeatableSubfields.validateField",
                    type: RepeatableSubfields.validateField,
                    params: {
                        subfields: repeatableNames
                    }
                });
            }

            result.rules = convertTypeNameOfAllRules(result.rules);

            Log.info("Field rules (", fieldName, "): " + __formatRuleNames( result.rules ) );

            return result;
        }
        finally {
            watchFunc.stop();
            Log.trace( "Exit -- TemplateOptimizer.optimizeField(): ", result );
        }
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
        Log.trace( "Enter -- TemplateOptimizer.optimizeSubfield()" );
        var watchFunc = new StopWatch( "TemplateOptimizer.optimizeSubfield" );

        var result = undefined;
        try {
            var values = sf.values;
            var rules = sf.rules;

            if (values === undefined) {
                values = defs.values;
            }

            if (rules === undefined) {
                rules = defs.rules;
            }

            if (rules === undefined) {
                rules = [];
            }

            if (values !== undefined) {
                var obj = {
                    name: "CheckValue.validateSubfield",
                    type: CheckValue.validateSubfield,
                    params: {values: values}
                };

                rules.push(obj);
            }

            result = convertTypeNameOfAllRules(rules);

            Log.debug( "  rules: ", __formatRuleNames( rules ) );
            return result;
        }
        finally {
            watchFunc.stop();
            Log.trace( "Exit -- TemplateOptimizer.optimizeSubfield()" );
        }
    }

    // TODO: JSDoc
    function setTemplatePropertyOnRule( rule, template ) {
        Log.trace( "Enter -- TemplateOptimizer.setTemplatePropertyOnRule()" );

        try {
            if (rule === undefined) {
                return;
            }

            if (rule.params === undefined) {
                rule.params = {template: template};
                return;
            }

            rule.params.template = template;
        }
        finally {
            Log.trace( "Exit -- TemplateOptimizer.setTemplatePropertyOnRule(): ", rule );
        }
    }


    //-----------------------------------------------------------------------------
    //              Helpers
    //-----------------------------------------------------------------------------

    function __formatRuleNames( rules ) {
        var names = [];

        if( rules !== undefined ) {
            for (var i = 0; i < rules.length; i++) {
                names.push(rules[i].name);
            }
        }

        return names.join(",");
    }
    /**
     *
     *
     * @param {Array} rules
     *
     * @returns {Array}
     */
    function convertTypeNameOfAllRules( rules ) {
        Log.trace( "Enter -- TemplateOptimizer.convertTypeNameOfAllRules()" );

        var res = [];
        try {
            for (var i = 0; i < rules.length; i++) {
                var obj = rules[i];
                if (typeof( rules[i].type ) === "string") {
                    obj.name = rules[i].type;
                    obj.type = convertRuleTypeNameToFunction(rules[i].type);

                    __checkRule(rules[i], rules[i].type);
                    Log.debug( "Converted rule name: ", obj.name );
                }

                res.push(obj);
            }

            return res;
        }
        finally {
            Log.trace( "Exit -- TemplateOptimizer.convertTypeNameOfAllRules(): ", res );
        }
    }

    function convertRuleTypeNameToFunction( typeName ) {
        Log.trace( "Enter -- TemplateOptimizer.convertRuleTypeNameToFunction( " + typeName + " )" );

        try {
            switch (typeName) {
                case "RecordRules.fieldsPosition":
                    return FieldsPosition.validateRecord;
                case "RecordRules.idFieldExists":
                    return IdFieldExists.validateRecord;
                case "RecordRules.fieldsMandatory":
                    return FieldsMandatory.validateRecord;
                case "RecordRules.repeatableFields":
                    return RepeatableFields.validateRecord;
                case "RecordRules.conflictingFields":
                    return ConflictingFields.validateRecord;
                case "RecordRules.conflictingSubfields":
                    return ConflictingSubfields.validateRecord;
                case "RecordRules.optionalFields":
                    return OptionalFieldsvalidateRecord.validateRecord;
                case "RecordRules.allFieldsMandatoryIfOneExist":
                    return AllFieldsMandatoryIfOneExist.validateRecord;
                case "RecordRules.fieldDemandsOtherFields":
                    return FieldDemandsOtherFields.validateRecord;

                case "FieldRules.fieldsIndicator":
                    return FieldsIndicator.validateField;
                case "FieldRules.subfieldsMandatory":
                    return SubfieldsMandatory.validateField;
                case "FieldRules.subfieldMandatoryIfSubfieldNotPresent":
                    return SubfieldMandatoryIfSubfieldNotPresentRule.validateField;
                case "FieldRules.subfieldConditionalMandatory":
                    return SubfieldConditionalMandatory.validateField;
                case "FieldRules.subfieldHasValueDemandsOtherSubfield":
                    return SubfieldHasValueDemandsOtherSubfield.validateField;
                case "FieldRules.repeatableSubfields":
                    return RepeatableSubfields.validateField;
                case "FieldRules.exclusiveSubfield":
                    return ExclusiveSubfield.validateField;
                case "FieldRules.mandatorySubfieldInVolumeWork":
                    return MandatorySubfieldInVolumeWorkRule.validateField;
                case "FieldRules.upperCaseCheck":
                    return UpperCaseCheck.validateField;

                case "SubfieldRules.subfieldCannotContainValue":
                    return SubfieldCannotContainValue.validateSubfield;
                case "SubfieldRules.subfieldsDemandsOtherSubfields":
                    return SubfieldsDemandsOtherSubfields.validateSubfield;
                case "SubfieldRules.checkReference":
                    return CheckReference.validateSubfield;
                case "SubfieldRules.checkLength":
                    return CheckLength.validateSubfield;
                case "SubfieldRules.checkValue":
                    return CheckValue.validateSubfield;
                case "SubfieldRules.checkFaust":
                    return CheckFaust.validateSubfield;
                //case "SubfieldRules.checkFaust": return CheckFaust.validateSubfield;
                case "SubfieldRules.checkISMN":
                    return CheckISMN.validateSubfield;
                case "SubfieldRules.checkISSN":
                    return CheckISSN.validateSubfield;
                case "SubfieldRules.checkISBN10":
                    return CheckISBN10.validateSubfield;
                case "SubfieldRules.checkISBN13":
                    return CheckISBN13.validateSubfield;
                case "SubfieldRules.checkChangedValue":
                    return CheckChangedValue.validateSubfield;
                case "SubfieldRules.checkSubfieldNotUsedInParentRecord":
                    return CheckSubfieldNotUsedInParentRecord.validateSubfield;
                case "SubfieldRules.checkSubfieldNotUsedInChildrenRecords":
                    return CheckSubfieldNotUsedInChildrenRecords.validateSubfield;
                case "SubfieldRules.lookupRecord":
                    return LookUpRecord.validateSubfield;
                case "SubfieldRules.lookupValue":
                    return LookUpValue.validateSubfield;

                default:
                {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);

                    throw ResourceBundle.getStringFormat(bundle, "validation.rule.unknown", typeName);
                }
            }
        }
        catch( ex ) {
            Log.warn( "Unable to find validation function for typename '", typeName, "': ", ex );
        }
        finally {
            Log.trace( "Exit -- TemplateOptimizer.convertRuleTypeNameToFunction()" );
        }
    }

    function __checkRule( rule, ruleName ) {
        Log.trace( "Enter -- TemplateOptimizer.__checkRule()" );

        try {
            if( rule.hasOwnProperty( "errorType" ) && VALID_ERROR_TYPES.indexOf( rule.errorType ) == -1 ) {
                var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

                throw ResourceBundle.getStringFormat( bundle, "invalid.validation.error.type", ruleName, rule.errorType, VALID_ERROR_TYPES.join( ", " ) );
            }
        }
        finally {
            Log.trace( "Exit -- TemplateOptimizer.__checkRule()" );
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
                name: "RepeatableFields.validateRecord",
                type: RepeatableFields.validateRecord,
                params: {
                    fields: [ "002" ]
                }
            }
            ]
        } );
    //Assert.equalValue( "Template with mandatory/repeatable fields", actual.rules.length, 2 );

    template.rules = [ {
        type: FieldsMandatory.validateRecord,
        params: {
            fields: [ "001" ]
        }
    } ];
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

    Assert.equalValue( "TemplateOptimizer.optimizeField 2", TemplateOptimizer.optimizeField( "xxx", field, fdDefs, sfDefs ),
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
    Assert.equalValue( "TemplateOptimizer.optimizeField 3", TemplateOptimizer.optimizeField( "xxx", field, fdDefs, sfDefs ),
        {
            url: undefined,
            rules: [ {
                name: "RepeatableSubfields.validateField",
                type: RepeatableSubfields.validateField,
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
                name: "SubfieldsMandatory.validateField",
                type: SubfieldsMandatory.validateField,
                params: {
                    subfields: [ "a", "b" ]
                }
            },
            {
                name: "RepeatableSubfields.validateField",
                type: RepeatableSubfields.validateField,
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
    //Assert.equalValue( "TemplateOptimizer.optimizeField 4 ", actualResult4, expectedResult4 );
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
                name: "CheckValue.validateSubfield",
                type: CheckValue.validateSubfield,
                params: { values: defs.values }
            }
        ] );

    sf = { values: [ "1", "2" ] };
    defs = { values: [ "a" ] };
    Assert.equalValue( "subfield with values and defs with values", TemplateOptimizer.optimizeSubfield( sf, defs ), [
            {
                name: "CheckValue.validateSubfield",
                type: CheckValue.validateSubfield,
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
                type: CheckLength.validateSubfield,
                params: { min: 1 },
                name: "SubfieldRules.checkLength"
            },
            {
                name: "CheckValue.validateSubfield",
                type: CheckValue.validateSubfield,
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
                type: CheckLength.validateSubfield,
                params: { min: 1 },
                name: "SubfieldRules.checkLength"
            },
            {
                name: "CheckValue.validateSubfield",
                type: CheckValue.validateSubfield,
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
                type: CheckISBN10.validateSubfield, name:"SubfieldRules.checkISBN10"
            }
        ] );
});
