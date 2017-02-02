//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RecordSorter" );
use( "UpdateConstants" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'UpdateOwnership' ];

//-----------------------------------------------------------------------------
/**
 * Module to update ownership in field 996 based on field 996 in an existing
 * record.
 *
 * @namespace
 * @name UpdateOwnership
 */
var UpdateOwnership = function() {
    /**
     * Merges ownership in field 996 from record and currentRecord.
     *
     * The result is written to field 996 in record.
     *
     * @param {Record} The record to merge and write the result to.
     * @param {Record} currentRecord The current record to merge with.
     *
     * @returns {Record} The record with the merged result in record.
     * @name UpdateOwnership#mergeRecord
     */
    var mergeRecord = function( record, currentRecord ) {
        Log.trace( "Enter - UpdateOwnership.mergeRecord( '", record, "', '", currentRecord, "'" );

        try {
            if( record === null ) {
                return record;
            }
            if( record === undefined ) {
                return record;
            }
            if( currentRecord === null ) {
                return record;
            }
            if( currentRecord === undefined ) {
                return record;
            }

            var newOwner = record.getValue( /996/, /a/ );
            if( currentRecord.matchValue( /996/, /a/, RegExp( newOwner ) ) === true ) {
                record.removeAll( "996" );
                record = RecordSorter.insertField( record, currentRecord.field( "996" ) );

                return record;
            }

            var owners = __collectOwners( record, currentRecord );

            record.removeAll( "996" );
            record = RecordSorter.insertField( record, __createOwnersField( owners ) );

            return record;
        }
        finally {
            Log.trace( "Exit - UpdateOwnership.mergeRecord(): '", record, "'" );
        }
    };

    function __collectOwners( record, currentRecord ) {
        Log.trace( "Enter - UpdateOwnership.__collectOwners( '", record, "', '", currentRecord, "'" );

        var owners = [];
        try {
            owners.push( record.getValue( /996/, /a/ ) );

            var value;
            value = currentRecord.getValue( /996/, /a/, ";" );
            if( value !== "" ) {
                owners = owners.concat( value.split( ";" ) );
            }
            value = currentRecord.getValue( /996/, /m/, ";" );
            if( value !== "" ) {
                owners = owners.concat( value.split( ";" ) );
            }
            value = currentRecord.getValue( /996/, /o/, ";" );
            if( value !== "" ) {
                owners = owners.concat( value.split( ";" ) );
            }

            return owners;
        }
        finally {
            Log.trace( "Exit - UpdateOwnership.__collectOwners(): ", owners );
        }
    }

    function __createOwnersField( owners ) {
        Log.trace( "Enter - UpdateOwnership.__createOwnersField( ", owners, " )" );

        var result = new Field( "996", "00" );
        try {
            for( var i = 0; i < owners.length; i++ ) {
                if( i === 0 ) {
                    result.append( "a", owners[ i ] );
                }
                else if( i === owners.length - 1 ) {
                    result.append( "o", owners[ i ] );
                }
                else {
                    result.append( "m", owners[ i ] );
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - UpdateOwnership.__createOwnersField(): ", result );
        }

    }

    return {
        'mergeRecord': mergeRecord
    }
}();
