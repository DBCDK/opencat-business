//-----------------------------------------------------------------------------
use( "Log" );
use( "RawRepoClient" );
use( "ValidateErrors" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['LookUpRecord'];
//-----------------------------------------------------------------------------
var LookUpRecord = function () {
    /**
     * validateSubfield
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object with the following properties.
     * agencyId : if omitted the value from field 001 subfield b will be used instead.
     * requiredFieldAndSubfield : String containing the field and subfield the record from rawrepo must contain , formatted in the following fashion 004a
     * allowedSubfieldValues : Array containing the allowed values of the subfield
     * @return Array which is either empty or contains an error
     * @name SubfieldRules.subfieldCannotContainValue
     * @method
     */
    function validateSubfield ( record, field, subfield, params, settings ) {
        Log.trace( "Enter - LoopUpRecord.validateSubfield()" );
        try {
            ValueCheck.check( "record", record ).type( "object" );
            ValueCheck.check( "field", field ).type( "object" );
            ValueCheck.check( "params", params ).type( "object" );

            var recordId = "";
            var agencyId = "";

            field.subfields.forEach( function ( subfieldVal ) {
                switch ( subfieldVal.name ) {
                    case "a":
                        recordId = subfieldVal.value;
                        break;
                    case "b":
                        agencyId = subfieldVal.value;
                        break;
                }
            } );
            if ( params !== undefined && typeof params.agencyId === "string" ) {
                agencyId = params.agencyId;
            }
            var record = RawRepoClient.fetchRecord( recordId, agencyId );
            if ( record === undefined ) {
                return [ValidateErrors.subfieldError( "", StringUtil.sprintf( "Recorden med id %s og agencyId %s findes ikke i forvejen.", recordId, agencyId ) )];
            }
            if ( params.hasOwnProperty( "requiredFieldAndSubfield" ) || params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                var checkParamsResult = __checkParams( params );

                if ( checkParamsResult.length > 0 ) {
                    return checkParamsResult;
                }
                if ( !__fieldAndSubfieldMandatoryAndHaveValues( record, params ) ) {
                    return [ValidateErrors.subfieldError( "", StringUtil.sprintf( "Recorden med id %s og agencyId %s har ikke en af f\u00f8lgende v\u00E6rdier %s i %s.", recordId, agencyId, params.allowedSubfieldValues, params.requiredFieldAndSubfield ) )];
                }
            }
            return [];
        }
        finally {
            Log.trace( "Exit - LoopUpRecord.validateSubfield()" );
        }
    }

//-----------------------------------------------------------------------------
// Helper functions
//-----------------------------------------------------------------------------
    function __checkParams ( params ) {
        Log.trace( "Enter - LookUpRecord.__checkParams" );
        try {
            var ret = [];
            if ( params.hasOwnProperty( "requiredFieldAndSubfield" ) && params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                if ( typeof params.requiredFieldAndSubfield !== "string" ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten requiredFieldAndSubfield er ikke af typen string" ) );
                    Log.warn( "requiredFieldAndSubfield has errornous value" );
                }
                if ( !Array.isArray(params.allowedSubfieldValues) ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten allowedSubfieldValues er ikke af typen array" ) );
                    Log.warn( "allowedSubfieldValues is not of type array" );
                } else if ( params.allowedSubfieldValues.length < 1 ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten allowedSubfieldValues skal minimum indeholde een v\u00E6rdi" ) );
                    Log.warn( "allowedSubfieldValues is empty" );
                }
            } else {
                if ( params.hasOwnProperty( "requiredFieldAndSubfield" ) && !params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten requiredFieldAndSubfield er angivet men allowedSubfieldValues mangler" ) );
                    Log.warn( "allowedSubfieldValues is missing" );
                } else if ( !params.hasOwnProperty( "requiredFieldAndSubfield" ) && params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                    ret.push( ValidateErrors.subfieldError( "", "Params attributten allowedSubfieldValues er angivet men requiredFieldAndSubfield mangler" ) );
                    Log.warn( "allowedSubfieldValues is missing" );
                }
            }
            return ret;
        } finally {
            Log.trace( "Exit - LookupRecord.__checkParams()" );
        }
    }

    function __fieldAndSubfieldMandatoryAndHaveValues ( marcRecord, params ) {
        Log.trace( "Enter - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues()" );
        try {
            var fieldNrFromParams = params.requiredFieldAndSubfield.substring( 0, 3 );
            var subFieldFromParams = params.requiredFieldAndSubfield.substring( 3, 4 );
            var expAllowedValsFromParams = new RegExp( params.allowedSubfieldValues.join( "|" ) );

            return marcRecord.matchValue( fieldNrFromParams, subFieldFromParams, expAllowedValsFromParams );
        }
        finally {
            Log.trace( "Exit - LoopUpRecord.__fieldAndSubfieldMandatoryAndHaveValues" );
        }
    }


//-----------------------------------------------------------------------------
// End helper functions
//-----------------------------------------------------------------------------

    return {
        'validateSubfield': validateSubfield
    }
}();