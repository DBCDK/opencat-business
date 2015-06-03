//-----------------------------------------------------------------------------
use( "IdFieldExists" );
use( "UnitTest" );
use( "SafeAssert" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "Test IdFieldExists.validateRecord", function( ) {
    Assert.equalValue( "Empty object", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], IdFieldExists.validateRecord( {} ) );
    Assert.equalValue( "Empty record", [ValidateErrors.recordError( "http://www.kat-format.dk/danMARC2/Danmarc2.5.htm#pgfId=1532869", "Felt 001 er obligatorisk." )], IdFieldExists.validateRecord( {
        fields : []
    } ) );
    Assert.equalValue( "Valid record", [], IdFieldExists.validateRecord( {
        fields : [{
            name : "001",
            indicator : "00",
            subfields : [{
                name : "a",
                value : "1 234 567 8"
            }]
        }]
    } ) );
} );