//-----------------------------------------------------------------------------
use( "Log" );
use( "RawRepoClient" );
use( "ValidateErrors" );
//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'LoopUpRecord' ];
//-----------------------------------------------------------------------------
var LoopUpRecord = function () {
    /**
     * checkForRecord
     * @syntax
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} String, if omitted the value from 001 b  will be used instead.
     * @return Array which is either empty or contains an error
     * @name SubfieldRules.subfieldCannotContainValue
     * @method
     */
    function checkForRecord ( record, field, subfield, params ) {
        Log.trace( "Enter - LoopUpRecord.checkForRecord()" );
        try {
            ValueCheck.check( "record", record ).type( "object" );
            ValueCheck.check( "field", field ).type( "object" );

            var agencyId = "";
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
            if ( typeof params === "string" ) {
                agencyId = params;
            }
            if ( RawRepoClient.recordExists( recordId, agencyId ) ) {
                return [];
            } else {
                return [ValidateErrors.subfieldError( "", StringUtil.sprintf( "Recorden med id %s og agencyId %s findes ikke i rawrepo.", recordId, agencyId ) )];
            }
        }
        finally {
            Log.trace( "Exit - LoopUpRecord.checkForRecord()" );
        }
    }
    return {
        'checkForRecord': checkForRecord
    };
}();

//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "RawRepoClient" );
use( "UnitTest" );
use( "Log" );
use( "Marc" );

//-----------------------------------------------------------------------------

UnitTest.addFixture( "LoopUpRecord", function( ) {

    // creating the record in rawrepo
    var trueMarcRec = new Record( );
    var field001 = new Field( "001", "00" );
    field001.append ( new Subfield ( "a", "a1Val" ));
    field001.append (new Subfield ( "b", "b1Val" ));
    trueMarcRec.append (field001);
    RawRepoClientCore.addRecord( trueMarcRec );


    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    var errorMessage = 'Recorden med id awrong og agencyId bwrong findes ikke i rawrepo.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001a og 001b mismatch , findes ikke i repo" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}), errors1a );


    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "b1Val"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    SafeAssert.equal( "Record findes i repo" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}), [] );


    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "awrong"
            }, {
                name: "b", value: "b1Val"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    var errorMessage = 'Recorden med id awrong og agencyId b1Val findes ikke i rawrepo.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001 a mismatch" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}), errors1a );

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    var errorMessage = 'Recorden med id a1Val og agencyId bwrong findes ikke i rawrepo.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001 b mismatch" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}), errors1a );

    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "b1Val"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    var params = "paramsNoMatch"
    var errorMessage = 'Recorden med id a1Val og agencyId paramsNoMatch findes ikke i rawrepo.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med ikke matchende params" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}, params), errors1a );


    record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }, {
                name: "b", value: "bwrong"
            }, {
                name: "c", value: "c1Val"
            }]
        }]
    };

    var params = "b1Val"
    var errorMessage = 'Recorden med id a1Val og agencyId paramsNoMatch findes ikke i rawrepo.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med matchende params" ,  LoopUpRecord.checkForRecord( record, record.fields[0], {}, params), [] );


} );


