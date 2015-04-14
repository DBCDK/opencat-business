//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "RawRepoClient" );
use( "UnitTest" );
use( "Log" );
use( "Marc" );
use ( "LookUpRecord");
//-----------------------------------------------------------------------------

UnitTest.addFixture( "LookUpRecord", function( ) {

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

    var errorMessage = 'Recorden med id awrong og agencyId bwrong findes ikke i forvejen.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001a og 001b mismatch , findes ikke i repo" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, {}), errors1a );


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

    SafeAssert.equal( "Record findes i repo" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, {}), [] );


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

    var errorMessage = 'Recorden med id awrong og agencyId b1Val findes ikke i forvejen.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001 a mismatch" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, {}), errors1a );

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

    var errorMessage = 'Recorden med id a1Val og agencyId bwrong findes ikke i forvejen.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "001 b mismatch" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, {}), errors1a );

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

    var params = {"agencyId" :"paramsNoMatch"};
    var errorMessage = 'Recorden med id a1Val og agencyId paramsNoMatch findes ikke i forvejen.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med ikke matchende params" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), errors1a );


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

    var params = {"agencyId" :"b1Val"};
    var errorMessage = 'Recorden med id a1Val og agencyId paramsNoMatch findes ikke i forvejen.';
    var errors1a = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med matchende params" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), [] );
} );