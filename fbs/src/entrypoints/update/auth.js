//-----------------------------------------------------------------------------
use( "AuthenticatorEntryPoint" );

//-----------------------------------------------------------------------------
function authenticateRecord( record, userId, groupId ) {
    return AuthenticatorEntryPoint.authenticateRecord( record, userId, groupId );
}
