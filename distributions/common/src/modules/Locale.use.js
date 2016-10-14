EXPORTED_SYMBOLS = ['Locale'];

/**
 * Module represent a Locale (country and language). Is it used with
 * ResourceBundle to load language specific resources.
 *
 * @namespace
 * @name Locale
 */
var Locale = function () {
    /**
     * Locale for danish.
     *
     * @type {{country, language}|{country: 'DK', language: 'da'}}
     * @name Locale#DANISH
     */
    var DANISH = create("da", "DK");

    /**
     * Creates an instance for a Locale with a country and language.
     *
     * @param language Language name.
     * @param country  The country name.
     *
     * @returns {{country: *, language: *}}
     * @name Locale#create
     */
    function create(language, country) {
        return {
            country: country,
            language: language
        }
    }

    /**
     * Converts a Locale to a string.
     *
     * @param instance Instance object of the Locale.
     *
     * @returns The formated string of the parsed Locale.
     *
     * @name Locale#create
     */
    function toString(instance) {
        return StringUtil.sprintf("%s_%s", instance.language, instance.country);
    }

    return {
        'DANISH': DANISH,
        'create': create,
        'toString': toString
    };
}();
