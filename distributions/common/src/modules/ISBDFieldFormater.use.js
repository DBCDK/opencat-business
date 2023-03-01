use("Marc");
use("MarcClasses");
use("Log");
use("StringUtil");

EXPORTED_SYMBOLS = ['ISBDFieldFormater'];

/**
 * This module can format a field according to an ISBD specification.
 *
 * @type {ISBDFieldFormater}
 */
var ISBDFieldFormater = function () {
    var specExample = {
        sepSpec: [
            {
                pattern: /ae/,
                firstSep: "(",
                midSep: " : ",
                lastSep: ")"
            }
        ],
        valueSpec: {
            e: "(%s)"
        }
    };

    function formatField(field, spec) {
        Log.trace("Enter - ISBDFieldFormater.formatField()");

        var result = "";
        try {
            var previousSubNames = "";

            for (var i = 0; i < field.count(); i++) {
                var subField = field.subfield(i);
                var specSepItem = __findSepSpecItem(previousSubNames + subField.name, spec.sepSpec);

                Log.debug("subfield: ", subField);
                Log.debug("Subfield names: ", previousSubNames + subField.name);
                Log.debug("specSepItem: ", specSepItem !== undefined ? specSepItem : "UNDEFINED");

                if (i === 0) {
                    if (specSepItem !== undefined && specSepItem.firstSep !== undefined) {
                        Log.debug("Add firstSep");
                        result += specSepItem.firstSep;
                    }
                }

                var subfieldValue = undefined;
                if (previousSubNames !== "") {
                    if (specSepItem !== undefined) {
                        Log.debug("Subfield names: ", previousSubNames + subField.name, " - spec: ", specSepItem);
                        if (specSepItem.midSep !== undefined) {
                            Log.debug("Add midSep");
                            result += specSepItem.midSep;
                        }

                        if (specSepItem.midValueFunction !== undefined) {
                            subfieldValue = specSepItem.midValueFunction(subField.value);

                            Log.debug("Format subfield value with function: ", subField.value, " -> ", subfieldValue);
                        }
                    }
                }

                if (subfieldValue === undefined) {
                    var specValueFunction = spec.valueSpec[subField.name];
                    if (specValueFunction !== undefined) {
                        subfieldValue = specValueFunction(subField.value);
                    }
                    else {
                        subfieldValue = subField.value;
                    }
                }

                result += subfieldValue;

                if (i === ( field.count() - 1 )) {
                    if (specSepItem !== undefined && specSepItem.lastSep !== undefined) {
                        Log.debug("Add lastSep");
                        result += specSepItem.lastSep;
                    }
                }

                previousSubNames += subField.name;
            }

            return result;
        }
        finally {
            Log.trace("Exit - ISBDFieldFormater.formatField(): ", result);
        }
    }

    function __findSepSpecItem(str, spec) {
        for (var i = 0; i < spec.length; i++) {
            var itemSpec = spec[i];
            if (itemSpec.pattern.test(str)) {
                return itemSpec;
            }
        }

        return undefined;
    }

    return {
        'formatField': formatField
    }
}();
