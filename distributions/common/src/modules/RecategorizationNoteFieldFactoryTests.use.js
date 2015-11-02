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
UnitTest.addFixture( "RecategorizationNoteFieldFactory.newNoteField.basic", function() {
    function callFunction( currentRecord, updatingRecord ) {
        return RecategorizationNoteFieldFactory.newNoteField( currentRecord, updatingRecord );
    }

    Assert.equalValue( "Empty records", callFunction( new Record, new Record ), undefined );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RecategorizationNoteFieldFactory.newNoteField.038", function() {
    function callFunction( record ) {
        var result = RecategorizationNoteFieldFactory.newNoteField( record );

        if( result === undefined || result === null ) {
            return uneval( result );
        }

        return result;
    }

    function createNote( message ) {
        Log.trace( "Enter - createNote( '" + message + "' )" );

        var result = undefined;
        try {
            result = new Field("504", "00");
            result.append("i", message);

            return result;
        }
        finally {
            Log.trace( "Exit - createNote(): " + result );
        }
    }

    var bundle = ResourceBundleFactory.getBundle( RecategorizationNoteFieldFactory.__BUNDLE_NAME );

    var record;
    var message;

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "038 00 *a dr"
    );

    message = ResourceBundle.getStringFormat( bundle, "note.material", ResourceBundle.getString( bundle, "code.038.dr" ) );

    var actual = callFunction( record );
    Log.debug( "callFunction()" );

    var expected = createNote( message );
    Log.debug( "createNote( message )" );

    Assert.equalValue( "038a found", actual.toString(), expected.toString() );
} );
