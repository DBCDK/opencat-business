#!/bin/bash
#set -x

export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))
export COMPOSE_PROJECT_NAME="${USER}_ocb"
export LOGS_FOLDER="${PROJECT_ROOT}/logs"

if [ ! -d "${LOGS_FOLDER}" ]
then
  mkdir ${LOGS_FOLDER}
else
  rm ${LOGS_FOLDER}/*.log
fi

docker logs ${USER}_ocb_updateservice-facade_1 > ${LOGS_FOLDER}/updateservice-facade.log 2>&1
docker logs ${USER}_ocb_updateservice_1 > ${LOGS_FOLDER}/updateservice.log 2>&1
docker logs ${USER}_ocb_opencat-business-service_1 > ${LOGS_FOLDER}/opencat-business-service.log 2>&1
docker logs ${USER}_ocb_rawrepo-record-service_1 > ${LOGS_FOLDER}/rawrepo-record-service.log 2>&1
