use("Exception");
use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValueCheck");
use("ValidationUtil");
use("ContextUtil");

EXPORTED_SYMBOLS = ['FieldDemandsOtherFieldAndSubfield'];

var FieldDemandsOtherFieldAndSubfield = function () {
    var BUNDLE_NAME = "validation";

    /**
     * Function that checks if a field exists then another field must exists and contain the subfields from params.
     * @syntax FieldDemandsOtherFieldAndSubfield.validateField(  record , params  )
     * @param {Object} record The record as a json.
     * @param {Object} field object
     * @param {Object} params object
     * Param example :
     * params = {
     *     field : '096',
     *     subfields : ['z']
     * }
     * @name FieldDemandsOtherFieldAndSubfield.validateField
     * @return {Array} an array which contains errors if any is present.
     * @method
     */
    function validateField(record, field, params) {
        Log.trace("Enter - FieldDemandsOtherFieldAndSubfield.validateField()");

        var result = [];
        try {
            var bundle;

            ValueCheck.check("record.fields", record.fields).instanceOf(Array);
            ValueCheck.check("params.field", params.field);
            ValueCheck.check("field", field);
            ValueCheck.check("field.name", field.name);
            ValueCheck.check("params.subfields", params.subfields).instanceOf(Array);

            var message = "";
            var context = params.context;

            // There is no reason to execute this validation for the same field multiple times,
            // so if the value is in context then simply return that value
            var contextResult = ContextUtil.getValue(context, 'FieldDemandsOtherFieldAndSubfield', field.name, params.field, params.subfields.join());
            if (contextResult !== undefined) {
                return contextResult;
            }

            var collectedFields = ContextUtil.getValue(context, 'getFields', params.field);
            if (collectedFields === undefined) {
                collectedFields = ValidationUtil.getFields(record, params.field);
                ContextUtil.setValue(context, collectedFields, 'getFields', params.field);
            }

            if (collectedFields.length === 0) {
                bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
                message = ResourceBundle.getStringFormat(bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields);
                result = [ValidateErrors.fieldError("", message)];
                ContextUtil.setValue(context, result, 'FieldDemandsOtherFieldAndSubfield', field.name, params.field, params.subfields.join())
                return result;
            } else {
                for (var i = 0; i < collectedFields.length; ++i) {
                    var collectedSubFields = {};
                    for (var j = 0; j < collectedFields[i].subfields.length; ++j) {
                        collectedSubFields[collectedFields[i].subfields[j].name] = true;
                    }
                    var ct = 0;
                    for (var k = 0; k < params.subfields.length; ++k) {
                        if (collectedSubFields.hasOwnProperty(params.subfields[k])) {
                            ct++;
                        }
                        if (ct === params.subfields.length) {
                            ContextUtil.setValue(context, result, 'FieldDemandsOtherFieldAndSubfield', field.name, params.field, params.subfields.join())
                            return result;
                        }
                    }
                }
            }
            bundle = ResourceBundleFactory.getBundle(BUNDLE_NAME);
            message = ResourceBundle.getStringFormat(bundle, "field.demands.other.field.and.subfield.rule.error", field.name, params.field, params.subfields);
            result = [ValidateErrors.fieldError("", message)]
            ContextUtil.setValue(context, result, 'FieldDemandsOtherFieldAndSubfield', field.name, params.field, params.subfields.join())
            return result;
        }
        finally {
            Log.trace("Exit - FieldDemandsOtherFieldAndSubfield.validateField()");
        }
    }


    return {
        'BUNDLE_NAME': BUNDLE_NAME,
        'validateField': validateField
    };
}();
