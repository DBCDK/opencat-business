use("SafeAssert");
use("UnitTest");
use("SubfieldsHaveValuesDemandsOtherSubfield");

UnitTest.addFixture("Test SubfieldsHaveValuesDemandsOtherSubfield.validateRecord mandatory field exists", function () {
    var field001, field245, field490, subfield001, subfield245, subfield490, record;
    var params = {
        'demandingFields': [
            {'fieldName': '245', 'subfieldName': 'a', 'subfieldValues': ['a', 'b', 'c']},
            {'fieldName': '490', 'subfieldName': 'b', 'subfieldValues': ['d', 'e', 'f']}
        ],
        'mandatoryFieldName': '001',
        'mandatorySubfieldName': 'a'
    };

    subfield001 = {'name': 'a', 'value': 42};
    field001 = {'name': '001', 'subfields': [subfield001]};

    record = {'fields': [field001]};

    Assert.equalValue("Record only contains mandatory subfield",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);

    subfield001 = {'name': 'a', 'value': 42};
    field001 = {'name': '001', 'subfields': [subfield001]};

    subfield245 = {'name': 'a', 'value': 'a'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field001, field245]};

    Assert.equalValue("Record contains mandatory subfield and one demanding field",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);

    subfield001 = {'name': 'a', 'value': 42};
    field001 = {'name': '001', 'subfields': [subfield001]};

    subfield245 = {'name': 'a', 'value': 'a'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    subfield490 = {'name': 'b', 'value': 'd'};
    field490 = {'name': '490', 'subfields': [subfield490]};

    record = {'fields': [field001, field245, field490]};

    Assert.equalValue("Record contains mandatory subfield and both demanding fields",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);

});
UnitTest.addFixture("Test SubfieldsHaveValuesDemandsOtherSubfield.validateRecord mandatory field doesn't exists", function () {
    var field245, field490, subfield245, subfield490, record;
    var params = {
        'demandingFields': [
            {'fieldName': '245', 'subfieldName': 'a', 'subfieldValues': ['a', 'b', 'c']},
            {'fieldName': '490', 'subfieldName': 'b', 'subfieldValues': ['d', 'e', 'f']}
        ],
        'mandatoryFieldName': '001',
        'mandatorySubfieldName': 'a'
    };

    subfield245 = {'name': 'a', 'value': 'd'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    subfield490 = {'name': 'b', 'value': 'd'};
    field490 = {'name': '490', 'subfields': [subfield490]};

    record = {'fields': [field245, field490]};

    Assert.equalValue("Demanding fields exist but has wrong subfield value",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);


    subfield245 = {'name': 'a', 'value': 'a'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    record = {'fields': [field245]};

    Assert.equalValue("Not all demanding fields in record",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);

    record = {'fields': []};

    Assert.equalValue("Empty record",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), []);

});
UnitTest.addFixture("Test SubfieldsHaveValuesDemandsOtherSubfield.validateRecord fail", function () {
    var field001, field245, field490, subfield001, subfield245, subfield490, record, error;
    var params = {
        'demandingFields': [
            {'fieldName': '245', 'subfieldName': 'a', 'subfieldValues': ['a', 'b', 'c']},
            {'fieldName': '490', 'subfieldName': 'b', 'subfieldValues': ['d', 'e', 'f']}
        ],
        'mandatoryFieldName': '001',
        'mandatorySubfieldName': 'a'
    };
    error = ValidateErrors.recordError("TODO:url", "Delfelt 001 *a er obligatorisk pga følgende delfelter: " +
        "delfelt 245 *a med en af værdierne: a,b,c og delfelt 490 *b med en af værdierne: d,e,f");

    subfield245 = {'name': 'a', 'value': 'a'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    subfield490 = {'name': 'b', 'value': 'd'};
    field490 = {'name': '490', 'subfields': [subfield490]};

    record = {'fields': [field245, field490]};

    Assert.equalValue("Demanding fields exist but not mandatory field",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), [error]);

    subfield001 = {'name': 'b', 'value': 42};
    field001 = {'name': '001', 'subfields': [subfield001]};

    subfield245 = {'name': 'a', 'value': 'a'};
    field245 = {'name': '245', 'subfields': [subfield245]};

    subfield490 = {'name': 'b', 'value': 'd'};
    field490 = {'name': '490', 'subfields': [subfield490]};

    record = {'fields': [field001, field245, field490]};

    Assert.equalValue("Demanding fields exist but not mandatory subfield",
        SubfieldsHaveValuesDemandsOtherSubfield.validateRecord(record, params), [error]);
});