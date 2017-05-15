//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckISSN" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckISSN.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckISSN.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "issn", 'value': "0105-4988" };
    Assert.equalValue( "1 CheckISSN.validateSubfield with valid issn number", CheckISSN.validateSubfield( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "issn", 'value': "0105-3988" };
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.issn.invalid.error", "issn", "0105-3988" ) ) ];
    Assert.equalValue( "2 CheckISSN.validateSubfield with invalid issn number", CheckISSN.validateSubfield( record, field, subfield2, params )[0], error2[0] );

    var subfield3 = {'name': "issn", 'value': "0105-39883" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.issn.length.error", "issn" ) )];
    Assert.equalValue( "3 CheckISSN.validateSubfield with invalid issn number", CheckISSN.validateSubfield( record, field, subfield3, params )[0], error3[0] );

    var subfield4 = {'name': "issn", 'value': "0105-398" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.issn.length.error", "issn" ) )];
    Assert.equalValue( "4 CheckISSN.validateSubfield with invalid issn number", CheckISSN.validateSubfield( record, field, subfield4, params )[0], error4[0] );

    var subfield5 = {'name': "issn", 'value': "01O5-3988" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.issn.numbers.error", "issn" ) )];
    Assert.equalValue( "5 CheckISSN.validateSubfield with invalid issn number", CheckISSN.validateSubfield( record, field, subfield5, params )[0], error5[0] );

    var subfield6 = {'name': "issn", 'value': "0900-226X" };
    Assert.equalValue( "6 CheckISSN.validateSubfield, valid issn number with trailing x", CheckISSN.validateSubfield( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "issn", 'value': "0900-216X" };
    var error7 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.issn.invalid.error", "issn", "0900-216X" ) )];
    Assert.equalValue( "7 CheckISSN.validateSubfield with invalid issn number", CheckISSN.validateSubfield( record, field, subfield7, params )[0], error7[0] );
});
