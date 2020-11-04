/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

/**
 * EJB to send a mail has part of the double record checkings.
 */
@Stateless
public class DoubleRecordMailService {
    private final static XLogger LOGGER = XLoggerFactory.getXLogger(DoubleRecordMailService.class);

    private final static String MAIL_HOST_PROPERTY = "mail.smtp.host";
    private final static String MAIL_PORT_PROPERTY = "mail.smtp.port";
    private final static String MAIL_USER_PROPERTY = "mail.user";
    private final static String MAIL_PASSWORD_PROPERTY = "mail.password";

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_HOST")
    private String DOUBLE_RECORD_MAIL_HOST;

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_PORT")
    private String DOUBLE_RECORD_MAIL_PORT;

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_USER")
    private String DOUBLE_RECORD_MAIL_USER;

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_PASSWORD")
    private String DOUBLE_RECORD_MAIL_PASSWORD;

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_FROM")
    private String DOUBLE_RECORD_MAIL_FROM;

    @Inject
    @ConfigProperty(name = "DOUBLE_RECORD_MAIL_RECIPIENT")
    private String DOUBLE_RECORD_MAIL_RECIPIENT;

    @Inject
    @ConfigProperty(name = "INSTANCE_NAME", defaultValue = "Update")
    private String INSTANCE_NAME;

    /**
     * Send the actual mail message.
     * <p>
     * The body is formatted as plan text so any HTML tags will have
     * no effect.
     * </p>
     * <p>
     * Any exceptions is eaten and send to the log files.
     * </p>
     *
     * @param subject Subject of the mail.
     * @param body    Body of the message.
     */
    public void sendMessage(String subject, String body) {
        LOGGER.entry(subject, body);
        StopWatch watch = new Log4JStopWatch("service.mail");
        try {
            final String adjustedSubject = INSTANCE_NAME + ": " + subject;

            // Setup Mail server properties
            final Properties properties = System.getProperties();
            properties.setProperty(MAIL_HOST_PROPERTY, DOUBLE_RECORD_MAIL_HOST);
            properties.setProperty(MAIL_PORT_PROPERTY, DOUBLE_RECORD_MAIL_PORT);
            properties.setProperty(MAIL_USER_PROPERTY, DOUBLE_RECORD_MAIL_USER);
            properties.setProperty(MAIL_PASSWORD_PROPERTY, DOUBLE_RECORD_MAIL_PASSWORD);

            final Session session = Session.getInstance(properties);
            try {
                final String mimeBody = String.format("From: %s\r\n"
                        + "To: %s\r\n"
                        + "Subject: %s\r\n"
                        + "\r\n"
                        + "%s", DOUBLE_RECORD_MAIL_FROM, DOUBLE_RECORD_MAIL_RECIPIENT, adjustedSubject, body);

                final MimeMessage message = new MimeMessage(session, new ByteArrayInputStream(mimeBody.getBytes(StandardCharsets.UTF_8)));
                Transport.send(message);
                LOGGER.info("DoubleRecordMailService: Sent message with subject '{}' successfully.", adjustedSubject);
            } catch (MessagingException ex) {
                LOGGER.warn("DoubleRecordMailService: Unable to send mail message to {}: {}", DOUBLE_RECORD_MAIL_RECIPIENT, ex.getMessage());
                LOGGER.warn("Mail message: {}\n{}", adjustedSubject, body);
                LOGGER.error("Mail service error");
                LOGGER.catching(XLogger.Level.ERROR, ex);
            }
        } finally {
            watch.stop();
            LOGGER.exit();
        }
    }

}
