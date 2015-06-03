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
    var bundle = ResourceBundleFactory.getBundle( SubfieldRules.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var params = undefined;

    var subfield = {'name': "isbn13", 'value': "9-785467-007540" };
    SafeAssert.equal( "1 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "isbn13", 'value': "5-705467-007642" };
    var error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.invalid.error", "isbn13", "5-705467-007642" ) ) ];
    SafeAssert.equal( "2 CheckISBN13.validateSubfield with invalid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), error );

    subfield = {'name': "isbn13", 'value': "5-705467-0076411" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.length.error", "isbn13" ) )];
    SafeAssert.equal( "3 CheckISBN13.validateSubfield with invalid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), error );

    subfield = {'name': "isbn13", 'value': "5-705467-00764" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn13.length.error", "isbn13" ) )];
    SafeAssert.equal( "4 CheckISBN13.validateSubfield with invalid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), error );

    subfield = {'name': "isbn13", 'value': "5-705467-0O7641" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.isbn.numbers.error", "isbn13" ) )];
    SafeAssert.equal( "5 CheckISBN13.validateSubfield with invalid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), error );

    //Bug 18231 - Validate fejler korrekt ISBN
    subfield = {'name': "isbn13", 'value': "9788792554710" };
    SafeAssert.equal( "6 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788793038189" };
    SafeAssert.equal( "7 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788788067118" };
    SafeAssert.equal( "8 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788791165078" };
    SafeAssert.equal( "9 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792771803" };
    SafeAssert.equal( "10 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788799727308" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788771161274" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788771570014" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792170248" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788711336632" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788792554727" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );

    //Bug 18231 - Validate fejler korrekt ISBN - reopened
    subfield = {'name': "isbn13", 'value': "9788770123938" };
    SafeAssert.equal( "11 CheckISBN13.validateSubfield with valid isbn13 number", CheckISBN13.validateSubfield( record, field, subfield, params ), [] );
});