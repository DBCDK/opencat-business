use("SafeAssert");
use("UnitTest");
use("Log");
use("FieldDemandsOtherFields");

UnitTest.addFixture( "FieldDemandsOtherFields first", function( ) {
    var record = {
        fields: [{name: '001', indicator: '00', subfields: []},
            {name: '002', indicator: '00', subfields: []},
            {name: '003', indicator: '00', subfields: []},
            {name: '004', indicator: '00', subfields: []},
            {name: '101', indicator: '00', subfields: []},
            {name: '102', indicator: '00', subfields: []},
            {name: '103', indicator: '00', subfields: []},
            {name: '104', indicator: '00', subfields: []}
        ]
    };

    //params error testing
    var error = [{type:"ERROR", urlForDocumentation: "", message: "Params mangler sources og demands attributterne."}];
    SafeAssert.equal( "FieldDemandsOtherFields with empty params obj" ,  FieldDemandsOtherFields.validateRecord( record, {}), error);
    var params = {"demands" : ["001"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Params attributten demands er angivet men attributten sources mangler."}];
    SafeAssert.equal( "FieldDemandsOtherFields with params but no sources obj" ,  FieldDemandsOtherFields.validateRecord( record, params), error);
    params = {"sources" : ["001"], "demands" : []};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Params attributten demands skal minimum indeholde een v\xe6rdi."}];
    SafeAssert.equal( "FieldDemandsOtherFields with params but no values in demands array" ,  FieldDemandsOtherFields.validateRecord( record, params), error);
    params = {"sources" : [], "demands" : ["001"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Params attributten sources skal minimum indeholde een v\xe6rdi."}];
    SafeAssert.equal( "FieldDemandsOtherFields with params obj but no values in sources array" ,  FieldDemandsOtherFields.validateRecord( record, params), error);

    // ok testing
    params = {"sources" : ["001"], "demands" : ["001"]};
    SafeAssert.equal("FieldDemandsOtherFields demand 001 and source 001",  FieldDemandsOtherFields.validateRecord(record, params),[]);
    params = {"sources" : ["004"], "demands" : ["001"]};
    SafeAssert.equal("FieldDemandsOtherFields demand 004 and source 001",  FieldDemandsOtherFields.validateRecord(record, params),[]);
    params = {"sources" : ["005"], "demands" : ["001"]};
    SafeAssert.equal("FieldDemandsOtherFields demand 005 and source 001",  FieldDemandsOtherFields.validateRecord(record, params),[]);
    params = {"sources" : ["005"], "demands" : ["005"]};
    SafeAssert.equal("FieldDemandsOtherFields demand 005 and source 005",  FieldDemandsOtherFields.validateRecord(record, params),[]);
    params = {"sources" : ["001","002","003","004","101","102","103","104"], "demands" : ["001","002","003","004","101","102","103","104"]};
    SafeAssert.equal("FieldDemandsOtherFields demand all and source all" ,  FieldDemandsOtherFields.validateRecord(record, params),[]);
    params = {"sources" : ["001","002","003","004","101","102","103","104","105"], "demands" : ["004"]};
    SafeAssert.equal("FieldDemandsOtherFields demand 004 and source all +1",  FieldDemandsOtherFields.validateRecord(record, params),[]);

    //logic errors testing
    params = {"sources" : ["001"], "demands" : ["005"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001'  er f\xf8lgende felter obligatoriske og mangler : '005'."}];
    SafeAssert.equal( "FieldDemandsOtherFields source 001 and demands 001" ,  FieldDemandsOtherFields.validateRecord(record, params), error);

    params = {"sources" : ["001","002"], "demands" : ["005"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001,002'  er f\xf8lgende felter obligatoriske og mangler : '005'."}];
    SafeAssert.equal( "FieldDemandsOtherFields demands 005 source 001,002" ,  FieldDemandsOtherFields.validateRecord(record, params), error);

    params = {"sources" : ["001", "005"], "demands" : ["005"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001'  er f\xf8lgende felter obligatoriske og mangler : '005'."}];
    SafeAssert.equal( "FieldDemandsOtherFields demands 005 source 001,005" ,  FieldDemandsOtherFields.validateRecord(record , params), error);

    params = {"sources" : ["001", "005","006","002"], "demands" : ["005"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001,002'  er f\xf8lgende felter obligatoriske og mangler : '005'."}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 005 and source 001,005,006,002" ,  FieldDemandsOtherFields.validateRecord(record, params), error);

    params = {"sources" : ["001", "004"], "demands" : ["001","005"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001,004'  er f\xf8lgende felter obligatoriske og mangler : '005'."}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 001 and source 001" ,  FieldDemandsOtherFields.validateRecord(record, params), error);

    params = {"sources" : ["001", "004"], "demands" : ["001","005","006"]};
    error = [{type:"ERROR", urlForDocumentation: "", message: "Da f\xf8lgende felter er tilstede i posten : '001,004'  er f\xf8lgende felter obligatoriske og mangler : '005,006'."}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 001 and source 001",  FieldDemandsOtherFields.validateRecord(record , params), error);
} );