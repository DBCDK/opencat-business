#!/usr/bin/env bash
set -e

export PROD_VERSION=$1

envsubst '${PROD_VERSION}' < docker/compose/docker-compose.yml > docker/compose/docker-compose.tmp
mv docker/compose/docker-compose.tmp docker/compose/docker-compose.yml