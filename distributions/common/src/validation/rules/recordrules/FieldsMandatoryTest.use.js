use( "SafeAssert" );
use( "UnitTest" );
use( "FieldsMandatory" );

UnitTest.addFixture( "Test FieldsMandatory.validateRecord", function( ) {
    var bundle = ResourceBundleFactory.getBundle( FieldsMandatory.__BUNDLE_NAME );

    var record = {
        fields : [{
            name : '001',
            indicator : '00',
            subfields : []
        }, {
            name : '002',
            indicator : '00',
            subfields : []
        }, {
            name : '003',
            indicator : '00',
            subfields : []
        }]
    };

    var params00123 = {
        'fields' : ['001', '002', '003']
    };
    Assert.equalValue( "1 testing with valid " + params00123 + " param", FieldsMandatory.validateRecord( record, params00123 ), [] );

    var errorMissing004 = [ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "004" ) ) ];
    var params00124 = { 'fields' : ['001', '002', '004'] };
    Assert.equalValue( "2 testing with invalid " + params00124 + " param", FieldsMandatory.validateRecord( record, params00124 ), errorMissing004 );

    var errorMissing000 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "000" ) );
    var errorMissing005 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "005" ) );
    var errorMissing004 = ValidateErrors.recordError( "", ResourceBundle.getStringFormat( bundle, "field.mandatory.error", "004" ) );
    var errors = [errorMissing000, errorMissing005, errorMissing004];
    var params00054 = {
        'fields' : ['000', '005', '004']
    };
    Assert.equalValue( "3 testing with invalid " + errors + " param", FieldsMandatory.validateRecord( record, params00054 ), errors );
} );
