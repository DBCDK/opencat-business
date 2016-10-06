use("UnitTest");
use("SafeAssert");
use('RecordSorting');

UnitTest.addFixture("RecordSorting", function () {

    var template = {
        "fields": {
            "001": {},
            "002": {},
            "003": {},
            "004": {},
            "101": {},
            "102": {},
            "103": {},
            "104": {},
            "999": {},
            "a01": {},
            "a02": {},
            "b99": {},
            "c01": {}
        }
    };

    var templateProvider = function () {
        return template;
    };

    var record = {
        fields: [
            {name: '104'},
            {name: '103'},
            {name: '003'},
            {name: '004'},
            {name: '101'},
            {name: 'a01'},
            {name: '001'},
            {name: 'c01'},
            {name: '002'},
            {name: '102'},
            {name: '999'},
            {name: 'b99'},
            {name: 'a02'}
        ]
    };

    var expectedResult = {
        fields: [
            {name: '001'},
            {name: '002'},
            {name: '003'},
            {name: '004'},
            {name: '101'},
            {name: '102'},
            {name: '103'},
            {name: '104'},
            {name: '999'},
            {name: 'a01'},
            {name: 'a02'},
            {name: 'b99'},
            {name: 'c01'}
        ]
    };

    SafeAssert.equal("fieldWithWeirdChar", RecordSorting.sort(templateProvider, record), expectedResult);

    record = {
        fields: [
            {name: 'a02'},
            {name: 'z01'},
            {name: 'z10'},
            {name: 'z99'},
            {name: 'a01'},
            {name: 'z98'}
        ]
    };

    expectedResult = {
        fields: [
            {name: 'a01'},
            {name: 'a02'},
            {name: 'z01'},
            {name: 'z10'},
            {name: 'z98'},
            {name: 'z99'}
        ]
    };

    SafeAssert.equal("Sort letter fields only", RecordSorting.sort(templateProvider, record), expectedResult);

});