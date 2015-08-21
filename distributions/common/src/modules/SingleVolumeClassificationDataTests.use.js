//-----------------------------------------------------------------------------
use( "SingleVolumeClassificationData" );
use( "DanMarc2Converter" );
use( "RawRepoClientCore" );
use( "UnitTest" );
use( "UpdateConstants" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "SingleVolumeClassificationData.create", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.SINGLE_VOLUME_CLASSIFICATION_FIELDS );
    var instance = SingleVolumeClassificationData.create( classificationsInstance, ClassificationData );

    Assert.equalValue( "SingleVolumeClassificationData instance", instance,
        {
            classifications: {
                instance: classificationsInstance,
                module: ClassificationData
            }
        }
    );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "SingleVolumeClassificationData.hasClassificationData", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.SINGLE_VOLUME_CLASSIFICATION_FIELDS );
    var instance = SingleVolumeClassificationData.create( classificationsInstance, ClassificationData );

    function callFunction( record ) {
        return SingleVolumeClassificationData.hasClassificationData( instance, record );
    }

    var record;

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "014 00 *a 2 345 678 9" +
        "245 00 *a titel"
    );
    Assert.equalValue( "Found classification data", callFunction( record ), true );

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "014 00 *a 2 345 678 9"
    );
    Assert.equalValue( "No classification data found", callFunction( record ), false );
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "SingleVolumeClassificationData.hasClassificationsChanged", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.SINGLE_VOLUME_CLASSIFICATION_FIELDS );
    var instance = SingleVolumeClassificationData.create( classificationsInstance, ClassificationData );

    function callFunction( oldMarc, newMarc ) {
        return SingleVolumeClassificationData.hasClassificationsChanged( instance, oldMarc, newMarc );
    }

    var oldRecord;
    var newRecord;
    var mainRecord;

    oldRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9" +
        "245 00 *a titel"
    );

    newRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    Assert.equalValue( "No parent", callFunction( oldRecord, newRecord ), false );

    mainRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( mainRecord );

    oldRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9\n" +
        "245 00 *a titel"
    );

    newRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    Assert.equalValue( "Found parent with same classifications", callFunction( oldRecord, newRecord ), false );
    RawRepoClientCore.clear();

    mainRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( mainRecord );

    oldRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9\n" +
        "245 00 *a titel"
    );

    newRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a new titel XXX"
    );
    Assert.equalValue( "Found parent with different classifications", callFunction( oldRecord, newRecord ), true );
    RawRepoClientCore.clear();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "SingleVolumeClassificationData.updateClassificationsInRecord", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.SINGLE_VOLUME_CLASSIFICATION_FIELDS );
    var instance = SingleVolumeClassificationData.create( classificationsInstance, ClassificationData );

    function callFunction( currentCommonMarc, updatingCommonMarc, enrichmentRecord ) {
        return SingleVolumeClassificationData.updateClassificationsInRecord( instance, currentCommonMarc, updatingCommonMarc, enrichmentRecord );
    }

    var mainRecord;
    var mainEnrichmentRecord;
    var oldRecord;
    var newRecord;
    var enrichmentRecord;
    var expectedEnrichmentRecord;

    mainRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( mainRecord );

    oldRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( oldRecord );

    newRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );

    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );

    expectedEnrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    Assert.equalValue( "Main record with no enrichment", callFunction( oldRecord, newRecord, enrichmentRecord ), expectedEnrichmentRecord );
    RawRepoClientCore.clear();

    mainRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( mainRecord );

    mainRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( mainRecord );

    mainEnrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 2 345 678 9 *b 700400\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a enrichment title"
    );
    RawRepoClientCore.addRecord( mainEnrichmentRecord );

    oldRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9\n" +
        "245 00 *a titel"
    );
    RawRepoClientCore.addRecord( oldRecord );

    newRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a titel"
    );

    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );

    expectedEnrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n\n" +
        "245 00 *a enrichment title"
    );
    Assert.equalValue( "Main record with enrichment", callFunction( oldRecord, newRecord, enrichmentRecord ), expectedEnrichmentRecord );
    RawRepoClientCore.clear();
} );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "SingleVolumeClassificationData.removeClassificationsFromRecord", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.SINGLE_VOLUME_CLASSIFICATION_FIELDS );
    var instance = SingleVolumeClassificationData.create( classificationsInstance, ClassificationData );

    function callFunction( record ) {
        return SingleVolumeClassificationData.removeClassificationsFromRecord( instance, record );
    }

    var record;

    record = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *a b *r n\n" +
        "014 00 *a 2 345 678 9" +
        "245 00 *a titel"
    );
    Assert.equalValue( "Remove classifications", callFunction( record ), ClassificationData.removeClassificationsFromRecord( classificationsInstance, record ) );
} );
