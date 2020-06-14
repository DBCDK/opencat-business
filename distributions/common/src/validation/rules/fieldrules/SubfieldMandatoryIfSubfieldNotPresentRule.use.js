use("Log");
use("ValueCheck");
use("ValidateErrors");
use("ValidationUtil");
use("ContextUtil");

EXPORTED_SYMBOLS = ['SubfieldMandatoryIfSubfieldNotPresentRule'];

var SubfieldMandatoryIfSubfieldNotPresentRule = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Makes a subfield mandatory if another subfield is not presented in the field.
     *
     * @syntax SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )
     * @param {object} record The record that contains the field.
     * @param {object} field  The field to validate.
     * @param {object} params Object with two properties: 'subfield' and 'not_presented_subfield'.
     *                        'subfield' is the name of the subfield that should be mandatory.
     *                        Ex. "m". 'not_presented_subfield' is the list og field/subfield that
     *                        should not be presented in the record for 'subfield' to be mandatory.
     *                        The 'not_presented_subfield' list should be formatted as field/subfield, ex.
     *                        ["652m", "666abc", "123z"].
     * @return {Array} Array of validation errors.
     * @example SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )
     * @name SubfieldMandatoryIfSubfieldNotPresentRule.validateField
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter - SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )");
        try {
            Log.trace("Params = " + uneval(params));
            ValueCheck.checkThat("params", params).type("object");
            ValueCheck.check("params.subfield", params['subfield']).type("string");
            ValueCheck.check("params.not_presented_subfield", params['not_presented_subfield']).instanceOf(Array);
            var context = params.context;
            var fieldsFromRecord = ContextUtil.getValue(context, 'getFields', field.name);
            if (fieldsFromRecord === undefined) {
                fieldsFromRecord = ValidationUtil.getFields(record, field.name);
                ContextUtil.setValue(context, fieldsFromRecord, 'getFields', field.name);
            }

            if (__isSubfieldPresentInFields(fieldsFromRecord, params.subfield)) {
                return [];
            }

            params.not_presented_subfield.forEach(function (fieldSubfield) {
                if (fieldSubfield.length < 4) {
                    Log.debug("params.not_presented_subfield is not a field/subfield: ", fieldSubfield, " in param ", params.subfields === undefined ? "params.subfields undefined" : params.subfields);
                    throw StringUtil.sprintf("params.not_presented_subfield is not a field/subfield: %s in param %s", params.not_presented_subfield, params.subfields);
                }
            });

            var foundFieldAndSubfields = __isAnyOfListOfSubfieldsFoundInFieldList(record, params.not_presented_subfield, context);
            var result = [];
            if (!foundFieldAndSubfields) {
                var bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                var errorMessage = ResourceBundle.getStringFormat(bundle, "mandatory.subfields.rule.error", params.subfield, field.name);
                result.push(ValidateErrors.fieldError("TODO:url", errorMessage));
            }
            return result;
        } finally {
            Log.trace("Exit - SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )");
        }
    }

    //Helper function, returns true if the subfield is found in list of fields
    function __isSubfieldPresentInFields(fieldsFromRecord, subfieldName) {
        Log.trace("SubfieldMandatoryIfSubfieldNotPresentRule.__isSubfieldPresentInFields");
        for (var i = 0; i < fieldsFromRecord.length; ++i) {
            if (ValidationUtil.doesFieldContainSubfield(fieldsFromRecord[i], subfieldName)) {
                return true;
            }
        }
        return false;
    }

    // Helper function, returns true if any of the subfields of the format ["001a", "002b"] is present in the record
    function __isAnyOfListOfSubfieldsFoundInFieldList(record, listOfFieldsAndSubfieldsString, context) {
        Log.trace("SubfieldMandatoryIfSubfieldNotPresentRule.__getFieldsFromRecord");
        var listOfFieldsAndSubfieldsStringLength = listOfFieldsAndSubfieldsString.length;
        for (var i = 0; i < listOfFieldsAndSubfieldsStringLength; ++i) {
            var fieldName = listOfFieldsAndSubfieldsString[i].substring(0, 3);
            var subfieldNames = listOfFieldsAndSubfieldsString[i].substring(3);

            var recordFields = ContextUtil.getValue(context, 'getFields', fieldName);
            if (recordFields === undefined) {
                recordFields = ValidationUtil.getFields(record, fieldName);
                ContextUtil.setValue(context, recordFields, 'getFields', fieldName);
            }

            var recordFieldsLength = recordFields.length;
            for (var j = 0; j < recordFieldsLength; ++j) {
                var subfieldNamesLength = subfieldNames.length;
                for (var k = 0; k < subfieldNamesLength; ++k) {
                    if (ValidationUtil.doesFieldContainSubfield(recordFields[j], subfieldNames.substring(k, 1))) {
                        return true
                    }
                }
            }
        }
        return false;
    }

    return {
        '__BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    }
}();
