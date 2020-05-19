package dk.dbc.opencat.dk.rest;

import dk.dbc.util.Timed;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/api")
public class JSRestPortal {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);

    @POST
    @Path("v1/{methodName}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public String callJSMethod(@PathParam("methodName") String methodName,String callParams) {
        LOGGER.info("JS method to call:{}", methodName);
        LOGGER.info("Incoming params: {}", callParams);
        return "{}";
    }
}
