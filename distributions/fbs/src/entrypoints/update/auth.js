//-----------------------------------------------------------------------------
use( "FBSAuthenticator" );

//-----------------------------------------------------------------------------
function authenticateRecord( record, userId, groupId, settings ) {
    return FBSAuthenticator.authenticateRecord( record, userId, groupId, settings );
}
