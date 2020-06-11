use("Locale");
use("Log");
use("ResourceBundle");

EXPORTED_SYMBOLS = ['ResourceBundleFactory'];

var ResourceBundleFactory = function () {
    var DEFAULT_LOCALE = Locale.DANISH;
    var resourcePaths = [];

    // Cache over loaded bundle. Name --> Bundle
    var bundles = {};

    function init(settings) {
        var start = new Date().getTime();
        if (resourcePaths.length === 0) {
            var pathFormat = "%s/distributions/%s/resources";
            setResourcePaths([
                StringUtil.sprintf(pathFormat, settings.get('javascript.basedir'), "common")
            ]);
        }
        Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.ResourceBundleFactory.init]');
    }

    function getBundle(bundleName) {
        return __getBundleByLocale(bundleName, DEFAULT_LOCALE);
    }

    function __getBundleByLocale(bundleName, locale) {
        Log.trace("Enter - ResourceBundleFactory.getBundleByLocale");
        var start = new Date().getTime();
        var result = null;
        try {
            var filename = __calcResourceFilename(bundleName, locale);
            if (bundles[filename] !== undefined) {
                return bundles[filename];
            }

            for (var i in resourcePaths) {
                var path = resourcePaths[i];

                var props = __loadResourceBundle(path, filename);
                if (props !== null) {
                    result = ResourceBundle.createWithProperties(locale, props);
                    bundles[filename] = result;
                    return result;
                }
            }
            throw StringUtil.sprintf("Unable to load resource bundle %s for locale %s in paths %s", bundleName, Locale.toString(locale), resourcePaths);
        } finally {
            Log.trace("Exit - ResourceBundleFactory.getBundleByLocale(): ", result);
            Log.debug('start[' + start + '] time[' + (new Date().getTime() - start) + '] tag[js.ResourceBundleFactory.getBundleByLocale(' + bundleName + ')]');
        }
    }

    function setResourcePaths(paths) {
        resourcePaths = paths;
    }

    function __calcResourceFilename(bundleName, locale) {
        return StringUtil.sprintf('%s_%s.properties', bundleName, Locale.toString(locale))
    }

    function __loadResourceBundle(path, filename) {
        Log.trace("Enter - ResourceBundleFactory.__loadResourceBundle");
        var result = null;
        try {
            result = new Packages.java.util.Properties();
            var fis = new Packages.java.io.FileInputStream(path + "/" + filename);
            var reader = new Packages.java.io.InputStreamReader(fis, "UTF-8");
            Log.debug("Properties encoding: ", reader.getEncoding());
            result.load(reader);

            return result;
        } catch (ex) {
            Log.trace("Exception: ", ex);
            return null;
        } finally {
            Log.trace("Exit - ResourceBundleFactory.__loadResourceBundle(): ", result);
        }
    }

    return {
        'init': init,
        'setResourcePaths': setResourcePaths,
        'getBundle': getBundle
    }
}();
