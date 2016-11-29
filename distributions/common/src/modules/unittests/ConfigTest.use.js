use("UnitTest");
use("SafeAssert");
use("Config");


// Test some of the helper functions
UnitTest.addFixture( "config.Config module", function( ) {

    Assert.exception( "is Config immutable?", 'Config.unit_test_flag = "changed"' );

    // Test some of the methods that checks the config.
    testthat = {
        to: {
            propa: undefined,
            propb: "",
            propc: "streng",
            propd: 42,
            propo: {
                propa: undefined,
                propb: "",
                propc: "streng",
                propd: 42,
            }
        }
    };
    Assert.equal( "repeatedSubscript 1", 'Config.__ut.repeatedSubscript( testthat, "to.propa" )', undefined );
    Assert.equal( "repeatedSubscript 2", 'Config.__ut.repeatedSubscript( testthat, "to.propb" )', "" );
    Assert.equal( "repeatedSubscript 3", 'Config.__ut.repeatedSubscript( testthat, "to.propc" );', "streng" );
    Assert.equal( "repeatedSubscript 4", 'Config.__ut.repeatedSubscript( testthat, "to.propd" );', 42 );
    //! \todo Check missing property. Becomes undefined. Is this really what we want...!!!!
    Assert.equal( "repeatedSubscript 6", 'Config.__ut.repeatedSubscript( testthat, "to.propf" )', undefined );

    Assert.equal( "repeatedSubscript 7", 'Config.__ut.repeatedSubscript( testthat, "to.propo.propa" )', undefined );
    Assert.equal( "repeatedSubscript 8", 'Config.__ut.repeatedSubscript( testthat, "to.propo.propb" )', "" );
    Assert.equal( "repeatedSubscript 9", 'Config.__ut.repeatedSubscript( testthat, "to.propo.propc" )', "streng" );
    Assert.equal( "repeatedSubscript 10", 'Config.__ut.repeatedSubscript( testthat, "to.propo.propd" )', 42 );

    // Config may be immutable on existing values, but we *can* add stuff to test.
    Config.testthat = testthat;

    // Test demandDefined
    Assert.exception( "demandDefined 0", 'Config.demandDefined( "testthat.to.propa" )' );
    Assert.equal( "demandDefined 1", 'Config.demandDefined( "testthat.to.propb" )', "" );
    Assert.equal( "demandDefined 1", 'Config.demandDefined( "testthat.to.propc" )', "streng" );
    Assert.equal( "demandDefined 1", 'Config.demandDefined( "testthat.to.propd" )', 42 );
    Assert.exception( "demandDefined 2", 'Config.demandDefined( "testthat.to.propf" )' );

    delete this.testthat;
    delete Config.testthat;
} );

delete Config.__ut;
