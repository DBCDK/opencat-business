//-----------------------------------------------------------------------------
use( "Log" );
use( "ValueCheck" );
use( "ValidateErrors" );
use( "Print" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'SubfieldMandatoryIfSubfieldNotPresentRule' ];

//-----------------------------------------------------------------------------
var SubfieldMandatoryIfSubfieldNotPresentRule = function() {

    /**
     * Makes a subfield mandatory if another subfield is not presented in the field.
     *
     * @syntax SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )
     * @param {object} record The record that contains the field.
     * @param {object} field  The field to validate.
     * @param {object} params Object with two properties: 'subfield' and 'not_presented_subfield'.
     *                        'subfield' is the name of the subfield that should be mandatory.
     *                        Ex. "m". 'not_presented_subfield' is the list og field/subfield that
     *                        should not be presented in the record for 'subfield' to be mandatory.
     *                        The 'not_presented_subfield' list should be formatted as field/subfield, ex.
     *                        ["652m", "666abc", "123z"].
     * @return {Array} Array of validation errors.
     * @example SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )
     * @name SubfieldMandatoryIfSubfieldNotPresentRule.validateField
     * @method
     */
    function validateField( record, field, params ) {
        Log.trace( "Enter - SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )" );

        try {
            Log.trace( "Params = " + uneval( params ) );
            ValueCheck.checkThat( "params", params ).type( "object" );
            ValueCheck.check( "params.subfield", params['subfield'] ).type( "string" );
            ValueCheck.check( "params.not_presented_subfield", params['not_presented_subfield'] ).instanceOf( Array );

            var fieldsFromRecord = __getFieldsFromRecord( record, field.name );
            if ( __isSubfieldPresentInFields( fieldsFromRecord.fields, params.subfield ) ) {
                return [];
            }

            params.not_presented_subfield.forEach( function ( fieldSubfield ) {
                if ( fieldSubfield.length < 4 ) {
                    // TODO: hvad hulen står der her???
                    Log.debug( "params.not_presented_subfield is not a field/subfield: %s in param %s", fieldSubfield, params.subfields );
                    throw StringUtil.sprintf( "params.not_presented_subfield is not a field/subfield: %s in param %s", params.not_presented_subfield, params.subfields );
                }
            } );

            var foundFieldAndSubfields = __isAnyOfListOfSubfieldsFoundInFieldList( record, params.not_presented_subfield );

            var result = [];
            if ( !foundFieldAndSubfields ) {
                var errorMessage = StringUtil.sprintf( 'Delfelt "%s" mangler i felt "%s".', params.subfield, field.name );
                result.push( ValidateErrors.fieldError( "TODO:url", errorMessage ) );
            }
            return result;
        }
        finally {
            Log.trace( "Exit - SubfieldMandatoryIfSubfieldNotPresentRule.validateField( record, field, params )" );
        }
    }

    //Helper function, returns true if the subfield is found in list of fields
    function __isSubfieldPresentInFields( fieldsFromRecord, subfieldName ) {
        Log.trace ( "SubfieldMandatoryIfSubfieldNotPresentRule.__isSubfieldPresentInFields" );
        for ( var i = 0; i < fieldsFromRecord.length ; ++i ) {
            if ( __doesFieldContainSubfield( fieldsFromRecord[i], subfieldName ) ) {
                return true;
            }
        }
        return false;
    }

    // Helper function, returns true if any of the subfields of the format ["001a", "002b"] is present in the record
    function __isAnyOfListOfSubfieldsFoundInFieldList( record, listOfFieldsAndSubfieldsString ) {
        Log.trace ( "SubfieldMandatoryIfSubfieldNotPresentRule.__getFieldsFromRecord" );
        var res = false;
        listOfFieldsAndSubfieldsString.forEach( function ( fieldSubfield ) {
            var fieldName = fieldSubfield.substring( 0, 3 );
            var subfieldNames = fieldSubfield.substring( 3 );
            var recordFields = __getFieldsFromRecord( record, fieldName );
            if ( recordFields.status === true ) {
                recordFields.fields.forEach( function( field ) {
                    for ( var j = 0; j < subfieldNames.length; ++j ) {
                        if ( __doesFieldContainSubfield( field, subfieldNames.substring( j, 1 ) ) ) {
                            res = true;
                            return;
                        }
                    }
                } );
            }
        } );
        return res;
    }

    // Helper function for getting all the fieldName fields from the record
    function __getFieldsFromRecord( record, fieldName ) {
        Log.trace ( "SubfieldMandatoryIfSubfieldNotPresentRule.__getFieldsFromRecord" );
        var res = { fields: [], status: false };
        for ( var i = 0; i < record.fields.length; ++i ) {
            if ( record.fields[i].name === fieldName ) {
                res.status = true;
                res.fields.push( record.fields[i] );
            }
        }
        return res;
    }

    // Helper function for determining is a subfield exists on a field
    function __doesFieldContainSubfield( field, subfieldName ) {
        Log.trace ( "RecordRules.__doesFieldContainSubfield" );
        for ( var i = 0 ; i < field.subfields.length ; ++i ) {
            if ( field.subfields[i].name === subfieldName ) {
                return true;
            }
        }
        return false;
    }

    return {
        'validateField': validateField
    }
}();
