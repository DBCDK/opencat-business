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
    SafeAssert.equal( "1 CheckISBN10.validateSubfield with valid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "isbn10", 'value': "0-201-53082-2" };
    var error2 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.invalid.error", "isbn10", "0-201-53082-2" ) ) ];
    SafeAssert.equal( "2 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield2, params ), error2 );

    var subfield3 = {'name': "isbn10", 'value': "0-201-53082-42" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.length.error", "isbn10" ) )];
    SafeAssert.equal( "3 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield3, params ), error3 );

    var subfield4 = {'name': "isbn10", 'value': "0-201-53082" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.length.error", "isbn10" ) )];
    SafeAssert.equal( "4 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield4, params ), error4 );

    var subfield5 = {'name': "isbn10", 'value': "0-201-53O82-1" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn.numbers.error", "isbn10" ) )];
    SafeAssert.equal( "5 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield5, params ), error5 );

    var subfield6 = {'name': "isbn10", 'value': "0-8044-2957-X" };
    SafeAssert.equal( "1 CheckISBN10.validateSubfield, valid isbn10 number with trailing x", CheckISBN10.validateSubfield( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "isbn10", 'value': "0-8044-2967-X" };
    var error7 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn10.invalid.error", "isbn10", "0-8044-2967-X" ) )];
    SafeAssert.equal( "2 CheckISBN10.validateSubfield with invalid isbn10 number", CheckISBN10.validateSubfield( record, field, subfield7, params ), error7 );
});
