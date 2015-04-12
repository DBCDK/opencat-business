//-----------------------------------------------------------------------------
use( "FBSAuthenticator" );

//-----------------------------------------------------------------------------
function authenticateRecord( record, userId, groupId ) {
    return FBSAuthenticator.authenticateRecord( record, userId, groupId );
}
