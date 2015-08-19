//-----------------------------------------------------------------------------
use( "Log" );
use( "Marc" );
use( "RecordUtil" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'DefaultRawRepoRecordHandler' ];

//-----------------------------------------------------------------------------
var DefaultRawRepoRecordHandler = function() {
    function create( authModule ) {
        return {
            authenticator: authModule
        }
    }

    /**
     * Converts a record to the actual records that should be stored in the RawRepo.
     *
     * @param {Object} instance Instance returned by create().
     * @param {Record} record   The record as a json.
     * @param {String} userId   User id from the webservice request.
     * @param {String} groupId  Group id from the webservice request.
     *
     * @returns {Array} A list of Record objects.
     */
    function recordDataForRawRepo( instance, record, userId, groupId ) {
        Log.trace( "Enter - DefaultRawRepoRecordHandler.recordDataForRawRepo" );

        var result = [];
        try {
            Log.trace( "Record:\n", uneval( record ) );

            var records = instance.authenticator.recordDataForRawRepo( record, userId, groupId );

            for( var i = 0; i < records.length; i++ ) {
                var curRecord = records[ i ];
                curRecord = RecordUtil.addOrReplaceSubfield( curRecord, "001", "c", RecordUtil.currentAjustmentTime() );
                Log.debug( "curRecord:\n", curRecord );

                Log.debug( "Adding curRecord: ", curRecord.toString() );
                result.push( curRecord );
            }

            return result;
        }
        finally {
            Log.trace( "Exit - DefaultRawRepoRecordHandler.recordDataForRawRepo(): " + result );
        }
    }

    return {
        'create': create,
        'recordDataForRawRepo': recordDataForRawRepo
    }
}();
