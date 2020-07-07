/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.rest;

import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.serviceutils.HowRU;
import dk.dbc.serviceutils.ServiceStatus;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/api")
public class StatusBean implements ServiceStatus {
    private static final Logger LOGGER = LoggerFactory.getLogger(StatusBean.class);

    @EJB
    ScripterPool scripterPool;

    String OK_ENTITY = (new HowRU()).withStatus(200).toJson();

    @GET
    @Path("status")
    @Produces({"application/json"})
    public Response getStatus() {
        boolean isReady = false;
        try {
            isReady = scripterPool.isAllEnviromentsLoaded();
            if (isReady) {
                return Response.ok().entity(OK_ENTITY).build();
            }
        } finally {
            LOGGER.info("StatusBean: {}", isReady);
        }
        return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
    }
}
