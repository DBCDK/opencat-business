//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckISBN10" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckISBN10.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckISBN10.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "isbn10", 'value': "0-201-53082-1" };
    Assert.equalValue( "1 CheckISBN10.validateSubfield with valid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "isbn10", 'value': "0-201-53082-2" };
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.invalid.error", "isbn10", "0-201-53082-2" ) ) ];
    Assert.equalValue( "2 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield2, params )[0], error2[0] );

    var subfield3 = {'name': "isbn10", 'value': "0-201-53082-42" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.length.error", "isbn10" ) )];
    Assert.equalValue( "3 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield3, params )[0], error3[0] );

    var subfield4 = {'name': "isbn10", 'value': "0-201-53082" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.length.error", "isbn10" ) )];
    Assert.equalValue( "4 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield4, params )[0], error4[0] );

    var subfield5 = {'name': "isbn10", 'value': "0-201-53O82-1" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.numbers.error", "isbn10" ) )];
    Assert.equalValue( "5 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield5, params )[0], error5[0] );

    var subfield6 = {'name': "isbn10", 'value': "0-8044-2957-X" };
    Assert.equalValue( "6 CheckISBN10.validateSubfield, valid isbn10 number with trailing x", CheckISBN10.validateSubfield( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "isbn10", 'value': "0-8044-2967-X" };
    var error7 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.invalid.error", "isbn10", "0-8044-2967-X" ) )];
    Assert.equalValue( "7 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield7, params )[0], error7[0] );

    var subfield8 = {'name': "isbn10", 'value': "0-8044-2967-a" };
    var error8 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.numbers.error", "isbn10" ) )];
    Assert.equalValue( "8 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield8, params )[0], error8[0] );

    var subfield9 = {'name': "isbn10", 'value': "0 201 53082 1" };
    Assert.equalValue( "1 CheckISBN10.validateSubfield with valid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield9, params ), [] );

    var subfield10 = {'name': "isbn10", 'value': "0 201-53082 1" };
    Assert.equalValue( "1 CheckISBN10.validateSubfield with valid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield10, params ), [] );
});
