//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RecordUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DefaultEnrichmentRecordHandler' ];

//-----------------------------------------------------------------------------
/**
 * Module to implement entrypoints for the update logic in DBC and FBS
 * installations.
 *
 * @namespace
 * @name DefaultEnrichmentRecordHandler
 */
var DefaultEnrichmentRecordHandler = function() {
    function create( classificationDataInstance, classificationDataModule ) {
        return {
            classifications: {
                instance: classificationDataInstance,
                module: classificationDataModule
            }
        }
    }

    /**
     * Creates a new enrichment record based on a common record.
     *
     * @param {Object} instance Instance returned by create().
     * @param {Record} commonRecord The DBC record.
     * @param {int}    agencyId    Library id for the local library.
     *
     * @return {Record} The new enrichment record.
     */
    function createRecord( instance, currentCommonRecord, updatingCommonMarc, agencyId ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.createRecord()" );

        var result;
        try {
            result = new Record;

            var idField = new Field("001", "00");
            idField.append(new Subfield("a", updatingCommonMarc.getValue(/001/, /a/)));
            idField.append(new Subfield("b", agencyId.toString()));
            idField.append(new Subfield("c", RecordUtil.currentAjustmentTime() ) );
            idField.append(new Subfield("d", RecordUtil.currentAjustmentDate() ) );
            idField.append(new Subfield("f", "a"));
            result.append(idField);

            result = updateRecord(instance, currentCommonRecord, updatingCommonMarc, result );
            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.createRecord(): " + result );
        }
    }

    /**
     * Updates an enrichment record with the classifications from
     * a DBC record.
     *
     * @param {Object} instance Instance returned by create().
     * @param {Record} commonRecord The DBC record.
     * @param {Record} enrichmentRecord The enrichment record to updated.
     *
     * @return {Record} The new enrichment record.
     */
    function updateRecord( instance, currentCommonMarc, updatingCommonMarc, enrichmentRecord ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.updateRecord()" );

        var result;
        try {
            result = __correctRecordIfEmpty( instance.classifications.module.updateClassificationsInRecord( instance.classifications.instance, currentCommonMarc, updatingCommonMarc, enrichmentRecord ) );
            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.updateRecord(): " + result );
        }
    }

    function correctRecord( instance, commonRecord, enrichmentRecord ) {
        Log.info( "Enter - DefaultEnrichmentRecordHandler.correctRecord()" );

        try {
            Log.info("    commonRecord: " + commonRecord );
            Log.info("    enrichmentRecord: " + enrichmentRecord );

            var result = null;

            if( instance.classifications.module.hasClassificationData( instance.classifications.instance, commonRecord ) ) {
                if( !instance.classifications.module.hasClassificationsChanged( instance.classifications.instance, commonRecord, enrichmentRecord)) {
                    Log.info("Classifications is the same. Removing it from library record.");
                    result = instance.classifications.module.removeClassificationsFromRecord( instance.classifications.instance, enrichmentRecord );
                }
                else {
                    Log.info("Classifications has changed.");
                }
            }
            else {
                Log.info("Common record has no classifications.");
            }

            if( result === null ) {
                result = enrichmentRecord.clone();
            }

            var record = __correctRecordIfEmpty( result );
            return record;
        }
        finally {
            Log.info("Exit - DefaultEnrichmentRecordHandler.correctRecord()" );
        }
    }

    function __correctRecordIfEmpty( record ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.__correctRecordIfEmpty" );

        Log.debug( "Record: ", record.toString() );
        var result = record;
        try {
            for( var i = 0; i < record.size(); i++ ) {
                var field = record.field( i );
                if( !( field.name === "001" || field.name === "996" ) ) {
                    Log.debug( "Return full record." );
                    return result;
                }
            }

            result = new Record;
            Log.debug( "Return empty record." );
            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.__correctRecordIfEmpty: " + result.toString() );
        }
    }

    return {
        'create': create,
        'createRecord': createRecord,
        'updateRecord': updateRecord,
        'correctRecord': correctRecord
    }
}();
