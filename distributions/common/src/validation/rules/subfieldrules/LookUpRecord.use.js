use("DanMarc2Converter");
use("Log");
use("RawRepoClient");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UpdateConstants");
use("ValidateErrors");

EXPORTED_SYMBOLS = ['LookUpRecord'];

var LookUpRecord = function () {
    var __BUNDLE_NAME = "validation";

    /**
     * validateSubfield
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params Object with the following properties.
     * agencyId : if omitted the value from field 001 subfield b will be used instead.
     * requiredFieldAndSubfield : String containing the field and subfield the record from rawrepo must contain , formatted in the following fashion 004a
     * allowedSubfieldValues : Array containing the allowed values of the subfield
     * an array of groups of agency, requiredFieldAndSubfield, allowedSubfieldValues can be specified with "choice"[] - each is checked for match in field/subfield/content
     * and in such case the specified agencyId is used. When used this way it will not be considered an error if no match in field/subfield/content.
     * Do not mix the two types op specification - won't make any sense.
     * @return Array which is either empty or contains an error
     * @name LookUpRecord
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter - LookUpRecord.validateSubfield()");
        try {
            ValueCheck.check("record", record).type("object");
            ValueCheck.check("field", field).type("object");
            ValueCheck.check("subfield", subfield).type("object");
            ValueCheck.check("params", params).type("object");

            var bundle;
            var recordId = subfield.value;
            var agencyId = "";
            var marc = DanMarc2Converter.convertToDanMarc2(record, params);
            if (params !== undefined) {
                if (Array.isArray(params.agencyId)) {
                    for (var i = 0; i < params.agencyId.length; ++i) {
                        if (__fieldAndSubfieldMandatoryAndHaveValues(marc, params.agencyId[i].fieldAndSubfield, params.agencyId[i].matchValues)) {
                            agencyId = params.agencyId[i].agencyId;
                        }
                    }
                } else {
                    if (typeof params.agencyId === "string") {
                        agencyId = params.agencyId;
                    }
                }
            }


            if (agencyId === "") {
                agencyId = marc.getValue(/001/, /b/);
            }
            var msg;
            if (!ValidationUtil.isNumber(agencyId)) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getString(bundle, "agencyid.not.a.number");
                return [ValidateErrors.subfieldError("TODO:fixurl", msg)];
            }

            if (!RawRepoClientCore.recordExists(recordId, agencyId)) {
                Log.trace("Record does not exist!");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", recordId, agencyId);
                return [ValidateErrors.subfieldError("", msg)];
            }

            if (params.hasOwnProperty("requiredFieldAndSubfield") || params.hasOwnProperty("allowedSubfieldValues")) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                var checkParamsResult = __checkParams(params, bundle);
                if (checkParamsResult.length > 0) {
                    return checkParamsResult;
                }
                if (!__fieldAndSubfieldMandatoryAndHaveValues(RawRepoClient.fetchRecord(recordId, agencyId), params.requiredFieldAndSubfield, params.allowedSubfieldValues)) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.values", recordId, params.allowedSubfieldValues, params.requiredFieldAndSubfield);
                    return [ValidateErrors.subfieldError("", msg)];
                }
            }
            return [];
        } finally {
            Log.trace("Exit - LookUpRecord.validateSubfield()");
        }
    }

    function __fieldAndSubfieldMandatoryAndHaveValues(marcRecord, FieldSubfield, subfieldContent) {
        Log.trace("Enter - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues()");
        try {
            var fieldNrFromParams = FieldSubfield.substring(0, 3);
            var subFieldFromParams = FieldSubfield.substring(3, 4);
            var expAllowedValuesFromParams = new RegExp(subfieldContent.join("|"));
            return marcRecord.matchValue(fieldNrFromParams, subFieldFromParams, expAllowedValuesFromParams);
        } finally {
            Log.trace("Exit - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues");
        }
    }

    function __checkParams(params) {
        Log.trace("Enter - LookUpRecord.__checkParams");
        try {
            var msg;
            var bundle;
            var ret = [];
            if (!params.hasOwnProperty("requiredFieldAndSubfield") && !params.hasOwnProperty("allowedSubfieldValues")) {
                Log.warn("requiredFieldAndSubfield and allowedSubfieldValues is missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.missing.sources.and.demands");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (!params.hasOwnProperty("allowedSubfieldValues")) {
                Log.warn("allowedSubfieldValues is missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.allowedSubfieldValues");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (!params.hasOwnProperty("requiredFieldAndSubfield")) {
                Log.warn("allowedSubfieldValues is missing");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.requiredFieldAndSubfield");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (typeof params.requiredFieldAndSubfield !== "string") {
                Log.warn("requiredFieldAndSubfield has erroneous value");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.requiredFieldAndSubfield.not.string");
                ret.push(ValidateErrors.subfieldError("", msg));
            }
            if (!Array.isArray(params.allowedSubfieldValues)) {
                Log.warn("allowedSubfieldValues is not of type array");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.allowedSubfieldValues.not.array");
                ret.push(ValidateErrors.subfieldError("", msg));
            } else if (Array.isArray(params.allowedSubfieldValues) && params.allowedSubfieldValues.length < 1) {
                Log.warn("allowedSubfieldValues is empty");
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.allowedSubfieldValues.no.items");
                ret.push(ValidateErrors.subfieldError("", msg));
            }
            return ret;
        } finally {
            Log.trace("Exit - LookupRecord.__checkParams()");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
