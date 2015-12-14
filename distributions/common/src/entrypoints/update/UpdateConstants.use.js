//-----------------------------------------------------------------------------
EXPORTED_SYMBOLS = [ 'UpdateConstants' ];

//-----------------------------------------------------------------------------
var UpdateConstants = {

    //-----------------------------------------------------------------------------
    //                  Agency ids
    //-----------------------------------------------------------------------------

    COMMON_AGENCYID: "870970",

    RAWREPO_COMMON_AGENCYID: "191919",
    RAWREPO_DBC_ENRICHMENT_AGENCY_ID: "870970",

    SCHOOL_COMMON_AGENCYID: "300000",
    SCHOOL_AGENCY_PATTERN: /3[0-9]{5}/,

    //-----------------------------------------------------------------------------
    //                  Fields
    //-----------------------------------------------------------------------------

    DEFAULT_CLASSIFICATION_FIELDS: /004|008|009|038|039|100|110|239|245|652/,
    SINGLE_VOLUME_CLASSIFICATION_FIELDS: /004|009|038|039|100|110|239|245|652/,
    EXTENTABLE_NOTE_FIELDS: "504|530",
    EXTENTABLE_SUBJECT_FIELDS: "600|610|630|666",

    AUTH_DBC_RECORDS: "auth_dbc_records",
    AUTH_COMMON_SUBJECTS: "auth_common_subjects",
    AUTH_COMMON_NOTES: "auth_common_notes",
    AUTH_PUBLIC_LIB_COMMON_RECORD: "auth_public_lib_common_record",
    AUTH_RET_RECORD: "auth_ret_record",
    AUTH_ROOT_FEATURE: "auth_root"
};
