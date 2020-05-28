package dk.dbc.opencat.rest;

import dk.dbc.common.records.MarcRecord;
import dk.dbc.dataio.jsonb.JSONBContext;
import dk.dbc.dataio.jsonb.JSONBException;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.util.Timed;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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

@Stateless
@Path("/api")
public class JSRestPortal {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);
    private final Properties settings = JNDIResources.getProperties();

    @EJB
    ScripterPool scripterPool;

    @POST
    @Path("v1/validateRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Object validateRecord(String[] callParams) throws InterruptedException, ScripterException {
        ScripterEnvironment scripterEnvironment = null;
        List<Object> parms = new ArrayList<Object>(Arrays.asList(callParams));
        parms.add(settings);
        Object result;
        try {
            scripterEnvironment = scripterPool.take();
            result = scripterEnvironment.callMethod("validateRecord", parms.toArray());
        }
        finally {
            scripterPool.put(scripterEnvironment);
        }
        return result;
    }
}
