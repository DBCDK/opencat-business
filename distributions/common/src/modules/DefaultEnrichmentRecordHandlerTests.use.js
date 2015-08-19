//-----------------------------------------------------------------------------
use( "DefaultEnrichmentRecordHandler" );
use( "UnitTest" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "DefaultEnrichmentRecordHandler.create", function() {
    var classificationsInstance = ClassificationData.create( UpdateConstants.CLASSIFICATION_FIELDS );
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
