//-----------------------------------------------------------------------------
use( "Marc" );
use( "MarcClasses" );
use( "RawRepoClient" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'RecategorizationNoteFieldProvider' ];

//-----------------------------------------------------------------------------
/**
 * This module has the responsability to extract fields from a record.
 *
 * This feature is used by {{RecategorizationNoteFieldFactory}} to format the
 * information from different fields.
 *
 * @type {{newNoteField}}
 */
var RecategorizationNoteFieldProvider = function() {
    function loadFieldRecursiveReplaceValue( bundle, record, fieldname, subfieldmatcher ) {
        Log.trace( "Enter - RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue()" );

        var result = undefined;
        try {
            var field = record.field( fieldname );

            result = new Field( fieldname, "00" );
            for( var i = 0; i < field.count(); i++ ) {
                var subfield = field.subfield(i);

                if( subfieldmatcher.test( subfield.name ) ) {
                    result.append( subfield.name, __loadBundleValue( bundle, field, subfield ) );
                }
            }

            if( result.count() === 0 ) {
                return undefined;
            }

            return result;
        }
        finally {
            Log.trace( "Exit - RecategorizationNoteFieldProvider.loadFieldRecursiveReplaceValue(): ", result );
        }
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

    return {
        'loadFieldRecursiveReplaceValue': loadFieldRecursiveReplaceValue
    }
}();
