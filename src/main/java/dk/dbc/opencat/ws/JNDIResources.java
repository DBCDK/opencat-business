/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.ws;

import java.util.Properties;

/**
 * Contains public accessible contents of all the JNDI resources, that is used
 * be all application.
 * <p>
 * This also includes keys from Properties resources.
 */
public class JNDIResources {
    public static final String JAVASCRIPT_BASEDIR = "JAVASCRIPT_BASEDIR";
    public static final String JAVASCRIPT_POOL_SIZE = "JAVASCRIPT_POOL_SIZE";

    public static Properties getProperties() {
        Properties properties = new Properties();

        for (String key : System.getenv().keySet()) {
            properties.setProperty(key, System.getenv(key));
        }

        properties.setProperty("javascript.basedir", System.getenv("JAVASCRIPT_BASEDIR"));

        return properties;
    }
}
