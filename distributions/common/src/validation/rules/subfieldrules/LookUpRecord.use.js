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

            Log.info("Params:", params);

            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var recordId = subfield.value;
            var agencyId = "";
            if (params !== undefined) {
                if (Array.isArray(params.agencyId)) {
                    for (var i = 0; i < params.agencyId.length; ++i) {
                        Log.info("Checking " + recordId + ":" + params.agencyId[i].agencyId);
                        if (RawRepoClient.recordExists(recordId, params.agencyId[i].agencyId)) {
                            if (__fieldAndSubfieldMandatoryAndHaveValues(RawRepoClient.fetchRecord(recordId, params.agencyId[i].agencyId), params.agencyId[i].fieldAndSubfield, params.agencyId[i].matchValues)) {
                                agencyId = params.agencyId[i].agencyId;
                                Log.info("0");
                            }
                        }
                    }
                } else {
                    if (typeof params.agencyId === "string") {
                        agencyId = params.agencyId;
                    }
                }
            }

            Log.info("1");

            if (agencyId === "") {
                var marc = DanMarc2Converter.convertToDanMarc2(record);
                agencyId = marc.getValue(/001/, /b/);
            }
            Log.info("2");
            Log.info("recordId: ", recordId);
            Log.info("agencyId: ", agencyId);
            Log.info("3");
            var msg;
            if (!ValidationUtil.isNumber(agencyId)) {
                msg = ResourceBundle.getString(bundle, "agencyid.not.a.number");
                return [ValidateErrors.subfieldError("TODO:fixurl", msg)];
            }
            Log.info("4");
            if (!RawRepoClientCore.recordExists(recordId, agencyId)) {
                Log.trace("Record does not exist!");
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.does.not.exist", recordId, agencyId);
                return [ValidateErrors.subfieldError("", msg)];
            }
            Log.info("5");
            if (params.hasOwnProperty("requiredFieldAndSubfield") || params.hasOwnProperty("allowedSubfieldValues")) {
                var checkParamsResult = __checkParams(params, bundle, record);
                if (checkParamsResult.length > 0) {
                    return checkParamsResult;
                }
                Log.info("6");
                if (!__fieldAndSubfieldMandatoryAndHaveValues(RawRepoClient.fetchRecord(recordId, agencyId), params.requiredFieldAndSubfield, params.allowedSubfieldValues)) {
                    msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.values", recordId, params.allowedSubfieldValues, params.requiredFieldAndSubfield);
                    return [ValidateErrors.subfieldError("", msg)];
                }
                Log.info("7");
            }

            Log.info("8");
            return [];
        } finally {
            Log.trace("Exit - LookUpRecord.validateSubfield()");
        }
    }

    function __fieldAndSubfieldMandatoryAndHaveValues(marcRecord, FieldSubfield, subfieldContent) {
        Log.trace("Enter - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues()");
        try {
            if (marcRecord == null) {
                return false;
            }
            Log.info("0.1");
            var fieldNrFromParams = FieldSubfield.substring(0, 3);
            Log.info(fieldNrFromParams);
            var subFieldFromParams = FieldSubfield.substring(3, 4);
            Log.info(subFieldFromParams);
            var expAllowedValuesFromParams = new RegExp(subfieldContent.join("|"));
            Log.info(expAllowedValuesFromParams);
            return marcRecord.matchValue(fieldNrFromParams, subFieldFromParams, expAllowedValuesFromParams);
        } finally {
            Log.trace("Exit - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues");
        }
    }

    function __checkParams(params, bundle, record) {
        Log.trace("Enter - LookUpRecord.__checkParams");
        try {
            var msg;
            var ret = [];
            if (!params.hasOwnProperty("requiredFieldAndSubfield") && !params.hasOwnProperty("allowedSubfieldValues")) {
                Log.warn("requiredFieldAndSubfield and allowedSubfieldValues is missing");
                msg = ResourceBundle.getStringFormat(bundle, "field.demands.other.fields.missing.sources.and.demands");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (!params.hasOwnProperty("allowedSubfieldValues")) {
                Log.warn("allowedSubfieldValues is missing");
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.allowedSubfieldValues");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (!params.hasOwnProperty("requiredFieldAndSubfield")) {
                Log.warn("allowedSubfieldValues is missing");
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.requiredFieldAndSubfield");
                return [ValidateErrors.subfieldError("", msg)];
            }
            if (typeof params.requiredFieldAndSubfield !== "string") {
                Log.warn("requiredFieldAndSubfield has erroneous value");
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.requiredFieldAndSubfield.not.string");
                ret.push(ValidateErrors.subfieldError("", msg));
            }
            if (!Array.isArray(params.allowedSubfieldValues)) {
                Log.warn("allowedSubfieldValues is not of type array");
                msg = ResourceBundle.getStringFormat(bundle, "lookup.record.missing.value.allowedSubfieldValues.not.array");
                ret.push(ValidateErrors.subfieldError("", msg));
            } else if (Array.isArray(params.allowedSubfieldValues) && params.allowedSubfieldValues.length < 1) {
                Log.warn("allowedSubfieldValues is empty");
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
