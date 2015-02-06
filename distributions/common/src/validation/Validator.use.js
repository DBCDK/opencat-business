//-----------------------------------------------------------------------------
use( "ValidateErrors" );
use( "ReadFile" );
use( "TemplateOptimizer" );
use( "Print" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'Validator' ];

//-----------------------------------------------------------------------------
/**
 * Module to optimize a template.
 * 
 * @namespace
 * @name Validator
 * 
 */
var Validator = function() {
    /**
     * Validates an entire record.
     * 
     * @param {Object} record The record that contains the subfield.
     * @param {Object} templateProvider A function that returns the 
     *                 optimized template to use for the validation.
     * 
     * @return {Array} An array of validation errors. 
     */
    function validateRecord( record, templateProvider, settings ) {
        Log.trace( "Enter - Validator.validateRecord()" );

        try {
            Log.info("Record:\n" + JSON.stringify(record, undefined, 4));

            var result = [];
            var template = templateProvider();
            /* Log udkommenteret da denne exception bliver kastet fra andet kald og fremover indtil redeploy.
             * Caused by: org.mozilla.javascript.EcmaError: TypeError: Cyclic {0} value not allowed.
             * (jar:file:/home/thl/glassfish-4.0/glassfish/domains/dbc/applications/validateservice-app-1.0-SNAPSHOT/lib/iscrum-javascript-1.0-SNAPSHOT.jar!/javascript/iscrum/Validator.use.js#35)
             */
            //Log.info( "Template:\n" + JSON.stringify( template, undefined, 4 ) );

            if (record.fields !== undefined) {
                for (var i = 0; i < record.fields.length; i++) {
                    var subResult = validateField(record, record.fields[i], templateProvider, settings);

                    for (var j = 0; j < subResult.length; j++) {
                        Log.info("err: " + uneval(subResult[j]));
                        subResult[j].params.fieldno = i + 1;
                    }
                    result = result.concat(subResult);
                }
            }
            else {
                // TODO: Return error.
            }

            if (template.rules instanceof Array) {
                for (var k = 0; k < template.rules.length; k++) {
                    var rule = template.rules[k];

                    try {
                        Log.info("Run rule " + uneval(rule.type) + " on record");
                        TemplateOptimizer.setTemplatePropertyOnRule(rule, template);

                        var valErrors = rule.type( record, rule.params, settings );
                        valErrors = __updateErrorTypeOnValidationResults( rule, valErrors );
                        result = result.concat( valErrors );
                    }
                    catch( ex ) {
                        throw StringUtil.sprintf( "Ved validering af posten: %s", ex );
                    }
                }
            }
            else {
                // TODO: Return error.
            }

            return result;
        }
        finally {
            Log.trace( "Exit - Validator.validateRecord()" );
        }
    };

    /**
     * Validates a single field in a record.
     * 
     * @param {Object} record The record that contains the subfield.
     * @param {Object} field  The field that contains the subfield.
     * @param {Object} templateProvider A function that returns the 
     *                 optimized template to use for the validation.
     * 
     * @return {Array} An array of validation errors. 
     */
    function validateField( record, field, templateProvider, settings ) {
        Log.trace( "Enter - Validator.validateField()" );

        try {
            var result = [];
            var template = templateProvider();

            var templateField = template.fields[field.name];
            if (templateField === undefined) {
                return [ValidateErrors.fieldError("", "Felt '" + field.name + "' kan ikke anvendes i denne skabelon.")];
            };

            if (field.subfields !== undefined) {
                for (var i = 0; i < field.subfields.length; i++) {
                    var subResult = validateSubfield(record, field, field.subfields[i], templateProvider, settings);

                    for (var j = 0; j < subResult.length; j++) {
                        Log.info("err: " + uneval(subResult[j]));
                        subResult[j].params.subfieldno = i + 1;
                    }
                    result = result.concat(subResult);
                }
            }

            if (templateField.rules instanceof Array) {
                for (var i = 0; i < templateField.rules.length; i++) {
                    var rule = templateField.rules[i];

                    try {
                        Log.info("Run rule " + uneval(rule.type) + " on field " + field.name);
                        TemplateOptimizer.setTemplatePropertyOnRule(rule, template);

                        var valErrors = rule.type(record, field, rule.params, settings );
                        valErrors = __updateErrorTypeOnValidationResults( rule, valErrors );
                        result = result.concat( valErrors );
                    }
                    catch( ex ) {
                        throw StringUtil.sprintf( "Ved validering af felt '%s': %s", field.name, ex );
                    }
                }
            }
            else {
                // TODO: Return error.
            }

            for (var k = 0; k < result.length; k++) {
                result[k].params.url = templateField.url;
            }

            return result;
        }
        finally {
            Log.trace( "Exit - Validator.validateField()" );
        }
    };
         
    /**
     * Validates a single subfield in a record.
     * 
     * @param {Object} record The record that contains the subfield.
     * @param {Object} field  The field that contains the subfield.
     * @param {Object} subfield The subfield itself.
     * @param {Object} templateProvider A function that returns the 
     *                 optimized template to use for the validation.
     * 
     * @return {Array} An array of validation errors.
     */
    function validateSubfield( record, field, subfield, templateProvider, settings ) {
        Log.trace( "Enter - Validator.validateSubfield()" );

        try {
            var result = [];
            var template = templateProvider();

            var templateField = template.fields[field.name];
            if (templateField === undefined) {
                return [ValidateErrors.fieldError("", "Felt '" + field.name + "' kan ikke anvendes i denne skabelon.")];
            }
            ;

            // Skip validation if subfield.name is upper case.
            if (subfield.name !== subfield.name.toLowerCase()) {
                return [];
            }
            var templateSubfield = templateField.subfields[subfield.name];
            if (templateSubfield === undefined) {
                return [ValidateErrors.subfieldError("", "Delfelt '" + subfield.name + "' kan ikke anvendes paa felt '" + field.name + "' i denne skabelon.")];
            }
            ;

            if (templateSubfield instanceof Array) {
                for (var i = 0; i < templateSubfield.length; i++) {
                    var rule = templateSubfield[i];

                    try {
                        Log.info("Run rule " + uneval(rule.type) + " on subfield " + field.name + subfield.name);
                        TemplateOptimizer.setTemplatePropertyOnRule(rule, template);

                        var valErrors = rule.type(record, field, subfield, rule.params, settings );
                        valErrors = __updateErrorTypeOnValidationResults( rule, valErrors );
                        result = result.concat( valErrors );
                    }
                    catch( ex ) {
                        throw StringUtil.sprintf( "Ved validering af delfelt '%s%s': %s", field.name, subfield.name, ex );
                    }
                }
            }
            else {
                // TODO: Return error.
            }

            return result;
        }
        finally {
            Log.trace( "Exit - Validator.validateSubfield()" );
        }
    }

    function __updateErrorTypeOnValidationResults( rule, valErrors ) {
        Log.trace( "Enter - Validator.__updateErrorTypeOnValidationResults" );

        try {
            Log.debug( "rule: ", uneval( rule ) );
            Log.debug( "valErrors: ", uneval( valErrors ) );

            if (rule.hasOwnProperty("errorType")) {
                for (var i = 0; i < valErrors.length; i++) {
                    Log.trace( "Update validation error with type: ", rule.errorType );
                    valErrors[i].type = rule.errorType;
                }
            }

            return valErrors;
        }
        finally {
            Log.trace( "Exit - Validator.__updateErrorTypeOnValidationResults" );
        }
    }

    return {
        'validateRecord': validateRecord,
        'validateField': validateField,
        'validateSubfield': validateSubfield
    };
}();

//-----------------------------------------------------------------------------
// Unittests can be found in ValidatorTest.use.js
