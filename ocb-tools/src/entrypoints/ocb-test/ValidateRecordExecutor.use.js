//-----------------------------------------------------------------------------
use( "RawRepoClientCore" );
use( "ReadFile" );
use( "RecordUtil" );
use( "SolrCore" );
use( "Log" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
var ValidateRecordExecutor = function() {
    /**
     * Validates a record with a given template.
     *
     * @param {String} tc      Testcase
     * @param {String} record  The record to validator as a json.
     *
     * @return {String} A json string with an array of validation errors.
     */
    function validateRecord( tc, record, settings ) {
        Log.trace( "Enter - ValidateRecordExecutor.validateRecord()" );

        try {
            Log.debug( "Testcase: ", tc.name, " - ", tc.description );
            Log.debug( "File: ", tc.file.absolutePath );

            __setupRawRepo( tc );
            __setupSolr( tc );

            if( tc.distributionName == "dataio" ) {
                use( "DBCValidatorEntryPoint" );
                return DBCValidatorEntryPoint.validateRecord( tc.request.templateName, record, settings );
            }
            else if( tc.distributionName == "fbs" ) {
                use( "FBSValidatorEntryPoint" );
                return FBSValidatorEntryPoint.validateRecord( tc.request.templateName, record, settings );
            }
        }
        catch( ex ) {
            return JSON.stringify( [ ValidateErrors.recordError( "", StringUtil.sprintf( "validateRecord systemfejl ved validering af testcase: %s", ex ) ) ] );
        }
        finally {
            Log.trace( "Exit - ValidateRecordExecutor.validateRecord()" );
        }
    }

    function __setupRawRepo( tc ) {
        Log.trace( "Enter - ValidateRecordExecutor.__setupRawRepo()" );

        try {
            RawRepoClientCore.clear();

            if( tc.setup !== null ) {
                if( tc.setup.rawrepo !== null ) {
                    var records = tc.setup.rawrepo;
                    for (var i = 0; i < records.size(); i++) {
                        var recordFilename = tc.file.parent + "/" + records.get(i).record;
                        var recordContent = System.readFile( recordFilename );

                        Log.debug( "Adding record to rawrepo: ", recordFilename );
                        RawRepoClientCore.addRecord( RecordUtil.createFromString( recordContent ) );
                    }
                }
                else {
                    Log.debug( "tc.setup.rawrepo is (null)" );
                }
            }
            else {
                Log.debug("tc.setup is (null)");
            }
        }
        finally {
            Log.trace( "Exit - ValidateRecordExecutor.__setupRawRepo()" );
        }
    }

    function __setupSolr( tc ) {
        Log.trace( "Enter - ValidateRecordExecutor.__setupSolr()" );

        try {
            return;
            SolrCore.clear();

            if( tc.setup !== null ) {
                if( tc.setup.solr !== null ) {
                    var queries = tc.setup.solr;
                    for (var i = 0; i < queries.size(); i++) {
                        var item = queries.get( i );

                        Log.debug( "Adding query to Solr: ", item.query, " -> ", item.numFound );
                        SolrCore.addQuery( item.query, item.numFound );
                    }
                }
                else {
                    Log.debug( "tc.setup.solr is (null)" );
                }
            }
            else {
                Log.debug( "tc.setup is (null)" );
            }
        }
        finally {
            Log.trace( "Exit - ValidateRecordExecutor.__setupSolr()" );
        }
    }

    return {
        'validateRecord': validateRecord
    }
}();

//-----------------------------------------------------------------------------
function validateRecord( tc, record, settings ) {
    return ValidateRecordExecutor.validateRecord( tc, record, settings );
}
