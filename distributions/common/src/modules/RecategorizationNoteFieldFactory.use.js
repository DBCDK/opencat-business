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
        Log.trace( "Enter - RecategorizationNoteFieldFactory.newNoteField()" );

        var result = undefined;
        try {
            if( currentRecord.empty() ) {
                return undefined;
            }

            result = new Field( __FIELD_NAME, "00" );
            __addClassifications( currentRecord, result );

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
                    values = values.concat( v );
                }
                else if( record.existField( /039/ ) ) {
                    var v = __loadValues( record, "039", "a" );
                    values = values.concat( v );

                    v = __loadValues( record, "039", "b" );
                    values = values.concat( v );
                }

                var message = ResourceBundle.getStringFormat( bundle, "note.material", __formatValues( values ) );

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
                var key = StringUtil.sprintf( "code.%s%s.%s", field.name, subfield.name, subfield.value );

                if( ResourceBundle.containsKey( __loadBundle(), key ) ) {
                    Log.debug( "Read key from bundle: ", key );
                    values.push( ResourceBundle.getString( __loadBundle(), key ) );
                }
                else {
                    Log.debug( "Add subfield value: ", subfield.value );
                    values.push( subfield.value );
                }
            } )
        } );

        return values;
    }

    function __formatValues( values ) {
        Log.trace( "Enter - RecategorizationNoteFieldFactory.__formatValues( ", values, " )" );

        var result = "";
        try {

            for( var i  = 0; i < values.length; i++ ) {
                var v = values[i];

                if( result === "" ) {
                    result += v;
                }
                else {
                    result += ". " + __formatValueWithUpperCase( v );
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecategorizationNoteFieldFactory.__formatValues(): ", result );
        }
    }

    function __formatValueWithUpperCase( name ) {
        return name.substr( 0, 1 ).toUpperCase() + name.substr( 1 );
    }

    return {
        '__FIELD_NAME': __FIELD_NAME,
        '__BUNDLE_NAME': __BUNDLE_NAME,
        'newNoteField': newNoteField,
        '__formatValueWithUpperCase': __formatValueWithUpperCase
    }

}();
