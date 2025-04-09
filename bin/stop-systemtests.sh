#!/bin/bash
#set -x

export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))
export COMPOSE_PROJECT_NAME="${USER}_ocb"

cd ${PROJECT_ROOT}/docker/compose

DOCKER_COMPOSE_CMD="$(command -v docker-compose > /dev/null && echo docker-compose || echo docker compose)"
${DOCKER_COMPOSE_CMD} down

cd -
