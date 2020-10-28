use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");

EXPORTED_SYMBOLS = ['SubfieldsHaveValuesDemandsOtherSubfield'];

var SubfieldsHaveValuesDemandsOtherSubfield = function () {
    var BUNDLE_NAME = "validation";

    /**
     * This function validates the following:
     *
     * IF field x subfield y has one of the values [z, y, w] AND field p subfield q has one of the values [r, s, t]
     * THEN field a subfield b is mandatory
     *
     * @param record
     * @param params
     * @returns {Array}
     */
    function validateRecord(record, params) {
        Log.trace("Enter - SubfieldsHaveValuesDemandsOtherSubfield.validateRecord");
        var result = [];

        try {
            ValueCheck.check("params", params);
            ValueCheck.check("params.demandingFields", params.demandingFields);
            ValueCheck.check("params.demandingFields.isArray", params.demandingFields).instanceOf(Array);
            ValueCheck.check("params.mandatoryFieldName", params.mandatoryFieldName);
            ValueCheck.check("params.mandatorySubfieldName", params.mandatorySubfieldName);
            // Start by checking if the field that might be mandatory exist
            // If it does there is no reason to continue checking
            if (ValidationUtil.recordContainsSubfield(record, params.mandatoryFieldName, params.mandatorySubfieldName)) {
                return [];
            }

            __prepareDemands(params);

            record.fields.forEach(function (recordField) {
                var demandingSubfield = __getDemandingSubfield(params, recordField.name);
                if (demandingSubfield !== null) {
                    recordField.subfields.forEach(function (recordSubfield) {
                        if (recordSubfield.name === demandingSubfield.subfieldName) {
                            if (demandingSubfield.subfieldValues.indexOf(recordSubfield.value) > -1) {
                                demandingSubfield.found = true;
                            }
                        }
                    })
                }
            });

            if (__allDemandsFound(params)) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var errorMessage = ResourceBundle.getStringFormat(bundle, "subfield.mandatory.because.of.other.fields",
                    params.mandatoryFieldName, params.mandatorySubfieldName, __prettyPrintDemands(params));
                result.push(ValidateErrors.fieldError("TODO:url", errorMessage));
            }

            return result;
        } finally {
            Log.trace("Exit - SubfieldsMandatory.validateRecord(): ", result);
        }
    }

    /**
     * Returns the demanding field from params given a field name
     *
     * @param params
     * @param fieldName
     * @returns {*}
     * @private
     */
    function __getDemandingSubfield(params, fieldName) {
        for (var i = 0; i < params.demandingFields.length; i++) {
            var demandingField = params.demandingFields[i];
            if (demandingField.fieldName === fieldName) {
                return demandingField;
            }
        }

        return null;
    }

    /**
     * This function adds 'found' parameter to all demanding fields in params
     *
     * @param params
     * @private
     */
    function __prepareDemands(params) {
        for (var i = 0; i < params.demandingFields.length; i++) {
            var demandingField = params.demandingFields[i];
            demandingField.found = false;
        }
    }

    /**
     * Loops over all demandingFields to see if 'found' is true on all demanding fields
     *
     * @param params
     * @returns {boolean}
     * @private
     */
    function __allDemandsFound(params) {
        for (var i = 0; i < params.demandingFields.length; i++) {
            var demandingField = params.demandingFields[i];
            if (!demandingField.found) {
                return false;
            }
        }

        return true;
    }

    /**
     * This function returns a human readable text with all the demanding fields
     *
     * @param params
     * @returns {string}
     * @private
     */
    function __prettyPrintDemands(params) {
        var result = '';
        var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);

        for (var i = 0; i < params.demandingFields.length; i++) {
            var demandingSubfield = params.demandingFields[i];
            if (result.length > 0) {
                result += ' og ';
            }
            result += ResourceBundle.getStringFormat(bundle, "subfield.mandatory.because.of.other.fields.demands",
                demandingSubfield.fieldName, demandingSubfield.subfieldName, demandingSubfield.subfieldValues);
        }
        return result;
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateRecord': validateRecord
    };

}();