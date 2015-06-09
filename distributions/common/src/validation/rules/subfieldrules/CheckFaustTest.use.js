//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "CheckFaust" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "CheckFaust.validateSubfield", function() {
    var bundle = ResourceBundleFactory.getBundle( CheckFaust.__BUNDLE_NAME );

    var record = {};
    var field = {};
    var params = undefined;

    var subfield1 = {'name': "faust", 'value': "50984508" };
    SafeAssert.equal( "1 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield1, params ), [] );

    var subfield2 = {'name': "faust", 'value': "43640224" };
    SafeAssert.equal( "2 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield2, params ), [] );

    var subfield3 = {'name': "faust", 'value': "50984507" };
    var error3 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.error", subfield3.name, subfield3.value ) ) ];
    SafeAssert.equal( "3 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield3, params ), error3 );

    var subfield4 = {'name': "faust", 'value': "50984508A" };
    var error4 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.digit.error", subfield4.name ) ) ];
    SafeAssert.equal( "4 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield4, params ), error4 );

    var subfield5 = {'name': "faust", 'value': "42" };
    var error5 = [ValidateErrors.subfieldError( "TODO:fixurl", ResourceBundle.getStringFormat( bundle, "check.faust.length.error", subfield5.name, 8 ) ) ];
    SafeAssert.equal( "5 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield5, params ), error5 );

    var subfield6 = {'name': "faust", 'value': "5098 4508" };
    SafeAssert.equal( "6 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield6, params ), [] );

    var subfield7 = {'name': "faust", 'value': " 5 0 9 8  4 5 0 8  " };
    SafeAssert.equal( "7 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield7, params ), [] );

    var subfield8 = {'name': "faust", 'value': "22438980" };
    SafeAssert.equal( "8 CheckFaust.validateSubfield with valid faust number", CheckFaust.validateSubfield( record, field, subfield8, params ), [] );
});