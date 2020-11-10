/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.opencat.javascript;

import dk.dbc.jslib.ClasspathSchemeHandler;
import dk.dbc.jslib.Environment;
import dk.dbc.jslib.FileSchemeHandler;
import dk.dbc.jslib.ModuleHandler;
import dk.dbc.jslib.SchemeURI;
import dk.dbc.opencat.ws.JNDIResources;
import org.perf4j.StopWatch;
import org.perf4j.log4j.Log4JStopWatch;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Properties;

/**
 * JavaScript engine factory to construct a new engine asynchronous.
 */
public class ScripterEnvironmentFactory {
    private static final XLogger logger = XLoggerFactory.getXLogger(ScripterEnvironmentFactory.class);
    private static final String ENTRYPOINTS_PATTERN_UPDATE = "%s/distributions/common/src/entrypoints/update/entrypoint.js";
    private static final String MODULES_PATH_PATTERN = "%s/distributions/common/src";


    /**
     * Constructs a new engine and adds is to the parsed pool.
     * <p>
     * All errors are written to the log.
     * </p>
     *
     * @param settings JNDI-settings required to construct the engine.
     * @return Future with a boolean value. <code>true</code> - the engine is created and added to the pool.
     * <code>false</code> - some error occurred.
     * @throws ScripterException on errors from JS.
     */
    public ScripterEnvironment newEnvironment(Properties settings, boolean doInitFunctions) throws Exception {
        logger.entry(settings);
        final StopWatch watch = new Log4JStopWatch("javascript.env.create");
        ScripterEnvironment result = null;
        try {
            final Environment environment = createEnvironment(settings);
            final ScripterEnvironment scripterEnvironment = new ScripterEnvironment(environment);
            initTemplates(scripterEnvironment, settings, doInitFunctions);

            return result = scripterEnvironment;
        } finally {
            watch.stop();
            logger.exit(result);
        }
    }

    private Environment createEnvironment(Properties settings) throws Exception {
        logger.entry();
        try {
            final String baseDir = settings.getProperty(JNDIResources.JAVASCRIPT_BASEDIR);
            final Environment environment = new Environment();
            environment.registerUseFunction(createModulesHandler(baseDir));
            environment.evalFile(String.format(ENTRYPOINTS_PATTERN_UPDATE, baseDir));
            return environment;
        } catch (Exception e) {
            logger.catching(e);
            throw e;
        } finally {
            logger.exit();
        }
    }

    private ModuleHandler createModulesHandler(String baseDir) {
        logger.entry();
        try {
            final ModuleHandler handler = new ModuleHandler();
            final String modulesDir;

            modulesDir = String.format(MODULES_PATH_PATTERN, baseDir);
            handler.registerHandler("file", new FileSchemeHandler(modulesDir));
            addSearchPathsFromSettingsFile(handler, "file", modulesDir);


            handler.registerHandler("classpath", new ClasspathSchemeHandler(this.getClass().getClassLoader()));
            addSearchPathsFromSettingsFile(handler, "classpath", getClass().getClassLoader().getResourceAsStream("jsmodules.settings"));
            return handler;
        } catch (IOException e) {
            logger.warn("Unable to load properties from resource 'jsmodules.settings'");
            logger.catching(e);
            return null;
        } finally {
            logger.exit();
        }
    }

    private void addSearchPathsFromSettingsFile(ModuleHandler handler, String schemeName, String modulesDir) {
        logger.entry(handler, schemeName, modulesDir);
        final String fileName = modulesDir + "/settings.properties";
        try {
            final File file = new File(fileName);
            try (FileInputStream fileInputStream = new FileInputStream(file)) {
                addSearchPathsFromSettingsFile(handler, schemeName, fileInputStream);
            }
        } catch (FileNotFoundException e1) {
            logger.catching(e1);
            logger.warn("The file '{}' does not exist.", fileName);
        } catch (IOException e2) {
            logger.catching(e2);
            logger.warn("Unable to load properties from file '{}'", fileName);
        } finally {
            logger.exit();
        }
    }

    private void addSearchPathsFromSettingsFile(ModuleHandler handler, String schemeName, InputStream is) throws IOException {
        logger.entry(handler, schemeName, is);
        try {
            final Properties props = new Properties();
            props.load(is);
            if (!props.containsKey("modules.search.path")) {
                logger.warn("Search path for modules is not specified");
                return;
            }
            final String moduleSearchPathString = props.getProperty("modules.search.path");
            if (moduleSearchPathString != null && !moduleSearchPathString.isEmpty()) {
                final String[] moduleSearchPath = moduleSearchPathString.split(";");
                for (String s : moduleSearchPath) {
                    handler.addSearchPath(new SchemeURI(schemeName + ":" + s));
                }
            }
        } finally {
            logger.exit();
        }
    }

    void initTemplates(ScripterEnvironment environment, Properties settings, boolean doInitFunctions) throws ScripterException {
        logger.entry();
        final StopWatch watch = new Log4JStopWatch("javascript.env.create.templates");
        try {
            environment.callMethod("initTemplates", settings);
            if (doInitFunctions) {
                initFunctions(environment, settings);
            }
        } finally {
            watch.stop();
            logger.exit();
        }
    }

    /*
        Warm up function. Not currently used as it requires a working openagency.
        Should be used by kubernetes readiness check in the future.
     */
    void initFunctions(ScripterEnvironment environment, Properties settings) throws ScripterException {
        logger.entry();
        final StopWatch watch = new Log4JStopWatch("javascript.env.init.functions");
        try {
            final URL commonRecord = ScripterEnvironmentFactory.class.getResource("/warmup/commonRecord.json");
            final String COMMON_RECORD = new String(Files.readAllBytes(new File(commonRecord.toURI()).toPath()), StandardCharsets.UTF_8);

            validateRecord(environment, COMMON_RECORD, settings);
            checkDoubleRecordFrontend(environment, COMMON_RECORD, settings);
            checkTemplate(environment, settings);
            doRecategorizationThings(environment, COMMON_RECORD);
            recategorizationNoteFieldFactory(environment, COMMON_RECORD);
            checkTemplateBuild(environment, settings);
            sortRecord(environment, COMMON_RECORD);
            getValidateSchemas(environment);
        } catch (URISyntaxException | IOException e) {
            throw new ScripterException("Failed to initialize environment");
        } finally {
            watch.stop();
            logger.exit();
        }
    }

    private void validateRecord(ScripterEnvironment scripterEnvironment, String record, Properties settings) throws ScripterException {
        scripterEnvironment.callMethod("validateRecord",
                "dbc",
                record,
                settings);
    }

    private void checkDoubleRecordFrontend(ScripterEnvironment scripterEnvironment, String record, Properties settings) throws ScripterException {
        scripterEnvironment.callMethod("checkDoubleRecordFrontend",
                record,
                settings);
    }

    private void checkTemplate(ScripterEnvironment scripterEnvironment, Properties settings) throws ScripterException {
        scripterEnvironment.callMethod("checkTemplate",
                "paahaengspost",
                "300151",
                "fbslokal",
                settings);
    }

    private void doRecategorizationThings(ScripterEnvironment scripterEnvironment, String record) throws ScripterException {
        scripterEnvironment.callMethod("doRecategorizationThings",
                record,
                record,
                record);
    }

    private void recategorizationNoteFieldFactory(ScripterEnvironment scripterEnvironment, String record) throws ScripterException {
        scripterEnvironment.callMethod("recategorizationNoteFieldFactory",
                record);
    }

    private void checkTemplateBuild(ScripterEnvironment scripterEnvironment, Properties settings) throws ScripterException {
        scripterEnvironment.callMethod("checkTemplateBuild", "allowall", settings);
    }

    private void sortRecord(ScripterEnvironment scripterEnvironment, String record) throws ScripterException {
        scripterEnvironment.callMethod("sortRecord",
                "bogbind",
                record);
    }

    private void getValidateSchemas(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("getValidateSchemas",
                "dbc",
                new HashSet<>(Arrays.asList("RecordRules.conflictingFields", "RecordRules.conflictingSubfields", "auth_root")));
    }
}
