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
    var field004 = new Field( "004", "00" );
    field004.append ( new Subfield ( "a", "a1" ));
    field004.append (new Subfield ( "a", "a2" ));
    field004.append (new Subfield ( "b", "b1" ));
    trueMarcRec.append (field004);
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
            }]
        }]
    };

    var params = {"agencyId" :"b1Val"};
    SafeAssert.equal( "med matchende params" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), [] );



    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };

    var params = {"agencyId" :"b1Val", "allowedSubfieldValues" : ["a1" ,"a2" ,"a3"] ,"requiredFieldAndSubfield" : "004a" };
    SafeAssert.equal( "med valide allowedSubfieldValues og requiredFieldAndSubfield" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), [] );


    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };

    var params = {"agencyId" :"b1Val", "allowedSubfieldValues" : ["nonValidValue1" ,"nonValidValue2" ,"nonValidValue3"] ,"requiredFieldAndSubfield" : "004a" };
    var errorMessage = 'Recorden med id a1Val og agencyId b1Val har ikke en af f\u00f8lgende v\u00E6rdier nonValidValue1,nonValidValue2,nonValidValue3 i 004a.';
    var err = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med ikke valide allowedSubfieldValues men valid requiredFieldAndSubfield" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), err );

    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };

    var params = {"agencyId" :"b1Val", "allowedSubfieldValues" : ["nonValidValue1" ,"nonValidValue2" ,"a2"] ,"requiredFieldAndSubfield" : "004a" };
    var errorMessage = 'Recorden med id a1Val og agencyId b1Val har ikke en af f\u00f8lgende v\u00E6rdier a1,a2,a3 i 005a.';
    err = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med valid allowedSubfieldValues og valid requiredFieldAndSubfield med check af andet subfield" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), [] );

    var record = {
        fields: [{
            name: '001', indicator: '00', subfields: [{
                name: "a", value: "a1Val"
            }]
        }]
    };

    var params = {"agencyId" :"b1Val", "allowedSubfieldValues" : ["a1" ,"a2" ,"a3"] ,"requiredFieldAndSubfield" : "005a" };
    var errorMessage = 'Recorden med id a1Val og agencyId b1Val har ikke en af f\u00f8lgende v\u00E6rdier a1,a2,a3 i 005a.';
    err = [{type:"ERROR", params:{url:"", message:errorMessage}}];
    SafeAssert.equal( "med valid allowedSubfieldValues men ikke valide requiredFieldAndSubfield" ,  LookUpRecord.validateSubfield( record, record.fields[0], {}, params), err );

} );