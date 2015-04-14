//-----------------------------------------------------------------------------
use( "Log" );
use( "RawRepoClient" );
use( "ValidateErrors" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'LookUpRecord' ];
//-----------------------------------------------------------------------------
var LookUpRecord = function () {
    /**
     * validateSubfield
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} Object with an agencyId property, if omitted the value from field 001 subfield b will be used instead.
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
            if ( RawRepoClient.recordExists( recordId, agencyId ) ) {
                return [];
            } else {
                return [ValidateErrors.subfieldError( "", StringUtil.sprintf( "Recorden med id %s og agencyId %s findes ikke i forvejen.", recordId, agencyId ) )];
            }
        }
        finally {
            Log.trace( "Exit - LoopUpRecord.validateSubfield()" );
        }
    }
    return {
        'validateSubfield': validateSubfield
    };
}();