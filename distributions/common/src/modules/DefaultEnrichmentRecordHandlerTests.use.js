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
            },
            bundle: ResourceBundleFactory.getBundle( "enrichments" )
        }
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultEnrichmentRecordHandler.shouldCreateRecords", function() {
    function yesResult() {
        return {
            status: "OK",
            serviceError: null,
            entries:[]
        };
    }

    function noResult( instance, fieldname, value ) {
        return {
            status: "FAILED_UPDATE_INTERNAL_ERROR",
            serviceError:null,
            entries: [
                {
                    warningOrError: "ERROR",
                    urlForDocumentation: null,
                    ordinalPositionOfField: null,
                    ordinalPositionOfSubField:null,
                    message: ResourceBundle.getStringFormat( instance.bundle, "do.not.create.enrichments.reason", fieldname, value )
                }
            ]
        }
    }

    var classificationsInstance = ClassificationData.create( UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS );
    var instance = DefaultEnrichmentRecordHandler.create( classificationsInstance, ClassificationData );

    var record = new Record;
    Assert.equalValue( "Empty record", DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ), yesResult() );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record", DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ), yesResult() );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel",
        "652 00 *m Ny TiTel"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 652m=Ny titel",
                       DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
                       noResult( instance, "652m", record.getValue( /652/, /m/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "245 00 *a titel",
        "652 00 *m Uden klassem\xe6rke"
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 652m=Uden klassem\xe6rke",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResult( instance, "652m", record.getValue( /652/, /m/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *a DBF999999",
        "245 00 *a titel",
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 032a=DBF999999",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResult( instance, "032a", record.getValue( /032/, /a/ ) ) );

    record = RecordUtil.createFromString( [
        "001 00 *a 1 234 567 8 *b 191919",
        "004 00 *a e *r n",
        "014 00 *a 2 345 678 9",
        "032 00 *x DBF999999",
        "245 00 *a titel",
    ].join( "\n" ) );
    Assert.equalValue( "Complete record: 032x=DBF999999",
        DefaultEnrichmentRecordHandler.shouldCreateRecords( instance, record, record ),
        noResult( instance, "032x", record.getValue( /032/, /x/ ) ) );
} );
