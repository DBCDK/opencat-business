/**
 * @file Module to integrate Perf4j StopWatch into JavaScript.
 */
EXPORTED_SYMBOLS = ['StopWatch'];

//-----------------------------------------------------------------------------
use( "Log" );

//-----------------------------------------------------------------------------
/**
 *
 * @namespace StopWatch
 */
StopWatch = function( tag ) {
    var Log4JStopWatch = Packages.org.perf4j.log4j.Log4JStopWatch;

    if( tag !== undefined ) {
        this.watch = new Log4JStopWatch(tag);
    }
    else {
        this.watch = new Log4JStopWatch();
    }
};

/**
 *
 * @namespace StopWatch#lap
 */
StopWatch.prototype.lap = function( tag ) {
    this.watch.lap( tag );
};

/**
 *
 * @namespace StopWatch#stop
 */
StopWatch.prototype.stop = function( tag ) {
    if( tag !== undefined ) {
        this.watch.stop( tag );
    }
    else {
        this.watch.stop();
    }
};
