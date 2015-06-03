//-----------------------------------------------------------------------------
use( "UnitTest" );
use( "SafeAssert" );
use( "FieldDemandsOtherFieldAndSubfield" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "Test FieldDemandsOtherFieldAndSubfield ", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldDemandsOtherFieldAndSubfield.BUNDLE_NAME );

    var rec = {
        fields : [{
            name : '001', indicator : '00', subfields : []
        }, {
            name : '002', indicator : '00', subfields : ["a", "b", "c"]
        }, {
            name : '003', indicator : '00', subfields : []
        }]
    };

    var field = {
        name : "096"
    };
    var params = {
        field : "004", subfields : ["a"]
    }
    var message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", "096", "004", "a" );
    var errMissing004 = [ValidateErrors.recordError( "", message )];
    SafeAssert.equal( "1 testing fieldDemandsOtherFieldAndSubfield with invalid 004 field", FieldDemandsOtherFieldAndSubfield.validateField( rec, field, params ), errMissing004 );

    params = {
        field : "001", subfields : ["a", "b", "c"]
    }
    message = ResourceBundle.getStringFormat( bundle, "field.demands.other.field.and.subfield.rule.error", "096", "001", "a,b,c" );
    var errMissingSubfieldABC = [ValidateErrors.recordError( "", message )];
    SafeAssert.equal( "2 testing fieldDemandsOtherFieldAndSubfield with invalid a,b,c subfields", FieldDemandsOtherFieldAndSubfield.validateField( rec, field, params ), errMissingSubfieldABC );

    params = {
        field : "002", subfields : ["a", "b", "c"]
    }
    SafeAssert.equal( "3 testing fieldDemandsOtherFieldAndSubfield with valid params", FieldDemandsOtherFieldAndSubfield.validateField( rec, field, params ), [] );
} );