use("UnitTest");
use("SafeAssert");
use("SubfieldSorting");

UnitTest.addFixture("SubfieldSorting", function () {
    var bundle = ResourceBundleFactory.getBundle(SubfieldSorting.BUNDLE_NAME);

    var fieldMoreSubfieldsThanSorting = {
        "sorting": "naelb",
        "subfields": {
            "a": "value for a",
            "A": "value for A",
            "b": "value for b",
            "c": "value for c",
            "e": "value for e",
            "q": "value for q",
            "L": "value for L",
            "x": "value for X"
        }
    };

    var fieldMoreSubfieldsThanSortingExpected = {
        "sorting": "naelb",
        "subfields": {
            "A": "value for A",
            "a": "value for a",
            "e": "value for e",
            "L": "value for L",
            "b": "value for b",
            "c": "value for c",
            "q": "value for q",
            "x": "value for X"
        }
    };

    SafeAssert.equal("fieldMoreSubfieldsThanSorting", SubfieldSorting.sort(fieldMoreSubfieldsThanSorting), fieldMoreSubfieldsThanSortingExpected);

    var fieldWithWeirdChar = {
        "sorting": "&tuazbcdefghijklmnoqrxwv",
        "subfields": {
            "&": {},
            "t": "t",
            "u": "u",
            "a": "a",
            "z": "z",
            "b": "b",
            "c": "c",
            "d": "d",
            "e": "e",
            "f": "f",
            "g": "g",
            "h": "h",
            "i": "i",
            "j": "j",
            "k": "k",
            "l": "l",
            "m": "m",
            "n": "n",
            "o": "o",
            "q": "q",
            "r": "r",
            "w": "w",
            "x": "x",
            "v": "v"
        }
    };

    var fieldWithWeirdCharExpected = {
        "sorting": "&tuazbcdefghijklmnoqrxwv",
        "subfields": {
            "&": {},
            "t": "t",
            "u": "u",
            "a": "a",
            "z": "z",
            "b": "b",
            "c": "c",
            "d": "d",
            "e": "e",
            "f": "f",
            "g": "g",
            "h": "h",
            "i": "i",
            "j": "j",
            "k": "k",
            "l": "l",
            "m": "m",
            "n": "n",
            "o": "o",
            "q": "q",
            "r": "r",
            "x": "x",
            "w": "w",
            "v": "v"
        }
    };

    SafeAssert.equal("fieldWithWeirdChar", SubfieldSorting.sort(fieldWithWeirdChar), fieldWithWeirdCharExpected);

    var alreadySorted = {
        "sorting": "AaBb",
        "subfields": {
            "A": "A",
            "a": "a",
            "B": "B",
            "b": "b"
        }
    };


    SafeAssert.equal("alreadySorted", SubfieldSorting.sort(alreadySorted), alreadySorted);

    var noSortingOverlap = {
        "sorting": "abcd",
        "subfields": {
            "e": "e",
            "f": "f",
            "g": "g",
            "h": "h"
        }
    };

    SafeAssert.equal("noSortingOverlap", SubfieldSorting.sort(noSortingOverlap), noSortingOverlap);

    var emptyField = {
        "sorting": "",
        "subfields": {}
    };

    SafeAssert.equal("noSortingOverlap", SubfieldSorting.sort(emptyField), emptyField);

    var noSorting = {
        "subfields": {
            "e": "e",
            "f": "f",
            "g": "g",
            "h": "h"
        }
    };

    SafeAssert.equal("noSorting", SubfieldSorting.sort(noSorting), noSorting);

    var noSubfields = {
        "sorting": "abcd"
    };

    SafeAssert.equal("noSubfields", SubfieldSorting.sort(noSubfields), noSubfields);

});