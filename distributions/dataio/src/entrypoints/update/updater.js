//-----------------------------------------------------------------------------
use( "DBCUpdaterEntryPoint" );

//-----------------------------------------------------------------------------

function hasClassificationData( marc ) {
    return DBCUpdaterEntryPoint.hasClassificationData( marc );    
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
    return DBCUpdaterEntryPoint.hasClassificationsChanged( oldRecord, newRecord );
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
    return DBCUpdaterEntryPoint.createLibraryExtendedRecord( dbcRecord, libraryId );
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
    return DBCUpdaterEntryPoint.updateLibraryExtendedRecord( dbcRecord, libraryRecord );
}

function correctLibraryExtendedRecord( dbcRecord, libraryRecord ) {
    return DBCUpdaterEntryPoint.correctLibraryExtendedRecord( dbcRecord, libraryRecord );    
}

function recordDataForRawRepo( dbcRecord, userId, groupId ) {
    return DBCUpdaterEntryPoint.recordDataForRawRepo( dbcRecord, userId, groupId );
}
