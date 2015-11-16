//-----------------------------------------------------------------------------
use( "ISBDFieldFormater" );
use( "Marc" );
use( "MarcClasses" );
use( "RawRepoClient" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RecategorizationNoteFieldFactory' ];

//-----------------------------------------------------------------------------
/**
 * Module to construct a new 504 note field in case of recategorization of a
 * record.
 *
 * @type {{newNoteField}}
 */
var RecategorizationNoteFieldFactory = function() {
    var __BUNDLE_NAME = "categorization-codes";
    var __FIELD_NAME = "512";

    /**
     * Constructs a new {__FIELD_NAME} note field from a record based on its
     * recategorization.
     *
     * @param currentRecord  The current record from RawRepo.
     * @param updatingRecord The record being updated.
     *
     * @returns {Field} The new {__FIELD_NAME} note field.
     */
    function newNoteField( currentRecord, updatingRecord ) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.newNoteField()");

        var result = undefined;
        try {
            if (currentRecord.empty()) {
                return undefined;
            }

            result = new Field(__FIELD_NAME, "00");
            __addClassifications(updatingRecord, result);
            __addCreator(updatingRecord, result);
            __addTitle(updatingRecord, result);
            __addCategory(currentRecord, updatingRecord, result);

            return result;
        }
        finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.newNoteField(): " + result);
        }
    }

    function __addClassifications(record, noteField) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addClassifications()");

        try {
            var bundle = __loadBundle();

            var field = undefined;
            var spec = undefined;

            if (record.existField(/038/)) {
                spec = {sepSpec: [], valueSpec: {}};
                field = __loadField(record, "038", /a/);
            }
            else if (record.existField(/039/)) {
                spec = {
                    sepSpec: [
                        {pattern: /ab$/, midSep: ". ", midValueFunction: __PrettyCase }
                    ],
                    valueSpec: {
                    }
                };

                field = __loadField(record, "039", /a|b/);
            }

            if( field !== undefined && spec !== undefined ) {
                Log.debug("Formating field: ", field);
                var message = ResourceBundle.getStringFormat(bundle, "note.material", ISBDFieldFormater.formatField(field, spec));

                noteField.append("i", message.trim());
            }
            else {
                var message = ResourceBundle.getStringFormat(bundle, "note.material", "" );

                noteField.append("i", message.trim());
            }
        }
        finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addClassifications()");
        }
    }

    function __addCreator( record, noteField ) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addCreator()");

        try {
            var field = undefined;
            var spec = undefined;

            if (record.existField(/100/)) {
                spec = {
                    sepSpec: [
                        { pattern: /[ahk][ahk]/, midSep: ", " },
                        { pattern: /.[ef]/, midSep: " " },
                        { pattern: /[ef]./, midSep: " " }
                    ],
                    valueSpec: {
                        f: function( v ) { return "(" + v + ")"; }
                    }
                };
                field = __loadField(record, "100", /a|h|k|e|f/);
            }
            else if (record.existField(/110/)) {
                spec = {
                    sepSpec: [
                        {pattern: /[sac][sac]$/, midSep: ". "},
                        {pattern: /[ijk][ijk]$/, midSep: " : ", lastSep: ")"},
                        {pattern: /[^ijk][ijk]$/, midSep: " (", lastSep: ")"},
                        {pattern: /[ijk][^ijk]$/, midSep: ") "},
                        {pattern: /^[ijk].*/, firstSep: "("},
                        {pattern: /.e/, midSep: " " }
                    ],
                    valueSpec: {
                        e: function( v ) { return "(" + v + ")" }
                    }
                };
                field = __loadField(record, "110", /s|a|c|e|i|k|j/);
            }
            else if (record.existField(/239/)) {
                spec = {
                    sepSpec: [
                        { pattern: /[ahk][ahk]/, midSep: ", " },
                        { pattern: /.[ef]/, midSep: " " },
                        { pattern: /[ef]./, midSep: " " }
                    ],
                    valueSpec: {
                        f: function( v ) { return "(" + v + ")"; }
                    }
                };
                field = __loadField(record, "239", /a|h|k|e|f/);
            }

            if( field !== undefined && spec !== undefined ) {
                Log.debug("Formating field: ", field);
                var message = ISBDFieldFormater.formatField( field, spec );

                noteField.append("d", message.trim());
            }
        }
        finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addCreator()");
        }
    }

    function __addTitle( record, noteField ) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addTitle()");

        try {
            var field = undefined;
            var spec = undefined;

            if (record.existField(/239/)) {
                spec = {
                    sepSpec: [
                        { pattern: /[tø][tø]/, midSep: " " }
                    ],
                    valueSpec: {
                        ø: function( v ) { return "(" + v + ")"; }
                    }
                };
                field = __loadField(record, "239", /t|ø/);
            }

            if( field !== undefined && spec !== undefined ) {
                Log.debug("Formating field: ", field);
                var message = ISBDFieldFormater.formatField( field, spec );

                noteField.append("t", message.trim());
            }
        }
        finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addTitle()");
        }
    }

    function __addCategory( currentRecord, updatingRecord, noteField ) {
        Log.trace("Enter - RecategorizationNoteFieldFactory.__addCategory()");

        try {
            var field = undefined;
            var spec = undefined;

            var message = "";

            if (updatingRecord.existField(/652/)) {
                spec = {
                    sepSpec: [
                        { pattern: /[ahk][ah]/, midSep: ", " },
                        { pattern: /.[ef]/, midSep: " " },
                        { pattern: /[ef]./, midSep: " " },
                        { pattern: /m./, midSep: " " },
                        { pattern: /.m/, midSep: " " },
                        { pattern: /nz/, midSep: "-" },
                        { pattern: /zo/, midSep: "; " }
                    ],
                    valueSpec: {
                    }
                };
                field = __loadMergeField(updatingRecord, "652", /m|n|z|o|a|b|h|e|f/);

                if( field !== undefined && spec !== undefined ) {
                    Log.debug("Formating field: ", field);
                    message = ResourceBundle.getStringFormat( __loadBundle(), "note.category.dk5", ISBDFieldFormater.formatField( field, spec ) );
                }
            }

            if (updatingRecord.existField(/009/)) {
                spec = {
                    sepSpec: [
                        { pattern: /ag/, midSep: " " },
                        { pattern: /ga/, midSep: "+" }
                    ],
                    valueSpec: {
                        g: function( v ) { return "(" + v + ")"; }
                    }
                };
                field = __loadField(updatingRecord, "009", /a|g/);

                if( field !== undefined && spec !== undefined ) {
                    Log.debug("Formating field: ", field);
                    message += ResourceBundle.getStringFormat( __loadBundle(), "note.category.type", ISBDFieldFormater.formatField( field, spec ) );
                }
            }

            if( message !== "" ) {
                message += " " + ResourceBundle.getString( __loadBundle(), "note.category.reason.general" );

                var recTypeChanged = !currentRecord.matchValue( /004/, /e/, RegExp( updatingRecord.getValue( /004/, /e/ ) ) );
                var categoryChanged = !currentRecord.matchValue( /008/, /t/, RegExp( updatingRecord.getValue( /008/, /t/ ) ) );

                if( recTypeChanged || categoryChanged ) {
                    if( currentRecord.matchValue( /004/, /a/, /e/ ) ) {
                        if( updatingRecord.matchValue( /004/, /a/, /b/ ) && updatingRecord.matchValue( /008/, /t/, /p/ ) ) {
                            message += " " + ResourceBundle.getString( __loadBundle(), "note.category.reason.to.serials" );
                        }
                        else if( currentRecord.matchValue( /008/, /t/, /m|s/ ) ) {
                            message += " " + ResourceBundle.getString( __loadBundle(), "note.category.reason.from.single" );
                        }
                    }
                    else if( currentRecord.matchValue( /004/, /a/, /b/ ) ) {
                        if( currentRecord.matchValue( /008/, /t/, /m|s/ ) ) {
                            message += " " + ResourceBundle.getString( __loadBundle(), "note.category.reason.from.volume" );
                        }
                        else if( currentRecord.matchValue( /008/, /t/, /p/ ) && updatingRecord.matchValue( /004/, /a/, /e/ ) ) {
                            message += " " + ResourceBundle.getString( __loadBundle(), "note.category.reason.from.serials" );
                        }

                    }
                }

                noteField.append("b", message.trim());
            }
        }
        finally {
            Log.trace("Exit - RecategorizationNoteFieldFactory.__addCategory()");
        }
    }

    function __loadBundle() {
        return ResourceBundleFactory.getBundle( __BUNDLE_NAME );
    }

    function __loadBundleValue( bundle, field, subfield ) {
        var key = StringUtil.sprintf( "code.%s%s.%s", field.name, subfield.name, subfield.value );

        if( ResourceBundle.containsKey( bundle, key ) ) {
            return ResourceBundle.getString( bundle, key );
        }
        else {
            return subfield.value;
        }
    }

    function __loadField( record, fieldname, subfieldmatcher ) {
        Log.trace( "Enter - RecategorizationNoteFieldFactory.__loadField( '", record, "', '", fieldname, "' )" );

        var result = undefined;
        try {
            var field = record.field( fieldname );

            result = new Field( fieldname, "00" );
            for( var i = 0; i < field.count(); i++ ) {
                var subfield = field.subfield(i);

                if( subfieldmatcher.test( subfield.name ) ) {
                    result.append( subfield.name, __loadBundleValue( __loadBundle(), field, subfield ) );
                }
            }

            if( result.count() === 0 ) {
                return undefined;
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecategorizationNoteFieldFactory.__loadField(): ", result );
        }
    }

    function __loadMergeField( record, fieldname, subfieldmatcher ) {
        Log.trace( "Enter - RecategorizationNoteFieldFactory.__loadField( '", record, "', '", fieldname, "' )" );

        var result = undefined;
        try {
            result = new Field( fieldname, "00" );

            record.eachField( RegExp( fieldname ), function( field ) {
                field.eachSubField( subfieldmatcher, function( field, subfield ) {
                    result.append( subfield );
                })
            });

            if( result.count() === 0 ) {
                return undefined;
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecategorizationNoteFieldFactory.__loadField(): ", result );
        }
    }

    function __PrettyCase( value ) {
        return value.substr( 0, 1 ).toUpperCase() + value.substr( 1 );
    }

    return {
        '__FIELD_NAME': __FIELD_NAME,
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'newNoteField': newNoteField,
        '__PrettyCase': __PrettyCase
    }

}();
