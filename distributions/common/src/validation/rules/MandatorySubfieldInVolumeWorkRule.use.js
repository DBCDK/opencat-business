//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Log" );
use( "RawRepoClient" );
use( "ValidateErrors" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'MandatorySubfieldInVolumeWorkRule' ];

//-----------------------------------------------------------------------------
var MandatorySubfieldInVolumeWorkRule = function() {
    function validateField( record, field, params, settings ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.validateField()" );

        try {
            ValueCheck.check("params", params).type("object");
            ValueCheck.check("params.subfield", params.subfield).type("string");

            var marcRecord = DanMarc2Converter.convertToDanMarc2( record );

            if( marcRecord.matchValue( /004/, /a/, /h/ ) ) {
                return __validateHeadRecord( marcRecord, field, params );
            }
            else if( marcRecord.matchValue( /004/, /a/, /b/ ) ) {
                return __validateVolumeRecord( marcRecord, field, params );
            }

            return [];
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.validateField()" );
        }
    }

    //-----------------------------------------------------------------------------
    //              Helper functions
    //-----------------------------------------------------------------------------

    function __validateHeadRecord( record, field, params ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.__validateHeadRecord()" );

        try {
            var volumes = __getVolumeRecords( record );

            if( volumes.length === 0 ) {
                if( !__checkSubfieldIsUsed( [ record ], field, params.subfield)) {
                    return [ValidateErrors.subfieldError("", StringUtil.sprintf("Delfelt %s%s er obligatorisk i et flerbindsv\xe6rk.", field.name, params.subfield))];
                }
            }

            for( var i = 0; i < volumes.length; i++ ) {
                if( !__checkSubfieldIsUsed( [ volumes[i], record ], field, params.subfield)) {
                    return [ValidateErrors.subfieldError("", StringUtil.sprintf("Delfelt %s%s er obligatorisk i et flerbindsv\xe6rk.", field.name, params.subfield))];
                }
            }

            return [];
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.__validateHeadRecord()" );
        }
    }

    function __validateVolumeRecord( record, field, params ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.__validateVolumeRecord()" );

        try {
            var parentId = record.getValue( /014/, /a/ );
            var agencyId = record.getValue( /001/, /b/ );

            if (!RawRepoClient.recordExists(parentId, agencyId)) {
                return [];
            }

            var headRecord = RawRepoClient.fetchRecord( parentId, agencyId );
            if( !__checkSubfieldIsUsed( [ headRecord, record ], field, params.subfield)) {
                return [ValidateErrors.subfieldError("", StringUtil.sprintf("Delfelt %s%s er obligatorisk i et flerbindsv\xe6rk.", field.name, params.subfield))];
            }

            return [];
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.__validateVolumeRecord()" );
        }
    }

    function __checkSubfieldIsUsed( records, field, subfieldName ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.__checkSubfieldIsUsed()" );
        Log.trace( "Records:", records.toString() );

        try {
            for (var i = 0; i < records.length; i++) {
                var rec = records[i];

                for (var k = 0; k < rec.size(); k++) {
                    if (rec.field(k).name === field.name) {
                        var recField = rec.field(k);
                        for (var j = 0; j < recField.size(); j++) {
                            if (recField.subfield(j).name === subfieldName) {
                                Log.debug( field.name, subfieldName, " found in record: [", rec.getValue( /001/, /a/ ), ":", rec.getValue( /001/, /b/ ), "]" );
                                return true;
                            }
                        }
                    }
                }
            }

            Log.debug( field.name, subfieldName, " not found in any record." );
            return false;
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.__checkSubfieldIsUsed()" );
        }
    }

    function __getHeadRecord( record ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.__getHeadRecord()" );

        try {
            var type = record.getValue(/004/, /a/);

            if (type === "h") {
                return record;
            }
            else if (type === "b") {
                var agencyId = record.getValue(/001/, /b/);
                var parentId = record.getValue(/014/, /a/);

                if (!RawRepoClient.recordExists(parentId, agencyId)) {
                    return null;
                }

                return __getHeadRecord(RawRepoClient.fetchRecord(parentId, agencyId));
            }

            return null;
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.__getHeadRecord()" );
        }
    }

    function __getVolumeRecords( record ) {
        Log.trace( "Enter - MandatorySubfieldInVolumeWorkRule.__getVolumeRecords()" );

        try {
            var type = record.getValue(/004/, /a/);

            if (type !== "h") {
                return [];
            }

            var recId = record.getValue(/001/, /a/);
            var agencyId = record.getValue(/001/, /b/);
            var children = RawRepoClient.getRelationsChildren(recId, agencyId);

            var result = [];
            for (var i = 0; i < children.length; i++) {
                var childRecord = children[i];
                if( childRecord.matchValue( /004/, /a/, /b/ ) ) {
                    result.push(childRecord);
                }
            }

            return result;
        }
        finally {
            Log.trace( "Exit - MandatorySubfieldInVolumeWorkRule.__getVolumeRecords()" );
        }
    }

    return {
        'validateField': validateField
    }
}();
