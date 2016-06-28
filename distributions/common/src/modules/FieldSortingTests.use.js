use("UnitTest");
use("SafeAssert");
use("FieldSorting");

UnitTest.addFixture("FieldSorting", function () {
    var bundle = ResourceBundleFactory.getBundle(FieldSorting.BUNDLE_NAME);

    var fieldMoreSubfieldsThanSorting = {
        "name": "fieldMoreSubfieldsThanSorting",
        "sorting": "naelb",
        "subfields": [
            {name: "a"},
            {name: "A"},
            {name: "b"},
            {name: "c"},
            {name: "e"},
            {name: "q"},
            {name: "L"},
            {name: "X"}
        ]
    };

    var fieldMoreSubfieldsThanSortingExpected = {
        "name": "fieldMoreSubfieldsThanSorting",
        "sorting": "naelb",
        "subfields": [
            {name: "A"},
            {name: "a"},
            {name: "e"},
            {name: "L"},
            {name: "b"},
            {name: "c"},
            {name: "q"},
            {name: "X"}
        ]
    };

    SafeAssert.equal("fieldMoreSubfieldsThanSorting", FieldSorting.sort(fieldMoreSubfieldsThanSorting), fieldMoreSubfieldsThanSortingExpected);

    var fieldWithWeirdChar = {
        "name": "fieldWithWeirdChar",
        "sorting": "&tuazbcdefghijklmnoqrxwv",
        "subfields": [
            {name: "&"},
            {name: "t"},
            {name: "u"},
            {name: "a"},
            {name: "z"},
            {name: "b"},
            {name: "c"},
            {name: "d"},
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"},
            {name: "i"},
            {name: "j"},
            {name: "k"},
            {name: "l"},
            {name: "m"},
            {name: "n"},
            {name: "o"},
            {name: "q"},
            {name: "r"},
            {name: "w"},
            {name: "x"},
            {name: "v"}
        ]
    };

    var fieldWithWeirdCharExpected = {
        "name": "fieldWithWeirdChar",
        "sorting": "&tuazbcdefghijklmnoqrxwv",
        "subfields": [
            {name: "&"},
            {name: "t"},
            {name: "u"},
            {name: "a"},
            {name: "z"},
            {name: "b"},
            {name: "c"},
            {name: "d"},
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"},
            {name: "i"},
            {name: "j"},
            {name: "k"},
            {name: "l"},
            {name: "m"},
            {name: "n"},
            {name: "o"},
            {name: "q"},
            {name: "r"},
            {name: "x"},
            {name: "w"},
            {name: "v"}
        ]
    };

    SafeAssert.equal("fieldWithWeirdChar", FieldSorting.sort(fieldWithWeirdChar), fieldWithWeirdCharExpected);

    var alreadySorted = {
        "name": "alreadySorted",
        "sorting": "ab",
        "subfields": [
            {name: "A"},
            {name: "a"},
            {name: "B"},
            {name: "b"}
        ]
    };


    SafeAssert.equal("alreadySorted", FieldSorting.sort(alreadySorted), alreadySorted);

    var noSortingOverlap = {
        "name": "noSortingOverlap",
        "sorting": "abcd",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    SafeAssert.equal("noSortingOverlap", FieldSorting.sort(noSortingOverlap), noSortingOverlap);

    var emptyField = {
        "name": "emptyField",
        "sorting": "",
        "subfields": []
    };

    SafeAssert.equal("noSortingOverlap", FieldSorting.sort(emptyField), emptyField);

    var noSorting = {
        "name": "noSorting",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    SafeAssert.equal("noSorting", FieldSorting.sort(noSorting), noSorting);

    var noSubfields = {
        "name": "noSubfields",
        "sorting": "abcd"
    };

    SafeAssert.equal("noSubfields", FieldSorting.sort(noSubfields), noSubfields);

})
;