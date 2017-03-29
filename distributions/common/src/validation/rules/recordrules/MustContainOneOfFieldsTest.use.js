use( "SafeAssert" );
use( "UnitTest" );
use( "MustContainOneOfFields" );

UnitTest.addFixture( "Test MustContainOneOfFields.validateRecord", function( ) {

    var record = {
        fields : [{
            name : '001',
            indicator : '00',
            subfields : []
        }, {
            name : '002',
            indicator : '00',
            subfields : []
        }, {
            name : '003',
            indicator : '00',
            subfields : []
        }]
    };

    var params = {
        'fields' : ['001', '002', '003']
    };
    Assert.equal( "1 testing with valid " + params + " param", MustContainOneOfFields.validateRecord( record, params ), [] );

    params = {
        'fields' : []
    };
    var err = new Error("ValueCheckError: The following check failed: Value of 'params.fields' : '0' is not > '0'");

    Assert.exception ("2 testing with valid " + params + " param", function(){MustContainOneOfFields.validateRecord( record, params )} , err);

    params = {
        'fields' : ['001', '004']
    };
    Assert.equal( "3 testing with valid " + params + " param", MustContainOneOfFields.validateRecord( record, params ), [] );

    params = {
        'fields' : ['004', '005']
    };

    var valErr =  [({type:"ERROR", urlForDocumentation:"", message:"Et af felterne '004,005' skal forefindes i posten."})];
    Assert.equal( "4 testing with valid " + params + " param", MustContainOneOfFields.validateRecord( record, params ), valErr );
} );
