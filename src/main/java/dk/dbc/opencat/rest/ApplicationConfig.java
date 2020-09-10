/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.rest;

import javax.ws.rs.core.Application;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@javax.ws.rs.ApplicationPath("")
public class ApplicationConfig extends Application {
    private static final Set<Class<?>> classes = new HashSet<>(
            Arrays.asList(
                    JSRestPortal.class,
                    TransformationService.class,
                    StatusBean.class)
    );

    @Override
    public Set<Class<?>> getClasses() {
        return classes;
    }
}