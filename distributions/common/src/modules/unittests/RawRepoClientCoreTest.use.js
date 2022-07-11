//-----------------------------------------------------------------------------
use( "Marc" );
use( "RawRepoClientCore" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "RawRepoClientCore.records", function() {
    RawRepoClientCore.clear();
	Assert.equalValue( "recordExists: Empty repo", RawRepoClientCore.recordExists( "12345678", "870970" ), false ); 
	
	var rec = new Record();
	rec.fromString( "001 00 *a 12345678 *b 870970" );
	RawRepoClientCore.addRecord( rec );
	Assert.equalValue( "recordExists: Record exist", RawRepoClientCore.recordExists( "12345678", "870970" ), true );
	Assert.equalValue( "recordExists: Record does not exist", RawRepoClientCore.recordExists( "12345678", "870973" ), false );

	Assert.equalValue( "fetchRecord: Record exist", RawRepoClientCore.fetchRecord( "12345678", "870970" ).toString(), rec.toString() );
	Assert.equalValue( "fetchRecord: Record does not exist", RawRepoClientCore.fetchRecord( "12345678", "870973" ), undefined );	
    RawRepoClientCore.clear();
} );

UnitTest.addFixture( "RawRepoClientCore.getRelationsChildren", function() {
    RawRepoClientCore.clear();

	var recParent = new Record();
	recParent.fromString( "001 00 *a 12345678 *b 870970" );
	RawRepoClientCore.addRecord( recParent );

	Assert.equalValue( "No children", RawRepoClientCore.getRelationsChildren( "12345678", "870970" ), [] );

	var recChild = new Record();
	recChild.fromString( "001 00 *a 23456789 *b 870970\n" +
					     "014 00 *a 12345678" );
	RawRepoClientCore.addRecord( recChild );

	Assert.equalValue( "Has children", RawRepoClientCore.getRelationsChildren( "12345678", "870970" ), [ recChild ] );
    RawRepoClientCore.clear();
} );
