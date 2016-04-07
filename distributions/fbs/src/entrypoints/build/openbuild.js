use( "Builder" );
use( "Log" );
use( "Print" );
use( "TemplateContainer" );
use( "WebserviceUtil" );

/**
 * Gets the names of the templates as an Array
 *
 * @return {JSON} A json with the names of the templates. The names is returned
 *                as an Array.
 */
function getBuildSchemas() {
    return JSON.stringify( TemplateContainer.getTemplateNames() );
}

function checkTemplate( name, settings ) {
    var result;
    try {
        ResourceBundleFactory.init( settings );
        TemplateContainer.setSettings( settings );
        result = TemplateContainer.getUnoptimized( name ) !== undefined;
    } catch ( exception ) {
        // It is ok for the TemplateContainer.get to trow, it means that the
        // template does not exist and we can then return false.
        result = false;
    }
    return result;
}

function buildRecord( templateName, record, settings ) {
    var result;
    var templateProvider = function() {
        ResourceBundleFactory.init( settings );
        TemplateContainer.setSettings( settings );
        return TemplateContainer.getUnoptimized( templateName );
    };
    var faustProvider = function() {
        WebserviceUtil.init( settings );
        return WebserviceUtil.getNewFaustNumberFromOpenNumberRoll();
    };
    if ( record === undefined || record === null ) {
        Log.debug("new record");
        // new record
        result = Builder.buildRecord( templateProvider, faustProvider );
    } else {
        Log.debug("convert record");
        // convert record
        var rec = JSON.parse( record );
        result = Builder.convertRecord( templateProvider, rec, faustProvider );
    }
    return JSON.stringify( result );
}
