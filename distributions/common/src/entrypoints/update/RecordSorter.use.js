//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RecordSorter' ];

//-----------------------------------------------------------------------------
/**
 * Module to sort a Record and to insert fields in the sorted record.
 *
 * @namespace
 * @name RecordSorter
 */
var RecordSorter = function() {
    /**
     * Constructs a new record from an sorted record and insert a field so
     * the returned record is sorted.
     *
     * @param {Record} record The sorted record.
     * @param {Field} field The new field to insert.
     *
     * @returns {Record} The new sorted record with the new field.
     *
     * @name RecordSorter#insertField
     */
    function insertField( record, field ) {
        Log.trace( "Enter - RecordSorter.insertField" );

        try {
            var isFieldAppended = false;
            var result = new Record();
            for( var i = 0; i < record.size(); i++ ) {
                var recordField = record.field( i );
                if( field.name < recordField.name && !isFieldAppended ) {
                    result.append( field );
                    isFieldAppended = true;
                }
                result.append( recordField );
            }

            if( !isFieldAppended ) {
                result.append( field );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecordSorter.insertField" );
        }

    }

    //-----------------------------------------------------------------------------
    //                  Helper functions
    //-----------------------------------------------------------------------------

    /**
     * Returns the position in record that a field should be inserted into for the
     * record to remain sorted. The field is given by its name.
     *
     * @param {Record} record The sorted record.
     * @param {String} name The name of the field.
     *
     * @name RecordSorter#__fieldInsertPosition
     */
    function __fieldInsertPosition( record, name ) {
        Log.trace( "Enter - RecordSorter.__fieldInsertPosition" );

        try {
            for( var i = 0; i < record.size(); i++ ) {
                if( name < record.field( i).name ) {
                    return i;
                }
            }

            return record.size();
        }
        finally {
            Log.trace( "Exit - RecordSorter.__fieldInsertPosition" );
        }
    }

    return {
        'insertField': insertField
    }
}();
