//-----------------------------------------------------------------------------
use( "DBCAuthenticator" );

//-----------------------------------------------------------------------------
function authenticateRecord( record, userId, groupId ) {
    return DBCAuthenticator.authenticateRecord( record, userId, groupId );
}
