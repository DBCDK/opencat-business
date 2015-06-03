//-----------------------------------------------------------------------------
use( "SafeAssert" );
use( "UnitTest" );
use( "Log" );
use ( "ConflictingFields");
//-----------------------------------------------------------------------------
UnitTest.addFixture( "Test ConflictingFields.validateRecord", function( ) {
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
    SafeAssert.equal( "1 testing with valid " + params1 + " param", ConflictingFields.validateRecord( record, params1 ), [] );

    var params2 = {'fields' : []};
    Assert.exception( "2 testing with empty param", 'ConflictingFields.validateRecord(record, params2)' );

    var params3 = {'fields' : ['001']};
    Assert.exception( "3 testing with empty record.fields", 'ConflictingFields.validateRecord(recordFieldUndef, params3)' );

    var params4 = {'fields' : ['001']};
    Assert.exception( "4 testing with empty record", 'ConflictingFields.validateRecord(recordUndef, params4)' );

    var params5 = {'fields' : ['001', '002', '003']};
    var errorVal5 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.conflicting.error", "002", "001" ) );
    var errorVal6 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "fields.conflicting.error", "003", "001" ) );
    var errorTooMany = [errorVal5,errorVal6];
    SafeAssert.equal( "length of value to short 1", ConflictingFields.validateRecord( record, params5 ), errorTooMany);

    var params6 = {'fields' : ['001', '011', '012', '013', '014', '015', '016']};
    SafeAssert.equal( "length of value to short 2", ConflictingFields.validateRecord( record, params6 ), [] );
} );