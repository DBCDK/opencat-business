#!/bin/bash

#Script that makes the ocb-test.log file readable - needs adjustment from time to time 

cat ocb-test.log |\
egrep -v 'ModuleHandler|cannot read file|ield rule|Log4JStopWatch|FileSchemeHandler|Environment.java|ClasspathSchemeHandler.java|microseconds|milliseconds.|^$' |\
egrep -v 'OCBFileSystem.java:81' |\
sed -e 's&ServiceScripter.java&&' |\
sed -e 's&d.d.o.s.ServiceScripter&&' |\
sed -e "s&file:///home/${USER}/iscrum/opencat-business/distributions/common/src/&&" |\
sed -e "s&jar:file:/home/${USER}/iscrum/opencat-business/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:50&&"|\
sed -e "s&jar:file:/home/${USER}/iscrum/opencat-business/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:51&&"|\
sed -e "s&jar:file:/home/${USER}/iscrum/opencat-business/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:52&&"|\
sed -e "s&jar:file:/home/${USER}/iscrum/opencat-business/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:49&&" |\
sed -e "s&jar:file:/home/${USER}/iscrum/ocb-tools/target/dist/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:48&&" |\
sed -e "s&jar:file:/home/${USER}/iscrum/ocb-tools/target/dist/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:51&&" |\
sed -e "s&jar:file:/home/${USER}/iscrum/ocb-tools/target/dist/ocb-tools-1.0.0/bin/ocb-test-1.0-SNAPSHOT-jar-with-dependencies.jar!/javascript/javacore/LogCore.use.js:49&&" > ocb-test.log.vi
vi ocb-test.log.vi
