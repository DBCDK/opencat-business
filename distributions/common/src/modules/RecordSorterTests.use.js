use("RecordSorter");
use("UnitTest");

UnitTest.addFixture("RecordSorter.insertField", function () {
    var expected;
    var record;
    var field;

    expected = new Record();
    expected.fromString("245 00 *a text");

    record = new Record();
    field = expected.field(0);
    Assert.equalValue("Field into empty record", RecordSorter.insertField(record, field).toString(), expected.toString());

    expected = new Record();
    expected.fromString(
        "001 00 *a text\n" +
        "004 00 *a text"
    );

    record = new Record();
    record.fromString(
        "004 00 *a text"
    );
    field = expected.field(0);
    Assert.equalValue("Field into first position", RecordSorter.insertField(record, field).toString(), expected.toString());

    expected = new Record();
    expected.fromString(
        "001 00 *a text\n" +
        "004 00 *a r\n" +
        "245 00 *a title"
    );

    record = new Record();
    record.fromString(
        "001 00 *a text\n" +
        "245 00 *a title"
    );
    field = expected.field(1);
    Assert.equalValue("Field into middle position", RecordSorter.insertField(record, field).toString(), expected.toString());

    expected = new Record();
    expected.fromString(
        "001 00 *a text\n" +
        "004 00 *a r\n" +
        "245 00 *a title"
    );

    record = new Record();
    record.fromString(
        "001 00 *a text\n" +
        "004 00 *a r\n"
    );
    field = expected.field(2);
    Assert.equalValue("Field into last position", RecordSorter.insertField(record, field).toString(), expected.toString());

    expected = new Record();
    expected.fromString(
        "001 00 *a text\n" +
        "004 00 *a r\n" +
        "245 00 *a title a\n" +
        "245 00 *a title b\n" +
        "245 00 *a title c\n" +
        "245 00 *a new field"
    );

    record = new Record();
    record.fromString(
        "001 00 *a text\n" +
        "004 00 *a r\n" +
        "245 00 *a title a\n" +
        "245 00 *a title b\n" +
        "245 00 *a title c"
    );
    field = expected.field(5);
    Assert.equalValue("Field into record with repeated fields", RecordSorter.insertField(record, field).toString(), expected.toString());

});
