package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpClient;
import dk.dbc.jsonb.JSONBContext;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.marc.reader.MarcXchangeV1Reader;
import dk.dbc.marc.writer.MarcXchangeV1Writer;
import dk.dbc.openagency.client.OpenAgencyServiceFromURL;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;

public class AbstractOpencatBusinessContainerTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractOpencatBusinessContainerTest.class);
    static final String MIMETYPE_MARCXCHANGE = "text/marcxchange";
    static final String MIMETYPE_ENRICHMENT = " text/enrichment+marcxchange";

    private static final GenericContainer wiremockSolrServiceContainer;
    private static final GenericContainer recordServiceContainer;
    private static final GenericContainer rawrepoDbContainer;
    private static final GenericContainer holdingsItemsDbContainer;
    private static final GenericContainer openCatBusinessContainer;
    private static final String JAVA_BASE_IMAGE = "docker.dbc.dk/dbc-java8";
    private static final String RAWREPODB_IMAGE = "docker-io.dbc.dk/rawrepo-postgres-1.13-snapshot:DIT-5016";
    private static final String HOLDINGITEMSDB_IMAGE = "docker-os.dbc.dk/holdings-items-postgres-1.1.4:latest";
    private static final String RECORDSERVICE_IMAGE = "docker-io.dbc.dk/rawrepo-record-service:DIT-238";
    private static final String WIREMOCK_JAR = "wiremock-standalone-2.5.1.jar";

    private static final OpenAgencyServiceFromURL openAgency;

    private static final String rawrepoDbBaseUrl;
    private static final String holdingsItemsDbUrl;
    private static final String recordServiceBaseUrl;
    private static final String openAgencyURL = "http://openagency.addi.dk/2.34/";
    private static final String forsrightsURL = "http://forsrights.addi.dk/2.0/";
    private  static final String solrURL = "http://solr:9090";

    static final String openCatBusinessBaseURL;


    static final HttpClient httpClient;
    static final JSONBContext JSONB_CONTEXT = new JSONBContext();


    static {
        openAgency = OpenAgencyServiceFromURL.builder().build("http://openagency.addi.dk/2.34/");

        Network network = Network.newNetwork();

        wiremockSolrServiceContainer = new GenericContainer(JAVA_BASE_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("solr")
                .withClasspathResourceMapping(".", "currentWorkDir", BindMode.READ_ONLY)
                .withWorkingDirectory("/currentWorkDir")
                .withCommand(String.format("java -jar lib/%s --port 9090 --verbose", WIREMOCK_JAR))
                .withExposedPorts(9090)
                .withStartupTimeout(Duration.ofMinutes(1));
        wiremockSolrServiceContainer.start();

        rawrepoDbContainer = new GenericContainer(RAWREPODB_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("rawrepoDb")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("POSTGRES_DB", "rawrepo")
                .withEnv("POSTGRES_USER", "rawrepo")
                .withEnv("POSTGRES_PASSWORD", "rawrepo")
                .withExposedPorts(5432)
                .withStartupTimeout(Duration.ofMinutes(1));
        rawrepoDbContainer.start();
        rawrepoDbBaseUrl = "rawrepo:rawrepo@rawrepoDb:5432/rawrepo";

        holdingsItemsDbContainer = new GenericContainer(HOLDINGITEMSDB_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("holdingsItemsDb")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("POSTGRES_DB", "holdings")
                .withEnv("POSTGRES_USER", "holdings")
                .withEnv("POSTGRES_PASSWORD", "holdings")
                .withExposedPorts(5432)
                .withStartupTimeout(Duration.ofMinutes(1));
        holdingsItemsDbContainer.start();
        holdingsItemsDbUrl = "holdings:holdings@holdingsItemsDb:5432/holdings";

        recordServiceContainer = new GenericContainer(RECORDSERVICE_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("recordservice")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("INSTANCE", "it")
                .withEnv("LOG_FORMAT", "text")
                .withEnv("OPENAGENCY_CACHE_AGE", "0")
                .withEnv("OPENAGENCY_URL", openAgencyURL)
                .withEnv("RAWREPO_URL", rawrepoDbBaseUrl)
                .withEnv("HOLDINGS_URL", holdingsItemsDbUrl)
                .withEnv("DUMP_THREAD_COUNT", "8")
                .withEnv("DUMP_SLIZE_SIZE", "1000")
                .withEnv("JAVA_MAX_HEAP_SIZE", "2G")
                .withClasspathResourceMapping(".", "/currentdir", BindMode.READ_ONLY)
                .withExposedPorts(8080)
                .waitingFor(Wait.forHttp("/api/status"))
                .withStartupTimeout(Duration.ofMinutes(2));
        recordServiceContainer.start();
        recordServiceBaseUrl = "http://recordservice:8080";

        openCatBusinessContainer = new GenericContainer("docker-io.dbc.dk/opencatbusiness:devel")
                .withNetwork(network)
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("LOG_FORMAT", "text")
                .withEnv("RAWREPO_RECORD_SERVICE_URL", recordServiceBaseUrl)
                .withEnv("OPENAGENCY_URL", openAgencyURL)
                .withEnv("SOLR_URL", solrURL)
                .withEnv("FORSRIGHTS_URL", forsrightsURL)
                .withEnv("JAVA_MAX_HEAP_SIZE", "2G")
                .withExposedPorts(8080)
                .waitingFor(Wait.forHttp("/api/status"))
                .withStartupTimeout(Duration.ofMinutes(2));
        openCatBusinessContainer.start();
        openCatBusinessBaseURL = "http://" + openCatBusinessContainer.getContainerIpAddress() +
                ":" + openCatBusinessContainer.getMappedPort(8080);

        httpClient = HttpClient.create(HttpClient.newClient());

    }

    static Connection connectToRawrepoDb() {
        try {
            Class.forName("org.postgresql.Driver");
            final String dbUrl = String.format("jdbc:postgresql://localhost:%s/rawrepo", rawrepoDbContainer.getMappedPort(5432));
            final Connection connection = DriverManager.getConnection(dbUrl, "rawrepo", "rawrepo");
            connection.setAutoCommit(true);

            return connection;
        } catch (ClassNotFoundException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    static void resetRawrepoDb(Connection connection) throws Exception {
        final List<String> tables = Arrays.asList("relations", "records", "records_cache", "records_archive", "queue", "jobdiag");

        PreparedStatement stmt;

        for (String table : tables) {
            stmt = connection.prepareStatement("TRUNCATE " + table + " CASCADE");
            stmt.execute();
        }
    }

    static void saveRecord(Connection connection, String fileName, String mimeType) throws Exception {
        final String INSERT_SQL = "insert into records(bibliographicrecordid, agencyid, " +
                "deleted, mimetype, content, created, modified, trackingid) " +
                "values (?, ?, ?, ?, ?, now(), now(), ?)";

        final MarcXchangeV1Writer writer = new MarcXchangeV1Writer();

        final MarcRecord marcRecord = getMarcRecordFromFile(fileName);

        final String bibliographicRecordId = marcRecord.getSubFieldValue("001", 'a').get();
        final int agencyId = Integer.parseInt(marcRecord.getSubFieldValue("001", 'b').get());
        final boolean deleted = "d".equalsIgnoreCase(marcRecord.getSubFieldValue("004", 'r').get());
        final byte[] content = writer.write(marcRecord, StandardCharsets.UTF_8);
        final String trackingId = String.format("%d:%s", agencyId, bibliographicRecordId);

        try(PreparedStatement stmt = connection.prepareStatement(INSERT_SQL)) {
            stmt.setString(1, bibliographicRecordId);
            stmt.setInt(2, agencyId);
            stmt.setBoolean(3, deleted);
            stmt.setString(4, mimeType);
            stmt.setString(5, Base64.getEncoder().encodeToString(content));
            stmt.setString(6, trackingId);
            stmt.execute();
        }
    }

    static MarcRecord getMarcRecordFromFile(String fileName) throws MarcReaderException {
        final InputStream inputStream = AbstractOpencatBusinessContainerTest.class.getResourceAsStream(fileName);
        final BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
        final MarcXchangeV1Reader reader = new MarcXchangeV1Reader(bufferedInputStream, StandardCharsets.UTF_8);

        return reader.read();
    }
}
