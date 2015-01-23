#!/bin/bash

WIREMOCK_HOST=localhost
WIREMOCK_PORT=12099

SOLR_CORE=raw-repo-index

SOLR_QUERY_URL="http://$WIREMOCK_HOST:$WIREMOCK_PORT/solr/$SOLR_CORE/select"
SOLR_QUERY_ARGS="wt=json&indent=true"

querylines=`cat queries.txt`
for query in $querylines ; do
    curl $SOLR_QUERY_URL?$SOLR_QUERY_ARGS"&q=$query"
done
