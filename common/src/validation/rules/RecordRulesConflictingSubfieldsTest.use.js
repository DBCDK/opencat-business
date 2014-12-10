//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "SafeAssert" );
use( "UnitTest" );

// -----------------------------------------------------------------------------
//                          Unit tests
// -----------------------------------------------------------------------------

UnitTest.addFixture( "RecordRules.conflictingSubfields.invalidArguments", function() {
    var exceptCallFormat = "RecordRules.conflictingSubfields( %s, %s )";

    var recordArg = null;
    var paramsArg = null;
    Assert.exception( "records is null", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = undefined;
    paramsArg = undefined;
    Assert.exception( "records is undefined", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = { fields: [] };
    paramsArg = null;
    Assert.exception( "params is null", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = { fields: [] };
    paramsArg = undefined;
    Assert.exception( "params is undefined", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = { fields: [] };
    paramsArg = {};
    Assert.exception( "params is missing subfields", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = { fields: [] };
    paramsArg = { subfields: "kk" };
    Assert.exception( "params: subfields has wrong type", StringUtil.sprintf( exceptCallFormat, uneval( recordArg ), uneval( paramsArg ) ) );

    recordArg = { fields: [] };
    paramsArg = { subfields: [] };
    RecordRules.conflictingSubfields( recordArg, paramsArg );
});

UnitTest.addFixture( "RecordRules.conflictingSubfields", function() {
    var record = {};
    var params = {};

    record = { fields: [
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
    params = { subfields: [] };
    SafeAssert.equal( "No subfields", RecordRules.conflictingSubfields( record, params ), [] );

    record = { fields: [
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
    params = { subfields: [ "653m", "654m" ] };
    SafeAssert.equal( "Two subfields: None found", RecordRules.conflictingSubfields( record, params ), [] );

    record = { fields: [
        {
            name: "001", indicator: "00",
            subfields: [ { name: "a", value: "1 234 567 9" } ]
        },
        {
            name: "004", indicator: "00",
            subfields: [ { name: "a", value: "e" },
                         { name: "r", value: "c" } ]
        },
        {
            name: "653", indicator: "00",
            subfields: [ { name: "m", value: "xx" } ]
        } ]
    };
    params = { subfields: [ "653m", "654m" ] };
    SafeAssert.equal( "Two subfields: First found", RecordRules.conflictingSubfields( record, params ), [] );

    record = { fields: [
        {
            name: "001", indicator: "00",
            subfields: [ { name: "a", value: "1 234 567 9" } ]
        },
        {
            name: "004", indicator: "00",
            subfields: [ { name: "a", value: "e" },
                         { name: "r", value: "c" } ]
        },
        {
            name: "654", indicator: "00",
            subfields: [ { name: "m", value: "xx" } ]
        } ]
    };
    params = { subfields: [ "653m", "654m" ] };
    SafeAssert.equal( "Two subfields: Last found", RecordRules.conflictingSubfields( record, params ), [] );

    record = { fields: [
        {
            name: "001", indicator: "00",
            subfields: [ { name: "a", value: "1 234 567 9" } ]
        },
        {
            name: "004", indicator: "00",
            subfields: [ { name: "a", value: "e" },
                         { name: "r", value: "c" } ]
        },
        {
            name: "653", indicator: "00",
            subfields: [ { name: "m", value: "xx" } ]
        },
        {
            name: "654", indicator: "00",
            subfields: [ { name: "m", value: "xx" } ]
        } ]
    };
    params = { subfields: [ "653m", "654m" ] };
    SafeAssert.equal( "Two subfields: Last found", RecordRules.conflictingSubfields( record, params ),
                      [ ValidateErrors.recordError( "TODO:fixurl", "Delfelt 653m m\u00E5 ikke anvendes sammen med delfelt 654m" ) ] );
} );
