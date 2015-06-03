use( "Exception" );
use( "Log" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "TemplateUrl" );
use( "ValidateErrors" );
use( "ValueCheck" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['AllFieldsMandatoryIfOneExist'];
//-----------------------------------------------------------------------------
var AllFieldsMandatoryIfOneExist = function( ) {
    var BUNDLE_NAME = "validation";

    /**
     * Verifies that if one of the fields from params is present, all must be present.
     * @syntax RecordRules.allFieldsMandatoryIfOneExist( record, params )
     * @param {object} record
     * @param {object} params must contain a key 'fields' with an array of fields that must be present
     * params example:
     * {'fields': ['008','009','038','039','100','110','239','245','652']}
     * @return {object}
     * @name RecordRules.allFieldsMandatoryIfOneExist
     * @method
     */
    function validateRecord( record, params) {
        Log.trace ( "Enter - RecordRules.allFieldsMandatoryIfOneExist( ", record, ", ", params, " )" );

        var result = [];
        try {
            var bundle = ResourceBundleFactory.getBundle( BUNDLE_NAME );

            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.fields", params.fields ).instanceOf( Array );

            var totalFieldsFound = 0;
            var foundFields = [];
            var field;
            var totalFieldsToCheckFor = params.fields.length;
            for ( var i = 0 ; i < totalFieldsToCheckFor ; ++i ) {
                field = params.fields[i];
                if ( __recordContainsField( record, field ) ) {
                    totalFieldsFound += 1;
                    foundFields.push( { name: field, value: true } );
                } else {
                    foundFields.push( { name: field, value: false } );
                }
            }
            if ( totalFieldsFound > 0 && totalFieldsFound < totalFieldsToCheckFor ) {
                foundFields.forEach( function(f){
                    if ( f.value === false ) {
                        var message = ResourceBundle.getStringFormat( bundle, "field.mandatory.error", f.name );
                        result.push( ValidateErrors.recordError( "TODO:fixurl", message ) );
                    }
                });
            }
            return result;
        } finally {
            Log.trace( "Exit - RecordRules.allFieldsMandatoryIfOneExist(): ", result );
        }
    }
    function __recordContainsField( record, fieldName ) {
        Log.trace ( "RecordRules.__recordContainsField" );
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                return true;
            }
        }
        return false;
    }
    return {"validateRecord" : validateRecord,
            "__BUNDLE_NAME"  : BUNDLE_NAME
    };
}();