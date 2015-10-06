//-----------------------------------------------------------------------------
use( "OpenAgencyClientCore" );
use( "UnitTest" );
use( "Log" );

//-----------------------------------------------------------------------------
UnitTest.addFixture( "OpenAgencyClientCore.Features", function() {
    Assert.not( "Feature not found in empty set", OpenAgencyClientCore.hasFeature( "010100", "auth_root" ) );

    OpenAgencyClientCore.addFeatures( "010100", [ "auth_root", "use_enrichments" ] );
    Assert.that( "Feature found for known agency", OpenAgencyClientCore.hasFeature( "010100", "auth_root" ) );
    Assert.not( "Feature not found for known agency", OpenAgencyClientCore.hasFeature( "010100", "xxx" ) );

    Assert.not( "Feature not found for unknown agency", OpenAgencyClientCore.hasFeature( "710300", "xxx" ) );

    OpenAgencyClientCore.clearFeatures();
    Assert.not( "Lookup feature after clearFeatures", OpenAgencyClientCore.hasFeature( "010100", "auth_root" ) );
} );

