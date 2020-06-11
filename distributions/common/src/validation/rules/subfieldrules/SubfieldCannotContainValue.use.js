use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['SubfieldCannotContainValue'];

var SubfieldCannotContainValue = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * subfieldCannotContainValue checks that if a given subfield does not contain the value from params
     * @syntax SubfieldRules.subfieldCannotContainValue( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object containing a property 'values' with an array of string values that the subfield
     *                 may not contain. The property 'condition' is an Object with properties 'subfield' and 'value'.
     *                 'condition.subfield' is a subfield name like '001b' that will need to contain the value from
     *                 'condition.value' before the subfields value is validated against the property 'values'.
     * @return Array which is either empty or contains an error
     * @name SubfieldRules.subfieldCannotContainValue
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- SubfieldCannotContainValue.validateSubfield");
        ValueCheck.check("params.values", params.values);
        ValueCheck.check("params", params.values).instanceOf(Array);
        try {
            if (params.notcondition !== undefined) {
                ValueCheck.check("params.notcondition", params.notcondition).type("object");
                ValueCheck.check("params.notcondition.subfield", params.notcondition.subfield).type('string');
                ValueCheck.check("params.notcondition.value", params.notcondition.value).type('string');

                var fieldname = params.notcondition.subfield.substr(0, 3);
                var subfieldname = params.notcondition.subfield.substr(3, 1);
                var foundCondition = false;
                for (var i = 0; i < record.fields.length; i++) {
                    if (record.fields[i].name === fieldname) {
                        for (var j = 0; j < record.fields[i].subfields.length; j++) {
                            if (record.fields[i].subfields[j].name === subfieldname &&
                                record.fields[i].subfields[j].value === params.notcondition.value) {
                                foundCondition = true;
                                break;
                            }
                        }
                    }
                }
                if (foundCondition) {
                    return [];
                }
            }

            var ret = [];
            // implicit cast here as we want to check for both strings and ints
            // eg 1 equals '1'
            params.values.forEach(function (value) {
                if (subfield.value == value) {
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    var errorMessage = ResourceBundle.getStringFormat(bundle, "subfield.cannot.contain.value.rule.error", subfield.name, subfield.value);
                    ret.push(ValidateErrors.subfieldError('TODO:fixurl', errorMessage));
                }
            });
            return ret;
        } finally {
            Log.trace("Exit --- SubfieldCannotContainValue.validateSubfield");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
