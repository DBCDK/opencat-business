//-----------------------------------------------------------------------------
use( "Marc" );
use( "MarcClasses" );
use( "RecategorizationNoteFieldFactory" );
use( "RecordUtil" );
use( "ResourceBundle" );
use( "ResourceBundleFactory" );
use( "UnitTest" );
use( "UpdateConstants" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecategorizationNoteFieldFactory.newNoteField", function() {
    //-----------------------------------------------------------------------------
    //                  Helper functions
    //-----------------------------------------------------------------------------

    function callFunction( currentRecord, updatingRecord ) {
        var result = RecategorizationNoteFieldFactory.newNoteField( currentRecord, updatingRecord );
        return result;
    }

    function createNote( message ) {
        Log.trace( "Enter - createNote( '" + message + "' )" );

        var result = undefined;
        try {
            result = new Field( RecategorizationNoteFieldFactory.__FIELD_NAME, "00");
            result.append("i", message);

            return result;
        }
        finally {
            Log.trace( "Exit - createNote(): " + result );
        }
    }

    function formatMaterialMessage( bundle, code ) {
        return ResourceBundle.getStringFormat( bundle, "note.material", ResourceBundle.getString( bundle, code ) );
    }

    //-----------------------------------------------------------------------------
    //                  Variables
    //-----------------------------------------------------------------------------

    var bundle = ResourceBundleFactory.getBundle( RecategorizationNoteFieldFactory.__BUNDLE_NAME );

    var record;
    var message;

    //-----------------------------------------------------------------------------
    //                  Test basic cases
    //-----------------------------------------------------------------------------

    Assert.equalValue( "Empty records", callFunction( new Record, new Record ), undefined );

    //-----------------------------------------------------------------------------
    //                  Test 038 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    message = formatMaterialMessage( bundle, "code.038a.dr" );
    Assert.equalValue( "038a found", callFunction( record, record ).toString(), createNote( message ).toString() );

    //-----------------------------------------------------------------------------
    //                  Test 039 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol"
    );

    message = formatMaterialMessage( bundle, "code.039a.fol" );
    Assert.equalValue( "039a found", callFunction( record, record ).toString(), createNote( message ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *b dk"
    );

    message = formatMaterialMessage( bundle, "code.039b.dk" );
    Assert.equalValue( "039b found", callFunction( record, record ).toString(), createNote( message ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol *b dk"
    );

    message = formatMaterialMessage( bundle, "code.039a.fol" );
    var country = ResourceBundle.getString( bundle, "code.039b.dk" );

    message += ". " + RecategorizationNoteFieldFactory.__formatValueWithUpperCase( country );
    Assert.equalValue( "039a/b found", callFunction( record, record ).toString(), createNote( message ).toString() );
} );
