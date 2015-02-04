#!/bin/bash

SHELL_CMD=dbc-jsshell
DISTRIBUTIONS_PATH="../distributions"

LOG_FILE=jstest.log
LOG_LEVEL=trace

modules=( "common/src/entrypoints/build"
          "common/src/entrypoints/update"
          "common/src/validation"
          "common/src/validation/rules"
          "common/src/templates"
          "common/src/modules"
          "common/src/modules/unittests"
        )

search_args="-a file:. "
for i in "${modules[@]}"
do
    search_args=$search_args"-a file:$DISTRIBUTIONS_PATH/$i "
done

# Start Wiremock in ../tests/wiremock/solr
WIREMOCK_ROOTDIR=../distributions/tests/wiremock
WIREMOCK_JAR=../wiremock-1.50-standalone.jar

WIREMOCK_SOLR_PORT=12100
WIREMOCK_SOLR_DIR=$WIREMOCK_ROOTDIR/solr

$SHELL_CMD $search_args -l $LOG_FILE -L $LOG_LEVEL -c main\(\) run_unittests.js
