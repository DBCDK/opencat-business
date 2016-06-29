use("UnitTest");
use("SafeAssert");
use("FieldSorting");

UnitTest.addFixture("FieldSorting", function () {
    var bundle = ResourceBundleFactory.getBundle(FieldSorting.BUNDLE_NAME);

    var fieldMoreSubfieldsThanSorting = {
        "name": "fieldMoreSubfieldsThanSorting",
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

    SafeAssert.equal("fieldMoreSubfieldsThanSorting", FieldSorting.sort(fieldMoreSubfieldsThanSorting, "naelb"), fieldMoreSubfieldsThanSortingExpected);

    var fieldWithWeirdChar = {
        "name": "fieldWithWeirdChar",
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

    SafeAssert.equal("fieldWithWeirdChar", FieldSorting.sort(fieldWithWeirdChar, "&tuazbcdefghijklmnoqrxwv"), fieldWithWeirdCharExpected);

    var alreadySorted = {
        "name": "alreadySorted",
        "subfields": [
            {name: "A"},
            {name: "a"},
            {name: "B"},
            {name: "b"}
        ]
    };


    SafeAssert.equal("alreadySorted", FieldSorting.sort(alreadySorted, "ab"), alreadySorted);

    var noSortingOverlap = {
        "name": "noSortingOverlap",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    SafeAssert.equal("noSortingOverlap", FieldSorting.sort(noSortingOverlap, "abcd"), noSortingOverlap);

    var emptyField = {
        "name": "emptyField",
        "subfields": []
    };

    SafeAssert.equal("noSortingOverlap", FieldSorting.sort(emptyField, ""), emptyField);

    var noSorting = {
        "name": "noSorting",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    SafeAssert.equal("noSorting", FieldSorting.sort(noSorting, null), noSorting);

    var noSubfields = {
        "name": "noSubfields"
    };

    SafeAssert.equal("noSubfields", FieldSorting.sort(noSubfields, "abcd"), noSubfields);

})
;