//-----------------------------------------------------------------------------
use( "ClassificationData" );
use( "Marc" );
use( "MarcClasses" );
use( "Log" );
use( "RecordLookupField" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'FBSClassificationData' ];

//-----------------------------------------------------------------------------
var FBSClassificationData = function() {
    var CLASSIFICATION_FIELDS = /004|008|009|038|039|100|110|239|245|652/;

    function hasClassificationData( marc ) {
        return ClassificationData.hasClassificationData( marc );
    }

    function hasClassificationsChanged( oldMarc, newMarc ) {
        Log.trace( "Enter - FBSClassificationData.hasClassificationsChanged( ", oldMarc, ", ", newMarc, " )" );

        var result = null;
        try {
            var lookup = RecordLookupField.createFromRecord( oldMarc, CLASSIFICATION_FIELDS );

            for( var i = 0; i < newMarc.numberOfFields(); i++ ) {
                var newField = newMarc.field( i );

                if( !CLASSIFICATION_FIELDS.test( newField.name ) ) {
                    continue;
                }

                if( !RecordLookupField.containsField( lookup, newField ) ) {
                    Log.debug( "Unable to find field: ", newField );
                    Log.debug( "Lookup record:\n", oldMarc );
                    return result = true;
                }
            }

            return result = false;
        }
        finally {
            Log.trace( "Exit - FBSClassificationData.hasClassificationsChanged(): ", result );
        }
    }

    function updateClassificationsInRecord( dbcRecord, libraryRecord ) {
        return ClassificationData.updateClassificationsInRecord( dbcRecord, libraryRecord );
    }

    function removeClassificationsFromRecord( record ) {
        return ClassificationData.removeClassificationsFromRecord( record );
    }

    return {
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord
    };

}();
