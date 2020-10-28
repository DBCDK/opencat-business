use("DanMarc2Converter");
use("UnitTest");

UnitTest.addFixture("DanMarc2Converter.convertToDanMarc2.invalidArguments", function () {
    /**
     * This fixture tests how DanMarc2Converter.convertToDanMarc2 reacts
     * on invalid arguments.
     */
    /***************
     * US2139 For now we comment out the exception test
     * a more general solution of these exception asserts should be found
    var exceptCallFormat = "DanMarc2Converter.convertToDanMarc2( %s )";
    Assert.exception("obj is null", StringUtil.sprintf(exceptCallFormat, "null"));
    Assert.exception("obj is undefined", StringUtil.sprintf(exceptCallFormat, "undefined"));

    var exceptArg = {};
    Assert.exception("Empty record", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: 7};
    Assert.exception("Wrong fields type", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [7]};
    Assert.exception("Wrong field type", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{}]};
    Assert.exception("Empty field", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: 17}]};
    Assert.exception("field.name is non string", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: 5}]};
    Assert.exception("field.indicator is non string", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: 32}]};
    Assert.exception("field.subfields is non array", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: [7]}]};
    Assert.exception("field.subfields[i] is non object", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: [{}]}]};
    Assert.exception("field.subfields[i].name is undefined", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: [{name: 7}]}]};
    Assert.exception("field.subfields[i].name is non string", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: [{name: "a"}]}]};
    Assert.exception("field.subfields[i].value is undefined", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));

    exceptArg = {fields: [{name: "001", indicator: "00", subfields: [{name: "a", value: 22}]}]};
    Assert.exception("field.subfields[i].value is non string", StringUtil.sprintf(exceptCallFormat, JSON.stringify(exceptArg)));
     **************/
});

UnitTest.addFixture("DanMarc2Converter.convertToDanMarc2.validArguments", function () {
    /**
     * This fixture tests how DanMarc2Converter.convertToDanMarc2 reacts
     * to valid arguments.
     */
    var arg = {fields: []};
    var expect = "";
    Assert.equalValue("Empty record", DanMarc2Converter.convertToDanMarc2(arg).toString(), expect);

    arg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "1 234 567 9"}, {name: "b", value: "123456"}]
            },
            {
                name: "004", indicator: "00",
                subfields: [{name: "a", value: "e"},
                    {name: "r", value: "c"}]
            }]
    };
    expect = "001 00 *a 1 234 567 9 *b 123456 \n" +
        "004 00 *a e *r c \n";
    var params = {context: {}}
    Assert.equalValue("Record with 2 fields", DanMarc2Converter.convertToDanMarc2(arg, params).toString(), expect);
    Assert.equalValue("Context is set", params.context["convertToDanMarc2"]["1 234 567 9"]["123456"].toString(), expect);
});

UnitTest.addFixture("DanMarc2Converter.convertFromDanMarc2", function () {
    /**
     * This fixture tests DanMarc2Converter.convertFromDanMarc2.
     */
    // TODO US2139 exception problem Assert.exception("Argument is not Record", "DanMarc2Converter.convertFromDanMarc2(35)");
    var arg = {fields: []};
    var record = DanMarc2Converter.convertToDanMarc2(arg);
    Assert.equalValue("Empty record", DanMarc2Converter.convertFromDanMarc2(record), arg);
    arg = {
        fields: [
            {
                name: "001", indicator: "00",
                subfields: [{name: "a", value: "1 234 567 9"}]
            },
            {
                name: "004", indicator: "00",
                subfields: [{name: "a", value: "e"},
                    {name: "r", value: "c"}]
            }]
    };
    record = DanMarc2Converter.convertToDanMarc2(arg);
    Assert.equalValue("Record with 2 fields", DanMarc2Converter.convertFromDanMarc2(record), arg);
});
