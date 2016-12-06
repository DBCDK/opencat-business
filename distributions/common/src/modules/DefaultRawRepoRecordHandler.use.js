use("Log");
use("Marc");
use("RecordUtil");

EXPORTED_SYMBOLS = ['DefaultRawRepoRecordHandler'];

var DefaultRawRepoRecordHandler = function () {
    function create(authModule) {
        return {
            authenticator: authModule
        }
    }

    return {
        'create': create
    }
}();
