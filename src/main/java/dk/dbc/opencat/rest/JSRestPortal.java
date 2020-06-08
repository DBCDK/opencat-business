package dk.dbc.opencat.rest;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.opencat.javascript.ScripterEnvironment;
import dk.dbc.opencat.javascript.ScripterException;
import dk.dbc.opencat.javascript.ScripterPool;
import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.opencatbusiness.dto.ValidateRecordRequestDTO;
import dk.dbc.updateservice.dto.MessageEntryDTO;
import dk.dbc.util.Timed;
import java.util.Properties;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
@Path("/api")
public class JSRestPortal {
    private static final Logger LOGGER = LoggerFactory.getLogger(JSRestPortal.class);
    private final Properties settings = JNDIResources.getProperties();
    private static final JSONBContext jsonbContext = new JSONBContext();


    @POST
    @Path("v1/validateRecord")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public String validateRecord(ValidateRecordRequestDTO validateRecordRequestDTO) throws InterruptedException, ScripterException, JSONBException {
        ScripterPool scripterPool = new ScripterPool();
        ScripterEnvironment scripterEnvironment = null;
        String result;
        try {
            scripterEnvironment = scripterPool.take();
            result = (String) scripterEnvironment.callMethod("validateRecord",
                    validateRecordRequestDTO.getTemplateName(),
                    validateRecordRequestDTO.getRecord(),
                    settings);
        }
        finally {
            scripterPool.put(scripterEnvironment);
        }
        MessageEntryDTO messageEntryDTO = new MessageEntryDTO();
        String messString = jsonbContext.marshall(messageEntryDTO);
        LOGGER.info("Tester:{}", jsonbContext.unmarshall(messString, MessageEntryDTO.class));
        return result;
    }
}
