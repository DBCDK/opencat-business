//-----------------------------------------------------------------------------
use( "ClassificationData" );
use( "DefaultEnrichmentRecordHandler" );
use( "UnitTest" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultEnrichmentRecordHandler.create", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
    var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

    Assert.equalValue( "DefaultEnrichmentRecordHandler instance", instance,
        {
            classifications: {
                instance: classificationsInstance,
                module: ClassificationData
            }
        }
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultEnrichmentRecordHandler.shouldCreateRecords", function() {
    function noResult( fieldname, value ) {
        var bundle = ResourceBundleFactory.getBundle( "enrichments" );

        return DefaultEnrichmentRecordHandler.__shouldCreateRecordsNoResult( ResourceBundle.getStringFormat( bundle, "do.not.create.enrichments.reason", fieldname, value ) );
    }

    function noResultInProduction() {
        var bundle = ResourceBundleFactory.getBundle( "enrichments" );

        return DefaultEnrichmentRecordHandler.__shouldCreateRecordsNoResult( ResourceBundle.getString( bundle, "do.not.create.enrichments.inproduction.reason" ) );
    }

    var classificationsInstance = ClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
    var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

    var currentRecord;
    var record = new Record;
    Assert.equalValue( "Empty record",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        DefaultEnrichmentRecordHandler.__shouldCreateRecordsYesResult() );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        DefaultEnrichmentRecordHandler.__shouldCreateRecordsYesResult() );

    currentRecord = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel",
        "652 00 *m Ny TiTel"
    ].join( "\n" ) );
    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel",
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 652m=Ny titel",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentRecord, record ),
        noResult( "652m", currentRecord.getValue( /652/, /m/ ) ) );

    currentRecord = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n" ) );
    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 652m=Uden klassem\xe6rke",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentRecord, record ),
        noResult( "652m", currentRecord.getValue( /652/, /m/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *a DBF999999",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 032a=DBF999999",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResult( "032a", record.getValue( /032/, /a/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBF999999",
        "245 00 *a titel",
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 032x=DBF999999",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResult( "032x", record.getValue( /032/, /x/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *a DBI200204",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record not in production",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        DefaultEnrichmentRecordHandler.__shouldCreateRecordsYesResult() );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record in production",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResultInProduction() );

    Log.trace( "Enter - Testcase" );
    currentRecord = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004 *a UTI201503",
        "245 00 *a titel"
    ].join( "\n" ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "008 00 *u r",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record in production: 008u=r and 032a|x is changed",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentRecord, record ),
        DefaultEnrichmentRecordHandler.__shouldCreateRecordsYesResult() );
    Log.trace( "Exit - Testcase" );

    currentRecord = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004",
        "245 00 *a titel"
    ].join( "\n" ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "008 00 *u r",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record in production: 008u=r and 032a|x is not changed",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentRecord, record ),
        noResultInProduction() );

    currentRecord = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004 *a UTI201503",
        "245 00 *a titel"
    ].join( "\n" ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "008 00 *u k",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBI210004",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record in production: 008u!=r and 032a|x is changed",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, currentRecord, record ),
        DefaultEnrichmentRecordHandler.__shouldCreateRecordsYesResult() );
} );

//-----------------------------------------------------------------------------
//UnitTest.addFixture( "DefaultEnrichmentRecordHandler.updateRecord", function() {
//    function callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord ) {
//        var classificationsInstance = ClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
//        var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );
//
//        return DefaultEnrichmentRecordHandler.updateRecord( instance, currentCommonRecord, updatingCommonRecord, enrichmentRecord );
//    }
//
//    var currentCommonRecord;
//    var updatingCommonRecord;
//    var enrichmentRecord;
//    var expected;
//
//    currentCommonRecord = new Record;
//    updatingCommonRecord = new Record;
//    enrichmentRecord = new Record;
//    expected = new Record;
//    Assert.equalValue( "Empty record", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord ).toString(), expected.toString() );
//
//    currentCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a b\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel"
//    );
//    updatingCommonRecord = currentCommonRecord;
//    enrichmentRecord  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400"
//    );
//    expected  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400\n" +
//        "004 00 *r n *a b\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel"
//    );
//    Assert.equalValue( "Copy categorization fields", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString() );
//
//    currentCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a b\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    updatingCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    enrichmentRecord  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400"
//    );
//    expected  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400\n" +
//        "004 00 *r n *a e\n" +
//        RecategorizationNoteFieldFactory.newNoteField( currentCommonRecord, updatingCommonRecord ).toString() +"\n" +
//        "y08 00 *a UPDATE posttypeskift"
//    );
//    Assert.equalValue( "New 512-note: 004a=e had 004a=b", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString() );
//
//    currentCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    updatingCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a b\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    enrichmentRecord  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400"
//    );
//    expected  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400\n" +
//        "004 00 *r n *a b\n" +
//        RecategorizationNoteFieldFactory.newNoteField( currentCommonRecord, updatingCommonRecord ).toString()+"\n" +
//        "y08 00 *a UPDATE posttypeskift"
//    );
//    Assert.equalValue( "New 512-note: 004a=b had 004a=e", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString() );
//
//    currentCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "008 00 *t p\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    updatingCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    enrichmentRecord  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400"
//    );
//    expected  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400\n" +
//        "004 00 *r n *a e\n" +
//        RecategorizationNoteFieldFactory.newNoteField( currentCommonRecord, updatingCommonRecord ).toString()+"\n" +
//        "y08 00 *a UPDATE posttypeskift"
//    );
//    Assert.equalValue( "New 512-note: Current common record has 008t=p", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString() );
//
//    currentCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    updatingCommonRecord = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 191919\n" +
//        "004 00 *r n *a e\n" +
//        "008 00 *t p\n" +
//        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
//        "652 00 *m 47.44 *b Barcelona"
//    );
//    enrichmentRecord  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400"
//    );
//    expected  = RecordUtil.createFromString(
//        "001 00 *a 1 234 567 8 *b 700400\n" +
//        "004 00 *r n *a e\n" +
//        RecategorizationNoteFieldFactory.newNoteField( currentCommonRecord, updatingCommonRecord ).toString()+"\n" +
//        "y08 00 *a UPDATE posttypeskift"
//    );
//    Assert.equalValue( "New 512-note: Updating common record has 008t=p", callFunction( currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString() );
//} );
