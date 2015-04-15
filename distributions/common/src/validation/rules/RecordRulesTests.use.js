//-----------------------------------------------------------------------------
use( "RecordRules" );
use( "UnitTest" );
use( "SafeAssert" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Test RecordRules.idFieldExists", function( ) {
    Assert.equalValue( "Empty object", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], RecordRules.idFieldExists( {} ) );
    Assert.equalValue( "Empty record", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], RecordRules.idFieldExists( {
        fields : []
    } ) );
    Assert.equalValue( "Valid record", [], RecordRules.idFieldExists( {
        fields : [{
            name : "001",
            indicator : "00",
            subfields : [{
                name : "a",
                value : "1 234 567 8"
            }]
        }]
    } ) );
} );

UnitTest.addFixture( "Test RecordRules.fieldsMandatory", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

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

    var params00123 = {
        'fields' : ['001', '002', '003']
    };
    SafeAssert.equal( "1 testing with valid " + params00123 + " param", RecordRules.fieldsMandatory( record, params00123 ), [] );

    var errorMissing004 = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "004" ) ) ];
    var params00124 = { 'fields' : ['001', '002', '004'] };
    SafeAssert.equal( "2 testing with invalid " + params00124 + " param", RecordRules.fieldsMandatory( record, params00124 ), errorMissing004 );

    var errorMissing000 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "000" ) );
    var errorMissing005 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "005" ) );
    var errorMissing004 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "004" ) );
    var errors = [errorMissing000, errorMissing005, errorMissing004];
    var params00054 = {
        'fields' : ['000', '005', '004']
    };
    SafeAssert.equal( "3 testing with invalid " + errors + " param", RecordRules.fieldsMandatory( record, params00054 ), errors );
} );

UnitTest.addFixture( "Test RecordRules.conflictingFields", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var record = {
        fields : [{
            name : '001'
        }, {
            name : '002'
        }, {
            name : '003'
        }, {
            name : '004'
        }, {
            name : '005'
        }, {
            name : '006'
        }, {
            name : '007'
        }, {
            name : '008'
        }, {
            name : '009'
        }, {
            name : '010'
        }]
    };
    var recordFieldUndef = {
        fields : undefined
    };
    var recordUndef = undefined;

    var params1 = {'fields' : ['001'] };
    SafeAssert.equal( "1 testing with valid " + params1 + " param", RecordRules.conflictingFields( record, params1 ), [] );

    var params2 = {'fields' : []};
    Assert.exception( "2 testing with empty param", 'RecordRules.conflictingFields(record, params2)' );

    var params3 = {'fields' : ['001']};
    Assert.exception( "3 testing with empty record.fields", 'RecordRules.conflictingFields(recordFieldUndef, params3)' );

    var params4 = {'fields' : ['001']};
    Assert.exception( "4 testing with empty record", 'RecordRules.conflictingFields(recordUndef, params4)' );

    var params5 = {'fields' : ['001', '002', '003']};
    var errorVal5 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.conflicting.error", "002", "001" ) );
    var errorVal6 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.conflicting.error", "003", "001" ) );
    var errorTooMany = [errorVal5,errorVal6];
    SafeAssert.equal( "length of value to short 1", RecordRules.conflictingFields( record, params5 ), errorTooMany);

    var params6 = {'fields' : ['001', '011', '012', '013', '014', '015', '016']};
    SafeAssert.equal( "length of value to short 2", RecordRules.conflictingFields( record, params6 ), [] );
} );

UnitTest.addFixture( "Test RecordRules.optionalFields", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }, {
            'name' : '004'
        }, {
            'name' : '005'
        }, {
            'name' : '006'
        }, {
            'name' : '007'
        }, {
            'name' : '008'
        }, {
            'name' : '009'
        }, {
            'name' : '010'
        }]
    };
    var recordFieldUndef = {
        fields : undefined
    };

    var params1 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']};
    SafeAssert.equal( "1 testing with valid params", RecordRules.optionalFields( record, params1 ), [] );

    var params2 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020']};
    SafeAssert.equal( "2 testing with valid params", RecordRules.optionalFields( record, params2 ), [] );

    var params3 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009']};
    var error3 = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.optional.error", "010" ) )];
    SafeAssert.equal( "3 testing with valid params", RecordRules.optionalFields( record, params3 ), error3 );

    var params4 = [];
    Assert.exception( "4 testing with empty params", 'RecordRules.optionalFields(record, params4)' );

    var params5 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']};
    SafeAssert.equal( "5 testing with empty record", RecordRules.optionalFields( record, params5 ), [] );
} );

UnitTest.addFixture( "Test RecordRules.repeatableFields", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var record1 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}]};
    var params1 = {'fields': ['003']};
    SafeAssert.equal( "1 testing with valid params and data", RecordRules.repeatableFields( record1, params1 ), [] );

    var record2 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}, {'name': '003'}]};
    var params2 = {'fields': ['001','004']};
    var error2 = [ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "003", 3 ) ) ];
    SafeAssert.equal( "2 testing with valid params, error in data", RecordRules.repeatableFields( record2, params2 ), error2 );

    var record3 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'}, {'name': '003'},
        {'name': '004'}, {'name': '004'}, {'name': '005'}, {'name': '006'}, {'name': '007'},
        {'name': '008'}, {'name': '009'}, {'name': '010'}, {'name': '010'}, {'name': '010'}]};
    var params3 = {'fields': ['002','004','010']};
    SafeAssert.equal( "3 testing with valid params and data", RecordRules.repeatableFields( record3, params3 ), [] );

    var record4 = {'fields': [{'name': '001'}]};
    var params4 = {'fields': ['002','003','004','005','006','007','008','009','010']};
    SafeAssert.equal( "4 testing with valid params and data", RecordRules.repeatableFields( record4, params4 ), [] );

    var record5 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'},
        {'name': '003'}, {'name': '003'}, {'name': '006'}, {'name': '006'}]};
    var params5 = {'fields': ['001','004','005']};
    var error5 = [];
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "002", 3 ) ) );
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "003", 2 ) ) );
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "006", 2 ) ) );
    SafeAssert.equal( "5 testing with valid params, error in data", RecordRules.repeatableFields( record5, params5 ), error5 );

    var record6 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}]};
    var params6 = {'fields': []};
    SafeAssert.equal( "6 testing with valid params and data", RecordRules.repeatableFields( record6, params6 ), [] );
} );

UnitTest.addFixture( "Test RecordRules.recordSorted", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var recordCorrect = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }]
    };

    SafeAssert.equal( "1 testing with valid record", RecordRules.recordSorted( recordCorrect, {}), [] );

    var recordBad = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '003'
        }, {
            'name' : '002'
        }]
    };
    var errMsg = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "record.sorted.error", "002" ) )];
    SafeAssert.equal( "2 testing with invalid record", RecordRules.recordSorted( recordBad, {} ), errMsg );

    var recordBad = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '003'
        }, {
            'name' : '002'
        }, {
            'name' : '001'
        }]
    };
    var errMsg = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "record.sorted.error", "002" ) ) ];
    SafeAssert.equal( "3 testing with invalid record", RecordRules.recordSorted( recordBad, {} ), errMsg );

    var recordGood = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '001'
        }, {
            'name' : '001'
        }, {
            'name' : '001'
        }]
    };
    SafeAssert.equal( "4 testing with valid record", RecordRules.recordSorted( recordGood, {} ), [] );

} );
UnitTest.addFixture( "RecordRules.allFieldsMandatoryIfOneExist", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }, {
            'name' : '004'
        }]
    };
    var params = { fields: [ '001', '002', '003', '004' ]};
    var expectedResult = [];
    var actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 1", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "003" ) ) ];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 2", actualResult, expectedResult );

    record = {
        fields : [{
            'name' : '042'
        }]
    };
    expectedResult = [];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 3", actualResult, expectedResult );

    var record = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '004'
        }]
    };
    expectedResult = [
        ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "002" ) ),
        ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "003" ) ),
    ];
    actualResult = RecordRules.allFieldsMandatoryIfOneExist( record, params );
    SafeAssert.equal( "RecordRules.allFieldsMandatoryIfOneExist 4", actualResult, expectedResult );
} );
