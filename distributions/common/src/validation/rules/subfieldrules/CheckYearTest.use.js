//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "CheckYear" );
use( "DanMarc2Converter" );
use( "GenericSettings" );
use( "RecordUtil" );
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );

//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckYear.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckYear.__BUNDLE_NAME );

    var record;
    var field;
    var subfield;
    var error;
    var params = undefined;

    var subfield = {'name': "year", 'value': "2016" };
    Assert.equalValue( "1 CheckYear.validateSubfield with valid year", CheckYear.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "year", 'value': "201?" };
    Assert.equalValue( "2 CheckYear.validateSubfield with valid year", CheckYear.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "year", 'value': "20??" };
    Assert.equalValue( "3 CheckYear.validateSubfield with valid year", CheckYear.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "year", 'value': "2???" };
    Assert.equalValue( "4 CheckYear.validateSubfield with valid year", CheckYear.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "year", 'value': "????" };
    Assert.equalValue( "5 CheckYear.validateSubfield with valid year", CheckYear.validateSubfield( record, field, subfield, params ), [] );

    subfield = {'name': "year", 'value': "20?6" };
    var error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.order.error", "year", "20?6" ) ) ];
    Assert.equalValue( "6 CheckYear.validateSubfield with digits after question mark", CheckYear.validateSubfield( record, field, subfield, params )[0], error[0] );

    subfield = {'name': "year", 'value': "2o16" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.content.error", "year", "2o16" ) ) ];
    Assert.equalValue( "7 CheckYear.validateSubfield with invalid year (length)", CheckYear.validateSubfield( record, field, subfield, params )[0], error[0] );

    subfield = {'name': "year", 'value': "9790706785432" };
    error = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.year.length.error", "year", "9790706785432" ) ) ];
    Assert.equalValue( "8 CheckYear.validateSubfield with invalid year (length)", CheckYear.validateSubfield( record, field, subfield, params )[0], error[0] );

});