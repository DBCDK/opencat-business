package dk.dbc.opencat.javascript;

import dk.dbc.opencat.ws.JNDIResources;
import dk.dbc.util.Timed;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScripterEnvironmentWarmUp {
    private static final Logger LOGGER = LoggerFactory.getLogger(ScripterEnvironmentWarmUp.class);
    private final Properties settings = JNDIResources.getProperties();

    @Timed
    public void warm(ScripterEnvironment scripterEnvironment, int id) throws ScripterException {
        LOGGER.info("Warming environment {}", id);
        validateRecord(scripterEnvironment);
        checkDoubleRecordFrontend(scripterEnvironment);
        checkTemplate(scripterEnvironment);
        doRecategorizationThings(scripterEnvironment);
        recategorizationNoteFieldFactory(scripterEnvironment);
        checkTemplateBuild(scripterEnvironment);
        buildRecord(scripterEnvironment);
        sortRecord(scripterEnvironment);
        getValidateSchemas(scripterEnvironment);
    }

    private void validateRecord(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("validateRecord",
                "dbc",
                getCommonRecord(),
                settings);
    }

    private void checkDoubleRecordFrontend(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("checkDoubleRecordFrontend",
                getCommonRecord(),
                settings);
    }

    private void checkTemplate(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("checkTemplate",
                "netlydbog",
                "710101",
                "fbs",
                settings);

    }

    private void doRecategorizationThings(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod( "doRecategorizationThings",
                getCommonRecord(),
                getCommonRecord(),
                getCommonRecord());

    }

    private void recategorizationNoteFieldFactory(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("recategorizationNoteFieldFactory",
                getCommonRecord());

    }

    private void checkTemplateBuild(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("checkTemplateBuild", "allowall", settings);
    }

    private void  buildRecord(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("buildRecord",
                "dbcsingle",
                getCommonRecord(),
                settings);
    }

    private void sortRecord(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("sortRecord",
                "bogbind",
                getCommonRecord());
    }

    private void getValidateSchemas(ScripterEnvironment scripterEnvironment) throws ScripterException {
        scripterEnvironment.callMethod("getValidateSchemas",
                "dbc",
                new HashSet<>(Arrays.asList("RecordRules.conflictingFields", "RecordRules.conflictingSubfields", "auth_root")));
    }

    private String getCommonRecord() {
        return "{\n" +
                "  \"fields\": [\n" +
                "    {\n" +
                "      \"name\": \"001\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"5 158 076 1\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"870970\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"20150304180759\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"20150209\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"f\",\n" +
                "          \"value\": \"a\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"t\",\n" +
                "          \"value\": \"FAUST\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"004\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"r\",\n" +
                "          \"value\": \"n\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"e\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"008\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"t\",\n" +
                "          \"value\": \"m\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"f\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"2015\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"dk\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"å\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"x\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"j\",\n" +
                "          \"value\": \"f\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"l\",\n" +
                "          \"value\": \"ger\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"v\",\n" +
                "          \"value\": \"0\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"009\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"a\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"g\",\n" +
                "          \"value\": \"xx\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"021\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"e\",\n" +
                "          \"value\": \"9788771691078\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"hf.\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"021\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"e\",\n" +
                "          \"value\": \"9788771690651\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"bogpakken DigiLesen nybegyndertysk\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"032\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"DBF201511\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"BKM201511\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"DBF\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"BKM\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"SKO\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"100\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Møller\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"h\",\n" +
                "          \"value\": \"Karl Henrik\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"4\",\n" +
                "          \"value\": \"aut\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"245\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Lilly macht einen Ausflug\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"QR bog\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"250\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"1. udgave\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"÷\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"260\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"[Værløse]\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"DigTea\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"2015\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"300\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"23 sider\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"alle ill. i farver\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"440\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Digilesen\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"Lillys Leben - Niveau B\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"504\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Lilly og hendes far tager på udflugt, og hendes far bestemmer at de skal ud i naturen, men Lilly ville hellere have været på shoppetur i byen. Desværre forløber turen ikke helt som planlagt\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"512\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"På titelsiden: Hören und lesen\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"520\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Originaludgave: 2015\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"521\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"1. oplag\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"2015\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"k\",\n" +
                "          \"value\": \"Lasertryk\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"526\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Heri QR-koder til bogens tekst indlæst\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"652\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"n\",\n" +
                "          \"value\": \"86.4\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"z\",\n" +
                "          \"value\": \"096\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"652\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"84\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"udflugter\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 11 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 12 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"let at læse\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"720\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"Mette Bødker\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"4\",\n" +
                "          \"value\": \"ill\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"945\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Digi lesen\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"se\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"z\",\n" +
                "          \"value\": \"440(a)\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"945\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Lillys Leben - Niveau B\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"se\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"z\",\n" +
                "          \"value\": \"440(a,o)\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"990\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"201511\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"b\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"s\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"nt\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"996\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"DBC\"\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"empty\": false\n" +
                "}";
    }

    public String getCheckDoubleRecordFrontendRecord() {
        return "{\n" +
                "  \"fields\": [\n" +
                "    {\n" +
                "      \"name\": \"001\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"50938409\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"870970\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"20191218013539\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"20140131\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"f\",\n" +
                "          \"value\": \"a\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"004\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"r\",\n" +
                "          \"value\": \"n\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"e\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"008\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"t\",\n" +
                "          \"value\": \"m\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"f\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"2014\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"dk\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"2\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"å\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"d\",\n" +
                "          \"value\": \"x\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"l\",\n" +
                "          \"value\": \"dan\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"b\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"v\",\n" +
                "          \"value\": \"0\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"009\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"a\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"g\",\n" +
                "          \"value\": \"xx\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"021\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"ib.\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"032\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"DBF201409\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"BKM201409\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"ACC201405\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"x\",\n" +
                "          \"value\": \"DAT991605\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"038\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"bi\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"041\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"dan\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"nor\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"100\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"5\",\n" +
                "          \"value\": \"870979\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"6\",\n" +
                "          \"value\": \"69208045\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"4\",\n" +
                "          \"value\": \"aut\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"4\",\n" +
                "          \"value\": \"art\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"241\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Odd er et egg\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"245\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Ib er et æggehoved\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"250\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"1. udgave\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"÷\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"260\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"&\",\n" +
                "          \"value\": \"1\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Hedehusene\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"Torgard\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"2014\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"300\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"[36] sider\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"alle ill. i farver\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"28 cm\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"504\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"&\",\n" +
                "          \"value\": \"1\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"Billedbog. Hver morgen pakker Ib sit hoved ind i håndklæder og en tehætte. Hans hoved er nemlig et æg, og han skal hele tiden passe på, at det ikke går i stykker. Men så møder han Sif. Hun passer ikke på noget\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"521\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"&\",\n" +
                "          \"value\": \"REX\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"1. oplag\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"c\",\n" +
                "          \"value\": \"2014\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"k\",\n" +
                "          \"value\": \"Arcorounborg\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"652\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"n\",\n" +
                "          \"value\": \"85\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"z\",\n" +
                "          \"value\": \"296\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"652\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"sk\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"alene\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"ensomhed\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"venskab\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"kærlighed\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"tapperhed\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"s\",\n" +
                "          \"value\": \"mod\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 4 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 5 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 6 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"666\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"0\",\n" +
                "          \"value\": \"\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"for 7 år\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"720\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"Hugin Eide\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"4\",\n" +
                "          \"value\": \"trl\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"990\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"o\",\n" +
                "          \"value\": \"201409\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"l\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"b\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"b\",\n" +
                "          \"value\": \"s\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"u\",\n" +
                "          \"value\": \"nt\"\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"996\",\n" +
                "      \"indicator\": \"00\",\n" +
                "      \"subfields\": [\n" +
                "        {\n" +
                "          \"name\": \"a\",\n" +
                "          \"value\": \"DBC\"\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"empty\": false\n" +
                "}";
    }

}

