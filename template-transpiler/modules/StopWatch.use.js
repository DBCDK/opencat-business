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
    var Log4JStopWatch =Java.type("org.slf4j.profiler.Profiler");

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
    this.watch.start( tag );
};

/**
 *
 * @namespace StopWatch#stop
 */
StopWatch.prototype.stop = function( ) {
    var res=this.watch.stop();
    Log.info("\n{}",res);
    return res;
};
