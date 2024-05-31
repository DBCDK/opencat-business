package dk.dbc.opencat.rest;

import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.serviceutils.HowRU;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Stateless
@Path("/api")
public class StatusBean {

    @EJB
    ScripterPool scripterPool;

    private final static String OK_ENTITY = new HowRU().withStatus(200).toJson();
    private static final OpencatBusinessWarmup WARMUP = new OpencatBusinessWarmup();

    @GET
    @Path("status")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStatus() {
        if (scripterPool.isAllEnviromentsLoaded()) {
            return Response.ok().entity(OK_ENTITY).build();
        } else {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
    }

    @GET
    @Path("isready")
    @Produces(MediaType.TEXT_PLAIN)
    public Response isReady() {
        final boolean isReady = WARMUP.isReady();
        if (isReady) {
            return Response.ok(OK_ENTITY).build();
        } else {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
    }
}
