use("DanMarc2Converter");
use("ISBDFieldFormater");
use("Marc");
use("MarcClasses");
use("RawRepoClient");
use("RecategorizationNoteFieldProvider");
use("Log");

EXPORTED_SYMBOLS = ['RecategorizationNoteFieldFactory'];

/**
 * Module to construct a new 504 note field in case of recategorization of a
 * record.
 *
 * @type {{newNoteField}}
 */
var RecategorizationNoteFieldFactory = function () {
    var __BUNDLE_NAME = "categorization-codes";
    var __FIELD_NAME = "512";

    /**
     * Returns a 512 note field
     *
     * @param {record} the record as a string
     * @param {updatingRecord} record the updating record as a string
     *
     * @returns {String} JSON representation of a field.
     */
    function createNewNoteField(currentRecord) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.RecategorizationNoteFieldFactory");
        var result;
        try {
            var rec = DanMarc2Converter.convertToDanMarc2(JSON.parse(currentRecord));
            return result = JSON.stringify(DanMarc2Converter.convertFromDanMarc2Field(newNoteField(rec, rec)));
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.RecategorizationNoteFieldFactory: ", result);
        }
    }

    /**
     * Constructs a new {__FIELD_NAME} note field from a record based on its
     * recategorization.
     *
     * @param currentRecord  The current record from RawRepo.
     * @param updatingRecord The record being updated.
     *
     * @returns {Field} The new {__FIELD_NAME} note field.
     */
    // TODO MYRDE - WTF?????
    function newNoteField(currentRecord, updatingRecord) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.newNoteField()");
        var result = undefined;
        try {
            if (currentRecord.empty()) {
                return undefined;
            }

            result = new Field(__FIELD_NAME, "00");
            __addClassifications(currentRecord, result);
            __addCreator(currentRecord, result);
            __addTitle(currentRecord, result);
            __addCategory(currentRecord, updatingRecord, result);

            return result;
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.newNoteField(): " + result);
        }
    }

    function __addClassifications(record, noteField) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addClassifications()");
        try {
            var bundle = __loadBundle();
            var field;
            var spec = undefined;

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "038", /a/);
            if (field !== undefined) {
                spec = {sepSpec: [], valueSpec: {}};
            } else {
                field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "039", /a|b/);
                if (field !== undefined) {
                    spec = {
                        sepSpec: [
                            {pattern: /ab$/, midSep: ". ", midValueFunction: __PrettyCase}
                        ],
                        valueSpec: {}
                    };
                }
            }

            if (field !== undefined && spec !== undefined) {
                Log.debug("Formatting field: ", field);
                var message = ResourceBundle.getStringFormat(bundle, "note.material", ISBDFieldFormater.formatField(field, spec));

                noteField.append("i", message.trim());
            } else {
                var message = ResourceBundle.getStringFormat(bundle, "note.material", "");

                noteField.append("i", message.trim());
            }
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addClassifications()");
        }
    }

    function __addCreator(record, noteField) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addCreator()");

        try {
            var field;
            var spec = undefined;
            var message;

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "100", /a|h|k|e|f/);
            Log.debug("Found field: ", field !== undefined ? field : "UNDEFINED");
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /[ahk][ahk]/, midSep: ", "},
                        {pattern: /.[ef]/, midSep: " "},
                        {pattern: /[ef]./, midSep: " "}
                    ],
                    valueSpec: {
                        f: __Brackets
                    }
                };

                Log.debug("Formatting field: ", field);
                message = ISBDFieldFormater.formatField(field, spec);

                noteField.append("d", message.trim());
                return;
            }

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "110", /s|a|c|e|i|k|j/);
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /[sac][sac]$/, midSep: ". "},
                        {pattern: /[ijk][ijk]$/, midSep: " : ", lastSep: ")"},
                        {pattern: /[^ijk][ijk]$/, midSep: " (", lastSep: ")"},
                        {pattern: /[ijk][^ijk]$/, midSep: ") "},
                        {pattern: /^[ijk].*/, firstSep: "("},
                        {pattern: /.e/, midSep: " "}
                    ],
                    valueSpec: {
                        e: __Brackets
                    }
                };

                Log.debug("Formatting field: ", field);
                message = ISBDFieldFormater.formatField(field, spec);

                noteField.append("d", message.trim());
                return;
            }

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "239", /a|h|k|e|f/);
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /[ahk][ahk]/, midSep: ", "},
                        {pattern: /.[ef]/, midSep: " "},
                        {pattern: /[ef]./, midSep: " "}
                    ],
                    valueSpec: {
                        f: __Brackets
                    }
                };

                Log.debug("Formatting field: ", field);
                message = ISBDFieldFormater.formatField(field, spec);

                noteField.append("d", message.trim());
                return;
            }

        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addCreator()");
        }
    }

    function __addTitle(record, noteField) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addTitle()");
        try {
            var field;
            var spec = undefined;
            var message;

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "239", /t|\u00F8/);
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /[t\u00F8][t\u00F8]/, midSep: " "}
                    ],
                    valueSpec: {
                        \u00F8: __Brackets
                    }
                };

                Log.debug("Formatting field: ", field);
                message = ISBDFieldFormater.formatField(field, spec);

                Log.debug("C1: Add *t with: ", message);
                noteField.append("t", message.trim());
                return;
            }

            if (record.getValue(/014/, /a/) !== "") {
                field = RecategorizationNoteFieldProvider.loadMergeFieldRecursive(record, "245", /[anogm\u00F8\u00E6y]/);
                spec = {
                    sepSpec: [
                        {pattern: /a[anog]$/, midSep: ". "},
                        {pattern: /na$|ga$/, midSep: " : "}
                    ],
                    valueSpec: {
                        \u00E6: __BracketsWithSpaces
                    }
                };

                if (field !== undefined) {
                    Log.debug("Formatting field: ", field);
                    message = ISBDFieldFormater.formatField(field, spec);

                    Log.debug("C2: Add *t with: ", message);
                    noteField.append("t", message.trim());
                }
                return;
            }

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), record, "245", /[anogm\u00F8\u00E6y]/);
            spec = {
                sepSpec: [
                    {pattern: /[anog][^m\u00E6\u00F8y]/, midSep: ". "},
                    {pattern: /.[m\u00F8\u00E6]/, midSep: " "},
                    {pattern: /.y/, midSep: " -- "}
                ],
                valueSpec: {
                    m: __Brackets,
                    \u00F8: __Brackets,
                    \u00E6: __Brackets
                }
            };

            if (field !== undefined) {
                Log.debug("Formatting field: ", field);
                message = ISBDFieldFormater.formatField(field, spec);

                Log.debug("C3: Add *t with: ", message);
                noteField.append("t", message.trim());
            }
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addTitle()");
        }
    }

    function __addCategory(currentRecord, updatingRecord, noteField) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addCategory()");
        Log.info("CAT rec cur : " + currentRecord.toString());
        Log.info("CAT rec update : " + updatingRecord.toString());
        Log.info("notefield : " + noteField.toString());
        try {
            var field;
            var spec = undefined;
            var message = "";

            field = RecategorizationNoteFieldProvider.loadMergeFieldRecursive(currentRecord, "652", /m|n|z|o|a|b|h|e|f/);
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /[ahk][ah]$/, midSep: ", "},
                        {pattern: /.[ef]$/, midSep: " "},
                        {pattern: /[ef].$/, midSep: " "},
                        {pattern: /m.$/, midSep: " "},
                        {pattern: /.m$/, midSep: " "},
                        {pattern: /nz$/, midSep: "-"},
                        {pattern: /zo$/, midSep: "; "}
                    ],
                    valueSpec: {}
                };

                Log.info("Formatting field: ", field !== undefined ? field : "UNDEFINED");
                Log.info("Bundle :" + ResourceBundle.getString(__loadBundle(), "note.category.dk5"));
                Log.info("Data : " + ISBDFieldFormater.formatField(field, spec));
                Log.info("Formatted message: ", ISBDFieldFormater.formatField(field, spec));
                message = ResourceBundle.getStringFormat(__loadBundle(), "note.category.dk5", ISBDFieldFormater.formatField(field, spec));
                Log.info("Message : " + message);
            }

            field = RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(__loadBundle(), currentRecord, "009", /a|g/);
            if (field !== undefined) {
                spec = {
                    sepSpec: [
                        {pattern: /ag/, midSep: " "},
                        {pattern: /ga/, midSep: "+"}
                    ],
                    valueSpec: {
                        g: __Brackets
                    }
                };

                Log.debug("Formatting field: ", field);
                Log.info("Message pre 009 : " + message);
                message += ResourceBundle.getStringFormat(__loadBundle(), "note.category.type", ISBDFieldFormater.formatField(field, spec));
                Log.info("Message post 009 : " + message);
            }

            if (message !== "") {
                Log.debug("Generate reason info for case 'note.category.reason.general'");
                message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.general");

                if (currentRecord.getValue(/008/, /t/) == updatingRecord.getValue(/008/, /t/)) {
                    if (currentRecord.matchValue(/004/, /a/, /b/) && updatingRecord.matchValue(/004/, /a/, /e/)) {
                        message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.from.volume");
                    } else if (currentRecord.matchValue(/004/, /a/, /e/) && updatingRecord.matchValue(/004/, /a/, /b/)) {
                        message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.from.single");
                    }
                } else {
                    if (currentRecord.matchValue(/008/, /t/, /p/)) {
                        if (currentRecord.getValue(/004/, /a/) == updatingRecord.getValue(/004/, /a/)) {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.from.serials");
                        } else if (currentRecord.matchValue(/004/, /a/, /b/) && updatingRecord.matchValue(/004/, /a/, /e/)) {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.from.serials.to.single");
                        } else {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.from.serials.to.volume");
                        }
                    } else if (currentRecord.matchValue(/008/, /t/, /m|s/)) {
                        if (currentRecord.getValue(/004/, /a/) == updatingRecord.getValue(/004/, /a/)) {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.to.serials");
                        } else if (currentRecord.matchValue(/004/, /a/, /b/) && updatingRecord.matchValue(/004/, /a/, /e/)) {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.to.serials.from.volume");
                        } else {
                            message += " " + ResourceBundle.getString(__loadBundle(), "note.category.reason.to.serials.from.single");
                        }
                    }
                }
                noteField.append("b", message.trim());
            }
        } finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addCategory()");
        }
    }

    function __loadBundle() {
        return ResourceBundleFactory.getBundle(__BUNDLE_NAME);
    }

    function __PrettyCase(value) {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    function __Brackets(value) {
        return "(" + value + ")";
    }

    function __BracketsWithSpaces(value) {
        return " (" + value + ") ";
    }

    return {
        '__FIELD_NAME': __FIELD_NAME,
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'createNewNoteField': createNewNoteField,
        'newNoteField': newNoteField,
        '__PrettyCase': __PrettyCase
    }
}();
