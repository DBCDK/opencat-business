//-----------------------------------------------------------------------------
use( "Print" );
use( "TemplateOptimizer" );
use( "UnitTest" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'Builder' ];

//-----------------------------------------------------------------------------
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
    function buildRecord( templateProvider, faustProvider ) {
        Log.trace( "validateRecord" );

        var result = {
            "fields": []
        };
        // TODO: check om template er ok, ellers kast op, slet senere tjeks
        var template = templateProvider();

        var mandatoryFields = getMandatoryFieldsFromUnoptimizedTemplate( template );
        var newField;
        if ( mandatoryFields !== undefined ) {
            for ( var i = 0; i < mandatoryFields.length; i++ ) {
                newField = buildField( template, mandatoryFields[i], faustProvider );
                result.fields.push( newField );
            }
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
        Log.trace( "convertRecord" );

        var result = {
            "fields": []
        };
        var template = templateProvider();
        // get list of mandatory fields
        var mandatoryFields = getMandatoryFieldsFromUnoptimizedTemplate( template );

        // convert list of mandatory fields to object for easier access
        // brug true/false istedet for 0 og 1
        var mandatoryFieldsObject = listAsObject( mandatoryFields, false );
        var newField;
        for ( var i = 0; i < record.fields.length; i++ ) {
            newField = convertField( template, record.fields[i], faustProvider );
            if ( newField !== undefined ) {
                result.fields.push( newField );
            }
            // if the field is mandatory we note that it's used
            if ( mandatoryFieldsObject.hasOwnProperty( record.fields[i].name ) ) {
                mandatoryFieldsObject[record.fields[i].name] = true;
            }
        }
        // here we add the remaining mandatory fields not present in the original record
        var missingFields = buildMissingFields( template, faustProvider, mandatoryFieldsObject );
        result.fields = result.fields.concat( missingFields );

        // sort the new record before returning it
        result = sortRecord( result );
        return result;
    }

    // function to sort the record fields
    function sortRecord( record ) {
        Log.trace( "sortRecord" );
        var result = {
            "fields": []
        };
        result.fields = record.fields.sort(sortRecordFunction);
        return result;
    }

    // sort function used by sortRecord
    // function( a, b ) { return a.name.localeCompare(b.name); }
    function sortRecordFunction( a, b ){
        Log.trace( "sortRecordFunction" );
        var result = a.name.localeCompare(b.name);
        return result;
    }

    // convertField converts a field to the type indicated by the template, by
    // either removing not allowed subfields and adding mandatory subfields.
    // Returns undefined if field is not used.
    // TODO: faustnumber, brug som buildrecord
    function convertField( template, field, faustProvider ) {
        Log.trace( "convertField" );
        var fieldName = field.name;
        // here we check if the field name, eg. 001, is in the template and
        // thus allowed
        var newField = undefined;
        if ( template.fields.hasOwnProperty( fieldName ) ) {
            newField = field;
            // TODO: Fix return undefined
            // make sure it has an indicator
            newField = verifyIndicator( template, newField );

            // make a list of mandatory subfields
            var newSubfieldsObject = convertSubfields(template, field, faustProvider );
            var newSubfields = newSubfieldsObject["subfields"];
            var mandatorySubfieldsObject = newSubfieldsObject["mandatorySubfields"];

            // add the remaining mandatory subfields not present in the original field
            var missingSubfields = buildMissingSubfields( mandatorySubfieldsObject, field, faustProvider );
            newField.subfields = newSubfields.concat( missingSubfields );
        }
        return newField;
    }

    // verifyIndicator adds the indicator value of '00' if none is present
    function verifyIndicator( template, field ) {
        Log.trace( "verifyIndicator" );
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
        Log.trace( "getIndicatorFromUnoptimizedTemplate" );
        var indicator = "00";
        if ( template["defaults"]["field"].hasOwnProperty( "indicator" ) ) {
            indicator = template["defaults"]["field"]["indicator"];
        }
        return indicator;
    }

    // buildMissingFields returns a list of mandatory fields not used in the original record
    function buildMissingFields( template, faustProvider, mandatoryFields ) {
        Log.trace( "buildMissingFields" );
        var newField;
        var result = [];
        for ( var fieldKey in mandatoryFields ) {
            if ( mandatoryFields[fieldKey] === false ) {
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
        Log.trace( "convertSubfields" );
        var newSubfields = [];
        // list of allowed subfields
        var availableSubfieldsObject = subfieldsInTemplate( template, field.name );
        var subfieldName;
        var newSubfield;
        var result = {};
        var mandatorySubfieldsList = getMandatorySubfieldsFromUnoptimizedTemplate( template, field.name );
        var mandatorySubfieldsObject = listAsObject( mandatorySubfieldsList, false );

        // for each subfield in the records field we check if it is allowed
        // and if not we discard it
        var subfields = field.subfields;
        //TODO: brug for(var i = 0; ...
        for ( var i in subfields ) {
            subfieldName = subfields[i].name;
            if ( availableSubfieldsObject.hasOwnProperty( subfieldName ) ) {
                newSubfield = field.subfields[i];
                if ( field.name === "001" && subfieldName === "a" ) {
                    newSubfield.value = faustProvider();
                }
                if ( newSubfield.hasOwnProperty( "value" ) === false ) {
                    newSubfield.value = "";
                }
                newSubfields.push( newSubfield );
                if ( mandatorySubfieldsObject.hasOwnProperty( subfieldName ) ) {
                    mandatorySubfieldsObject[subfieldName] = true;
                }
            }
        }
        result["subfields"] = newSubfields;
        result["mandatorySubfields"] = mandatorySubfieldsObject;
        return result;
    }

    // buildMissingSubfields builds a list of the mandatory subfields not used
    // in the original field
    function buildMissingSubfields( mandatorySubfields, field, faustProvider ) {
        Log.trace( "buildMissingSubfields" );
        var newSubfields = [];
        var newSubfield;
        for ( var subfieldKey in mandatorySubfields ) {
            if ( mandatorySubfields[subfieldKey] === false ) {
                newSubfield = buildSubfield( subfieldKey, field.name, faustProvider );
                newSubfields.push( newSubfield );
            }
        }
        return newSubfields;
    }

    // buildField constructs a single field using the field name given as a parameter.
    // If it is field 001 being constructed, the faust number (fstNumber) is also used.
    function buildField( template, fieldName, faustProvider ) {
        Log.trace( "buildField" );
        var mandatorySubfields = getMandatorySubfieldsFromUnoptimizedTemplate( template, fieldName );
        var indicator = getIndicatorFromUnoptimizedTemplate( template );
        var field = {
            "name": fieldName,
            "indicator": indicator,
            "subfields": []
        };

        var newSubfield;
        if ( mandatorySubfields !== undefined ) {
            for ( var i = 0; i < mandatorySubfields.length; i++ ) {
                newSubfield = buildSubfield( mandatorySubfields[i], fieldName, faustProvider );
                field.subfields.push( newSubfield );
            }
        }
        return field;
    }

    // buildSubfield constructs a single subfield using the subfield name given
    // as a parameter.
    // If the faustNumber parameter is not undefined, the subfield is part of
    // field 001 and will insert the faust number.
    function buildSubfield( subfieldName, fieldName, faustProvider ) {
        Log.trace( "buildSubfield" );
        var subfield = {
            "name": subfieldName,
            "value": ""
        };
        if ( fieldName === "001" ) {
            if ( subfieldName === "a" ) {
                subfield.value = faustProvider();
            }
            // TODO: Replace with general method that takes data from template
            // -> will be a story
            if ( subfieldName === "f" ) {
                subfield.value = "a";
            }
        }
        return subfield;
    }

    // getMandatoryFieldsFromTemplate returns an array of mandatory fields,
    // if any, from the template given as a parameter.
    function getMandatoryFieldsFromUnoptimizedTemplate( template ) {
        Log.trace( "getMandatoryFieldsFromUnoptimizedTemplate" );
        var mandatoryFields = [];
        // first read the mandatory field value
        var mandatoryFieldValue = getMandatoryDefaultValueFromUnoptimizedTemplate( template, "field" );
        for ( var fieldKey in template["fields"] ) {
            if ( ( template["fields"][fieldKey].hasOwnProperty( "mandatory" ) &&
                    template["fields"][fieldKey]["mandatory"] === true ) ||
                    mandatoryFieldValue === true ) {
                mandatoryFields.push( fieldKey );
            }
        }

        mandatoryFields.sort();
        return mandatoryFields;
    }

    // getMandatorySubfieldsFromTemplate returns an array of mandatory subfields,
    // if any, from the template and field name given as parameters.
    function getMandatorySubfieldsFromUnoptimizedTemplate( template, fieldName ) {
        Log.trace( "getMandatorySubfieldsFromUnoptimizedTemplate" );
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
        Log.trace( "getMandatoryDefaultValueFromUnoptimizedTemplate" );
        var mandatoryValue = template["defaults"][type]["mandatory"];
        return mandatoryValue;
    }

    // converts an array to an object
    // ex: in  = ["001", "002", "003"], 1
    //     out = {"001": 1, "002": 1, "003": 1}
    function listAsObject( list, defaultValue ) {
        Log.trace( "listeAsObject" );
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

    // returns a list of subfields present in the template under a specifiec field
    function subfieldsInTemplate( template, field ) {
        Log.trace( "subfieldsInTemplate" );
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
        Log.trace( "validateFunction" );
        var res = false;
        if ( functionObject !== undefined && functionObject instanceof Function ) {
            res = true;
        }
        return res;
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
        '__buildSubfield': buildSubfield,
        '__getMandatoryFieldsFromUnoptimizedTemplate': getMandatoryFieldsFromUnoptimizedTemplate,
        '__getMandatorySubfieldsFromUnoptimizedTemplate': getMandatorySubfieldsFromUnoptimizedTemplate,
        '__getMandatoryDefaultValueFromUnoptimizedTemplate': getMandatoryDefaultValueFromUnoptimizedTemplate,
        '__listeAsObject': listAsObject,
        '__subfieldsInTemplate': subfieldsInTemplate,
        '__isFunction': isFunction
    };
}();
