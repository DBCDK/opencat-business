use("NoteAndSubjectAndDisputasExtentionsHandler");
use("RawRepoClientCore");
use("ResourceBundle");
use("ResourceBundleFactory");
use("UnitTest");

UnitTest.addFixture("NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord", function () {
    var record;

    record = new Record();

    record.fromString(
        "004 00 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Not 032", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), false);

    record.fromString(
        "032 00 *x xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("032: No *a", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), false);

    record.fromString(
        "032 00 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("032: *a and no *x", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), true);

    record.fromString(
        "032 00 *a xxx *x BKM201417\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("032: *a and *x BKM", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), false);

    record.fromString(
        "032 00 *a xxx *x NET201417\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("032: *a and *x NET", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), false);

    record.fromString(
        "032 00 *a xxx *x SF201417\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("032: *a and *x SF", NoteAndSubjectAndDisputasExtentionsHandler.isNationalCommonRecord(record), false);
});

// authenticateExtentions
UnitTest.addFixture("NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions.no_features", function () {
    var bundle = ResourceBundleFactory.getBundle(NoteAndSubjectAndDisputasExtentionsHandler.__BUNDLE_NAME);
    var curRecord;
    var record;

    RawRepoClientCore.clear();
    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue("Not national common record",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("No existing record in rawrepo",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);
    Assert.equalValue("National common record with no changes",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(curRecord, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *b %s *a 1 234 567 8 \n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *r n *a e\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("National common record with no changes, but with different order of subfields",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "600 00 *a xxx\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "504", "1 234 567 8")),
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "600", "1 234 567 8"))
        ]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a note\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a ny note\n" +
        "600 00 *a yyy\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "504", "1 234 567 8")),
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "600", "1 234 567 8"))
        ]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a note\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", "700400", "504", "1 234 567 8")),
            ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", "700400", "600", "1 234 567 8"))
        ]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a yyy *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();
});

UnitTest.addFixture("NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions.auth_common_subjects", function () {
    var bundle = ResourceBundleFactory.getBundle(NoteAndSubjectAndDisputasExtentionsHandler.__BUNDLE_NAME);
    var curRecord;
    var record;
    RawRepoClientCore.clear();

    OpenAgencyClientCore.addFeatures("700400", [UpdateConstants.AUTH_COMMON_SUBJECTS]);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue("Not national common record",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("No existing record in rawrepo",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);
    Assert.equalValue("National common record with no changes",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(curRecord, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *b %s *a 1 234 567 8 \n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *r n *a e\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("National common record with no changes, but with different order of subfields",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *a xxx\n" +
        "666 00*e emneord\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *a yyy\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a yyy *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    OpenAgencyClientCore.clearFeatures();
});

UnitTest.addFixture("NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions.auth_common_notes", function () {
    var bundle = ResourceBundleFactory.getBundle(NoteAndSubjectAndDisputasExtentionsHandler.__BUNDLE_NAME);
    var curRecord;
    var record;
    RawRepoClientCore.clear();

    OpenAgencyClientCore.addFeatures("700400", [UpdateConstants.AUTH_COMMON_NOTES]);

    record = new Record();
    record.fromString(
        "001 00 *a 1 234 567 8 *b 700400\n" +
        "004 00 *a e *r n"
    );
    Assert.equalValue("Not national common record",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("No existing record in rawrepo",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);
    Assert.equalValue("National common record with no changes",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(curRecord, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *b %s *a 1 234 567 8 \n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *r n *a e\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("National common record with no changes, but with different order of subfields",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a note\n" +
        "530 00 *a note\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *a yyy\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "504 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete extension field", NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"), []);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("New non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a yyy *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Edit non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.edit.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    curRecord = new Record();
    curRecord.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "300 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    RawRepoClientCore.addRecord(curRecord);

    record = new Record();
    record.fromString(
        StringUtil.sprintf("001 00 *a 1 234 567 8 *b %s\n", UpdateConstants.COMMON_AGENCYID) +
        "004 00 *a e *r n\n" +
        "032 00 *a xxx *x\n" +
        "600 00 *& 751000 *a xxx\n" +
        "996 00 *a DBC"
    );
    Assert.equalValue("Delete non extension field",
        NoteAndSubjectAndDisputasExtentionsHandler.authenticateExtentions(record, "700400"),
        [ValidateErrors.recordError("", ResourceBundle.getStringFormat(bundle, "notes.subjects.delete.field.error", "700400", "300", "1 234 567 8"))]);
    RawRepoClientCore.clear();

    OpenAgencyClientCore.clearFeatures();
});
