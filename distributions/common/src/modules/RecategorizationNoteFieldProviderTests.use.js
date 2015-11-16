//-----------------------------------------------------------------------------
use( "Marc" );
use( "MarcClasses" );
use( "RawRepoClientCore" );
use( "RecategorizationNoteFieldProvider" );
use( "RecordUtil" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue", function() {
    function callFunction( bundle, record, fieldname, subfieldmatcher ) {
        return RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue( bundle, record, fieldname, subfieldmatcher );
    }

    //-----------------------------------------------------------------------------
    //                  Variables
    //-----------------------------------------------------------------------------

    var bundle = ResourceBundleFactory.getBundle( "categorization-codes" );
    var record;
    var expected;

    //-----------------------------------------------------------------------------
    //                  Single records
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    expected = undefined;
    Assert.equalValue( "Field not found in single record", callFunction( bundle, record, "245", /a/ ), expected );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *b dr"
    );

    expected = undefined;
    Assert.equalValue( "Field found and subfield not found in single record", callFunction( bundle, record, "038", /a/ ), expected );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    expected = RecordUtil.createFieldFromString( "038 00 *a " + ResourceBundle.getString( bundle, "code.038a.dr" ) );
    Assert.equalValue( "Field and subfield found in single record", callFunction( bundle, record, "038", /a/ ).toString(), expected.toString() );

    //-----------------------------------------------------------------------------
    //                  Field found in volume records
    //-----------------------------------------------------------------------------

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *a dr"
    );

    expected = undefined;
    Assert.equalValue( "Field not found in single record", callFunction( bundle, record, "245", /a/ ), expected );
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *b dr"
    );

    expected = undefined;
    Assert.equalValue( "Field found and subfield not found in single record", callFunction( bundle, record, "038", /a/ ), expected );
    RawRepoClientCore.clear();

    RawRepoClientCore.addRecord(
        RecordUtil.createFromString(
            "001 00 *a 2 234 567 8 *b 191919"
        )
    );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "014 00 *a 2 234 567 8\n" +
        "038 00 *a dr"
    );

    expected = RecordUtil.createFieldFromString( "038 00 *a " + ResourceBundle.getString( bundle, "code.038a.dr" ) );
    Assert.equalValue( "Field and subfield found in single record", callFunction( bundle, record, "038", /a/ ).toString(), expected.toString() );
    RawRepoClientCore.clear();
} );
