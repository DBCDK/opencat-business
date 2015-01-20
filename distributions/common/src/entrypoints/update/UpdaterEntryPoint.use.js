//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "ClassificationData" );
use( "Log" );
use( "Marc" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'UpdaterEntryPoint' ];

//-----------------------------------------------------------------------------
var UpdaterEntryPoint = function() {
    /**
     * Checks if a record contains any classification data
     * 
     * @param {String} jsonMarc The record as a json.
     * 
     * @return {Boolean} true if classification data exists in the record, false otherwise.
     */
    function hasClassificationData( jsonMarc ) {
        var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( jsonMarc ) );
        
        return ClassificationData.hasClassificationData( marc );
    }
    
    /**
     * Checks if the classifications has changed between two records.
     * 
     * @param {String} oldRecord The old record as a json.
     * @param {String} newRecord The new record as a json.
     * 
     * @return {Boolean} true if the classifications has changed, false otherwise.
     */
    function hasClassificationsChanged( oldRecord, newRecord ) {
        var oldMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( oldRecord ) );
        var newMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( newRecord ) );

        return ClassificationData.hasClassificationsChanged( oldMarc, newMarc );    
    }

    /**
     * Creates a new library extended record based on a DBC record.
     * 
     * @param {String} dbcRecord The DBC record as a json.
     * @param {int}    libraryId Library id for the local library.
     * 
     * @return {String} A json with the new record.
     */
    function createLibraryExtendedRecord( dbcRecord, libraryId ) {
        var dbcMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( dbcRecord ) );
        var result = new Record;

        var curDate = new Date();
        var curDateStr = curDate.getFullYear().toString() + 
                         curDate.getMonth().toString() + 
                         curDate.getDay().toString();
        var curTimeStr = curDate.getHours().toString() + 
                         curDate.getMinutes().toString() + 
                         curDate.getSeconds().toString();

        var idField = new Field( "001", "00" );
        idField.append( new Subfield( "a", dbcMarc.getValue( /001/, /a/ ) ) );
        idField.append( new Subfield( "b", libraryId.toString() ) );
        idField.append( new Subfield( "c", curDateStr + curTimeStr ) );
        idField.append( new Subfield( "d", curDateStr ) );
        idField.append( new Subfield( "f", "a" ) );
        result.append( idField );

        return updateLibraryExtendedRecord( dbcRecord, JSON.stringify( DanMarc2Converter.convertFromDanMarc2( result ) ) );
    }
    
    /**
     * Updates a library extended record with the classifications from 
     * a DBC record.
     * 
     * @param {String} dbcRecord The DBC record as a json.
     * @param {String} libraryRecord The library record to update as a json.
     * 
     * @return {String} A json with the updated record.
     */
    function updateLibraryExtendedRecord( dbcRecord, libraryRecord ) {
        var dbcMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( dbcRecord ) );
        var libraryMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( libraryRecord ) );

        return JSON.stringify( DanMarc2Converter.convertFromDanMarc2( ClassificationData.updateClassificationsInRecord( dbcMarc, libraryMarc ) ) );
    }
     
    function correctLibraryExtendedRecord( dbcRecord, libraryRecord ) {
        Log.info( "Enter - ClassificationData.__hasFieldChanged()" );
        var dbcMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( dbcRecord ) );
        var libraryMarc = DanMarc2Converter.convertToDanMarc2( JSON.parse( libraryRecord ) );

        Log.info( "    dbcMarc: " + dbcMarc );
        Log.info( "    libraryMarc: " + libraryMarc );

        if( ClassificationData.hasClassificationData( dbcMarc ) ) {
            if( !ClassificationData.hasClassificationsChanged( dbcMarc, libraryMarc ) ) {
                Log.info( "Classifications is the same. Removing it from library record." );
                libraryMarc = ClassificationData.removeClassificationsFromRecord( libraryMarc );
            }
            else {
                Log.info( "Classifications has changed." );                
            }
        }
        else {
            Log.info( "Common record has no classifications." );            
        }
        
        if( libraryMarc.size() === 1 && libraryMarc.field( 0 ).name === "001" ) {
            libraryMarc = new Record();
        }

        Log.info( "Exit - ClassificationData.correctLibraryExtendedRecord(): " + libraryMarc );
        return JSON.stringify( DanMarc2Converter.convertFromDanMarc2( libraryMarc ) );
    }

    /**
     * Changes the records content when it is being updated.
     *
     * @param {String}   dbcRecord The DBC record as a json.
     *
     * @returns {String} A json with the new record content.
     */
    function changeUpdateRecordForUpdate( dbcRecord ) {
        var marc = DanMarc2Converter.convertToDanMarc2( JSON.parse( dbcRecord ) );

        if( !marc.existField( /001/ ) ) {
            return dbcRecord;
        }

        var date = new Date();
        var dateStr = StringUtil.sprintf( "%4s%2s%2s%2s%2s%2s",
                                          date.getFullYear(), date.getMonth() + 1, date.getDate(),
                                          date.getHours(), date.getMinutes(), date.getSeconds() ).replace( " ", "0" );

        marc.field( "001" ).append( "c", dateStr, true );
        return JSON.stringify( DanMarc2Converter.convertFromDanMarc2( marc ) );
    }

    return {
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'createLibraryExtendedRecord': createLibraryExtendedRecord,
        'updateLibraryExtendedRecord': updateLibraryExtendedRecord,
        'correctLibraryExtendedRecord': correctLibraryExtendedRecord,
        'changeUpdateRecordForUpdate': changeUpdateRecordForUpdate
    };

}();
