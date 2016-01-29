//-----------------------------------------------------------------------------
use( "RecategorizationNoteFieldFactory" );
use( "Log" );
use( "Marc" );
use( "RecordProduction" );
use( "RecordUtil" );
use( "ResourceBundleFactory" );
use( "ResourceBundle" );

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
     * Checks if we chould create enrichment records for a common record.
     *
     * @param {Object} instance Instance returned by create().
     * @param {String} currentCommonRecord  The current common record as a json.
     * @param {String} updatingCommonRecord The common record begin updated as a json.
     *
     * @return {Object} A ServiceResult instance.
     */
    function shouldCreateRecords( instance, currentCommonRecord, updatingCommonRecord ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.shouldCreateRecords()" );

        var result;
        try {
            var dk5Codes = /ny\stitel|Uden\sklassem\xe6rke/i;
            var catCodes = /(DBF|DLF|DBI|DMF|DMO|DPF|BKM|GBF|GMO|GPF|FPF|DBR|UTI)999999/i;

            result = __shouldCreateRecords( instance, currentCommonRecord, "652", "m", dk5Codes );

            if( result.status === "OK" ) {
                result = __shouldCreateRecords( instance, updatingCommonRecord, "032", "x", catCodes );
            }
            if( result.status === "OK" ) {
                result = __shouldCreateRecords( instance, updatingCommonRecord, "032", "a", catCodes );
            }

            if( result.status === "OK" ) {
                // Check if record has been published before today.
                if( RecordProduction.checkRecord( new Date, currentCommonRecord ) ) {
                    // It wasn't, so it should fail unless
                    // if 008*u==r then we have to check if content of 032a|x is about to change (some catCodes only).
                    if( updatingCommonRecord.matchValue( /008/, /u/, /r/) ) {
                        if ( __matchKatcodes( currentCommonRecord, updatingCommonRecord ) ) {
                            // 032 not changed
                            var bundle = ResourceBundleFactory.getBundle("enrichments");
                            result = __shouldCreateRecordsNoResult(ResourceBundle.getString(bundle, "do.not.create.enrichments.inproduction.reason"));
                        }
                    } else {
                        var bundle = ResourceBundleFactory.getBundle("enrichments");
                        result = __shouldCreateRecordsNoResult(ResourceBundle.getString(bundle, "do.not.create.enrichments.inproduction.reason"));

                    }
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.shouldCreateRecords(): " + result );
        }
    }

    function __shouldCreateRecordsYesResult() {
        return {
            status: "OK",
            serviceError: null,
            entries:[]
        };
    }

    function __shouldCreateRecordsNoResult( reason ) {
        return {
            status: "FAILED_UPDATE_INTERNAL_ERROR",
            serviceError:null,
            entries: [
                {
                    warningOrError: "ERROR",
                    urlForDocumentation: null,
                    ordinalPositionOfField: null,
                    ordinalPositionOfSubField:null,
                    message: reason
                }
            ]
        }
    }

    function __shouldCreateRecords( instance, record, field, subfield, checkValue ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.__shouldCreateRecords()" );

        var result = __shouldCreateRecordsYesResult();
        try {
            var fieldRx = RegExp( field );
            var subfieldRx = RegExp( subfield );

            if( record.matchValue( fieldRx, subfieldRx, checkValue ) ) {
                var value = record.getValue( fieldRx, subfieldRx, "," );
                var bundle = ResourceBundleFactory.getBundle( "enrichments" );

                result = __shouldCreateRecordsNoResult( ResourceBundle.getStringFormat( bundle, "do.not.create.enrichments.reason", field + subfield, value ) );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.__shouldCreateRecords() " + result );
        }
    }

    function __matchKatcodes( actualRec, newRec ) {
        var result = false;
        try {
            var oldValues = __collectProductionCodes( actualRec );
            var newValues = __collectProductionCodes( newRec );

            oldValues.sort();
            newValues.sort();

            Log.debug( "oldValues: ", oldValues );
            Log.debug( "newValues: ", newValues );

            if (oldValues.length !== newValues.length ) {
                Log.debug( "oldValues.length !== newValues.length" );
                return result = false;
            }
            else {
                Log.debug( "oldValues.length === newValues.length" );
                for ( var i = 0; i < oldValues.length; i++ ) {
                    if ( oldValues[i] !== newValues[i] ) {
                        Log.debug( "oldValues[i] !== newValues[i]: ", oldValues[i], " !== ", newValues[i] );
                        return result = false;
                    }
                }
            }
            return result = true;
        }
        finally {
                Log.trace( "Exit - DefaultEnrichmentRecordHandler.__matchKatcodes(): " + result );
            }
    }

    function __collectProductionCodes( record ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.__collectProductionCodes()" );

        var compareCats = "^(/DBF|DLF|DBI|DMF|DMO|DPF|BKM|GBF|GMO|GPF|FPF|DBR|UTI/)";
        var result = [];
        try {
            record.eachField( /032/, function( field ) {
                field.eachSubField( /a|x/, function( field, subfield ) {
                    if ( /^(DBF|DLF|DBI|DMF|DMO|DPF|BKM|GBF|GMO|GPF|FPF|DBR|UTI)/.test(subfield.value) ) {
                        result.push(subfield.name + ": " + subfield.value);
                    }
                } )
            } );

            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.__collectProductionCodes(): " + result );
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
            var record = instance.classifications.module.updateClassificationsInRecord( instance.classifications.instance, currentCommonMarc, updatingCommonMarc, enrichmentRecord );

            if( __isRecategorization( currentCommonMarc, updatingCommonMarc ) ) {
                Log.info( "Record is a recategorization." );

                record = instance.classifications.module.removeClassificationsFromRecord( instance.classifications.instance, record );
                var field = RecategorizationNoteFieldFactory.newNoteField( currentCommonMarc, updatingCommonMarc );
                if( field !== undefined ) {
                    record = RecordSorter.insertField( record, field );
                }
            }
            else {
                Log.info( "Record is not a recategorization." );
            }

            record.removeAll( "004" );
            updatingCommonMarc.eachField( /004/, function( field ) {
                field.eachSubField( /./, function( field, subfield ) {
                    record = RecordUtil.addOrReplaceSubfield( record, field.name, subfield.name, subfield.value );
                })
            } );

            result = __correctRecordIfEmpty( record );
            return result;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.updateRecord(): " + result );
        }
    }

    function correctRecord( instance, commonRecord, enrichmentRecord ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.correctRecord()" );

        try {
            Log.trace("    commonRecord: " + commonRecord );
            Log.trace("    enrichmentRecord: " + enrichmentRecord );

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
            Log.trace("Exit - DefaultEnrichmentRecordHandler.correctRecord()" );
        }
    }

    function __correctRecordIfEmpty( record ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.__correctRecordIfEmpty" );

        Log.debug( "Record: ", record.toString() );
        var result = record;
        try {
            if( record.getValue( /001/, /b/ ) === UpdateConstants.COMMON_AGENCYID ) {
                Log.debug( "Return full record for " + UpdateConstants.COMMON_AGENCYID );
                return record;
            }

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

    function __isRecategorization( currentCommonRecord, updatingCommonRecord ) {
        Log.trace( "Enter - DefaultEnrichmentRecordHandler.__isRecategorization()" );

        var result = undefined;
        try {
            if( updatingCommonRecord.matchValue( /004/, /a/, /e/ ) ) {
                if( currentCommonRecord.matchValue( /004/, /a/, /b/ ) ) {
                    return result = true;
                }
            }

            if( updatingCommonRecord.matchValue( /004/, /a/, /b/ ) ) {
                if( currentCommonRecord.matchValue( /004/, /a/, /e/ ) ) {
                    return result = true;
                }
            }

            if( updatingCommonRecord.matchValue( /008/, /t/, /p/ ) ) {
                if( !currentCommonRecord.matchValue( /008/, /t/, /p/ ) ) {
                    return result = true;
                }
            }
            else if( currentCommonRecord.matchValue( /008/, /t/, /p/ ) ) {
                return result = true;
            }

            var bundle = ResourceBundleFactory.getBundle( "categorization-codes" );
            var currentMaterialField = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue( bundle, currentCommonRecord, "009", /a|g/ );
            var updatingMaterialField = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue( bundle, updatingCommonRecord, "009", /a|g/ );

            if( currentMaterialField === undefined && updatingMaterialField === undefined ) {
                return result = false;
            }
            if( currentMaterialField === undefined && updatingMaterialField !== undefined ) {
                return result = true;
            }
            if( currentMaterialField !== undefined && updatingMaterialField === undefined ) {
                return result = true;
            }

            var record_lookup = RecordLookupField.createFromField( currentMaterialField );
            if( RecordLookupField.containsField( record_lookup, updatingMaterialField ) ) {
                return result = false;
            }

            return result = false;
        }
        finally {
            Log.trace( "Exit - DefaultEnrichmentRecordHandler.__isRecategorization(): ", result );
        }
    }

    return {
        'create': create,
        'shouldCreateRecords': shouldCreateRecords,
        '__shouldCreateRecordsYesResult': __shouldCreateRecordsYesResult,
        '__shouldCreateRecordsNoResult': __shouldCreateRecordsNoResult,
        'createRecord': createRecord,
        'updateRecord': updateRecord,
        'correctRecord': correctRecord
    }
}();
