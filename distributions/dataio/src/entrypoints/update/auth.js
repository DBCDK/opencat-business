//-----------------------------------------------------------------------------
use( "DBCAuthenticator" );

//-----------------------------------------------------------------------------
function authenticateRecord( record, userId, groupId, settings ) {
    return DBCAuthenticator.authenticateRecord( record, userId, groupId, settings );
}
