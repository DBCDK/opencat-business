//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "SafeAssert" );
use( "UnitTest" );

// -----------------------------------------------------------------------------
//                          Unit tests
// -----------------------------------------------------------------------------

UnitTest.addFixture( "DanMarc2Converter.convertToDanMarc2.invalidArguments", function() {
    /**
     * This fixture tests how DanMarc2Converter.convertToDanMarc2 reacts
     * on invalid arguments.
     */

    var exceptCallFormat = "DanMarc2Converter.convertToDanMarc2( %s )";

    var exceptArg = null;
    Assert.exception( "obj is null", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = undefined;
    Assert.exception( "obj is undefined", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = {};
    Assert.exception( "Empty record", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: 7 };
    Assert.exception( "Wrong fields type", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ 7 ] };
    Assert.exception( "Wrong field type", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ {} ] };
    Assert.exception( "Empty field", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: 17 } ] };
    Assert.exception( "field.name is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: 5 } ] };
    Assert.exception( "field.indicator is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: 32 } ] };
    Assert.exception( "field.subfields is non array", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: [ 7 ] } ] };
    Assert.exception( "field.subfields[i] is non object", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: [ {} ] } ] };
    Assert.exception( "field.subfields[i].name is undefined", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: [ { name: 7 } ] } ] };
    Assert.exception( "field.subfields[i].name is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: [ { name: "a" } ] } ] };
    Assert.exception( "field.subfields[i].value is undefined", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );

    exceptArg = { fields: [ { name: "001", indicator: "00", subfields: [ { name: "a", value: 22 } ] } ] };
    Assert.exception( "field.subfields[i].value is non string", StringUtil.sprintf( exceptCallFormat, uneval( exceptArg ) ) );
} );

UnitTest.addFixture( "DanMarc2Converter.convertToDanMarc2.validArguments", function() {
    /**
     * This fixture tests how DanMarc2Converter.convertToDanMarc2 reacts
     * to valid arguments.
     */
    var arg;
    var expect;

    arg = { fields: [] };
    expect = "";
    SafeAssert.equal( "Empty record", DanMarc2Converter.convertToDanMarc2( arg ).toString(), expect );

    arg = { fields: [ 
        {
            name: "001", indicator: "00",
            subfields: [ { name: "a", value: "1 234 567 9" } ]
        },
        {
            name: "004", indicator: "00",
            subfields: [ { name: "a", value: "e" },
                         { name: "r", value: "c" } ]
        } ]
    };
    expect = "001 00 *a 1 234 567 9 \n" +
             "004 00 *a e *r c \n";
    SafeAssert.equal( "Record with 2 fields", DanMarc2Converter.convertToDanMarc2( arg ).toString(), expect );
} );

UnitTest.addFixture( "DanMarc2Converter.convertFromDanMarc2", function() {
    /**
     * This fixture tests DanMarc2Converter.convertFromDanMarc2.
     */
        
    Assert.exception( "Argument is not Record", "DanMarc2Converter.convertFromDanMarc2( 35 )" );

    var arg;
    var record;
    var expect;
    
    arg = { fields: [] };
    record = DanMarc2Converter.convertToDanMarc2( arg );
    SafeAssert.equal( "Empty record", DanMarc2Converter.convertFromDanMarc2( record ), arg );

    arg = { fields: [ 
        {
            name: "001", indicator: "00",
            subfields: [ { name: "a", value: "1 234 567 9" } ]
        },
        {
            name: "004", indicator: "00",
            subfields: [ { name: "a", value: "e" },
                         { name: "r", value: "c" } ]
        } ]
    };
    record = DanMarc2Converter.convertToDanMarc2( arg );
    SafeAssert.equal( "Record with 2 fields", DanMarc2Converter.convertFromDanMarc2( record ), arg );
} );
