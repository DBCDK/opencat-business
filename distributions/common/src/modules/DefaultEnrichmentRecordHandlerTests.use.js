use("ClassificationData");
use("DefaultEnrichmentRecordHandler");
use("UnitTest");
use("UpdateConstants");

UnitTest.addFixture("DefaultEnrichmentRecordHandler.create", function () {
    var classificationsInstance = ClassificationData.create(UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS);
    var instance = DefaultEnrichmentRecordHandler.create(classificationsInstance, ClassificationData);

    Assert.equalValue("DefaultEnrichmentRecordHandler instance", instance,
        {
            classifications: {
                instance: classificationsInstance,
                module: ClassificationData
            }
        }
    );
});

UnitTest.addFixture("DefaultEnrichmentRecordHandler.updateRecord", function () {
    function callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord) {
        var classificationsInstance = ClassificationData.create(UpdateConstants.DEFAULT_CLASSIFICATION_FIELDS);
        var instance = DefaultEnrichmentRecordHandler.create(classificationsInstance, ClassificationData);

        return DefaultEnrichmentRecordHandler.updateRecord(instance, currentCommonRecord, updatingCommonRecord, enrichmentRecord);
    }

    var currentCommonRecord;
    var updatingCommonRecord;
    var enrichmentRecord;
    var expected;

    currentCommonRecord = new Record;
    updatingCommonRecord = new Record;
    enrichmentRecord = new Record;
    expected = new Record;
    Assert.equalValue("Empty record", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel"
    );
    updatingCommonRecord = currentCommonRecord;
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a b\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel"
    );
    Assert.equalValue("Copy categorization fields", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: 004a=e had 004a=b", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a b\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a b\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: 004a=b had 004a=e", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "008 00 *t p\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: Current common record has 008t=p", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "008 00 *t p\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: Updating common record has 008t=p", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a c *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a c *a a *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: Updating common record has more 009 *a fields", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a a *a c *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a c *a a *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a a *a c *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    Assert.equalValue("New 512-note: Different order of fields", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());

    currentCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a aa *a yy *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    updatingCommonRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 191919\n" +
        "004 00 *r n *a e\n" +
        "009 00 *a aa *a xx *g xx *b s *h xc\n" +
        "245 00 *g 5. bind, hft. 30 *a Brændekilde, Bellinge, Stenløse, Fangel\n" +
        "652 00 *m 47.44 *b Barcelona"
    );
    enrichmentRecord = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400"
    );
    expected = RecordUtil.createFromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *r n *a e\n" +
        RecategorizationNoteFieldFactory.newNoteField(currentCommonRecord, updatingCommonRecord).toString() + "\n" +
        "y08 00 *a UPDATE posttypeskift"
    );
    Assert.equalValue("New 512-note: Same amount of fields, different values", callFunction(currentCommonRecord, updatingCommonRecord, enrichmentRecord).toString(), expected.toString());
});
