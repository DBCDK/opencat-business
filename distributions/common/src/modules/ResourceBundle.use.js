use("Log");
use("StringUtil");

EXPORTED_SYMBOLS = ['ResourceBundle'];

/**
 * Loads Locale specific string resources from a property file.
 *
 * @namespace
 * @name ResourceBundle
 */
var ResourceBundle = function () {
    function create(locale) {
        return {
            locale: locale,
            entries: null
        }
    }

    function createWithProperties(locale, properties) {
        return {
            locale: locale,
            entries: properties
        }
    }

    function containsKey(instance, key) {
        Log.trace("Enter - ResourceBundle.containsKey( ", instance, ", ", key, " )");
        var result = null;
        try {
            return result = instance.entries.containsKey(key);
        } catch (ex) {
            Log.trace("Exception: ", ex);
            return result = false;
        } finally {
            Log.trace("Exit - ResourceBundle.containsKey(): ", result);
        }
    }

    function getString(instance, key) {
        if (containsKey(instance, key)) {
            return instance.entries.get(key).toString() + '';
        }
        return '';
    }

    function getStringFormat(instance, key, args) {
        Log.trace("Enter - ResourceBundle.getStringFormat( ", instance, ", ", key, " )");
        var result = null;
        try {
            var str = getString(instance, key);
            var array = [str];
            for (var i = 2; i < arguments.length; i++) {
                array.push(arguments[i]);
            }
            Log.trace("Call StringUtil.sprintf with: [ ", array.join(", "), " ]");
            return result = StringUtil.sprintf.apply(StringUtil, array);
        } finally {
            Log.trace("Exit - ResourceBundle.getStringFormat(): ", result);
        }
    }

    return {
        'create': create,
        'createWithProperties': createWithProperties,
        'containsKey': containsKey,
        'getString': getString,
        'getStringFormat': getStringFormat
    }
}();
