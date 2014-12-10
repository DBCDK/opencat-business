//-----------------------------------------------------------------------------
use( "Marc" );
use( "StringUtil" );
use( "Log" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DanMarc2Converter' ];

//-----------------------------------------------------------------------------
/**
 * This module can convert a Record instance to an pure JavaScript Object containing 
 * the values (fields and subfields) from the record. The module does also has an 
 * operation to convert a pure JavaScript Object to a Record.
 * 
 * The pure JavaScript Object is used to parse a DanMarc2 record to/from the environment
 * as a pure JSON string. The object has the following content:
 * 
 * @example
 * 	{
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
var DanMarc2Converter = function() {       
    /**
     * Converts a pure JavaScript Object to a Record.
     * 
     * @param {Object} obj The pure JavaScript Object. See the module description of a 
     * 					   definition of the content of this obj.
     * 
     * @return {Record} The new Record object.
     * 
     * @name DanMarc2Converter#convertToDanMarc2
     */
    function convertToDanMarc2( obj ) {
        Log.trace( "Enter - DanMarc2Converter.convertToDanMarc2()" );

        ValueCheck.checkThat( "obj", obj ).type( "object" );        
        ValueCheck.checkThat( "obj.fields", obj.fields ).instanceOf( Array );
        
        var result = new Record();        
        try {
	        for( var i = 0; i < obj.fields.length; i++ ) {
	        	var objField = obj.fields[ i ];
	            ValueCheck.checkThat( "obj.fields[ " + i + " ]", objField ).type( 'object' );
	            ValueCheck.checkThat( "obj.fields[ " + i + " ].name", objField.name ).type( 'string' );
	            ValueCheck.checkThat( "obj.fields[ " + i + " ].indicator", objField.indicator ).type( 'string' );
	            ValueCheck.checkThat( "obj.fields[ " + i + " ].subfields", objField.subfields ).instanceOf( Array );
	        	
	        	var field = new Field( objField.name, objField.indicator );
	            
	            for( var j = 0; j < objField.subfields.length; j++ ) {
	                var objSubfield = objField.subfields[ j ];
		            
	                ValueCheck.checkThat( "obj.fields[ " + i + " ].subfields[ " + j + "]", objSubfield ).type( 'object' );
	                ValueCheck.checkThat( "obj.fields[ " + i + " ].subfields[ " + j + "].name", objSubfield.name ).type( 'string' );
	                ValueCheck.checkThat( "obj.fields[ " + i + " ].subfields[ " + j + "].value", objSubfield.value ).type( 'string' );

	                field.append( new Subfield( objSubfield.name, objSubfield.value ) );
	            }
	            
	            result.append( field );
	        }
	        
	        return result;
        }
        finally {
        	Log.info( "Exit - DanMarc2Converter.convertToDanMarc2() - " + result.toString() );
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
    function convertFromDanMarc2( record ) {
        Log.trace( "Enter - DanMarc2Converter.convertFromDanMarc2()" );

        var result = {
            fields: []
        };
        
        try {
            ValueCheck.checkThat( "record", record ).instanceOf( Record );
            
	        record.eachField( /./, function( field ) {
	            var objField = {
	                name: field.name,
	                indicator: field.indicator,
	                subfields: []
	            };
	            
	            field.eachSubField( /./, function( field, subfield ) {
	            	objField.subfields.push( { name: subfield.name, value: subfield.value } );
	            });
	            
	            result.fields.push( objField );
	        } );
	        	        
	        return result;
        }
        finally {
        	Log.trace( "Exit - DanMarc2Converter.convertFromDanMarc2() - " + result );
        }
    }
            
    return {
        'convertToDanMarc2': convertToDanMarc2,
        'convertFromDanMarc2': convertFromDanMarc2
    };
}();
