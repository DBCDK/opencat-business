//-----------------------------------------------------------------------------
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

    /**
     * Constructs a new 504 note field from a record based on its
     * recategorization.
     *
     * @param currentRecord  The current record from RawRepo.
     * @param updatingRecord The record being updated.
     *
     * @returns {Field} The new 504 note field.
     */
    function newNoteField( record ) {
        Log.trace( "Enter - RecategorizationNoteFieldFactory.newNoteField()" );

        var result = undefined;
        try {
            if( record.empty() ) {
                return undefined;
            }

            result = new Field( "504", "00" );
            __addClassifications( record, result );

            return result;
        }
        finally {
            Log.trace( "Exit - RecategorizationNoteFieldFactory.newNoteField(): " + result );
        }

        function __addClassifications( record, noteField ) {
            Log.trace( "Enter - RecategorizationNoteFieldFactory.__addClassifications()" );

            try {
                var bundle = __loadBundle();

                var values = [];

                if( record.existField( /038/ ) ) {
                    var v = __loadValues( record, "038", "a" );
                    if( v !== undefined ) {
                        values = values.concat( v );
                    }
                }

                var message = ResourceBundle.getStringFormat( bundle, "note.material", values.join( ", " ) );

                noteField.append( "i", message );
            }
            finally {
                Log.trace( "Exit - RecategorizationNoteFieldFactory.__addClassifications()" );
            }
        }
    }

    function __loadBundle() {
        return ResourceBundleFactory.getBundle( __BUNDLE_NAME );
    }

    function __loadValues( record, fieldname, subfieldname ) {
        var values = [];

        record.eachField( RegExp( fieldname ), function( field ) {
            field.eachSubField( RegExp( subfieldname ), function( field, subfield ) {
                var key = StringUtil.sprintf( "code.%s.%s", field.name, subfield.value );
                values.push( ResourceBundle.getString( __loadBundle(), key ) );
            } )
        } );

        return values;
    }

    return {
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'newNoteField': newNoteField
    }

}();
