use("Log");
use("Marc");
use("UpdateConstants");

EXPORTED_SYMBOLS = ['BasisSplitter'];

/**
 * Module split a complete basis record into common and enrightment records.
 *
 * @namespace
 * @name BasisSplitter
 */
var BasisSplitter = function () {
    var DBC_FIELDS = /[a-z].*/;

    function splitCompleteBasisRecord(record) {
        Log.trace("Enter - BasisSplitter.splitCompleteBasisRecord");

        try {
            var dbcRecord = new Record();
            var commonRecord = new Record();

            for (var i = 0; i < record.size(); i++) {
                var field = record.field(i);

                if (field.name === "001") {
                    var dbcField = field.clone();
                    dbcField.append("b", UpdateConstants.RAWREPO_DBC_ENRICHMENT_AGENCY_ID, true);
                    dbcRecord.append(dbcField);

                    var commonField = field.clone();
                    commonField.append("b", UpdateConstants.RAWREPO_COMMON_AGENCYID, true);
                    commonRecord.append(commonField);
                }
                else {
                    if (field.name === "004") {
                        dbcRecord.append(field);
                        commonRecord.append(field);
                    }
                    else if (DBC_FIELDS.test(field.name)) {
                        dbcRecord.append(field);
                    }
                    else {
                        commonRecord.append(field);
                    }
                }
            }

            return [commonRecord, dbcRecord];
        }
        finally {
            Log.trace("Exit - BasisSplitter.splitCompleteBasisRecord");
        }
    }

    return {
        'splitCompleteBasisRecord': splitCompleteBasisRecord
    }
}();
