use("RecordLookupField");
use("RecordUtil");


UnitTest.addFixture("RecordLookupField.createFromRecord", function () {
    var record;

    Assert.equalValue("Empty record", RecordLookupField.createFromRecord(new Record), {});

    record = RecordUtil.createFromString("001 00 *a 20611529 *b 723000 *c 19971020 *d 19940516 *f a");
    Assert.equalValue("Single field", RecordLookupField.createFromRecord(record, /./), {
        '001': [
            {
                indicator: "00",
                subfields: [
                    record.field(0).subfield(0),
                    record.field(0).subfield(1),
                    record.field(0).subfield(2),
                    record.field(0).subfield(3),
                    record.field(0).subfield(4)
                ]
            }
        ]
    });

    record = RecordUtil.createFromString(
        "001 00 *a 20611529 *b 723000 *c 19971020 *d 19940516 *f a\n" +
        "001 00 *a 20611529 *b 191919 *c 19971020 *d 19940516 *f a\n" +
        "004 00 *r n *a e\n"
    );
    Assert.equalValue("Multiple fields", RecordLookupField.createFromRecord(record, /./), {
        '001': [
            {
                indicator: record.field(0).indicator,
                subfields: [
                    record.field(0).subfield(0),
                    record.field(0).subfield(1),
                    record.field(0).subfield(2),
                    record.field(0).subfield(3),
                    record.field(0).subfield(4)
                ]
            },
            {
                indicator: record.field(1).indicator,
                subfields: [
                    record.field(1).subfield(0),
                    record.field(1).subfield(1),
                    record.field(1).subfield(2),
                    record.field(1).subfield(3),
                    record.field(1).subfield(4)
                ]
            }
        ],
        '004': [
            {
                indicator: record.field(2).indicator,
                subfields: [
                    record.field(2).subfield(1),
                    record.field(2).subfield(0)
                ]
            }
        ]
    });

    record = RecordUtil.createFromString(
        "001 00 *a 20611529 *b 723000 *c 19971020 *d 19940516 *f a\n" +
        "004 00 *r n *a e *a k\n"
    );
    Assert.equalValue("Multiple subfields fields", RecordLookupField.createFromRecord(record, /./), {
        '001': [
            {
                indicator: record.field(0).indicator,
                subfields: [
                    record.field(0).subfield(0),
                    record.field(0).subfield(1),
                    record.field(0).subfield(2),
                    record.field(0).subfield(3),
                    record.field(0).subfield(4)
                ]
            }
        ],
        '004': [
            {
                indicator: record.field(1).indicator,
                subfields: [
                    record.field(1).subfield(1),
                    record.field(1).subfield(2),
                    record.field(1).subfield(0)
                ]
            }
        ]
    });
});

UnitTest.addFixture("RecordLookupField.createFromRecord", function () {
    Log.trace("Enter - Fixture: RecordLookupField.createFromRecord()");

    try {
        var record = RecordUtil.createFromString(
            "001 00 *a 20611529 *b 723000 *c 19971020 *d 19940516 *f a\n" +
            "004 00 *r n *a e *a k\n" +
            "521 00 *a 2. danske udgave *c 1994\n" +
            "521 00 *b nyt oplag *c 1997\n"
        );
        var instance = RecordLookupField.createFromRecord(record);

        SafeAssert.that("Same single field object", RecordLookupField.containsField(instance, record.field(0)));
        SafeAssert.that("Same repeated field object", RecordLookupField.containsField(instance, record.field(0)));

        var field = RecordUtil.createFieldFromString("004 00 *a e *a k *r n");
        SafeAssert.that("Same field in different order", RecordLookupField.containsField(instance, field));

        var field = RecordUtil.createFieldFromString("004 00 *a e *a k *r n *g kk");
        SafeAssert.not("Lookup extended field", RecordLookupField.containsField(instance, field));
    }
    finally {
        Log.trace("Exit - Fixture: RecordLookupField.createFromRecord()");
    }
});
