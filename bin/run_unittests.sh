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

#cd $WIREMOCK_SOLR_DIR
#nohub java -jar $WIREMOCK_JAR --verbose --port $WIREMOCK_SOLR_PORT > wiremock.out 2>&1 &
#WIREMOCK_SOLR_PID=$!
#echo "Starting wiremock on port $WIREMOCK_SOLR_PORT with pid $WIREMOCK_SOLR_PID"
#cd -

#sleep 2
#ps aux | grep wiremock

# curl --verbose "http://localhost:12100/solr/raw-repo-index/select?q=marc.001a%3A%2A&indent=true&wt=json"
#               http://localhost:12100/solr/raw-repo-index/select?q=marc.001a%3A%2A&indent=true&wt=json

$SHELL_CMD $search_args -l $LOG_FILE -L $LOG_LEVEL -c main\(\) run_unittests.js

#kill -9 $WIREMOCK_SOLR_PID
