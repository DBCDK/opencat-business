use("UnitTest");
use("SafeAssert");
use('RecordSorting');

UnitTest.addFixture("RecordSorting", function () {

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

    SafeAssert.equal("fieldWithWeirdChar", RecordSorting.sort(record), expectedResult);

})
;