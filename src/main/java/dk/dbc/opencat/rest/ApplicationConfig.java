package dk.dbc.opencat.rest;

import jakarta.ws.rs.core.Application;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@jakarta.ws.rs.ApplicationPath("")
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
