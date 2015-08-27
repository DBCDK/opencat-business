//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Log" );
use( "Marc" );
use( "MarcClasses" );
use( "RawRepoClient" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'SingleVolumeClassificationData' ];

//-----------------------------------------------------------------------------
var SingleVolumeClassificationData = function() {
    function create( classificationDataInstance, classificationDataModule ) {
        return {
            classifications: {
                instance: classificationDataInstance,
                module: classificationDataModule
            }
        }
    }

    function hasClassificationData( instance, marc ) {
        Log.info( "Enter - SingleVolumeClassificationData.hasClassificationsData()" );

        var result;
        try {
            result = instance.classifications.module.hasClassificationData( instance.classifications.instance, marc );
            return result;
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.hasClassificationsData(): " + result );
        }
    }

    function hasClassificationsChanged( instance, oldMarc, newMarc ) {
        Log.info( "Enter - SingleVolumeClassificationData.hasClassificationsChanged()" );

        var result;
        try {
            Log.debug( "    oldMarc: " + oldMarc );
            Log.debug( "    newMarc: " + newMarc );

            var mainRecord = __fetchParentRecord( oldMarc );
            if( mainRecord === undefined ) {
                return result = false;
            }
            result = instance.classifications.module.hasClassificationsChanged( instance.classifications.instance, mainRecord, newMarc );

            return result;
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.hasClassificationsChanged(): " + result );
        }
    }

    function updateClassificationsInRecord( instance, currentCommonMarc, updatingCommonMarc, enrichmentRecord ) {
        Log.info( "Enter - SingleVolumeClassificationData.updateClassificationsInRecord()" );

        var result;
        try {
            Log.debug( "    currentCommonMarc: " + currentCommonMarc );
            Log.debug( "    updatingCommonMarc: " + updatingCommonMarc );
            Log.debug( "    enrichmentRecord: " + enrichmentRecord );

            var mainRecord = __fetchParentRecord( currentCommonMarc );
            if( mainRecord === undefined ) {
                Log.warn( "Unable to load main record of current common record." );
                return enrichmentRecord;
            }

            var mainEnrichmentRecord = __fetchParentEnrichmentRecord( mainRecord, enrichmentRecord );
            if( mainEnrichmentRecord === undefined ) {
                enrichmentRecord = instance.classifications.module.updateClassificationsInRecord( instance.classifications.instance, mainRecord, mainRecord, enrichmentRecord );
            }
            else {
                enrichmentRecord = instance.classifications.module.updateClassificationsInRecord(instance.classifications.instance, mainEnrichmentRecord, mainEnrichmentRecord, enrichmentRecord);
            }

            enrichmentRecord.removeAll( "004" );
            updatingCommonMarc.eachField( /004/, function( field ) {
                field.eachSubField( /./, function( field, subfield ) {
                    enrichmentRecord = RecordUtil.addOrReplaceSubfield( enrichmentRecord, field.name, subfield.name, subfield.value );
                })
            } );

            return result = enrichmentRecord;
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.updateClassificationsInRecord(): " + result );
        }
    }

    function removeClassificationsFromRecord( instance, record ) {
        Log.info( "Enter - SingleVolumeClassificationData.removeClassificationsFromRecord()" );

        var result;
        try {
            Log.debug( "Record: " + record );

            return result = instance.classifications.module.removeClassificationsFromRecord( instance.classifications.instance, record );
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.removeClassificationsFromRecord(): " + result );
        }
    }

    function __fetchParentRecord( record ) {
        Log.info( "Enter - SingleVolumeClassificationData.__fetchParentRecord()" );

        var result = undefined;
        try {
            Log.debug( "Record: " + record );

            var recId = record.getValue( /014/, /a/ );
            var libNo = record.getValue( /001/, /b/ );

            return result = __fetchRecord( recId, libNo );
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.__fetchParentRecord(): " + result );
        }
    }

    function __fetchParentEnrichmentRecord( mainRecord, enrichmentRecord ) {
        Log.info( "Enter - SingleVolumeClassificationData.__fetchParentEnrichmentRecord()" );

        var result = undefined;
        try {
            Log.debug( "mainRecord: " + mainRecord );
            Log.debug( "enrichmentRecord: " + enrichmentRecord );

            var recId = mainRecord.getValue( /001/, /a/ );
            var libNo = enrichmentRecord.getValue( /001/, /b/ );

            return result = __fetchRecord( recId, libNo );
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.__fetchParentEnrichmentRecord(): " + result );
        }
    }

    function __fetchRecord( recId, libNo ) {
        Log.info( "Enter - SingleVolumeClassificationData.__fetchRecord()" );

        var result = undefined;
        try {
            if( RawRepoClient.recordExists( recId, libNo ) ) {
                result = RawRepoClient.fetchRecord( recId, libNo );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - SingleVolumeClassificationData.__fetchRecord(): " + result );
        }
    }

    return {
        'create': create,
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord
    };
}();
