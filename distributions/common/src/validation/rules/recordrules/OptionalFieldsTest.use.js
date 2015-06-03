//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "UnitTest" );
use( "Log" );
use ( "OptionalFields");
//-----------------------------------------------------------------------------

UnitTest.addFixture( "Test OptionalFields.validateRecord", function( ) {
    var bundle = ResourceBundleFactory.getBundle( OptionalFields.__BUNDLE_NAME );

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
    SafeAssert.equal( "1 testing with valid params", OptionalFields.validateRecord( record, params1 ), [] );

    var params2 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020']};
    SafeAssert.equal( "2 testing with valid params", OptionalFields.validateRecord( record, params2 ), [] );

    var params3 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009']};
    var error3 = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.optional.error", "010" ) )];
    SafeAssert.equal( "3 testing with valid params", OptionalFields.validateRecord( record, params3 ), error3 );

    var params4 = [];
    Assert.exception( "4 testing with empty params", 'OptionalFields.validateRecord(record, params4)' );

    var params5 = {'fields' : ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']};
    SafeAssert.equal( "5 testing with empty record", OptionalFields.validateRecord( record, params5 ), [] );
} );
