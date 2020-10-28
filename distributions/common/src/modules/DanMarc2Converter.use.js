use("Marc");
use("StringUtil");
use("Log");

EXPORTED_SYMBOLS = ['DanMarc2Converter'];

/**
 * This module can convert a Record instance to an pure JavaScript Object containing
 * the values (fields and subfields) from the record. The module does also has an
 * operation to convert a pure JavaScript Object to a Record.
 *
 * The pure JavaScript Object is used to parse a DanMarc2 record to/from the environment
 * as a pure JSON string. The object has the following content:
 *
 * @example
 *    {
 * 		// Array of field objects, may be empty.
 * 		fields: [  
 * 			{
 * 				name: "001", // String: Field name
 * 				indicator: "00", // String: Field indicator
 * 				
 * 				// Array of sub field objects, may be empty.
 * 				subfields: [
 * 					{
 * 						name: "a",  // String: Subfield name
 * 						value: "xx" // String: Subfield value
 * 					}
 * 				]
 * 			}
 * 		]
 * 	}
 *
 * @namespace
 * @name DanMarc2Converter
 *
 */
var DanMarc2Converter = function () {
    /**
     * Converts a pure JavaScript Object to a Record.
     *
     * @param {Object} obj The pure JavaScript Object. See the module description of a
     *                       definition of the content of this obj.
     * @param {params} params Optional element with context cache
     * @return {Record} The new Record object.
     *
     * @name DanMarc2Converter#convertToDanMarc2
     */
    function convertToDanMarc2(obj, params) {
        Log.trace("Enter - DanMarc2Converter.convertToDanMarc2()");
        var result = undefined;
        var bibliographicRecordId = undefined;
        var agencyId = undefined;
        var context;

        if (params !== undefined && params.context !== undefined) {
            // If the context object exists then we need to find the keys to look for the record.
            // That is done by finding 001 *a and *b in the incoming JSON record
            var field001Post = obj.fields.map(function (x) {return x.name;}).indexOf("001");
            if (field001Post > -1) {
                var field001 = obj.fields[field001Post];

                var subfield001aPos = field001.subfields.map(function (x) {return x.name;}).indexOf("a");
                if (subfield001aPos > -1) {
                    bibliographicRecordId = field001.subfields[subfield001aPos].value;
                }

                var subfield001bPos = field001.subfields.map(function (x) {return x.name;}).indexOf("b");
                if (subfield001bPos > -1) {
                    agencyId = field001.subfields[subfield001bPos].value;
                }
            }

            context = params.context;
            if (bibliographicRecordId !== undefined && agencyId !== undefined) {
                result = ContextUtil.getValue(context, 'convertToDanMarc2', bibliographicRecordId, agencyId);
            }
        }

        var start = new Date().getTime();

        try {
            if (result === undefined) {
                result = new Record();
                for (var i = 0; i < obj.fields.length; i++) {
                    var objField = obj.fields[i];

                    var field = new Field(objField.name.toString() + '', objField.indicator.toString() + '');

                    for (var j = 0; j < objField.subfields.length; j++) {
                        var objSubfield = objField.subfields[j];
                        field.append(new Subfield(objSubfield.name.toString() + '', objSubfield.value.toString() + ''));
                    }

                    result.append(field);
                }

                if (params !== undefined && params.context !== undefined && bibliographicRecordId !== undefined && agencyId !== undefined) {
                    context = params.context;
                    ContextUtil.setValue(context, result, 'convertToDanMarc2', bibliographicRecordId, agencyId);
                }
            }
            return result;
        } catch (ex) {
            Log.debug("Catch exception: ", ex);
            throw ex;
        } finally {
            Log.trace("Exit - DanMarc2Converter.convertToDanMarc2()");
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.DanMarc2Converter.convertToDanMarc2]');
        }
    }

    /**
     * Converts a DanMarc2 record (of type Record) to a pure JavaScript object.
     *
     * @param {Record} record The record to convert to a pure JS object.
     *
     * @return {Object} JS object that contains the record values. See the module description
     *                  for a definition of this object.
     *
     * @name DanMarc2Converter#convertFromDanMarc2
     */
    function convertFromDanMarc2(record) {
        Log.trace("Enter - DanMarc2Converter.convertFromDanMarc2()");
        var start = new Date().getTime();
        var result = {
            fields: []
        };

        try {
            record.eachField(/./, function (field) {
                var objField = convertFromDanMarc2Field(field);
                result.fields.push(objField);
            });
            return result;
        } finally {
            Log.trace("Exit - DanMarc2Converter.convertFromDanMarc2()");
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.DanMarc2Converter.convertFromDanMarc2]');
        }
    }


    /**
     * Converts a DanMarc2 field (of type Field) to a pure JavaScript object.
     *
     * @param {Field} field The field to convert to a pure JS object.
     *
     * @return {Object} JS object that contains the field. See the module description
     *                  for a definition of this object.
     *
     * @name DanMarc2Converter#convertFromDanMarc2Field
     */
    function convertFromDanMarc2Field(field) {
        Log.trace("Enter - DanMarc2Converter.convertFromDanMarc2Field()");
        var result = {
            name: field.name.toString() + '',
            indicator: field.indicator.toString() + '',
            subfields: []
        };

        try {
            field.eachSubField(/./, function (field, subfield) {
                result.subfields.push({
                    name: subfield.name.toString() + '',
                    value: subfield.value.toString() + ''
                });
            });
            return result;
        } finally {
            Log.trace("Exit - DanMarc2Converter.convertFromDanMarc2Field()");
        }
    }

    return {
        'convertToDanMarc2': convertToDanMarc2,
        'convertFromDanMarc2': convertFromDanMarc2,
        'convertFromDanMarc2Field': convertFromDanMarc2Field
    };
}();
