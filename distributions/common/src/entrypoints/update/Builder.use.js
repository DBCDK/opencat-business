use("Log");

EXPORTED_SYMBOLS = [ 'Builder' ];

/**
 * @file Module to build a an empty record from a template.
 *
 * @namespace
 * @name Builder
 *
 */
var Builder = function() {
    /**
     * buildRecord constructs a new record from the template given as a parameter
     * using the faust number also given as a parameter.
     *
     * @syntax Builder.buildRecord( templateProvider, faustNumber )
     * @param {Object} faustProvider Function that returns a faust number
     * @param {Object} templateProvider A function that returns the
     *                 optimized template to use for the validation.
     * @return {Object} JSON object containing the constructed record
     * @name Builder.buildRecord
     * @method
     */
    function buildRecord(templateProvider, faustProvider) {
        Log.trace("-> buildRecord");

        var result = {
            "fields": []
        };
        var template = templateProvider();
        var mandatoryFields = getMandatoryFieldsFromUnoptimizedTemplate(template);
        var extraFields = getExtraFieldsList(template);
        extraFields.forEach(function (currentValue) {
            mandatoryFields.push(currentValue["field"])
        });
        mandatoryFields = removeDuplicatesFromArray(mandatoryFields);
        if (mandatoryFields !== undefined) {
            mandatoryFields.forEach(function (currentElement) {
                result["fields"].push(buildField(template, currentElement, faustProvider, extraFields));
            })

        }
        return result;
    }

    /**
     * buildRecord constructs a record from the template given as a parameter
     * using an existing record as the basis for the data.
     *
     * @syntax Builder.buildRecord( templateProvider, record, faustNumber )
     * @param {Object} templateProvider A function that returns the
     *                 unoptimized template to use for the validation.
     * @param {Object} record The record to use as a base for the new record
     * @param {Object} faustProvider Function that returns a faust number
     * @return {Object} JSON object containing the constructed record
     * @name Builder.convertRecord
     * @method
     */
    function convertRecord( templateProvider, record, faustProvider ) {
        Log.trace( "-> convertRecord" );

        var result = {"fields": []};

        // get list of mandatory fields
        var mandatoryFields = getMandatoryFieldsFromUnoptimizedTemplate( templateProvider() );

        // convert list of mandatory fields to object for easier access
        // brug true/false istedet for 0 og 1
        var mandatoryFieldsObject = listAsObject( mandatoryFields, false );
        var newField;
        record.fields.forEach(function (currentValue) {
            newField = convertField( templateProvider(), currentValue, faustProvider );
            if ( newField !== undefined ) {
                result.fields.push( newField );
            }
            // if the field is mandatory we note that it's used
            if ( mandatoryFieldsObject.hasOwnProperty( currentValue.name ) ) {
                mandatoryFieldsObject[currentValue.name] = true;
            }
        });

        // here we add the remaining mandatory fields not present in the original record
        var missingFields = buildMissingFields( templateProvider(), faustProvider, mandatoryFieldsObject );
        result.fields = result.fields.concat( missingFields );

        // sort the new record before returning it
        result = sortRecord( result );
        return result;
    }

    // function to sort the record fields
    function sortRecord( record ) {
        Log.trace( "-> sortRecord" );
        var result = {"fields": []};
        result.fields = record.fields.sort(sortRecordFunction);
        return result;
    }

    // sort function used by sortRecord
    function sortRecordFunction( a, b ){
        Log.trace( "-> sortRecordFunction" );
        return a.name.localeCompare(b.name);
    }

    // convertField converts a field to the type indicated by the template, by
    // either removing not allowed subfields and adding mandatory subfields.
    // Returns undefined if field is not used.
    function convertField( template, field, faustProvider ) {
        Log.trace( "-> convertField" );
        var fieldName = field.name;
        // here we check if the field name, eg. 001, is in the template and
        // thus allowed
        var newField = undefined;
        if ( template.fields.hasOwnProperty( fieldName ) ) {
            newField = field;
            // TODO: Fix return undefined
            // make sure it has an indicator
            newField = verifyIndicator(template, newField);

            // make a list of mandatory subfields
            var newSubfieldsObject = convertSubfields(template, field, faustProvider);
            var newSubfields = newSubfieldsObject["subfields"];
            var mandatorySubfieldsObject = newSubfieldsObject["mandatorySubfields"];

            var missingSubfields;
            if (newSubfields.length == 0 && Object.keys(mandatorySubfieldsObject).length == 0) {
                missingSubfields = {name:"", value:""};
            } else {
                // add the remaining mandatory subfields not present in the original field
                missingSubfields = buildMissingSubfields(template, mandatorySubfieldsObject, field, faustProvider);
            }
            newField.subfields = newSubfields.concat(missingSubfields);
        }
        return newField;
    }

    // verifyIndicator adds the indicator value of '00' if none is present
    function verifyIndicator( template, field ) {
        Log.trace( "-> verifyIndicator" );
        var newField = field;
        var indicator = getIndicatorFromUnoptimizedTemplate( template );
        if ( field.hasOwnProperty( "indicator" ) === false ||
                ( indicator !== undefined && newField !== undefined &&
                        ( newField.indicator === undefined || newField.indicator === "" ) ) ) {
            newField.indicator = indicator;
        }
        return newField;
    }

    // getIndicatorFromUnoptimizedTemplate returns the default indicator value
    // from an unoptimized template
    function getIndicatorFromUnoptimizedTemplate( template ) {
        Log.trace( "-> getIndicatorFromUnoptimizedTemplate" );
        var indicator = "00";
        if ( template["defaults"]["field"].hasOwnProperty( "indicator" ) ) {
            indicator = template["defaults"]["field"]["indicator"];
        }
        return indicator;
    }

    // buildMissingFields returns a list of mandatory fields not used in the original record
    function buildMissingFields( template, faustProvider, mandatoryFields ) {
        Log.trace( "-> buildMissingFields" );
        var newField;
        var result = [];
        for ( var fieldKey in mandatoryFields ) {
            if ( mandatoryFields.hasOwnProperty(fieldKey) && mandatoryFields[fieldKey] === false ) {
                newField = buildField( template, fieldKey, faustProvider );
                result.push( newField );
            }
        }
        return result;
    }

    // convertSubfields converts the subfields on a field to match the template
    // given as an argument by removing fields not allowed and indicating the
    // mandatory fields that has been used
    function convertSubfields( template, field, faustProvider ) {
        Log.trace( "-> convertSubfields" );
        // list of allowed subfields
        var availableSubfieldsObject = subfieldsInTemplate( template, field.name );
        var result = {};
        var mandatorySubfieldsList = getMandatorySubfieldsFromUnoptimizedTemplate( template, field.name );
        var mandatorySubfieldsObject = listAsObject( mandatorySubfieldsList, false );

        var newSubfields = [];
        // for each subfield in the records field we check if it is allowed
        // and if not we discard it
        // var subfields = field.subfields;
        field.subfields.forEach(function (currentValue) {
            // subfieldName = currentValue.name;
            if (availableSubfieldsObject.hasOwnProperty(currentValue.name)) {
                var newSubfield = currentValue;
                if (field.name === "001" && currentValue.name === "a" && isFaustEnabledForTemplate(template)) {
                    newSubfield.value = faustProvider();
                }
                if (newSubfield.hasOwnProperty("value") === false) {
                    newSubfield.value = "";
                }
                newSubfields.push(newSubfield);
                if (mandatorySubfieldsObject.hasOwnProperty(currentValue.name)) {
                    mandatorySubfieldsObject[currentValue.name] = true;
                }
            }
        });
        result["subfields"] = newSubfields;
        result["mandatorySubfields"] = mandatorySubfieldsObject;
        return result;
    }

    // buildMissingSubfields builds a list of the mandatory subfields not used
    // in the original field
    function buildMissingSubfields(template, mandatorySubfields, field, faustProvider) {
        Log.trace("-> buildMissingSubfields");
        var newSubfields = [];
        var newSubfield;
        for (var subfieldKey in mandatorySubfields) {
            if (mandatorySubfields.hasOwnProperty(subfieldKey) && mandatorySubfields[subfieldKey] === false) {
                newSubfield = buildSubfield(template, subfieldKey, field.name, faustProvider);
                newSubfields.push(newSubfield);
            }
        }
        return newSubfields;
    }

    // buildField constructs a single field using the field name given as a parameter.
    function buildField(template, fieldName, faustProvider, extraFields) {
        Log.trace("-> buildField");
        var mandatorySubfields = getMandatorySubfieldsFromUnoptimizedTemplate(template, fieldName);
        var indicator = getIndicatorFromUnoptimizedTemplate(template);
        var field = {
            "name": fieldName,
            "indicator": indicator,
            "subfields": []
        };
        var alreadyAddedSubfields = [];
        var tmpSubfields = getSubfieldsFromExtraFields(fieldName, extraFields);
        if (mandatorySubfields.length > 0 || tmpSubfields.length > 0) {
            mandatorySubfields.forEach(function (arg) {
                field.subfields.push(buildSubfield(template, arg, fieldName, faustProvider));
                alreadyAddedSubfields.push(arg);
            });
            tmpSubfields.forEach(function (arg) {
                if (alreadyAddedSubfields.indexOf(arg) == -1) {
                    field.subfields.push(buildSubfield(template, arg, fieldName, faustProvider));
                }

            });
        } else {
            field.subfields.push(buildSubfield(template, "", fieldName, faustProvider));
        }
        return field;
    }

    // Looks through the array of extra fields and returns the fields subfield otherwise a blank string.
    function getSubfieldsFromExtraFields(fieldName, extraFields) {
        Log.trace("-> getSubfieldsFromExtraFields");
        var res = [];
        for (var field in extraFields) {
            if (extraFields[field]["field"] === fieldName) {
                res.push(extraFields[field]["subfield"]);
            }
        }
        return res;
    }

    // buildSubfield constructs a single subfield using the subfield name given
    // as a parameter.
    // If the faustNumber parameter is not undefined, the subfield is part of
    // field 001 and will insert the faust number.
    function buildSubfield(template, subfieldName, fieldName, faustProvider) {
        Log.trace("-> buildSubfield");
        var subfield = {
            "name": subfieldName,
            "value": ""
        };
        if (subfieldName !== undefined && subfieldName !== "") {
            if (fieldName === "001" && subfieldName === "a" && isFaustEnabledForTemplate(template)) {
                subfield.value = faustProvider();
            } else {
                if (template["fields"] !== undefined
                    && template["fields"][fieldName] !== undefined
                    && template["fields"][fieldName]["subfields"] !== undefined
                    && template["fields"][fieldName]["subfields"][subfieldName] !== undefined
                    && template["fields"][fieldName]["subfields"][subfieldName]["values"] !== undefined
                    && template["fields"][fieldName]["subfields"][subfieldName]["values"].length === 1) {
                    subfield.value = template["fields"][fieldName]["subfields"][subfieldName]["values"][0];
                }
            }
        }
        return subfield;
    }

    // getMandatoryFieldsFromTemplate returns an array of mandatory fields,
    // if any, from the template given as a parameter.
    function getMandatoryFieldsFromUnoptimizedTemplate(template) {
        Log.trace("-> getMandatoryFieldsFromUnoptimizedTemplate");
        var mandatoryFields = [];
        // first read the mandatory field value
        var mandatoryFieldValue = getMandatoryDefaultValueFromUnoptimizedTemplate(template, "field");
        for (var fieldKey in template["fields"]) {
            if ((template["fields"].hasOwnProperty(fieldKey)
                && template["fields"][fieldKey].hasOwnProperty("mandatory")
                && template["fields"][fieldKey]["mandatory"] === true ) ||
                mandatoryFieldValue === true) {
                mandatoryFields.push(fieldKey);
            }
        }
        mandatoryFields.sort();
        return mandatoryFields;
    }

    // getMandatorySubfieldsFromTemplate returns an array of mandatory subfields,
    // if any, from the template and field name given as parameters.
    function getMandatorySubfieldsFromUnoptimizedTemplate( template, fieldName ) {
        Log.trace( "-> getMandatorySubfieldsFromUnoptimizedTemplate" );
        var mandatorySubfields = [];
        if ( template.fields[fieldName] !== undefined) {
            // first read the mandatory field value
            var mandatorySubfieldValue = getMandatoryDefaultValueFromUnoptimizedTemplate( template, "subfield" );
            for ( var subfieldKey in template["fields"][fieldName]["subfields"] ) {
                if ( ( template["fields"][fieldName]["subfields"][subfieldKey].hasOwnProperty( "mandatory" ) &&
                        template["fields"][fieldName]["subfields"][subfieldKey]["mandatory"] === true ) ||
                        mandatorySubfieldValue === true ) {
                    mandatorySubfields.push( subfieldKey );
                }
            }
        }
        return mandatorySubfields;
    }

    function getMandatoryDefaultValueFromUnoptimizedTemplate( template, type ) {
        Log.trace( "-> getMandatoryDefaultValueFromUnoptimizedTemplate" );
        return template["defaults"][type]["mandatory"];
    }

    // converts an array to an object
    // ex: in  = ["001", "002", "003"], 1
    //     out = {"001": 1, "002": 1, "003": 1}
    function listAsObject( list, defaultValue ) {
        Log.trace( "-> listAsObject" );
        var result;
        if ( list instanceof Array ) {
            result = {};
            for ( var i = 0; i < list.length; i++ ) {
                result[list[i]] = defaultValue;
            }
        } else {
            result = undefined;
        }
        return result;
    }

    // returns a list of subfields present in the template under a specific field
    function subfieldsInTemplate( template, field ) {
        Log.trace( "-> subfieldsInTemplate" );
        var result = {};
        if ( template.fields.hasOwnProperty( field ) ) {
            for ( var key in template.fields[field].subfields ) {
                result[key] = false;
            }
        }
        return result;
    }

    // returns true if parameter is not undefined and a function
    function isFunction( functionObject ) {
        Log.trace( "-> validateFunction" );
        var res = false;
        if ( functionObject !== undefined && functionObject instanceof Function ) {
            res = true;
        }
        return res;
    }

    function isFaustEnabledForTemplate( template ) {
        Log.trace( "-> isFaustEnabledForTemplate" );
        var res = true;
        if ( template.hasOwnProperty( "settings" )
            && template["settings"].hasOwnProperty( "lookupfaust" )
            && Util.getType( template["settings"]["lookupfaust"] ) === "boolean" ) {
            res = template["settings"]["lookupfaust"];
        }
        return res;
    }

    // returns an array with any extra fields defined in the template
    function getExtraFieldsList(template) {
        Log.trace("-> getExtraFieldsList");
        var extraFields = [];
        if (template.hasOwnProperty("settings")
            && template["settings"].hasOwnProperty("extrafields")
            && Util.getType(template["settings"]["extrafields"]) === "Array"
            && template["settings"]["extrafields"].length > 0) {

            var tmpFields = template["settings"]["extrafields"];
            tmpFields.forEach(function (currentValue) {
                if (currentValue.length === 4) {
                    extraFields.push({"field": currentValue.slice(0, 3), "subfield": currentValue.slice(3)})
                }
            });
        }
        return extraFields;
    }

    function removeDuplicatesFromArray(array) {
        Log.trace("-> removeDuplicatesFromArray");
        var uniqueArray = [];
        if (array !== undefined && array !== null && array.length > 0) {
            var sortedArray = array.sort();
            var lastUsedField = "";
            sortedArray.forEach(function (currentValue) {
                if (lastUsedField !== currentValue) {
                    uniqueArray.push(currentValue);
                    lastUsedField = currentValue;
                }
            });
        }
        return uniqueArray;
    }

    return {
        'buildRecord': buildRecord,
        'convertRecord': convertRecord,
        '__sortRecord': sortRecord,
        '__convertField': convertField,
        '__verifyIndicator': verifyIndicator,
        '__getIndicatorFromUnoptimizedTemplate': getIndicatorFromUnoptimizedTemplate,
        '__buildMissingFields': buildMissingFields,
        '__convertSubfields': convertSubfields,
        '__buildMissingSubfields': buildMissingSubfields,
        '__buildField': buildField,
        '__getSubfieldsFromExtraFields': getSubfieldsFromExtraFields,
        '__buildSubfield': buildSubfield,
        '__getMandatoryFieldsFromUnoptimizedTemplate': getMandatoryFieldsFromUnoptimizedTemplate,
        '__getMandatorySubfieldsFromUnoptimizedTemplate': getMandatorySubfieldsFromUnoptimizedTemplate,
        '__getMandatoryDefaultValueFromUnoptimizedTemplate': getMandatoryDefaultValueFromUnoptimizedTemplate,
        '__listeAsObject': listAsObject,
        '__subfieldsInTemplate': subfieldsInTemplate,
        '__isFunction': isFunction,
        '__isFaustEnabledForTemplate': isFaustEnabledForTemplate,
        '__getExtraFieldsList': getExtraFieldsList,
        '__removeDuplicatesFromArray': removeDuplicatesFromArray
    };
}();
