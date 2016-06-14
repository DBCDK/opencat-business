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


StopWatch = function( tag, parentName ) {
    var Log4JStopWatch =Java.type("org.slf4j.profiler.Profiler");
    var ProfilerRegistry = Java.type("org.slf4j.profiler.ProfilerRegistry");

    this.profilerRegistry = ProfilerRegistry.getThreadContextInstance();


    if( tag !== undefined ) {
        this.watch = new Log4JStopWatch(tag);
    }
    else {
        this.watch = new Log4JStopWatch();
    }

    if( parentName ) {
        var tmp=this.profilerRegistry.get(parentName);
        if( tmp ) this.watch = tmp;
    }
};

/**
 *
 * @namespace StopWatch#lap
 */
StopWatch.prototype.lap = function( tag ) {
    this.watch.start( tag );
};

StopWatch.prototype.startNestet = function ( parentname ) {
    this.watch.registerWith( this.profilerRegistry );
    this.watch.startNested(parentname);
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
