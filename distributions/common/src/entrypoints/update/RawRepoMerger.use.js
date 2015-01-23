//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RawRepoClient" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RawRepoMerger' ];

//-----------------------------------------------------------------------------
/**
 * RawRepoMerger is used to merge a record from update with the current record
 * in RawRepo to make sure that DBC specific fields are not removed from the
 * record when it is stored in the RawRepo.
 *
 * @namespace
 * @name RawRepoMerger
 */
var RawRepoMerger = function() {
    /**
     * Merges a record with the current record from RawRepo.
     *
     * The current record is loaded from RawRepo if it exists.
     *
     * @param record
     * @returns {Record}
     *
     * @name RawRepoMerger#mergeRawRepoRecord
     */
    function mergeRawRepoRecord( record ) {
        Log.trace( "Enter - RawRepoMerger.mergeRecord()" );

        try {
            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue(/001/, /b/);

            if( !RawRepoClient.recordExists( recId, agencyId ) ) {
                return record;
            }

            return mergeRecord( record, RawRepoClient.fetchRecord( recId, agencyId ) );
        }
        finally {
            Log.trace( "Exit - RawRepoMerger.mergeRecord()" );
        }
    }

    /**
     * Merges a record with the current record from RawRepo.
     *
     * @param record        The record that we tries to update.
     * @param rawRepoRecord The record from RawRepo.
     *
     * @returns {Record}
     *
     * @name RawRepoMerger#mergeRecord
     */
    function mergeRecord( record, rawRepoRecord ) {
        Log.trace( "Enter - RawRepoMerger.mergeRecord()" );

        try {
            var dbcFields = /[a-z].*/;

            var resultRecord = record.clone();
            rawRepoRecord.eachField( dbcFields, function( field ) {
                resultRecord.append( field );
            } );

            var groupId = resultRecord.getValue( /996/, /a/);
            if( groupId !== "" ) {
                resultRecord = __addOrReplaceField( resultRecord, "s10", "a", groupId );
            }

            return resultRecord;
        }
        finally {
            Log.trace( "Exit - RawRepoMerger.mergeRecord()" );
        }
    }

    /**
     * Adds or replaces a subfield value in a record.
     *
     * If the field or subfield does not exist it is created.
     *
     * If a new field is created then the resulting record is sorted.
     *
     * @param {Record} record The record that we tries to update.
     * @param {String} fieldName Name of the field.
     * @param {String} subfieldName Name of the subfield.
     * @param {String} value Subfield value.
     *
     * @returns {Record} The record.
     *
     * @private
     * @name RawRepoMerger#__addOrReplaceField
     */
    function __addOrReplaceField( record, fieldName, subfieldName, value ) {
        Log.trace( "Enter - RawRepoMerger.__addOrReplaceField()" );

        try {
            if( record.existField( RegExp( fieldName ) ) ) {
                Log.info( StringUtil.sprintf( "Replace existing %s%s with %s", fieldName, subfieldName, value ) );
                record.field( fieldName ).append( subfieldName, value, true );
                return record;
            }

            var newField = new Field( fieldName, "00" );
            newField.append( subfieldName, value );
            record.append( newField );

            return __sortRecord( record );
        }
        finally {
            Log.trace( "Exit - RawRepoMerger.__addOrReplaceField()" );
        }
    }

    /**
     * Sorts a record by field names.
     *
     * @param {Record} record The record that we tries to update.
     *
     * @returns {Record} The record.
     *
     * @private
     * @name RawRepoMerger#__sortRecord
     */
    function __sortRecord( record ) {
        var array = [];
        record.eachField( /./, function( field ) {
            array.push( field );
        } );
        array.sort( function( a, b ) {
            if( a.name < b.name ) {
                return -1;
            }
            else if( a.name > b.name ) {
                return 1;
            }

            return 0;
        });

        var result = new Record;
        for( var i = 0; i < array.length; i++ ) {
            result.append( array[ i ] );
        }
        return result;
    }

    return {
        'mergeRawRepoRecord': mergeRawRepoRecord,
        'mergeRecord': mergeRecord
    }
}();
