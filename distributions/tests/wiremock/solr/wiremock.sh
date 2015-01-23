#!/bin/bash

WIREMOCK_JAR=../wiremock-1.50-standalone.jar

SOLR_HOST=http://ivs193.dbc.dk
SOLR_PORT=8080

WIREMOCK_PORT=12099

rm -rf __files
rm -rf mappings

java -jar $WIREMOCK_JAR --port $WIREMOCK_PORT --proxy-all="$SOLR_HOST:$SOLR_PORT" --record-mappings --verbose
