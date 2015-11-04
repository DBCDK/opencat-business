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

    function createNote( parts ) {
        Log.trace( "Enter - createNote( '" + parts + "' )" );

        var result = undefined;
        try {
            result = new Field( RecategorizationNoteFieldFactory.__FIELD_NAME, "00");

            if( parts.recategorization !== undefined ) {
                result.append( "i", parts.recategorization.trim() );
            }
            if( parts.creator !== undefined ) {
                result.append( "d", parts.creator.trim() );
            }

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
    var parts;

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

    parts = { recategorization: formatMaterialMessage( bundle, "code.038a.dr" ) };
    Assert.equalValue( "038a found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    //-----------------------------------------------------------------------------
    //                  Test 039 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol"
    );

    parts = { recategorization: formatMaterialMessage( bundle, "code.039a.fol" ) };
    Assert.equalValue( "039a found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *b dk"
    );

    parts = { recategorization: formatMaterialMessage( bundle, "code.039b.dk" ) };
    Assert.equalValue( "039b found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "039 00 *a fol *b dk"
    );

    parts = { recategorization: formatMaterialMessage( bundle, "code.039a.fol" ) };

    var country = ResourceBundle.getString( bundle, "code.039b.dk" );
    parts.recategorization += ". " + RecategorizationNoteFieldFactory.__formatValueWithUpperCase( country );

    Assert.equalValue( "039a/b found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    //-----------------------------------------------------------------------------
    //                  Test 100 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "100 00 *a Troelsen *h Jens"
    );

    parts = {
        recategorization: formatMaterialMessage( bundle, "" ),
        creator: "Troelsen, Jens"
    };
    Assert.equalValue( "100ah found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "100 00 *a Margrethe *E 2 *e II *f dronning af Danmark"
    );

    parts = {
        recategorization: formatMaterialMessage( bundle, "" ),
        creator: "Margrethe II (dronning af Danmark)"
    };
    Assert.equalValue( "100aef found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    //-----------------------------------------------------------------------------
    //                  Test 110 field
    //-----------------------------------------------------------------------------

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a NOAH *e musikgruppe"
    );

    parts = {
        recategorization: formatMaterialMessage( bundle, "" ),
        creator: "NOAH (musikgruppe)"
    };
    Assert.equalValue( "110ae found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a Koebenhavns Universitet *c Romansk Institut"
    );

    parts = {
        recategorization: formatMaterialMessage( bundle, "" ),
        creator: "Koebenhavns Universitet. Romansk Institut"
    };
    Assert.equalValue( "110ac found", callFunction( record, record ).toString(), createNote( parts ).toString() );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "110 00 *a Nordic Prosody *i 4 *k 1986 *j Middelfart"
    );

    parts = {
        recategorization: formatMaterialMessage( bundle, "" ),
        creator: "Nordic Prosody (4 : 1986 : Middelfart)"
    };
    Assert.equalValue( "110ac found", callFunction( record, record ).toString(), createNote( parts ).toString() );
} );
