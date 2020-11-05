#!/bin/bash
#set -x

export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))
export COMPOSE_PROJECT_NAME="${USER}_ocb"

cd ${PROJECT_ROOT}/docker/compose

docker-compose down

cd -