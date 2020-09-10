/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

/**
 * Created by stp on 03/12/14.
 */
public class ScripterException extends Exception {
    public ScripterException(String format, Object... args) {
        super(String.format(format, args));
    }

    public ScripterException(String message, Throwable cause) {
        super(message, cause);
    }
}
