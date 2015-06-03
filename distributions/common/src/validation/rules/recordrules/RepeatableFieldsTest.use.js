//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "UnitTest" );
use( "Log" );
use ( "RepeatableFields");
//-----------------------------------------------------------------------------

UnitTest.addFixture( "Test RepeatableFields.validateRecord", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordRules.BUNDLE_NAME );

    var record1 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}]};
    var params1 = {'fields': ['003']};
    SafeAssert.equal( "1 testing with valid params and data", RepeatableFields.validateRecord( record1, params1 ), [] );

    var record2 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}, {'name': '003'}, {'name': '003'}]};
    var params2 = {'fields': ['001','004']};
    var error2 = [ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "003", 3 ) ) ];
    SafeAssert.equal( "2 testing with valid params, error in data", RepeatableFields.validateRecord( record2, params2 ), error2 );

    var record3 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'}, {'name': '003'},
        {'name': '004'}, {'name': '004'}, {'name': '005'}, {'name': '006'}, {'name': '007'},
        {'name': '008'}, {'name': '009'}, {'name': '010'}, {'name': '010'}, {'name': '010'}]};
    var params3 = {'fields': ['002','004','010']};
    SafeAssert.equal( "3 testing with valid params and data", RepeatableFields.validateRecord( record3, params3 ), [] );

    var record4 = {'fields': [{'name': '001'}]};
    var params4 = {'fields': ['002','003','004','005','006','007','008','009','010']};
    SafeAssert.equal( "4 testing with valid params and data", RepeatableFields.validateRecord( record4, params4 ), [] );

    var record5 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '002'}, {'name': '002'},
        {'name': '003'}, {'name': '003'}, {'name': '006'}, {'name': '006'}]};
    var params5 = {'fields': ['001','004','005']};
    var error5 = [];
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "002", 3 ) ) );
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "003", 2 ) ) );
    error5.push(ValidateErrors.recordError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "fields.repeatable.error", "006", 2 ) ) );
    SafeAssert.equal( "5 testing with valid params, error in data", RepeatableFields.validateRecord( record5, params5 ), error5 );

    var record6 = {'fields': [{'name': '001'}, {'name': '002'}, {'name': '003'}]};
    var params6 = {'fields': []};
    SafeAssert.equal( "6 testing with valid params and data", RepeatableFields.validateRecord( record6, params6 ), [] );
} );
