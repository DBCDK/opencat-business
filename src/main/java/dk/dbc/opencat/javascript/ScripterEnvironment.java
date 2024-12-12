/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import dk.dbc.jslib.Environment;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 * Implements a scripter environment that holds an JavaScript engine to execute
 * functions on it.
 */
public class ScripterEnvironment {
    private static final XLogger logger = XLoggerFactory.getXLogger(ScripterEnvironment.class);
    private Environment environment;

    public ScripterEnvironment(Environment environment) {
        this.environment = environment;
    }

    /**
     * Calls a function in a JavaScript environment and returns the result.
     * The JavaScript environment is created and cached by the filename.
     *
     * @param methodName Name of the function to call.
     * @param args       Arguments to the function.
     * @return The result of the JavaScript function.
     * @throws ScripterException Encapsulate any exception from Rhino or is throwned
     *                           in case of an error. For instance if the file can not be loaded.
     */
    public Object callMethod(String methodName, Object... args) throws ScripterException {
        logger.entry(methodName, args);
        Object result = null;
        try {
            StopWatch watch = new Log4JStopWatch();

            result = environment.callMethod(methodName, args);
            watch.stop("javascript.method." + methodName);
            return result;
        } catch (Exception ex) {
            logger.catching(ex);
            throw new ScripterException(ex.getMessage(), ex);
        } finally {
            logger.exit(result);
        }
    }
}
