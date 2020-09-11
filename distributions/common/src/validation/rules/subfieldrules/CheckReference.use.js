use("Log");
use("ResourceBundle");
use("ResourceBundleFactory");
use("ValidateErrors");
use("ValidationUtil");
use("ContextUtil")

EXPORTED_SYMBOLS = ['CheckReference'];

var CheckReference = function () {
    var __BUNDLE_NAME = "validation";
    var __TOKEN_TYPE = {
        "LITERAL": 1,
        "DELIMITER": 2,
        "COMMA": 3,
        "LEFT_PARENTHESIS": 4,
        "RIGHT_PARENTHESIS": 5,
        "WHITESPACE": 6
    };

    // Class representing tokens produced when parsing subfield
    function Token(type, value) {
        this.type = type;
        this.value = value;
    }

    function SubfieldSyntaxError(message) {
        this.message = message;
    }

    /**
     * CheckReference is used to check if the fields contains correct references
     * the function is invoked with a subfield which contains one of three forms of a formatted string
     * 1  = 700
     * 2  = 700/1
     * 3  = 700/1(a,b,c)
     * 1 ) its checked whether a 700 field exists with no å subfield
     * 2 ) field must exists and subfield å must contain the value after the backslash
     * 3 ) rule 2 + 3 and the field with the correct value in å must also contain the subfields denoted in the paranthesis
     * url Danmarc2 : http://www.kat-format.dk/danMARC2/Danmarc2.99.htm#pgfId=1575494
     *
     * @syntax CheckReference.validateSubfield( record, field, subfield, params )
     * @param {object} record
     * @param {object} field
     * @param {object} subfield
     * @param {object} params is not used
     * @return {object}
     * @name CheckReference.validateSubfield
     * @method
     */
    function validateSubfield(record, field, subfield, params) {
        Log.trace("Enter --- CheckReference.validateSubfield");
        try {
            var bundle;

            try {
                __checkSyntax(field, subfield);
            } catch (e) {
                if (e instanceof SubfieldSyntaxError) {
                    return [ValidateErrors.subfieldError('TODO:fixurl', e.message)];
                }
                throw e;
            }

            var context = params.context;
            var fieldNameToCheck = subfield.value.slice(0, 3);// String

            var matchingFields = ContextUtil.getValue(context, 'getFields', fieldNameToCheck);
            if (matchingFields === undefined) {
                // array of fields which matches the fieldNameToCheck
                // meaning thew first three letters in subfield.value, ie 700/1(a,b,c) --> 700
                matchingFields = ValidationUtil.getFields(record, fieldNameToCheck);
                ContextUtil.setValue(context, matchingFields, 'getFields', fieldNameToCheck);
            }
            var errorMessage;

            if (matchingFields.length < 1) {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                errorMessage = ResourceBundle.getStringFormat(bundle, "check.ref.missing.field", field.name);
                return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
            }
            // if the length of the subfield val is only 3, we have a subfield val matching case 1, meaning its a pure field name eg : 710
            if (subfield.value.length === 3) {
                var fieldCountWithDanishaa = ContextUtil.getValue(context, 'fieldCountWithDanishaa', fieldNameToCheck);
                if (fieldCountWithDanishaa === undefined) {
                    fieldCountWithDanishaa = __getFieldCountWithDanishaa(matchingFields);
                    ContextUtil.setValue(context, fieldCountWithDanishaa, 'fieldCountWithDanishaa', fieldNameToCheck);
                }
                if (fieldCountWithDanishaa === matchingFields.length) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    return [ValidateErrors.subfieldError('TODO:fixurl', ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield.å", fieldNameToCheck))];
                } else if (matchingFields.length > 1 && fieldCountWithDanishaa === 0) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    return [ValidateErrors.subfieldError('TODO:fixurl', ResourceBundle.getStringFormat(bundle, "check.ref.ambiguous",
                        field.name, subfield.name, fieldNameToCheck))];
                }
                return [];
            }

            var forwardslashValue = __getValueFromForwardSlash(subfield.value); // { containsValidValue: Boolean, Value: String }
            // if the forwardslashvalue doesn't contain a valid value, the subfield.value is formatted without a forward slash and no parenthesis
            if (forwardslashValue.containsValidValue === false) {
                return []
            }

            var fieldsByForwardSlash = ContextUtil.getValue(context, 'fieldsByForwardSlash', fieldNameToCheck);
            if (fieldsByForwardSlash === undefined) {
                fieldsByForwardSlash = __fieldsByForwardSlash(matchingFields);
                ContextUtil.setValue(context, fieldsByForwardSlash, 'fieldsByForwardSlash', fieldNameToCheck);
            }

            var referencedFields = fieldsByForwardSlash[forwardslashValue.value];

            if (referencedFields === undefined || referencedFields.length > 0) {
                var subfieldValuesToCheck = __getValuesToCheckFromparenthesis(subfield.value);// Array: String
                if (subfieldValuesToCheck.length > 0) {
                    return (__checkSubFieldValues(referencedFields, subfieldValuesToCheck));
                }
            } else {
                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                errorMessage = ResourceBundle.getStringFormat(bundle, "check.ref.missing.value", forwardslashValue.value, matchingFields[0].name);
                return [ValidateErrors.subfieldError('TODO:fixurl', errorMessage)];
            }
            return [];
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield");
        }
    }

    /*
      This function divides a list of fields into a dict where the key is the value from subfield *å (\u00E5)
     */
    function __fieldsByForwardSlash(fields) {
        var ret = {};

        for (var i = 0; i < fields.length; ++i) {
            var field = fields[i];
            for (var j = 0; j < field.subfields.length; ++j) {
                var subfieldaa = field.subfields[j];
                if (subfieldaa.name === '\u00E5') {
                    if (ret[subfieldaa.value] === undefined) {
                        ret[subfieldaa.value] = []
                    }
                    ret[subfieldaa.value].push(field);
                }
            }
        }

        return ret;
    }

    function __getFieldCountWithDanishaa(fields) {
        Log.trace("Enter --- CheckReference.validateSubfield.__getFieldCountWithDanishaa");
        try {
            var count = 0;
            for (var i = 0; i < fields.length; ++i) {
                if (__fieldHasSubFieldDanishaa(fields[i])) {
                    count++;
                }
            }
            return count;
        } finally {
            Log.trace("Exit--- CheckReference.validateSubfield.__getFieldCountWithDanishaa");
        }
    }

    // Helper function which checks the syntax of a subfield referencing another,
    // throwing SubfieldSyntaxError on invalid syntax
    function __checkSyntax(field, subfield) {
        Log.trace("Enter --- CheckReference.validateSubfield.__checkSyntax");

        try {
            var tokens = __tokenize(subfield.value);
            __checkFieldNameSyntax(__getNextToken(), field, subfield);
            if (tokens.length > 0 && tokens[0].type === __TOKEN_TYPE.DELIMITER) {
                __checkNumeratorSyntax(tokens, field, subfield);
            }
            if (tokens.length > 0 && tokens[0].type === __TOKEN_TYPE.LEFT_PARENTHESIS) {
                __checkSubfieldListSyntax(tokens, field, subfield);
            }
            if (tokens.length > 0) {
                var token = __getNextToken();
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                    "check.ref.invalid.syntax.illegal.character", token.value, field.name, subfield.name));
            }
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield.__checkSyntax");
        }

        // Helper function used for tokenizing a subfield value
        function __tokenize(str) {
            // convert to array of characters
            str = str.split("");

            var tokens = [];    // array of tokens
            var literalBuffer = [];

            str.forEach(function (char) {
                if (__isDelimiter(char)) {
                    __emptyLiteralBuffer();
                    tokens.push(new Token(__TOKEN_TYPE.DELIMITER, char));
                } else if (__isComma(char)) {
                    __emptyLiteralBuffer();
                    tokens.push(new Token(__TOKEN_TYPE.COMMA, char));
                } else if (__isLeftParenthesis(char)) {
                    __emptyLiteralBuffer();
                    tokens.push(new Token(__TOKEN_TYPE.LEFT_PARENTHESIS, char));
                } else if (__isRightParenthesis(char)) {
                    __emptyLiteralBuffer();
                    tokens.push(new Token(__TOKEN_TYPE.RIGHT_PARENTHESIS, char));
                } else if (__isWhitespace(char)) {
                    __emptyLiteralBuffer();
                    tokens.push(new Token(__TOKEN_TYPE.WHITESPACE, char));
                } else {
                    literalBuffer.push(char);
                }
            });
            __emptyLiteralBuffer();
            return tokens;

            function __emptyLiteralBuffer() {
                if (literalBuffer.length) {
                    tokens.push(new Token(__TOKEN_TYPE.LITERAL, literalBuffer.join("")));
                    literalBuffer = [];
                }
            }
        }

        function __isComma(ch) {
            return (ch === ",");
        }

        function __isDelimiter(ch) {
            return (ch === "/");
        }

        function __isLeftParenthesis(ch) {
            return (ch === "(");
        }

        function __isRightParenthesis(ch) {
            return (ch === ")");
        }

        function __isWhitespace(ch) {
            return /\s/.test(ch);
        }

        function __isNumeric(str) {
            if (str === null) {
                return false;
            }
            return !isNaN(str);
        }

        function __getNextToken() {
            var token = tokens.shift();
            if (token.type === __TOKEN_TYPE.WHITESPACE) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                    "check.ref.invalid.syntax.whitespace", field.name, subfield.name));
            }
            return token;
        }

        function __getLastToken() {
            var token = tokens.pop();
            if (token.type === __TOKEN_TYPE.WHITESPACE) {
                var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                    "check.ref.invalid.syntax.whitespace", field.name, subfield.name));
            }
            return token;
        }

        // Helper function which checks the syntax the field name part of a referencing subfield,
        // throwing SubfieldSyntaxError on invalid syntax
        function __checkFieldNameSyntax(referencedFieldNameToken) {
            Log.trace("Enter --- CheckReference.validateSubfield.__checkSyntax.__checkFieldNameSyntax");
            var bundle;
            try {
                var tokenValue = referencedFieldNameToken.value;
                if (referencedFieldNameToken.type !== __TOKEN_TYPE.LITERAL) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.field.name", tokenValue, field.name, subfield.name));
                }
                if (tokenValue.length < 3) {    // e.g. 60
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.field.name", tokenValue, field.name, subfield.name));
                }
                if (tokenValue.slice(3)) {  // e.g. 6001 gives remainder 1
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.numerator.delimiter.missing", tokenValue, field.name, subfield.name));
                }
            } finally {
                Log.trace("Exit --- CheckReference.validateSubfield.__checkSyntax.__checkFieldNameSyntax");
            }
        }

        // Helper function which checks the syntax of the numerator part of a referencing subfield,
        // throwing SubfieldSyntaxError on invalid syntax
        function __checkNumeratorSyntax() {
            Log.trace("Enter --- CheckReference.validateSubfield.__checkSyntax.__checkNumeratorSyntax");
            var bundle;
            try {
                __getNextToken(); // discard delimiter token
                if (tokens.length === 0) {   // e.g. 600/
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.numerator.missing", field.name, subfield.name));
                }
                var numeratorToken = __getNextToken();
                if (numeratorToken.type !== __TOKEN_TYPE.LITERAL) { // e.g. 600/(a,b)
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.numerator.missing", field.name, subfield.name));
                }
                if (!__isNumeric(numeratorToken.value)) {  // e.g. 600/a
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.numerator.non.numeric", field.name, subfield.name));
                }
            } finally {
                Log.trace("Exit --- CheckReference.validateSubfield.__checkSyntax.__checkNumeratorSyntax");
            }
        }

        // Helper function which checks the syntax of the subfield list part of a referencing subfield,
        // throwing on invalid syntax
        function __checkSubfieldListSyntax() {
            Log.trace("Enter --- CheckReference.validateSubfield.__checkSyntax.__checkSubfieldListSyntax");
            var bundle;
            try {
                __getNextToken(); // discard left parenthesis
                var rightParenthesisToken = __getLastToken();
                if (rightParenthesisToken === undefined
                    || rightParenthesisToken.type !== __TOKEN_TYPE.RIGHT_PARENTHESIS) {
                    bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.list.parenthesis.missing", field.name, subfield.name));
                }
                if (tokens.length > 0) {
                    var token;
                    while (tokens.length !== 0) {
                        token = __getNextToken();
                        if (token.type !== __TOKEN_TYPE.LITERAL) {
                            bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                            throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                                "check.ref.invalid.syntax.list.subfield.missing", field.name, subfield.name));
                        }

                        __checkSubfieldSyntax(token, field, subfield, bundle);

                        if (tokens.length > 0) {
                            token = __getNextToken();
                            if (token.type !== __TOKEN_TYPE.COMMA) {
                                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                                throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                                    "check.ref.invalid.syntax.list.comma.missing", field.name, subfield.name));
                            }
                        }
                    }
                    // last token must be a literal
                    if (token.type !== __TOKEN_TYPE.LITERAL) {
                        bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                        throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                            "check.ref.invalid.syntax.list.subfield.missing", field.name, subfield.name));
                    }
                }
            } finally {
                Log.trace("Exit --- CheckReference.validateSubfield.__checkSyntax.__checkSubfieldListSyntax");
            }
        }

        // Helper function which checks the syntax of a subfield element from the list part of a referencing subfield,
        // throwing SubfieldSyntaxError on invalid syntax
        function __checkSubfieldSyntax(token) {
            Log.trace("Enter --- CheckReference.validateSubfield.__checkSyntax.__checkSubfieldListSyntax.__checkSubfieldSyntax");
            try {
                if (token.value.length > 2                                                      // e.g. 600(abc)
                    || (token.value.length === 2 && !__isNumeric(token.value.charAt(1)))) {     // e.g. 600(ab)
                    var bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                    throw new SubfieldSyntaxError(ResourceBundle.getStringFormat(bundle,
                        "check.ref.invalid.syntax.list.comma.missing", field.name, subfield.name));
                }
            } finally {
                Log.trace("Exit --- CheckReference.validateSubfield.__checkSyntax.__checkSubfieldListSyntax.__checkSubfieldSyntax");
            }
        }
    }

    // helper function that checks if a subfield with a given value exists on the field
    function __fieldHasSubFieldDanishaa(field) {
        Log.trace("Enter --- CheckReference.validateSubfield.__subfieldExistOnfield");
        try {
            for (var i = 0; i < field.subfields.length; ++i) {
                if (field.subfields[i].name === '\u00E5') {
                    return true;
                }
            }
            return false;
        } finally {
            Log.trace("Enter --- CheckReference.validateSubfield.__subfieldExistOnfield");
        }
    }

    // helper function which returns an array of errors
    // checks if the fields supplied does not contain the subfields in the subfieldValuesToCheck
    function __checkSubFieldValues(fieldsWithSubfieldDanishaa, subfieldValuesToCheck) {
        Log.trace("Enter --- CheckReference.validateSubfield.__checkSubFieldValues");
        try {
            var ret = [];
            var bundle = null;
            var found = {};
            var errorMessage;
            for (var i = 0; i < fieldsWithSubfieldDanishaa.length; ++i) {
                for (var j = 0; j < fieldsWithSubfieldDanishaa[i].subfields.length; ++j) {
                    found[fieldsWithSubfieldDanishaa[i].subfields[j].name] = true;
                }
                subfieldValuesToCheck.forEach(function (val) {
                    var valTrimmed = val.trim();
                    if (valTrimmed.length > 1) {
                        var nbr = valTrimmed.slice(1);
                        var subfield = valTrimmed.slice(0, 1);
                        var count = __countSubfieldOccurrences(fieldsWithSubfieldDanishaa[i], subfield);
                        if (count < nbr) {
                            if (bundle == null) {
                                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                            }
                            errorMessage = ResourceBundle.getStringFormat(bundle, "check.ref.subfield.not.repeated", subfield, fieldsWithSubfieldDanishaa[i].name, nbr);
                            ret.push(ValidateErrors.subfieldError('TODO:fixurl', errorMessage));
                        }
                    } else {
                        if (!found.hasOwnProperty(valTrimmed)) {
                            if (bundle == null) {
                                bundle = ResourceBundleFactory.getBundle(__BUNDLE_NAME);
                            }
                            errorMessage = ResourceBundle.getStringFormat(bundle, "check.ref.missing.subfield", i + 1, fieldsWithSubfieldDanishaa[0].name, valTrimmed);
                            ret.push(ValidateErrors.subfieldError('TODO:fixurl', errorMessage));
                        }
                    }
                });
            }
            return ret;
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield.__checkSubFieldValues");
        }
    }

    // helper function that returns the value from the backslash part
    function __getValueFromForwardSlash(subfieldValue) {
        Log.trace("Enter --- CheckReference.validateSubfield.__getValueFromForwardSlash");
        try {
            var value = {
                'containsValidValue': false
            };
            var indexOfParenthesis = subfieldValue.indexOf("(");
            if (subfieldValue.indexOf("/") !== -1) {
                value.containsValidValue = true;
                if (indexOfParenthesis !== -1) {
                    value.value = subfieldValue.slice(subfieldValue.indexOf("/") + 1, indexOfParenthesis);
                } else {
                    value.value = subfieldValue.slice(subfieldValue.indexOf("/") + 1);
                }
            }
            return (value);
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield.__getValueFromForwardSlash");
        }
    }

    // function that checks wheter an paranthesis is present
    // if it is , an array of the values in the paranthesis is returned.
    // if not an empty array will be returned
    function __getValuesToCheckFromparenthesis(subfieldValue) {
        Log.trace("Enter --- CheckReference.validateSubfield.__getValuesToCheckFromparenthesis");
        try {
            var indexStartParenthesis = subfieldValue.indexOf("(");
            var ret = [];
            if (indexStartParenthesis !== -1) {
                ret = subfieldValue.slice(indexStartParenthesis + 1, subfieldValue.lastIndexOf(')')).split(',');
            }
            return ret;
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield.__getValuesToCheckFromparenthesis");
        }
    }


    // helper function to count number of specific subfield occurrences
    function __countSubfieldOccurrences(field, subfieldName) {
        Log.trace("Enter --- CheckReference.validateSubfield.__countSubfieldOccurrences");
        try {
            var ret = 0;
            for (var i = 0; i < field.subfields.length; ++i) {
                if (field.subfields[i].name === subfieldName) {
                    ret++;
                }
            }
            return ret;
        } finally {
            Log.trace("Exit --- CheckReference.validateSubfield.__countSubfieldOccurrences");
        }
    }

    return {
        'validateSubfield': validateSubfield,
        '__BUNDLE_NAME': __BUNDLE_NAME
    }
}();
