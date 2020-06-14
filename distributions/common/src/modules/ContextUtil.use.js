use("Log");

EXPORTED_SYMBOLS = ['ContextUtil'];

var ContextUtil = function () {
    var __BUNDLE_NAME = "validation";

    function getValue(context) {
        // This function take an arbitrary list of arguments.
        // Java equivalent would be getValue(HashMap state, String... arguments)
        // Loop over them but ignore the first element as that is the dict to look in
        var tmp = context;
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (tmp[arg] === undefined) {
                var argsList = Array.prototype.slice.call(arguments, 1);
                Log.debug("Cache miss on context." + argsList.join('.'));
                return undefined;
            } else {
                tmp = tmp[arg];
            }
        }

        return tmp;
    }

    function setValue(context, value) {
        if (arguments.length < 3) {
            throw "setValue must be called with at least 3 arguments (context, value, keys...)"
        }
        var tmp = context;
        for (var i = 2; i < arguments.length; i++) {
            var arg = arguments[i];
            if (i < arguments.length - 1) {
                if (tmp[arg] === undefined) {
                    tmp[arg] = {};
                }
            } else {
                tmp[arg] = value;
            }
            tmp = tmp[arg];
        }
    }

    return {
        'BUNDLE_NAME': __BUNDLE_NAME,
        'getValue': getValue,
        'setValue': setValue
    };

}
();