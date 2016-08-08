use("DanMarc2Converter");
use("Marc");
use("MarcClasses");
use("Log");

EXPORTED_SYMBOLS = ['ClassificationData'];

var ClassificationData = function () {
    function create(fieldsRegExp) {
        return {
            fields: fieldsRegExp
        }
    }

    function hasClassificationData(instance, marc) {
        Log.debug("Enter - ClassificationData.hasClassificationData()");

        var result = null;
        try {
            Log.debug("Fields: " + instance.fields);
            Log.debug("Record: " + marc);

            return result = marc.existField(instance.fields);
        }
        finally {
            Log.debug("Exit - ClassificationData.hasClassificationData(): " + result);
        }
    }

    function hasClassificationsChanged(instance, oldMarc, newMarc) {
        Log.debug("Enter - ClassificationData.hasClassificationsChanged()");

        var result = false;
        var reason = undefined;
        try {
            Log.debug("    oldMarc: " + oldMarc);
            Log.debug("    newMarc: " + newMarc);

            // TODO move to posttypeskift
            if (instance.fields.test("008")) {
                if (__hasSubfieldChangedMatcher(oldMarc, newMarc, /008/, /t/, /m|s/, /p/)) {
                    reason = "008t m|s -> p";
                    return result = true;
                } else if (__hasSubfieldChangedMatcher(oldMarc, newMarc, /008/, /t/, /p/, /m|s/)) {
                    reason = "008t p -> m|s";
                    return result = true;
                }
            }

            if (instance.fields.test("009")) {
                if (__different009AG(oldMarc, newMarc)) {
                    reason = "009a or g";
                    return result = true
                }
            }
            // TODO move to posttypeskift END

            if (instance.fields.test("038") || instance.fields.test("039")) {
                var selectFields = /038|039/;
                if (__hasRecordChanged(__createSubRecord(oldMarc, selectFields),
                        __createSubRecord(newMarc, selectFields), __value)) {
                    reason = "038|039";
                    return result = true;
                }
            }

            if (instance.fields.test("100")) {
                if (__hasFieldByNameChanged(oldMarc, newMarc, "100", __stripValue, /[^a|h|k|e|f]/)) {
                    reason = "100 Delfelterne ahkef";
                    return result = true;
                }
            }

            if (instance.fields.test("110")) {
                if (__hasFieldByNameChanged(oldMarc, newMarc, "110", __stripValue, /[^s|a|c|e|i|k|j]/)) {
                    reason = "110 saceikj";
                    return result = true;
                }
            }

            var check245a = true;
            if (instance.fields.test("239")) {
                var checkField = true;

                // New 239 field
                if (!oldMarc.existField(/239/) && newMarc.existField(/239/)) {
                    checkField = oldMarc.getValue(/245/, /a/) !== newMarc.getValue(/239/, /t/);
                    check245a = checkField;
                }
                // Updated 239 field
                else if (oldMarc.existField(/239/) && newMarc.existField(/239/)) {
                    checkField = true;
                    check245a = !newMarc.existField(new MatchField(/239/, undefined, /t/));
                }
                // Deleted 239 field
                else if (oldMarc.existField(/239/) && !newMarc.existField(/239/)) {
                    checkField = oldMarc.getValue(/239/, /t/) !== newMarc.getValue(/245/, /a/);
                    check245a = checkField;
                }

                if (checkField) {
                    if (__hasFieldByNameChanged(oldMarc, newMarc, "239", __stripValueLength10, /[^a|h|k|e|f|t|\u00F8]/)) {
                        reason = "239 ahkeft\u00F8";
                        return result = true;
                    }
                }
            }

            if (instance.fields.test("245")) {
                var checkField = true;

                if (checkField) {
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /a/)) {
                        var subFieldExist = true;

                        if (newMarc.matchValue(/004/, /a/, /s/)) {
                            subFieldExist = oldMarc.existField(new MatchField(/245/, undefined, /n/)) ||
                                newMarc.existField(new MatchField(/245/, undefined, /n/));

                            if (subFieldExist && !__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, /245/, /n/)) {
                                Log.info("245n is not touched ==> Ignore 245a");
                                check245a = false;
                            }
                        }
                        else if (newMarc.matchValue(/004/, /a/, /b/)) {
                            subFieldExist = oldMarc.existField(new MatchField(/245/, undefined, /g/)) ||
                                newMarc.existField(new MatchField(/245/, undefined, /g/));

                            if (subFieldExist && !__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /g/)) {
                                Log.info("245g is not touched ==> Ignore 245a");
                                check245a = false;
                            }
                        }

                        if (check245a) {
                            reason = "245a";
                            return result = true;
                        }
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /g/)) {
                        reason = "245g";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __value, /245/, /m/)) {
                        reason = "245m";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, /245/, /n/)) {
                        reason = "245n";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /o/)) {
                        reason = "245o";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /y/)) {
                        reason = "245y";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /\u00E6/)) {
                        reason = "245\u00E6";
                        return result = true;
                    }
                    if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /245/, /\u00F8/)) {
                        reason = "245\u00F8";
                        return result = true;
                    }
                }
            }

            if (instance.fields.test("652")) {
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /652/, /a/)) {
                    reason = "652 Delfelt a changed";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValueLength10, /652/, /b/)) {
                    reason = "652 Delfelt b changed";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, new MatchField(/652/, undefined, /m|o/), /e/)) {
                    reason = "652m|o Delfelt e changed";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, new MatchField(/652/, undefined, /m|o/), /f/)) {
                    reason = "652m|o Delfelt f changed";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, new MatchField(/652/, undefined, /m|o/), /h/)) {
                    reason = "652m|o Delfelt h changed";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, /652/, /m/)) {
                    reason = "652m";
                    return result = true;
                }
                if (__hasSubfieldJustChanged(oldMarc, newMarc, __stripValue, /652/, /o/)) {
                    reason = "652o";
                    return result = true;
                }
            }

            return result;
        }
        finally {
            if (result === true) {
                Log.info("Classifications has changed because of: " + reason);
            }
            Log.debug("Exit - ClassificationData.hasClassificationsChanged(): " + result);
        }
    }

    function updateClassificationsInRecord(instance, currentCommonMarc, updatingCommonMarc, libraryRecord) {
        Log.debug("Enter - ClassificationData.updateClassificationsInRecord()");

        var result;
        try {
            Log.debug("    currentCommonMarc: " + currentCommonMarc);
            Log.debug("    updatingCommonMarc: " + updatingCommonMarc);
            Log.debug("    libraryRecord: " + libraryRecord);

            result = libraryRecord.clone();

            if (!hasClassificationData(instance, libraryRecord)) {
                currentCommonMarc.eachField(instance.fields, function (field) {
                    result.append(field);
                });
            }

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.updateClassificationsInRecord(): " + result);
        }
    }

    function removeClassificationsFromRecord(instance, record) {
        Log.debug("Enter - ClassificationData.updateClassificationsInRecord()");

        var result = undefined;
        try {
            Log.debug("    record: " + record);

            result = new Record;
            record.eachField(/./, function (field) {
                if (!instance.fields.test(field.name)) {
                    result.append(field);
                }
            });

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.updateClassificationsInRecord(): " + result);
        }
    }

    /**
     * Creates a Record from an existing record with all fields matching a
     * fieldmatcher.
     *
     * @param {Record}        record       Input record.
     * @param {RegExp|Object} fieldmatcher Field matcher.
     *
     * @returns {Record} The new subset record.
     */
    function __createSubRecord(record, fieldmatcher) {
        Log.debug("Enter - ClassificationData.__createSubRecord()");

        var result = undefined;
        try {
            Log.debug("    record: " + record);
            Log.debug("    fieldmatcher: " + fieldmatcher);
            result = new Record;

            record.eachField(fieldmatcher, function (field) {
                result.append(field);
            });

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.__createSubRecord(): " + result);
        }
    }

    function __hasRecordChanged(oldRecord, newRecord, valueFunc) {
        Log.debug("Enter - ClassificationData.__hasRecordChanged()");

        var result = undefined;
        try {
            Log.debug("    oldRecord: " + oldRecord);
            Log.debug("    newRecord: " + newRecord);

            if (oldRecord.size() !== newRecord.size()) {
                return result = true;
            }

            result = false;

            oldRecord.eachField(/./, function (oldField) {
                if (result === true) {
                    return result;
                }

                var isFieldChanged = true;

                newRecord.eachField(/./, function (newField) {
                    if (!__hasFieldChanged(oldField, newField, valueFunc)) {
                        isFieldChanged = false;
                    }
                });

                if (isFieldChanged) {
                    result = true;
                }
            });

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasRecordChanged(): " + result);
        }
    }

    function __hasFieldChanged(oldField, newField, valueFunc, ignoreSubfieldsMatcher) {
        Log.debug("Enter - ClassificationData.__hasFieldChanged()");

        var result = undefined;
        try {
            Log.debug("    oldField: " + oldField);
            Log.debug("    newField: " + newField);
            Log.debug("    ignoreSubfieldsMatcher: " + ignoreSubfieldsMatcher);

            if (oldField === undefined && newField === undefined) {
                return result = false;
            }
            else if (oldField !== undefined && newField === undefined) {
                return result = true;
            }
            else if (oldField === undefined && newField !== undefined) {
                return result = true;
            }

            var msf = getMatchSubField(ignoreSubfieldsMatcher);
            if (ignoreSubfieldsMatcher === undefined) {
                msf = {
                    matchSubField: function (f, sf) {
                        return false;
                    }
                };
            }

            result = false;
            oldField.eachSubField(/./, function (field, subfield) {
                if (result) {
                    return;
                }

                if (msf.matchSubField(field, subfield)) {
                    return;
                }

                var sfMatcher = {
                    matchSubField: function (f, sf) {
                        if (subfield.value === "") {
                            return true;
                        }

                        var sfValue = valueFunc(sf.value);
                        var subfieldValue = valueFunc(subfield.value);
                        Log.debug("sfValue (", sf.name, "): '", sfValue, "'");
                        Log.debug("subfieldValue (", subfield.name, "): '", subfieldValue, "'");
                        Log.debug("sf.name.type: ", typeof( sf.name ));
                        Log.debug("subfieldf.name.type: ", typeof( subfield.name ));
                        Log.debug("sf.value.type: ", typeof( sfValue ));
                        Log.debug("subfield.value.type: ", typeof( subfieldValue ));

                        return sf.name === subfield.name && sfValue === subfieldValue;
                    }
                };

                if (!newField.exists(sfMatcher)) {
                    result = true;
                }
            });

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasFieldChanged(): " + result);
        }
    }

    function __hasFieldByNameChanged(oldMarc, newMarc, fieldname, valueFunc, ignoreSubfieldsMatcher) {
        Log.debug("Enter - ClassificationData.__hasFieldByNameChanged()");

        var result = undefined;
        try {
            var oldField = undefined;
            var newField = undefined;

            if (oldMarc.existField(new RegExp(fieldname))) {
                oldField = oldMarc.field(fieldname);
            }
            if (newMarc.existField(new RegExp(fieldname))) {
                newField = newMarc.field(fieldname);
            }

            Log.debug("fieldname: ", fieldname);
            Log.debug("ignoreSubfieldsMatcher: ", uneval(ignoreSubfieldsMatcher));
            Log.debug("oldField: ", oldField === undefined ? "undefined" : oldField.toString());
            Log.debug("newField: ", newField === undefined ? "undefined" : newField.toString());

            return result = __hasFieldChanged(oldField, newField, valueFunc, ignoreSubfieldsMatcher) ||
                __hasFieldChanged(newField, oldField, valueFunc, ignoreSubfieldsMatcher);
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasFieldByNameChanged(): ", result);
        }
    }

    function __hasSubfieldChangedMatcher(oldMarc, newMarc, fieldmatcher, subfieldmatcher, oldValueMatcher, newValueMatcher) {
        Log.debug("Enter - ClassificationData.__hasSubfieldChangedMatcher()");

        var result = undefined;
        try {
            Log.debug("    oldMarc: " + oldMarc);
            Log.debug("    newMarc: " + newMarc);
            Log.debug("    fieldmatcher: " + fieldmatcher);
            Log.debug("    subfieldmatcher: " + subfieldmatcher);
            Log.debug("    oldValueMatcher: " + oldValueMatcher);
            Log.debug("    newValueMatcher: " + newValueMatcher);

            result = oldMarc.matchValue(fieldmatcher, subfieldmatcher, oldValueMatcher) &&
                newMarc.matchValue(fieldmatcher, subfieldmatcher, newValueMatcher);

            return result;
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasSubfieldChangedMatcher(): " + result);
        }
    }

    function __hasSubfieldJustChanged(oldMarc, newMarc, valueFunc, fieldmatcher, subfieldmatcher) {
        Log.debug("Enter - ClassificationData.__hasSubfieldJustChanged()");

        var result = undefined;
        try {
            Log.debug("    oldMarc: " + oldMarc);
            Log.debug("    newMarc: " + newMarc);
            Log.debug("    fieldmatcher: " + fieldmatcher);
            Log.debug("    subfieldmatcher: " + subfieldmatcher);

            return result = valueFunc(oldMarc.getValue(fieldmatcher, subfieldmatcher)) !== valueFunc(newMarc.getValue(fieldmatcher, subfieldmatcher));
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasSubfieldJustChanged():" + result);
        }
    }

    function __hasStripedValueChanged(a, b, len) {
        Log.debug("Enter - ClassificationData.__hasStripedValueChanged()");

        var result = undefined;
        try {
            Log.debug("    a: " + a);
            Log.debug("    b: " + b);
            Log.debug("    len: " + len);

            a = __stripValue(a.substr(0, len));
            b = __stripValue(b.substr(0, len));

            return result = a !== b
        }
        finally {
            Log.debug("Exit - ClassificationData.__hasStripedValueChanged():" + result);
        }
    }

    function __value(v) {
        return v;
    }

    function __stripValue(v) {
        Log.debug("Enter - ClassificationData.__stripValue()");

        try {
            var Normalizer = Packages.java.text.Normalizer;

            Log.debug("    v: " + v);

            v = v.replace(/\s|\[|\]|\u00A4/g, "");
            v = Normalizer.normalize(v, Normalizer.Form.NFD).replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

            return v + "";
        }
        finally {
            Log.debug("Exit - ClassificationData.__stripValue():" + v);
        }
    }

    function __stripValueLength10(v) {
        v = __stripValue(v.substr(0, 10));
        return v;
    }


    function __different009AG(oldRecord, newRecord) {
        Log.debug("Enter - ClassificationData.__different009AG()");

        var result = false;

        try {
            var oldA = [], oldG = [];
            var newA = [], newG = [];

            if (oldRecord.existField(new RegExp("009"))) {
                var oldField = oldRecord.field("009");

                oldField.eachSubField( /a/, function( field, subField ) {
                        oldA.push(subField.value);
                });

                oldField.eachSubField( /g/, function( field, subField ) {
                    oldG.push(subField.value);
                });

            }

            if (newRecord.existField(new RegExp("009"))) {
                var newField = newRecord.field("009");

                newField.eachSubField( /a/, function( field, subField ) {
                    newA.push(subField.value);
                });

                newField.eachSubField( /g/, function( field, subField ) {
                    newG.push(subField.value);
                });
            }

            var aDiffers = oldA.sort().concat().join("") !== newA.sort().concat().join("");
            var gDiffers = oldG.sort().concat().join("") !== newG.sort().concat().join("");

            return result = aDiffers || gDiffers;
        } finally {
            Log.debug("Exit - ClassificationData.__different009AG(): " + result);
        }
    }

    return {
        'create': create,
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord,
        '__stripValue': __stripValue
    };

}();
