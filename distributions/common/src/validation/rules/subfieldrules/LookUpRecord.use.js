//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Log" );
use( "RawRepoClient" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UpdateConstants" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = ['LookUpRecord'];

//-----------------------------------------------------------------------------
var LookUpRecord = function () {
    var __BUNDLE_NAME = "validation";

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
     * @name LookUpRecord
     * @method
     */
    function validateSubfield ( record, field, subfield, params, settings ) {
        Log.trace( "Enter - LoopUpRecord.validateSubfield()" );
        try {
            ValueCheck.check( "record", record ).type( "object" );
            ValueCheck.check( "field", field ).type( "object" );
            ValueCheck.check( "subfield", subfield ).type( "object" );
            ValueCheck.check( "params", params ).type( "object" );

            var bundle = ResourceBundleFactory.getBundle( __BUNDLE_NAME );

            var recordId = subfield.value;
            var agencyId = "";

            if( params !== undefined && typeof params.agencyId === "string" ) {
                agencyId = params.agencyId;
            }
            else {
                var marc = DanMarc2Converter.convertToDanMarc2( record );
                agencyId = marc.getValue( /001/, /b/ );

                if( agencyId === UpdateConstants.COMMON_AGENCYID ) {
                    agencyId = UpdateConstants.RAWREPO_COMMON_AGENCYID;
                }
            }

            Log.trace( "recordId: ", recordId );
            Log.trace( "agencyId: ", agencyId );

            if( !ValidationUtil.isNumber( agencyId ) ) {
                var msg = ResourceBundle.getString( bundle, "agencyid.not.a.number" );
                return [ ValidateErrors.subfieldError( "TODO:fixurl", msg ) ];
            }

            if ( !RawRepoClientCore.recordExists ( recordId, agencyId ) ) {
                Log.trace( "Record does not exist!" );
                return [ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.does.not.exist", recordId ) ) ];
            }

            if ( params.hasOwnProperty( "requiredFieldAndSubfield" ) || params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                var checkParamsResult = __checkParams( params, bundle );

                if ( checkParamsResult.length > 0 ) {
                    return checkParamsResult;
                }
                if ( !__fieldAndSubfieldMandatoryAndHaveValues( RawRepoClient.fetchRecord( recordId, agencyId ) , params ) ) {
                    return [ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.values", recordId, params.allowedSubfieldValues, params.requiredFieldAndSubfield ) ) ];
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
    function __checkParams ( params , bundle) {
        Log.trace( "Enter - LookUpRecord.__checkParams" );
        try {
            var ret = [];
            if ( !params.hasOwnProperty( "requiredFieldAndSubfield" ) && !params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                Log.warn( "requiredFieldAndSubfield and allowedSubfieldValues is missing" );
                return [ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "field.demands.other.fields.missing.sources.and.demands" ) )];
            }
            if ( !params.hasOwnProperty( "allowedSubfieldValues" ) ) {
                Log.warn( "allowedSubfieldValues is missing" );
                return [ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.value.allowedSubfieldValues" ) )];
            }
            if ( !params.hasOwnProperty( "requiredFieldAndSubfield" ) )  {
                Log.warn( "allowedSubfieldValues is missing" );
                return [ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.value.requiredFieldAndSubfield" ) )];
            }
            if ( typeof params.requiredFieldAndSubfield !== "string" ) {
                Log.warn( "requiredFieldAndSubfield has errornous value" );
                ret.push( ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.value.requiredFieldAndSubfield.not.string" ) ) );
            }
            if ( !Array.isArray( params.allowedSubfieldValues ) ) {
                Log.warn( "allowedSubfieldValues is not of type array" );
                ret.push( ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.value.allowedSubfieldValues.not.array" ) ) );
            } else if ( Array.isArray( params.allowedSubfieldValues ) &&  params.allowedSubfieldValues.length < 1 ) {
                Log.warn( "allowedSubfieldValues is empty" );
                ret.push( ValidateErrors.subfieldError( "", ResourceBundle.getStringFormat( bundle, "lookup.record.missing.value.allowedSubfieldValues.no.items" ) ) );
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
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
