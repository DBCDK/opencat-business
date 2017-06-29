use("Authenticator");
use("RawRepoClientCore");
use("UnitTest");
use("RecordUtil");
use("UpdateConstants");
use("Log");

UnitTest.addFixture("Authenticator.authenticateRecordEntryPoint", function () {
    var LOGIN_AGENCY_ID = "010100";

    var curRecord;
    var record;

    function callFunction(record, userId, groupId, settings) {

        var recordObject = DanMarc2Converter.convertFromDanMarc2(record);
        var recordJson = JSON.stringify(recordObject);
        var result = Authenticator.authenticateRecordEntryPoint(recordJson, userId, groupId, settings);

        return JSON.parse(result);

    }

});