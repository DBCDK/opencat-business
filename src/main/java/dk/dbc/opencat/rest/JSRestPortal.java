package dk.dbc.opencat.rest;

import dk.dbc.dataio.jsonb.JSONBException;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.util.Timed;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import dk.dbc.dataio.jsonb.JSONBContext;

@Stateless
@Path("/api")
public class JSRestPortal {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);
    private Properties settings = JNDIResources.getProperties();
    private static JSONBContext jsonbContext = new JSONBContext();

    @EJB
    ScripterPool scripterPool;

    @POST
    @Path("v1/{methodName}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public String callJSMethod(@PathParam("methodName") String methodName,String[] callParams) throws InterruptedException, ScripterException, JSONBException {
        LOGGER.info("JS method to call:{}", methodName);
        LOGGER.info("Incoming params: {}", String.join(",",callParams));
        ScripterEnvironment scripterEnvironment = null;
        Object result;
        final List<Object> params = new ArrayList<>();
        for (String callParam: callParams) {
            if ("__settings".equals(callParam)) {
                params.add(JNDIResources.getProperties());
            }
            else {
                params.add(callParam);
            }
        }
        LOGGER.info("Rewritten parms: {}", params);
        try {
            scripterEnvironment = scripterPool.take();
            result = scripterEnvironment.callMethod(methodName, params.toArray());
        }
        finally {
            scripterPool.put(scripterEnvironment);
        }
        return jsonbContext.marshall(result);
    }
}
