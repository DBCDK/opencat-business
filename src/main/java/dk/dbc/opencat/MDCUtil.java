/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat;

import java.util.UUID;

public class MDCUtil {
    private static final String TRACKING_ID_FORMAT = "%s-%s";

    public static final String MDC_TRACKING_ID_LOG_CONTEXT = "trackingId";

    public static String getTrackingId(String trackingId, String functionName) {
        if (trackingId != null && !trackingId.isEmpty()) {
            return String.format(TRACKING_ID_FORMAT, trackingId, functionName);
        } else {
            return String.format(TRACKING_ID_FORMAT, UUID.randomUUID(), functionName);
        }
    }
}
