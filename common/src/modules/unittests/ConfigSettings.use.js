/** @file Example configuration file for the Config module */

// This file is the configuration file for various JavaScript modules in 
// iscrum-javascript.

// You should change configuration in this file
// You can remove sections for modules you do not use, but you may 
// have to fix the async/sync methods in Config.use.js if you remove e.g. Z3950.

// The configuration is used through the Config module, so any javascript that
// needs access to these values, should use("Config");

// In other words: This module should never be use'd directly in a javascript
EXPORTED_SYMBOLS = ['ConfigSettings'];

// If you add new configuration parameters, remember to test the
// availability of them from the module.

/**
 * Example config settings.
 *
 * This is an example on how to use the Config and ConfigSettings module. 
 * Please consult the source code to get the details.
 *
 * @name ConfigSettings
 * @namespace */
var ConfigSettings = {

    // Http module
    Http : {
        // The proxyhost is the host used for http(s) proxying. Leave as "" for no proxying
        proxyhost : undefined,
        // The port of the proxyhost. Must be set, if proxyhost != ""
        proxyport : undefined,
        // Custom client certificate (path to file) for https requests. Leave as "" to use system default.
        // If given a path, will use the first certificate in the file.
        certificate : "",
        // Key for certificate (path to file). Must be provided if certificate != ""
        key : ""
    }

};
