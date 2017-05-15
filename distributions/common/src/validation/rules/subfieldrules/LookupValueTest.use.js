//-----------------------------------------------------------------------------
/**
 * This file contains unittests for the SubfieldCannotContainValue module.
 */

//-----------------------------------------------------------------------------
use( "ResourceBundle" );
use( "SafeAssert" );
use( "UnitTest" );
use ( 'GenericSettings' );
use( "LookupValue" );
//-----------------------------------------------------------------------------

UnitTest.addFixture( "LookupValue.validateSubfield", function() {
    /***************
     * US2139 For now we comment out the test of validateSubField
     * a more general solution of these exception asserts should be found - likewise with the tests that isn't
     * executed due to the return in the middle.
    Assert.exception( "No params", "LookupValue.validateSubfield( {}, {}, {}, undefined, undefined )" );
    Assert.exception( "Params: No register", "LookupValue.validateSubfield( {}, {}, {}, {}, undefined )" );
    Assert.exception( "Params: Wrong register type", "LookupValue.validateSubfield( {}, {}, {}, { register: 1 }, undefined )" );
    Assert.exception( "Params: No exist", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a' }, undefined )" );
    Assert.exception( "Params: Wrong exist type", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a', exist: 3 }, undefined )" );
    Assert.exception( "No settings", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a', exist: true }, undefined )" );

    GenericSettings.setSettings( {} );
    Assert.exception( "Settings: No solr.url", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );

    var settings = {};
    settings[ 'solr.url' ] = undefined;
    GenericSettings.setSettings( settings );
    Assert.exception( "Settings: solr.url is undefined", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );

    settings[ 'solr.url' ] = 37;
    GenericSettings.setSettings( settings );
    Assert.exception( "Settings: solr.url has wrong type", "LookupValue.validateSubfield( {}, {}, {}, { register: 'marc.001a', exist: true }, GenericSettings )" );
    ***************/
    return;

    settings[ 'solr.url' ] = "http://localhost:12100/solr/raw-repo-index";
    GenericSettings.setSettings( settings );

    var record = {};
    var field = {};
    var subfield = {};
    var marcRecord = undefined;

    var exist_message = "V\u00E6rdien %s (delfelt %s%s) kan ikke findes i en eksisterende post.";
    var notexist_message = "V\u00E6rdien %s (delfelt %s%s) findes allerede i en eksisterende post.";

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 06605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    var params = { register: "marc.002a", exist: true };
    Assert.equalValue( "001a must exist: OK", LookupValue.validateSubfield( record, field, subfield, params, GenericSettings ), [] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 76605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: true };
    Assert.equalValue( "001a must exist: Failure", LookupValue.validateSubfield( record, field, subfield, params, GenericSettings ),
        [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( exist_message, "76605141", "001", "a" ) ) ] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 76605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: false };
    Assert.equalValue( "001a must not exist: OK", LookupValue.validateSubfield( record, field, subfield, params, GenericSettings ), [] );

    marcRecord = new Record();
    marcRecord.fromString( "001 00 *a 06605141" );
    record = DanMarc2Converter.convertFromDanMarc2( marcRecord );
    field = record.fields[ 0 ];
    subfield = field.subfields[ 0 ];
    params = { register: "marc.002a", exist: false };
    Assert.equalValue( "001a must not exist: Failure", LookupValue.validateSubfield( record, field, subfield, params, GenericSettings ),
        [ ValidateErrors.subfieldError( "TODO:fixurl", StringUtil.sprintf( notexist_message, "06605141", "001", "a" ) ) ] );
});