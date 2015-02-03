//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RecordSorter" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RecordUtil' ];

//-----------------------------------------------------------------------------
/**
 * Utility functions that operates on a Field
 *
 * @namespace
 * @name BasisSplitter
 */
var RecordUtil = function() {
    /**
     * Adds or replaces a subfield with a given value.
     * <p/>
     * If the field or subfield does not exist, it is created.
     * <p/>
     * The record is expected to be sorted by field names.
     *
     * @param {Record} record The record to change.
     * @param {String} fieldName The name of the field to add or replace.
     * @param {String} subfieldName The name of the subfield to add or replace.
     * @param {String} value The value of the subfield.
     *
     * @returns {Record} The record with the new/changed subfield.
     *
     * @name RecordUtil#addOrReplaceSubfield
     */
    function addOrReplaceSubfield( record, fieldName, subfieldName, value ) {
        Log.trace( "Enter - RecordUtil.addOrReplaceSubfield" );

        try {
            if( record.existField( RegExp( fieldName ) ) ) {
                record.field( fieldName ).append( subfieldName, value, true );
                return record;
            }
            else {
                var field = new Field( fieldName, "00" );
                field.append( subfieldName, value );

                return RecordSorter.insertField( record, field );
            }
        }
        finally {
            Log.trace( "Exit - RecordUtil.addOrReplaceSubfield" );
        }
    }

    /**
     * Calculates the current ajustment time that follows the danMARC2
     * format for field 001c.
     *
     * @returns {String} The current ajustment time.
     */
    function currentAjustmentTime() {
        Log.trace( "Enter - RecordUtil.currentAjustmentTime" );

        try {
            var curDate = new Date();
            var ajustmentTimeStr = StringUtil.sprintf( "%4s%2s%2s%2s%2s%2s",
                            curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate(),
                            curDate.getHours(), curDate.getMinutes(), curDate.getSeconds() );
            return __replaceAll( ajustmentTimeStr, " ", "0" );
        }
        finally {
            Log.trace( "Exit - RecordUtil.currentAjustmentTime" );
        }
    }

    /**
     * Creates a Record from a String.
     *
     * @param {String} s Marc record in line format.
     *
     * @returns {Record} The new record.
     *
     * @name RecordUtil#createFromString
     */
    function createFromString( s ) {
        Log.trace( "Enter - RecordUtil.createFromString" );

        try {
            var record = new Record();
            record.fromString( s );

            return record;
        }
        finally {
            Log.trace( "Exit - RecordUtil.createFromString" );
        }
    }

    //-----------------------------------------------------------------------------
    //                  Helper functions
    //-----------------------------------------------------------------------------

    function __escapeRegExp( string ) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function __replaceAll( string, find, replace ) {
        return string.replace(new RegExp(__escapeRegExp(find), 'g'), replace);
    }

    return {
        'addOrReplaceSubfield': addOrReplaceSubfield,
        'currentAjustmentTime': currentAjustmentTime,
        'createFromString': createFromString
    }

}();
