//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckISBN13" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckISBN13.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckISBN13.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var params = undefined;

    var subfield = {'name': "isbn13", 'value': "9785467007540" };
    Assert.equalValue( "1 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "isbn13", 'value': "9785467007541" };
    var error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.invalid.error", "isbn13", "9785467007541" ) ) ];
    Assert.equalValue( "2 CheckISBN13.validateSubfield with invalid isbn13 number (checksum)", CheckISBN13.validateSubfield( record, field, subfield, params )[0], error[0] );

    subfield = {'name': "isbn13", 'value': "978546700754" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.length.error", "isbn13" ) )];
    Assert.equalValue( "3 CheckISBN13.validateSubfield with invalid isbn13 number (too short)", CheckISBN13.validateSubfield( record, field, subfield, params )[0], error[0] );

    subfield = {'name': "isbn13", 'value': "97854670075401" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.length.error", "isbn13" ) )];
    Assert.equalValue( "4 CheckISBN13.validateSubfield with invalid isbn13 number (too long)", CheckISBN13.validateSubfield( record, field, subfield, params )[0], error[0] );

    subfield = {'name': "isbn13", 'value': "9785467O07540" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.numbers.error", "isbn13" ) )];
    Assert.equalValue( "5 CheckISBN13.validateSubfield with invalid characters (O)", CheckISBN13.validateSubfield( record, field, subfield, params )[0], error[0] );

    //Bug 18231 - Validate fejler korrekt ISBN
    subfield = {'name': "isbn13", 'value': "9788792554710" };
    Assert.equalValue( "6 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788793038189" };
    Assert.equalValue( "7 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788788067118" };
    Assert.equalValue( "8 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788791165078" };
    Assert.equalValue( "9 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792771803" };
    Assert.equalValue( "10 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788799727308" };
    Assert.equalValue( "12 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788771161274" };
    Assert.equalValue( "13 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788771570014" };
    Assert.equalValue( "14 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792170248" };
    Assert.equalValue( "15 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788711336632" };
    Assert.equalValue( "16 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792554727" };
    Assert.equalValue( "17 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788770123938" };
    Assert.equalValue( "18 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "isbn13", 'value': "570-5467-0O764-1" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.numbers.error", "isbn13" ) )];
    Assert.equalValue( "19 CheckISBN13.validateSubfield with invalid characters(-)", CheckISBN13.validateSubfield( record, field, subfield, params )[0], error[0] );
});