use("UnitTest");
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

    Assert.equalValue("fieldMoreSubfieldsThanSorting", FieldSorting.sort(fieldMoreSubfieldsThanSorting, "naelb"), fieldMoreSubfieldsThanSortingExpected);

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

    Assert.equalValue("fieldWithWeirdChar", FieldSorting.sort(fieldWithWeirdChar, "&tuazbcdefghijklmnoqrxwv"), fieldWithWeirdCharExpected);

    var alreadySorted = {
        "name": "alreadySorted",
        "subfields": [
            {name: "A"},
            {name: "a"},
            {name: "B"},
            {name: "b"}
        ]
    };


    Assert.equalValue("alreadySorted", FieldSorting.sort(alreadySorted, "ab"), alreadySorted);

    var noSortingOverlap = {
        "name": "noSortingOverlap",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    Assert.equalValue("noSortingOverlap", FieldSorting.sort(noSortingOverlap, "abcd"), noSortingOverlap);

    var emptyField = {
        "name": "emptyField",
        "subfields": []
    };

    Assert.equalValue("noSortingOverlap", FieldSorting.sort(emptyField, ""), emptyField);

    var noSorting = {
        "name": "noSorting",
        "subfields": [
            {name: "e"},
            {name: "f"},
            {name: "g"},
            {name: "h"}
        ]
    };

    Assert.equalValue("noSorting", FieldSorting.sort(noSorting, null), noSorting);

    var noSubfields = {
        "name": "noSubfields"
    };

    Assert.equalValue("noSubfields", FieldSorting.sort(noSubfields, "abcd"), noSubfields);

    var moveToLast = {
        "name": "moveToLast",
        "subfields": [
            {name: "t"},
            {name: "u"},
            {name: "a"},
            {name: "b"},
            {name: "j"},
            {name: "l"},
            {name: "&"},
            {name: "n"},
            {name: "o"},
            {name: "v"},
            {name: "w"}
        ]
    };

    var moveToLastExpected = {
        "name": "moveToLast",
        "subfields": [
            {name: "&"},
            {name: "t"},
            {name: "u"},
            {name: "a"},
            {name: "b"},
            {name: "j"},
            {name: "l"},
            {name: "n"},
            {name: "o"},
            {name: "w"},
            {name: "v"}
        ]
    };

    Assert.equalValue("moveToLast", FieldSorting.sort(moveToLast, "&tuazbcdefghijklmnoqrxwv"), moveToLastExpected);

});