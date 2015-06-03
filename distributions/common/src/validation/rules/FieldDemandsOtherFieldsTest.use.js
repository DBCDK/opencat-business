//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "UnitTest" );
use( "Log" );
use ( "FieldDemandsOtherFields");
//-----------------------------------------------------------------------------

UnitTest.addFixture( "FieldDemandsOtherFields first", function( ) {

    var bundle = ResourceBundleFactory.getBundle( FieldDemandsOtherFields.__BUNDLE_NAME );

    var record = {
        fields: [
            {
                name: '001', indicator: '00', subfields: []
            },
            {
                name: '002', indicator: '00', subfields: []
            },
            {
                name: '003', indicator: '00', subfields: []
            },
            {
                name: '004', indicator: '00', subfields: []
            },
            {
                name: '101', indicator: '00', subfields: []
            },
            {
                name: '102', indicator: '00', subfields: []
            },
            {
                name: '103', indicator: '00', subfields: []
            },
            {
                name: '104', indicator: '00', subfields: []
            }
        ]
    };

    //params error testing
    var error= [{type:"ERROR", params:{url:"", message:"Params mangler sources og demands attribbuterne."}}];
    SafeAssert.equal( "FieldDemandsOtherFields with empty params obj" ,  FieldDemandsOtherFields.validateFields( record, {}, {}), error);
    var params = { "demands" : ["001"]};
    var error= [{type:"ERROR", params:{url:"", message:"Params attributten demands er angivet men attributten sources mangler."}}];
    SafeAssert.equal( "FieldDemandsOtherFields with params but no sources obj" ,  FieldDemandsOtherFields.validateFields( record, params, {} ), error);
    var params = {"sources" : ["001"], "demands" : []};
    var error= [{type:"ERROR", params:{url:"", message:"Params attributten demands skal minimum indeholde een v\xe6rdi."}}];
    SafeAssert.equal( "FieldDemandsOtherFields with params but no values in demands array" ,  FieldDemandsOtherFields.validateFields( record, params, {}), error);
    var params = {"sources" : [], "demands" : ["001"]};
    var error= [{type:"ERROR", params:{url:"", message:"Params attributten sources skal minimum indeholde een v\xe6rdi."}}];
    SafeAssert.equal( "FieldDemandsOtherFields with params obj but no values in sources array" ,  FieldDemandsOtherFields.validateFields( record, params, {}), error);

    // ok testing
    var params = {"sources" : ["001"], "demands" : ["001"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand 001 and source 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);
    var params = {"sources" : ["004"], "demands" : ["001"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand 004 and source 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);
    var params = {"sources" : ["005"], "demands" : ["001"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand 005 and source 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);
    var params = {"sources" : ["005"], "demands" : ["005"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand 005 and source 005" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);
    var params = {"sources" : ["001","002","003","004","101","102","103","104"], "demands" : ["001","002","003","004","101","102","103","104"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand all and source all" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);
    var params = {"sources" : ["001","002","003","004","101","102","103","104","105"], "demands" : ["004"]};
    SafeAssert.equal( "FieldDemandsOtherFields demand 004 and source all +1" ,  FieldDemandsOtherFields.validateFields( record, params, {}),[]);

    //logic errors testing
    var params = {"sources" : ["001"], "demands" : ["005"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001'  er f\xf8lgende felter obligatoriske og mangler : '005'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields source 001 and demands 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

    var params = {"sources" : ["001","002"], "demands" : ["005"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001,002'  er f\xf8lgende felter obligatoriske og mangler : '005'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields demands 005 source 001,002" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

    var params = {"sources" : ["001", "005"], "demands" : ["005"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001'  er f\xf8lgende felter obligatoriske og mangler : '005'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields demands 005 source 001,005" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

    var params = {"sources" : ["001", "005","006","002"], "demands" : ["005"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001,002'  er f\xf8lgende felter obligatoriske og mangler : '005'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 005 and source 001,005,006,002" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

    var params = {"sources" : ["001", "004"], "demands" : ["001","005"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001,004'  er f\xf8lgende felter obligatoriske og mangler : '005'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 001 and source 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

    var params = {"sources" : ["001", "004"], "demands" : ["001","005","006"]};
    var error= [{type:"ERROR", params:{url:"", message:"Da f\xf8lgende felter er tilstede i posten : '001,004'  er f\xf8lgende felter obligatoriske og mangler : '005,006'."}}];
    SafeAssert.equal( "FieldDemandsOtherFields demand 001 and source 001" ,  FieldDemandsOtherFields.validateFields( record, params, {}),error);

} );