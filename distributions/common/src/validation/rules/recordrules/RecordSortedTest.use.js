use( "SafeAssert" );
use( "UnitTest" );
use ( "RecordSorted");

UnitTest.addFixture( "Test RecordSorted.validateRecord", function( ) {
    var bundle = ResourceBundleFactory.getBundle( RecordSorted.__BUNDLE_NAME );

    var recordCorrect = {
        fields : [{
            'name' : '001'
        }, {
            'name' : '002'
        }, {
            'name' : '003'
        }]
    };

    SafeAssert.equal( "1 testing with valid record", RecordSorted.validateRecord( recordCorrect, {}), [] );

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
    SafeAssert.equal( "2 testing with invalid record", RecordSorted.validateRecord( recordBad, {} ), errMsg );

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
    SafeAssert.equal( "3 testing with invalid record", RecordSorted.validateRecord( recordBad, {} ), errMsg );

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
    SafeAssert.equal( "4 testing with valid record", RecordSorted.validateRecord( recordGood, {} ), [] );

} );