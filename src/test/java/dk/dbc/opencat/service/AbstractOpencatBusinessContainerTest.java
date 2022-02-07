package dk.dbc.opencat.service;

import dk.dbc.httpclient.HttpClient;
import dk.dbc.jsonb.JSONBContext;
import dk.dbc.marc.binding.MarcRecord;
import dk.dbc.marc.reader.MarcReaderException;
import dk.dbc.marc.reader.MarcXchangeV1Reader;
import dk.dbc.marc.writer.MarcXchangeV1Writer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;

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

public class AbstractOpencatBusinessContainerTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractOpencatBusinessContainerTest.class);
    static final String MIMETYPE_MARCXCHANGE = "text/marcxchange";
    static final String MIMETYPE_ENRICHMENT = " text/enrichment+marcxchange";

    private static final GenericContainer wiremockContainer;
    private static final GenericContainer recordServiceContainer;
    private static final GenericContainer rawrepoDbContainer;
    private static final GenericContainer holdingsItemsDbContainer;
    private static final GenericContainer openCatBusinessContainer;
    private static final String JAVA_BASE_IMAGE = "docker.dbc.dk/dbc-java8";
    private static final String RAWREPO_DB_IMAGE = "docker-io.dbc.dk/rawrepo-postgres-1.15-snapshot:DIT-5155";
    private static final String HOLDINGITEMS_DB_IMAGE = "docker-os.dbc.dk/holdings-items-postgres-1.1.4:latest";
    private static final String RECORD_SERVICE_IMAGE = "docker-io.dbc.dk/rawrepo-record-service:DIT-321";
    private static final String WIREMOCK_JAR = "wiremock-standalone-2.5.1.jar";

    private static final String RAWREPO_DB_BASE_URL;
    private static final String HOLDINGS_ITEMS_DB_URL;
    private static final String RECORD_SERVICE_BASE_URL;
    private static final String VIPCORE_ENDPOINT = "http://vipcore.iscrum-vip-extern-test.svc.cloud.dbc.dk";
    private static final String SOLR_URL = "http://solr:9090";
    private static final String OPENNUMBERROLL_URL = "http://opennumberroll:9090";

    static final String openCatBusinessBaseURL;

    static final HttpClient httpClient;
    static final JSONBContext JSONB_CONTEXT = new JSONBContext();

    static {
        final Network network = Network.newNetwork();

        wiremockContainer = new GenericContainer(JAVA_BASE_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("solr", "opennumberroll")
                .withClasspathResourceMapping(".", "currentWorkDir", BindMode.READ_ONLY)
                .withWorkingDirectory("/currentWorkDir")
                .withCommand(String.format("java -jar lib/%s --port 9090 --verbose", WIREMOCK_JAR))
                .withExposedPorts(9090)
                .withStartupTimeout(Duration.ofMinutes(1));
        wiremockContainer.start();

        rawrepoDbContainer = new GenericContainer(RAWREPO_DB_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("rawrepoDb")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("POSTGRES_DB", "rawrepo")
                .withEnv("POSTGRES_USER", "rawrepo")
                .withEnv("POSTGRES_PASSWORD", "rawrepo")
                .withExposedPorts(5432)
                .withStartupTimeout(Duration.ofMinutes(1));
        rawrepoDbContainer.start();
        RAWREPO_DB_BASE_URL = "rawrepo:rawrepo@rawrepoDb:5432/rawrepo";

        holdingsItemsDbContainer = new GenericContainer(HOLDINGITEMS_DB_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("holdingsItemsDb")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("POSTGRES_DB", "holdings")
                .withEnv("POSTGRES_USER", "holdings")
                .withEnv("POSTGRES_PASSWORD", "holdings")
                .withExposedPorts(5432)
                .withStartupTimeout(Duration.ofMinutes(1));
        holdingsItemsDbContainer.start();
        HOLDINGS_ITEMS_DB_URL = "holdings:holdings@holdingsItemsDb:5432/holdings";

        recordServiceContainer = new GenericContainer(RECORD_SERVICE_IMAGE)
                .withNetwork(network)
                .withNetworkAliases("recordservice")
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("INSTANCE", "it")
                .withEnv("LOG_FORMAT", "text")
                .withEnv("VIPCORE_ENDPOINT", VIPCORE_ENDPOINT)
                .withEnv("VIPCORE_CACHE_AGE", "0")
                .withEnv("RAWREPO_URL", RAWREPO_DB_BASE_URL)
                .withEnv("HOLDINGS_URL", HOLDINGS_ITEMS_DB_URL)
                .withEnv("DUMP_THREAD_COUNT", "8")
                .withEnv("DUMP_SLIZE_SIZE", "1000")
                .withEnv("JAVA_MAX_HEAP_SIZE", "2G")
                .withClasspathResourceMapping(".", "/currentdir", BindMode.READ_ONLY)
                .withExposedPorts(8080)
                .waitingFor(Wait.forHttp("/api/status"))
                .withStartupTimeout(Duration.ofMinutes(2));
        recordServiceContainer.start();
        RECORD_SERVICE_BASE_URL = "http://recordservice:8080";

        openCatBusinessContainer = new GenericContainer("docker-io.dbc.dk/opencat-business-service:devel")
                .withNetwork(network)
                .withLogConsumer(new Slf4jLogConsumer(LOGGER))
                .withEnv("LOG_FORMAT", "text")
                .withEnv("RAWREPO_RECORD_SERVICE_URL", RECORD_SERVICE_BASE_URL)
                .withEnv("VIPCORE_ENDPOINT", VIPCORE_ENDPOINT)
                .withEnv("SOLR_URL", SOLR_URL)
                .withEnv("JAVA_MAX_HEAP_SIZE", "2G")
                .withEnv("OPENNUMBERROLL_URL", OPENNUMBERROLL_URL)
                .withEnv("OPENNUMBERROLL_NAME_FAUST_8", "faust")
                .withEnv("OPENNUMBERROLL_NAME_FAUST", "faust")
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
        final List<String> tables = Arrays.asList("relations", "records", "records_archive", "queue", "jobdiag");

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

        try (PreparedStatement stmt = connection.prepareStatement(INSERT_SQL)) {
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
