//-----------------------------------------------------------------------------
use( "DanMarc2Converter" );
use( "Marc" );
use( "MarcClasses" );
use( "Log" );

//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'ClassificationData' ];

//-----------------------------------------------------------------------------
var ClassificationData = function() {
    var classificationFields = /004|008|009|038|039|100|110|239|245|652/;
    
    function hasClassificationData( marc ) {
        return marc.existField( classificationFields );
    }
    
    function hasClassificationsChanged( oldMarc, newMarc ) {
        Log.info( "Enter - ClassificationData.hasClassificationsChanged()" );
        Log.info( "    oldMarc: " + oldMarc );
        Log.info( "    newMarc: " + newMarc );
        
        if( __hasSubfieldChangedMatcher( oldMarc, newMarc, /004/, /a/, /e/, /b/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        };

        if( __hasSubfieldChangedMatcher( oldMarc, newMarc, /008/, /t/, /m|s/, /p/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        };

        if( __hasSubfieldJustChanged( oldMarc, newMarc, __value, /009/, /a/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        };
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __value, /009/, /g/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        };
        
        var selectFields = /038|039/;
        if( __hasRecordChanged( __createSubRecord( oldMarc, selectFields ), 
                                __createSubRecord( newMarc, selectFields ), __value ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }

        if( __hasFieldByNameChanged( oldMarc, newMarc, "100", __stripValue, /c/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasFieldByNameChanged( oldMarc, newMarc, "110", __stripValue ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasFieldByNameChanged( oldMarc, newMarc, "239", __stripValueLength10, /c/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }

        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /a/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /g/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __value, /245/, /m/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, /245/, /n/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /o/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /y/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /\u00E6/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, /245/, /\u00F8/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, new MatchField( /652/, undefined, /m|o/ ), /a/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValueLength10, new MatchField( /652/, undefined, /m|o/ ), /b/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, new MatchField( /652/, undefined, /m|o/ ), /e/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, new MatchField( /652/, undefined, /m|o/ ), /f/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, new MatchField( /652/, undefined, /m|o/ ), /h/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, /652/, /m/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        if( __hasSubfieldJustChanged( oldMarc, newMarc, __stripValue, /652/, /o/ ) ) {
            Log.info( "Exit - ClassificationData.hasClassificationsChanged(): true" );
            return true;
        }
        
        Log.info( "Exit - ClassificationData.hasClassificationsChanged(): false" );
        return false;        
    }
    
    function updateClassificationsInRecord( dbcRecord, libraryRecord ) {
        Log.info( "Enter - ClassificationData.updateClassificationsInRecord()" );
        Log.info( "    dbcRecord: " + dbcRecord );
        Log.info( "    libraryRecord: " + libraryRecord );
        var record = libraryRecord.clone();
        
        dbcRecord.eachField( classificationFields, function( field ) {
           if( !record.existField( new RegExp( field.name ) ) ) {
               record.append( field );
           } 
        });
        
        Log.info( "Exit - ClassificationData.updateClassificationsInRecord(): " + record );
        return record;
    }
    
    function removeClassificationsFromRecord( record ) {
        Log.info( "Enter - ClassificationData.updateClassificationsInRecord()" );
        Log.info( "    record: " + record );
        
        var result = new Record;
        record.eachField( /./, function( field ) {
            if( !classificationFields.test( field.name ) ) {
                result.append( field );
            }
        });
        
        Log.info( "Exit - ClassificationData.updateClassificationsInRecord(): " + result );
        return result;
    }
    
    /**
     * Creates a Record from an existing record with all fields matching a 
     * fieldmatcher.
     * 
     * @param {Record}        record       Input record.
     * @param {RegExp|Object} fieldmatcher Field matcher.
     * 
     * @returns {Record} The new subset record.
     */
    function __createSubRecord( record, fieldmatcher ) {
        Log.info( "Enter - ClassificationData.__createSubRecord()" );
        Log.info( "    record: " + record );
        Log.info( "    fieldmatcher: " + fieldmatcher );
        var result = new Record;
        
        record.eachField( fieldmatcher, function( field ) { 
            result.append( field ); 
        } );
        
        Log.info( "Exit - ClassificationData.createSubRecord(): " + result );
        return result;
    }
    
    function __hasRecordChanged( oldRecord, newRecord, valueFunc ) {
        Log.info( "Enter - ClassificationData.__hasRecordChanged()" );
        Log.info( "    oldRecord: " + oldRecord );
        Log.info( "    newRecord: " + newRecord );
        
        if( oldRecord.size() !== newRecord.size() ) {
            return true;
        }
        
        var result = false;
        
        oldRecord.eachField( /./, function( oldField ) {
            if( result === true ) {
                return;
            };
            
            var isFieldChanged = true;
            
            newRecord.eachField( /./, function( newField ) {
                if( !__hasFieldChanged( oldField, newField, valueFunc ) ) {
                    isFieldChanged = false;
                }
            } );
            
            if( isFieldChanged ) {
                result = true;
            }
        });
        
        Log.info( "Exit - ClassificationData.__hasRecordChanged(): " + result );
        return result;        
    }
    
    function __hasFieldChanged( oldField, newField, valueFunc, ignoreSubfieldsMatcher ) {
        Log.info( "Enter - ClassificationData.__hasFieldChanged()" );
        Log.info( "    oldField: " + oldField );
        Log.info( "    newField: " + newField );
        Log.info( "    ignoreSubfieldsMatcher: " + ignoreSubfieldsMatcher );
        
        if( oldField === undefined && newField === undefined ) {
            return false;
        }
        else if( oldField !== undefined && newField === undefined ) {
            return true;
        }
        else if( oldField === undefined && newField !== undefined ) {
            return true;
        }
        
        var msf = getMatchSubField( ignoreSubfieldsMatcher );
        if( ignoreSubfieldsMatcher === undefined ) {
            msf = { 
                matchSubField: function( f, sf ) {
                    return false;
                }
            };
        }
        
        if( oldField.size() !== newField.size() ) {
            Log.info( "Exit - ClassificationData.__hasFieldChanged(): true" );
            return true;
        }
        
        var result = false;
        oldField.eachSubField( /./, function( field, subfield ) {
            if( result ) {
                return;
            }
            
            if( msf.matchSubField( field, subfield ) ) {
                return;
            }
            
            var sfMatcher = { 
                matchSubField: function( f, sf ) {
                    return sf.name === subfield.name && valueFunc( sf.value ) === valueFunc( subfield.value );
                } 
            };
            
            if( !newField.exists( sfMatcher ) ) {
                result = true;
            }            
        });

        Log.info( "Exit - ClassificationData.__hasFieldChanged(): " + result );
        return result;        
    }
    
    function __hasFieldByNameChanged( oldMarc, newMarc, fieldname, valueFunc, ignoreSubfieldsMatcher ) {
        var oldField = undefined;
        var newField = undefined;
        
        if( oldMarc.existField( new RegExp( fieldname ) ) ) {
            oldField = oldMarc.field( fieldname );
        }
        if( newMarc.existField( new RegExp( fieldname ) ) ) {
            newField = newMarc.field( fieldname );
        }
        
        return __hasFieldChanged( oldField, newField, valueFunc, ignoreSubfieldsMatcher );
    }
    
    function __hasSubfieldChangedMatcher( oldMarc, newMarc, fieldmatcher, subfieldmatcher, oldValueMatcher, newValueMatcher ) {
        Log.info( "Enter - ClassificationData.__hasSubfieldChangedMatcher()" );
        Log.info( "    oldMarc: " + oldMarc );
        Log.info( "    newMarc: " + newMarc );
        Log.info( "    fieldmatcher: " + fieldmatcher );
        Log.info( "    subfieldmatcher: " + subfieldmatcher );
        Log.info( "    oldValueMatcher: " + oldValueMatcher );
        Log.info( "    newValueMatcher: " + newValueMatcher );

        var result = oldMarc.matchValue( fieldmatcher, subfieldmatcher, oldValueMatcher ) && 
                     newMarc.matchValue( fieldmatcher, subfieldmatcher, newValueMatcher );
             
        Log.info( "Exit - ClassificationData.__hasSubfieldChangedMatcher(): " + result );
        return result;
    }
    
    function __hasSubfieldJustChanged( oldMarc, newMarc, valueFunc, fieldmatcher, subfieldmatcher ) {
        Log.info( "Enter - ClassificationData.__hasSubfieldJustChanged()" );
        Log.info( "    oldMarc: " + oldMarc );
        Log.info( "    newMarc: " + newMarc );
        Log.info( "    fieldmatcher: " + fieldmatcher );
        Log.info( "    subfieldmatcher: " + subfieldmatcher );

        var result = valueFunc( oldMarc.getValue( fieldmatcher, subfieldmatcher ) ) !== valueFunc( newMarc.getValue( fieldmatcher, subfieldmatcher ) );
        Log.info( "Exit - ClassificationData.__hasSubfieldJustChanged():" + result );
        return result;
    }

    function __hasStripedValueChanged( a, b, len ) {
        Log.info( "Enter - ClassificationData.__hasStripedValueChanged()" );
        Log.info( "    a: " + a );
        Log.info( "    b: " + b );
        Log.info( "    len: " + len );

        a = __stripValue( a.substr( 0, len ) );
        b = __stripValue( b.substr( 0, len ) );
        
        var result = a !== b
        Log.info( "Exit - ClassificationData.__hasStripedValueChanged():" + result );
        return result;
    }
    
    function __value( v ) {
        return v;
    }
    
    function __stripValue( v ) {
        Log.info( "Enter - ClassificationData.__stripValue()" );
        Log.info( "    v: " + v );

        v = v.replace( /\s|\[|\]|\u00A4/g, "" );
        
        Log.info( "Exit - ClassificationData.__stripValue():" + v );
        return v;
    }

    function __stripValueLength10( v ) {
        v = __stripValue( v.substr( 0, 10 ) );
        return v;
    }
    
    return {
        'hasClassificationData': hasClassificationData,
        'hasClassificationsChanged': hasClassificationsChanged,
        'updateClassificationsInRecord': updateClassificationsInRecord,
        'removeClassificationsFromRecord': removeClassificationsFromRecord,
        '__stripValue': __stripValue
    };
    
}();
