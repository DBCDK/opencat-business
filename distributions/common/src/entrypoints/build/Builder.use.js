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
//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "TemplateContainer" );
use( "UnitTest" );

UnitTest.addFixture( "Builder.buildRecord", function() {
    var record = {
            "fields": [
                {
                    "name": "001",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "a",
                            "value": "58082937"
                        }, {
                            "name": "b",
                            "value": ""
                        }, {
                            "name": "c",
                            "value": ""
                        }, {
                            "name": "d",
                            "value": ""
                        }, {
                            "name": "f",
                            "value": "a"
                        }
                    ]
                }
            ]
        };

    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    }
                }
            };

    var record2 = {
            "fields": [
                {
                    "name": "001",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "a",
                            "value": "58082937"
                        }
                    ]
                }, {
                    "name": "002",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "z",
                            "value": ""
                        }
                    ]
                }, {
                    "name": "003",
                    "indicator": "00",
                    "subfields": []
                }, {
                    "name": "042",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "c",
                            "value": ""
                        }
                    ]
                }
            ]
        };

    var template2 =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": false,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "002": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "b": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "z": {
                                "mandatory": true,
                                "repeatable": false
                            }
                        }
                    },
                    "003": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": false,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "z": {
                                "mandatory": false,
                                "repeatable": false
                            }
                        }
                    },
                    "042": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": false,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "z": {
                                "mandatory": false,
                                "repeatable": false
                            }
                        }
                    }
                }
            };

    SafeAssert.equal( "1 BuildRecord test", Builder.buildRecord( function() { return template; }, function() { return "58082937"; } ), record );
    SafeAssert.equal( "2 BuildRecord test", Builder.buildRecord( function() { return template2; }, function() { return "58082937"; } ), record2 );
});

UnitTest.addFixture( "Builder.convertRecord", function() {
    var record = {
            "fields": [
                {
                    "name": "001",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "a",
                            "value": "58082937"
                        }, {
                            "name": "b",
                            "value": ""
                        }, {
                            "name": "c",
                            "value": ""
                        }, {
                            "name": "d",
                            "value": ""
                        }, {
                            "name": "f",
                            "value": "a"
                        }
                    ]
                },{
                    "name": "002",
                    "indicator": "00",
                    "subfields": []
                },{
                    "name": "004",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "r",
                            "value": ""
                        }
                    ]
                }
            ]
        };

    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "002": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abc",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    },
                    "005": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    var recordResult = {
            "fields": [
                {
                    "name": "001",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "a",
                            "value": "42"
                        }, {
                            "name": "b",
                            "value": ""
                        }, {
                            "name": "c",
                            "value": ""
                        }, {
                            "name": "d",
                            "value": ""
                        }, {
                            "name": "f",
                            "value": "a"
                        }
                    ]
                },{
                    "name": "002",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "a",
                            "value": ""
                        },{
                            "name": "b",
                            "value": ""
                        },{
                            "name": "c",
                            "value": ""
                        }
                    ]
                },{
                    "name": "004",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "r",
                            "value": ""
                        },{
                            "name": "a",
                            "value": ""
                        }
                    ]
                },{
                    "name": "005",
                    "indicator": "00",
                    "subfields": [
                        {
                            "name": "r",
                            "value": ""
                        },{
                            "name": "a",
                            "value": ""
                        }
                    ]
                }
            ]
        };

    var record2 = {
            "fields": [
                {
                    "name": "001"
                },{
                    "name": "002"
                },{
                    "name": "004"
                }
            ]
        };

    SafeAssert.equal( "1 convertRecord test", Builder.convertRecord( function() {return template;}, record, function() { return "42"; } ), recordResult );
    SafeAssert.equal( "2 convertRecord test", Builder.convertRecord( function() {return template;}, record2, function() { return "42"; } ), recordResult );
});

UnitTest.addFixture( "Builder.__buildField", function() {
    var field001 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "d",
                "value": ""
            }, {
                "name": "f",
                "value": "a"
            }
        ]

    };

    var field004 = {
        "name": "004",
        "indicator": "00",
        "subfields": [
            {
                "name": "r",
                "value": ""
            }, {
                "name": "a",
                "value": ""
            }
        ]
    };

    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    var faustProvider = function() {return "58082937";};
    SafeAssert.equal( "1 buildField test", Builder.__buildField( template, "001", faustProvider ), field001 );
    SafeAssert.equal( "2 buildField test", Builder.__buildField( template, "004", faustProvider ), field004 );
});

UnitTest.addFixture( "Builder.__buildSubfield", function() {
    var subfielda1 = {
        "name": "a",
        "value": "58082937"
    };
    var subfielda2 = {
        "name": "a",
        "value": ""
    };
    var subfieldb = {
        "name": "b",
        "value": ""
    };
    var subfieldf = {
        "name": "f",
        "value": "a"
    };

    var faustProvider = function() {return "58082937";};
    SafeAssert.equal( "1 buildSubfield test", Builder.__buildSubfield( "a", "001", faustProvider ), subfielda1 );
    SafeAssert.equal( "2 buildSubfield test", Builder.__buildSubfield( "a", "002", faustProvider ), subfielda2 );
    SafeAssert.equal( "3 buildSubfield test", Builder.__buildSubfield( "b", "001", faustProvider ), subfieldb );
    SafeAssert.equal( "4 buildSubfield test", Builder.__buildSubfield( "f", "001", faustProvider ), subfieldf );
});

UnitTest.addFixture( "Builder.__getMandatoryFieldsFromUnoptimizedTemplate", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };
    SafeAssert.equal( "1 __getMandatoryFieldsFromUnoptimizedTemplate test", Builder.__getMandatoryFieldsFromUnoptimizedTemplate( template ), ["001", "004"] );
});

UnitTest.addFixture( "Builder.__getMandatorySubfieldsFromUnoptimizedTemplate", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    SafeAssert.equal( "1 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "001" ), ["a", "b", "c", "d", "f"] );
    SafeAssert.equal( "2 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "004" ), ["r", "a"] );
    SafeAssert.equal( "3 __getMandatorySubfieldsFromUnoptimizedTemplate test", Builder.__getMandatorySubfieldsFromUnoptimizedTemplate( template, "042" ), [] );
});

UnitTest.addFixture( "Builder.__sortRecord", function() {
    var record = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };
    var recordSorted = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    }, {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": []
            }
        ]
    };
    var record2 = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "ø",
                        "value": ""
                    }, {
                        "name": "z",
                        "value": ""
                    }, {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "æ",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };
    var record2Sorted = {
        "fields": [
            {
                "name": "001",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": "32139825"
                    },
                    {
                        "name": "b",
                        "value": "870970"
                    },
                    {
                        "name": "c",
                        "value": "12072013"
                    },
                    {
                        "name": "d",
                        "value": "12072013101735"
                    },
                    {
                        "name": "f",
                        "value": "a"
                    }
                ]
            },
            {
                "name": "004",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "r",
                        "value": "n"
                    },
                    {
                        "name": "a",
                        "value": "e"
                    }
                ]
            },
            {
                "name": "008",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "v",
                        "value": "1"
                    },
                    {
                        "name": "t",
                        "value": ""
                    }
                ]
            },
            {
                "name": "009",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "ø",
                        "value": ""
                    }, {
                        "name": "z",
                        "value": ""
                    }, {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "æ",
                        "value": ""
                    }
                ]
            },
            {
                "name": "014",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "a",
                        "value": ""
                    }
                ]
            },
            {
                "name": "245",
                "indicator": "00",
                "subfields": []
            },
            {
                "name": "652",
                "indicator": "00",
                "subfields": [
                    {
                        "name": "å",
                        "value": ""
                    }, {
                        "name": "a",
                        "value": ""
                    }
                ]
            }
        ]
    };

    SafeAssert.equal( "1 __sortRecord test", Builder.__sortRecord( record ), recordSorted );
    SafeAssert.equal( "2 __sortRecord test", Builder.__sortRecord( recordSorted ), recordSorted );
    SafeAssert.equal( "3 __sortRecord test", Builder.__sortRecord( record2 ), record2Sorted );
    SafeAssert.equal( "4 __sortRecord test", Builder.__sortRecord( record2Sorted ), record2Sorted );
});

UnitTest.addFixture( "Builder.__convertField", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };
    var fieldInput = {
        "name": "001",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
            }, {
                "name": "f",
                "value": "a"
            }
        ]
    };
    var fieldOutput = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": "a"
            }, {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "d",
                "value": ""
            }
        ]
    };
    var fieldInput2 = {
        "name": "001"
    };
    var fieldOutput2 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "d",
                "value": ""
            }, {
                "name": "f",
                "value": "a"
            }
        ]
    };

    var fieldInput3 = {
        "name": "004"
    };
    var fieldOutput3 = {
        "name": "004",
        "indicator": "00",
        "subfields": [
            {
                "name": "r",
                "value": ""
            }, {
                "name": "a",
                "value": ""
            }
        ]
    };
    var faustProvider = function() {return "58082937";};

    SafeAssert.equal( "1 __convertField test", Builder.__convertField( template, fieldInput, faustProvider ), fieldOutput );
    SafeAssert.equal( "2 __convertField test", Builder.__convertField( template, fieldInput2, faustProvider ), fieldOutput2 );
    SafeAssert.equal( "3 __convertField test", Builder.__convertField( template, fieldInput3, faustProvider ), fieldOutput3 );
    faustProvider = function() {return undefined;};
    SafeAssert.equal( "4 __convertField test", Builder.__convertField( template, fieldInput3, faustProvider ), fieldOutput3 );
});

UnitTest.addFixture( "Builder.__verifyIndicator", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };
    var templateWithoutIndicator =
            {
                "defaults": {
                    "field": {
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    var field = {
        "name": "001",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "d",
                "value": ""
            }, {
                "name": "f",
                "value": "a"
            }
        ]
    };
    var fieldWithIndicator = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "a",
                "value": "58082937"
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "d",
                "value": ""
            }, {
                "name": "f",
                "value": "a"
            }
        ]
    };

    SafeAssert.equal( "1 __verifyIndicator test", Builder.__verifyIndicator( template, field ), fieldWithIndicator );
    SafeAssert.equal( "2 __verifyIndicator test", Builder.__verifyIndicator( templateWithoutIndicator, field ), fieldWithIndicator );
});

UnitTest.addFixture( "Builder.__getIndicatorFromUnoptimizedTemplate", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };
    var templateWithoutIndicator =
            {
                "defaults": {
                    "field": {
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    SafeAssert.equal( "1 __getIndicatorFromUnoptimizedTemplate test", Builder.__getIndicatorFromUnoptimizedTemplate( template ), "00" );
    SafeAssert.equal( "2 __getIndicatorFromUnoptimizedTemplate test", Builder.__getIndicatorFromUnoptimizedTemplate( templateWithoutIndicator ), "00" );
});

UnitTest.addFixture( "Builder.__buildMissingFields", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "002": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "003": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    },
                    "005": {
                        "url": "",
                        "mandatory": false,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    var missingFields = [
        {
            "name": "002",
            "indicator": "00",
            "subfields": [
                {
                    "name": "a",
                    "value": ""
                }, {
                    "name": "b",
                    "value": ""
                }, {
                    "name": "c",
                    "value": ""
                }, {
                    "name": "d",
                    "value": ""
                }, {
                    "name": "f",
                    "value": ""
                }
            ]
        }, {
            "name": "003",
            "indicator": "00",
            "subfields": [
                {
                    "name": "a",
                    "value": ""
                }, {
                    "name": "b",
                    "value": ""
                }, {
                    "name": "d",
                    "value": ""
                }, {
                    "name": "f",
                    "value": ""
                }
            ]
        }
    ];
    var faustProvider = function() {return "58082937";};

    var mandatoryFields = {"001": true, "002": false, "003": false, "004": true};
    SafeAssert.equal( "1 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), missingFields );
    mandatoryFields = {"001": true, "002": true, "003": true, "004": true};
    SafeAssert.equal( "2 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), [] );
    mandatoryFields = {};
    SafeAssert.equal( "3 __buildMissingFields test", Builder.__buildMissingFields( template, faustProvider, mandatoryFields ), [] );
});

UnitTest.addFixture( "Builder.__convertSubfields", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "002": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "003": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    },
                    "005": {
                        "url": "",
                        "mandatory": false,
                        "repeatable": false,
                        "subfields": {}
                    }
                }
            };


    var fieldInput = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var fieldOutput = [
        {
            "name": "b",
            "value": ""
        }, {
            "name": "c",
            "value": ""
        }, {
            "name": "f",
            "value": ""
        }
    ];

    var mandatorySubfieldsObj = {"a": false, "b": true, "c": true, "d": false, "f": true};

    var result = {};
    result["subfields"] = fieldOutput;
    result["mandatorySubfields"] = mandatorySubfieldsObj;
    var faustProvider = function() {return "58082937";};
    SafeAssert.equal( "1 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );
    faustProvider = function() {return undefined;};
    SafeAssert.equal( "2 __convertSubfields test", Builder.__convertSubfields( template, fieldInput, faustProvider ), result );

    var fieldInput2= {
        "name": "005",
        "indicator": "00",
        "subfields": [
            {
                "name": "k",
                "value": ""
            }, {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }, {
                "name": "å",
                "value": ""
            }
        ]
    };

    var result2 = {};
    result2["subfields"] = [];
    result2["mandatorySubfields"] = {};
    SafeAssert.equal( "3 __convertSubfields test", Builder.__convertSubfields( template, fieldInput2, "58082937" ), result2 );
});

UnitTest.addFixture( "Builder.__buildMissingSubfields", function() {
    var fieldInput = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }, {
                "name": "f",
                "value": ""
            }
        ]
    };

    var fieldOutput = [
        {
            "name": "a",
            "value": ""
        }, {
            "name": "d",
            "value": ""
        }
    ];

    var fieldInput2 = {
        "name": "001",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }
        ]
    };

    var fieldOutput2 = [
        {
            "name": "a",
            "value": "58082937"
        }, {
            "name": "d",
            "value": ""
        }, {
            "name": "f",
            "value": "a"
        }
    ];

    var fieldInput3 = {
        "name": "002",
        "indicator": "00",
        "subfields": [
            {
                "name": "b",
                "value": ""
            }, {
                "name": "c",
                "value": ""
            }
        ]
    };

    var fieldOutput3 = [
        {
            "name": "a",
            "value": ""
        }, {
            "name": "d",
            "value": ""
        }, {
            "name": "f",
            "value": ""
        }
    ];

    var mandatorySubfields = {"a": false, "b": true, "c": true, "d": false, "f": true};
    var mandatorySubfields2 = {"a": false, "b": true, "c": true, "d": false, "f": false};
    var mandatorySubfields3 = {"a": false, "b": true, "c": true, "d": false, "f": false};

    var faustProvider = function() {return "58082937";};
    var faustProviderUndefined = function() {return undefined;};

    SafeAssert.equal( "1 __buildMissingSubfields test", Builder.__buildMissingSubfields( mandatorySubfields, fieldInput, faustProvider ), fieldOutput );
    SafeAssert.equal( "2 __buildMissingSubfields test", Builder.__buildMissingSubfields( mandatorySubfields2, fieldInput2, faustProvider ), fieldOutput2 );
    SafeAssert.equal( "3 __buildMissingSubfields test", Builder.__buildMissingSubfields( mandatorySubfields3, fieldInput3, faustProvider ), fieldOutput3 );
    SafeAssert.equal( "4 __buildMissingSubfields test", Builder.__buildMissingSubfields( mandatorySubfields3, fieldInput3, faustProviderUndefined ), fieldOutput3 );
});

UnitTest.addFixture( "Builder.__listeAsObject", function() {
    var listIn = ["001", "002", "003"];
    var objectOut = {"001": true, "002": true, "003": true};

    var listIn2 = [];
    var objectOut2 = {};

    var listIn3 = ["001"];
    var objectOut3 = {"001": true};

    SafeAssert.equal( "1 __listeAsObject test", Builder.__listeAsObject( listIn, true ), objectOut );
    SafeAssert.equal( "2 __listeAsObject test", Builder.__listeAsObject( listIn2, true ), objectOut2 );
    SafeAssert.equal( "3 __listeAsObject test", Builder.__listeAsObject( listIn3, true ), objectOut3 );
    objectOut = {"001": false, "002": false, "003": false};
    SafeAssert.equal( "4 __listeAsObject test", Builder.__listeAsObject( listIn, false ), objectOut );
});

UnitTest.addFixture( "Builder.__subfieldsInTemplate", function() {
    var template =
            {
                "defaults": {
                    "field": {
                        "indicator": "00",
                        "mandatory": false,
                        "repeatable": true
                    },
                    "subfield": {
                        "mandatory": false,
                        "repeatable": true
                    }
                },
                "fields": {
                    "001": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            },
                            "g": {
                                "mandatory": false,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            },
                            "h": {
                                "mandatory": false,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            },
                            "j": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "002": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "003": {
                        "url": "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869",
                        "mandatory": true,
                        "repeatable": false,
                        "sorting": "abcdf",
                        "subfields": {
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "rules": [
                                    {
                                        "type": "SubfieldRules.checkFaust"
                                    },
                                    {
                                        "type": "SubfieldRules.checkLength",
                                        "params": {
                                            "min": 8
                                        }
                                    }
                                ]
                            },
                            "b": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "c": {
                                "mandatory": false,
                                "repeatable": false
                            },
                            "d": {
                                "mandatory": true,
                                "repeatable": false
                            },
                            "f": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "a"
                                ]
                            }
                        }
                    },
                    "004": {
                        "url": "",
                        "mandatory": true,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    },
                    "005": {
                        "url": "",
                        "mandatory": false,
                        "repeatable": false,
                        "subfields": {
                            "r": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "n",
                                    "c"
                                ]
                            },
                            "a": {
                                "mandatory": true,
                                "repeatable": false,
                                "values": [
                                    "e",
                                    "h",
                                    "s",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            };

    var subfieldsObj = {"a": false, "b": false, "c": false, "d": false, "f": false, "g": false, "h": false, "j": false};

    SafeAssert.equal( "1 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "001" ), subfieldsObj );
    SafeAssert.equal( "2 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "042" ), {} );
    subfieldsObj = {"r": false, "a": false};
    SafeAssert.equal( "3 __subfieldsInTemplate test", Builder.__subfieldsInTemplate( template, "005" ), subfieldsObj );
});

UnitTest.addFixture( "Builder.__isFunction", function() {
    var template = {};
    var templateProvider = function() {return template; };

    SafeAssert.equal( "1 __isFunction test", Builder.__isFunction( templateProvider ), true );
    SafeAssert.equal( "2 __isFunction test", Builder.__isFunction( template ), false );
    SafeAssert.equal( "3 __isFunction test", Builder.__isFunction( undefined ), false );
});
