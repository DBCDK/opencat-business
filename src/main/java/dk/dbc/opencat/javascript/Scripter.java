/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ejb.EJB;
import javax.ejb.Stateless;

/**
 * Scripter EJB to execute a JavaScript function and returns the result from
 * the engine.
 */
@Stateless
public class Scripter {
    private static final XLogger logger = XLoggerFactory.getXLogger(Scripter.class);

    @SuppressWarnings("EjbEnvironmentInspection")
    @EJB
    private ScripterPool pool;

    /**
     * Calls a function in a JavaScript environment and returns the result.
     * <p>
     * A JavaScript engine is obtained from the singleton ScripterPool. After
     * execution it is returned to the pool. We want for an engine to be
     * available if the pool is empty.
     * <p>
     * The engine is always returned to the pool, even in case of JavaScript
     * exceptions.
     *
     * @param methodName Name of the function to call.
     * @param args       Arguments to the function.
     * @return The result of the JavaScript function.
     * @throws ScripterException Encapsulate any exception from the JavaScript engine or
     *                           is throwned in case of an error.
     */
    public Object callMethod(String methodName, Object... args) throws ScripterException {
        logger.entry(methodName, args);

        Object result = null;
        ScripterEnvironment environment = null;
        try {
            environment = pool.take();

            logger.debug("Call function: '{}'", methodName);
            result = environment.callMethod(methodName, args);

            return result;
        } catch (Exception ex) {
            logger.error("message : " + ex.getMessage());
            logger.error(String.valueOf(ex));
            logger.catching(ex);
            ex.printStackTrace();
            throw new ScripterException(ex.getMessage(), ex);
        } finally {
            try {
                // 'environment' will be null if we where unable to take it from the scripter pool.
                // If that is the case we do not want to put null back into the pool.
                if (environment != null) {
                    logger.debug("Put scripter environment back to the pool");
                    pool.put(environment);
                }
            } catch (InterruptedException ex) {
                logger.error("message : " + ex.getMessage());
                ex.printStackTrace();
                throw new ScripterException(ex.getMessage(), ex);
            }

            logger.exit(result);
        }
    }
}
