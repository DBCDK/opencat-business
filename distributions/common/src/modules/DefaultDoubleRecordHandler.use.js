use("DoubleRecordFinder");
use("DoubleRecordMailServiceClient");
use("Log");
use("Marc");

EXPORTED_SYMBOLS = ['DefaultDoubleRecordHandler'];

/**
 * Module execute the checks of double records and sending a mail with any hits.
 *
 * The lookup of double records is done by the module DoubleRecordFinder. Mails are
 * sent by the module XXX.
 *
 * @namespace
 * @name DefaultDoubleRecordHandler
 */
var DefaultDoubleRecordHandler = function () {
    var __BUNDLE_NAME = "double-record";

    /**
     * Checks a records for double records and sends a mail if one or more are found.
     *
     * @param record   The record to check for double records.
     * @param settings JNDI settings.
     *
     * @name DefaultDoubleRecordHandler#checkAndSendMails
     */
    function checkAndSendMails(record, settings) {
        Log.trace("Enter - DefaultDoubleRecordHandler.checkAndSendMails()");
        try {
            if (!settings.containsKey('solr.url')) {
                Log.error("SOLR has not been configured. Missing key 'solr.url' in settings.");
                return;
            }
            /*
             TODO Når extern dobbeltpostkontrol laves skal man her kalde findGeneral ved almindelig
             TODO opdatering og ved forced skal find kaldes. Yderligere skal der kun sendes mail ved forced.
             TODO Ved intern opdatering skal find kaldes.
             */
            var records = DoubleRecordFinder.find(record, settings.get('solr.url'));
            var idField = record.getFirstFieldAsField(/001/);
            if (idField === "") {
                // record.getFirstFieldAsField() returns "" if no field were found!!!
                return;
            }
            var logMessage = StringUtil.sprintf("Double records for record {%s:%s}: %s", idField.getFirstValue(/a/), idField.getFirstValue(/b/), JSON.stringify(records));
            Log.info(logMessage);
            if (records.length === 0) {
                return;
            }
            var mailObject = formatMessage(idField, records);
            DoubleRecordMailServiceClient.sendMessage(mailObject.subject, mailObject.body);
        } finally {
            Log.trace("Exit - DefaultDoubleRecordHandler.checkAndSendMails()");
        }
    }

    /**
     * Checks a records for double records and returns a warning if one or more are found.
     *
     * @param record   The record to check for double records.
     * @param settings JNDI settings.
     *
     * @name DefaultDoubleRecordHandler#checkDoubleRecordFrontend
     */
    function checkDoubleRecordFrontend(record, settings) {
        Log.trace("Enter - DefaultDoubleRecordHandler.checkDoubleRecordFrontend()");
        var res = {status: "ok"};
        try {
            if (!settings.containsKey('solr.url')) {
                var msg = "SOLR has not been configured. Missing key 'solr.url' in settings.";
                Log.error(msg);
                res.status = "error";
                res.doubleRecordFrontendDTOs = [{message: msg}];
            } else {
                var records = DoubleRecordFinder.findGeneral(record, settings.get('solr.url'));
                var idField = record.getFirstFieldAsField(/001/);
                if (idField !== "" && records.length > 0) {
                    res.status = "doublerecord";
                    res.doubleRecordFrontendDTOs = [];
                    for (var i = 0; i < records.length; i++) {
                        var newDoubleRecord = {};
                        newDoubleRecord.pid = records[i].pid;
                        newDoubleRecord.message = "Double record for record " + idField.getFirstValue(/a/) + ", reason: " + records[i].reason;
                        res.doubleRecordFrontendDTOs.push(newDoubleRecord);
                    }
                }
            }
            return JSON.stringify(res);
        } finally {
            Log.trace("Exit - DefaultDoubleRecordHandler.checkDoubleRecordFrontend()");
        }
    }

    /**
     * Formats a mail to be send for a location of some double records.
     *
     * @param idField {Field} The id field (001) from the record that was checked for double records.
     * @param records {Array} An array of double records. The array contains an object for each item with
     *                        the properties "id" and "reason". "id" is the idno of the record that was
     *                        found and "reason" is a string with the description of why the record was
     *                        matched.
     *
     * @returns {{subject: String, body: String}} An object the subject and body for the mail message.
     *
     * @name DefaultDoubleRecordHandler#formatMessage
     */
    function formatMessage(idField, records) {
        Log.trace("Enter - DefaultDoubleRecordHandler.formatMessage()");

        var result = undefined;
        try {
            var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
            var s = "";
            var recordId = idField.getFirstValue(/a/);
            var agencyId = idField.getFirstValue(/b/);

            s += ResourceBundle.getStringFormat(bundle, "mail.body.header", recordId, agencyId);
            for (var i = 0; i < records.length; i++) {
                var doubleRecord = records[i];
                s += ResourceBundle.getStringFormat(bundle, "mail.body.double.record.line", doubleRecord.id, doubleRecord.reason);
            }
            s += ResourceBundle.getString(bundle, "mail.body.footer");
            return result = {
                subject: ResourceBundle.getStringFormat(bundle, "mail.subject", recordId, agencyId),
                body: s
            }
        } finally {
            Log.trace("Exit - DefaultDoubleRecordHandler.formatMessage(): ", result);
        }
    }

    /**
     * Checks a records for double records and sends a response back to the frontend if one or more are found.
     *
     * @param record   The record to check for double records.
     * @param settings JNDI settings.
     *
     * @name DefaultDoubleRecordHandler#checkGeneral
     */
    function checkGeneral(record, settings) {
        Log.trace("Enter - FrontendDoubleRecordHandler.checkGeneral()");
        var res = {status: ok, message: ""};
        try {
            if (!settings.containsKey('solr.url')) {
                var msg = "SOLR has not been configured. Missing key 'solr.url' in settings.";
                Log.error(msg);
                res.status = "failed";
                res.message = msg;
                return res;
            }
            // var records = DoubleRecordFinder.findGeneral(record, settings.getAbsolutePath('solr.url'));
            var records = [];
            var idField = record.getFirstFieldAsField(/001/);
            if (idField === "") {
                return res;
            }
            var logMessage = StringUtil.sprintf("Double records for record {%s:%s}: %s", idField.getFirstValue(/a/), idField.getFirstValue(/b/), JSON.stringify(records));
            Log.info(logMessage);
            res.status = "doublerecord";
            res.message = logMessage;
            return res;
        } finally {
            Log.trace("Exit - FrontendDoubleRecordHandler.checkGeneral()");
        }
    }

    return {
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'checkAndSendMails': checkAndSendMails,
        'checkGeneral': checkGeneral,
        'checkDoubleRecordFrontend': checkDoubleRecordFrontend
    }
}();
