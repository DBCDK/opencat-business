#!/bin/bash
#set -x

export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))

DOCKER_COMPOSE_CMD="$(command -v docker-compose > /dev/null && echo docker-compose || echo docker compose)"
RAWREPO_VERSION=1.16-snapshot
RAWREPO_DIT_TAG=DIT-5165
RAWREPO_RECORD_SERVICE_VERSION=DIT-349
HOLDINGS_ITEMS_VERSION=1.3-snapshot
UPDATE_FACADE_TAG=master-34

if [ ! "$1" == "false" ]
then
  echo "Building maven project"
  cd ${PROJECT_ROOT}
  mvn clean package
fi

docker build target/docker -t docker-metascrum.artifacts.dbccloud.dk/opencat-business-service:devel

cd ${PROJECT_ROOT}/docker/compose

. ${PROJECT_ROOT}/bin/common.sh

SOLR_PORT_NR=${SOLR_PORT_NR:-$(getFreePort)}
HOLDINGS_PORT=${HOLDINGS_PORT:-$(getFreePort)}


if [ ! -d $HOME/.ocb-tools ]
then
    mkdir $HOME/.ocb-tools
    res=$?
    if [ ${res} -ne 0 ]
    then
        echo "Could not create directory $HOME/.ocb-tools"
        echo "the directory are necessary so we stop now"
        exit 1
    fi
fi

USER=${USER:-"unknown"}
export COMPOSE_PROJECT_NAME="${USER}_ocb"

#Find the correct outbound ip-address regardless of host configuration
if [ "$(uname)" == "Darwin" ]
then
    export HOST_IP=$(ip addr show | grep inet | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' | egrep -v '^127.0.0.1' | head -1)
else
    export HOST_IP=$( ip -o addr show | grep "inet " | cut -d: -f2- | cut -c2- | egrep -v "^docker|^br" | grep "$(ip route list | grep default | cut -d' ' -f5) " | cut -d' ' -f6 | cut -d/ -f1)
fi

export PROD_VERSION=$(curl -s https://is.dbc.dk/view/metascrum/job/updateservice/job/updateservice-deploy/job/cisterne/lastSuccessfulBuild/artifact/UPDATE_DOCKER_IMAGE | cut -f2-3 -d:)
echo "Using prod version ${PROD_VERSION} of updateservice"

# On macOS you have to install envsubst first. Run these commands: brew install gettext && brew link --force gettext
envsubst '${PROD_VERSION}' < docker-compose.yml.tmpl > docker-compose.yml

# Life is complicated - this line is necessary for ocb-tools to function correctly in the wiremock setup
export DEV_NUMBERROLL_URL=${DEV_NUMBERROLL_URL:-"http://${HOST_IP}:${SOLR_PORT_NR}"}
# and then, if you want to make a regular call from outside this setup, then you need access to a real numberroll, in that case
#the line above needs to be commented out
export DEV_NUMBERROLL_URL=${DEV_NUMBERROLL_URL:-"http://opennumberroll-service.metascrum-prod.svc.cloud.dbc.dk/1.1"}

export DEV_VIPCORE_ENDPOINT=${DEV_VIPCORE_ENDPOINT:-"http://${HOST_IP}:${SOLR_PORT_NR}"}
export DEV_IDP_SERVICE_URL=${DEV_IDP_SERVICE_URL:-"http://${HOST_IP}:${SOLR_PORT_NR}"}
# Solr FBS settings
DEV_SOLR_ADDR=${DEV_SOLR_ADDR:-"solrserver"}
DEV_SOLR_PORT=${DEV_SOLR_PORT:-"${SOLR_PORT_NR}"}
DEV_SOLR_PATH=${DEV_SOLR_PATH:-"solr/raapost-index"}

export DEV_SOLR_URL="http://${DEV_SOLR_ADDR}:${DEV_SOLR_PORT}/${DEV_SOLR_PATH}"

#Solr basis settings
DEV_SOLR_BASIS_ADDR=${DEV_SOLR_BASIS_ADDR:-"solrbasis"}
DEV_SOLR_BASIS_PORT=${DEV_SOLR_BASIS_PORT:-"${SOLR_PORT_NR}"}
DEV_SOLR_BASIS_PATH=${DEV_SOLR_BASIS_PATH:-"solr/basis-index"}
export DEV_SOLR_BASIS_URL="http://${DEV_SOLR_BASIS_ADDR}:${DEV_SOLR_BASIS_PORT}/${DEV_SOLR_BASIS_PATH}"

${DOCKER_COMPOSE_CMD} down
${DOCKER_COMPOSE_CMD} ps
echo "docker ps : $?"

docker rmi -f docker-metascrum.artifacts.dbccloud.dk/rawrepo-postgres-${RAWREPO_VERSION}:${USER}
docker rmi -f docker-metascrum.artifacts.dbccloud.dk/update-postgres:${USER}
docker rmi -f docker-metascrum.artifacts.dbccloud.dk/update-service:${USER}
docker rmi -f docker-metascrum.artifacts.dbccloud.dk/opencat-business-service:${USER}
docker rmi -f docker-metascrum.artifacts.dbccloud.dk/rawrepo-record-service:${USER}
${DOCKER_COMPOSE_CMD} pull
${DOCKER_COMPOSE_CMD} up -d rawrepoDb updateserviceDb fakeSmtp
sleep 3
docker tag docker-metascrum.artifacts.dbccloud.dk/rawrepo-postgres-${RAWREPO_VERSION}:${RAWREPO_DIT_TAG} docker-metascrum.artifacts.dbccloud.dk/rawrepo-postgres-${RAWREPO_VERSION}:${USER}
docker rmi docker-metascrum.artifacts.dbccloud.dk/rawrepo-postgres-${RAWREPO_VERSION}:${RAWREPO_DIT_TAG}
docker tag docker-metascrum.artifacts.dbccloud.dk/update-postgres:staging docker-metascrum.artifacts.dbccloud.dk/update-postgres:${USER}
docker docker-metascrum.artifacts.dbccloud.dkc.dk/update-postgres:staging

RAWREPO_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q rawrepoDb`
export RAWREPO_PORT=`docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' ${RAWREPO_IMAGE} `
echo -e "RAWREPO_PORT is $RAWREPO_PORT\n"

UPDATESERVICEDB_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q updateserviceDb`
export UPDATESERVICEDB_PORT=`docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' ${UPDATESERVICEDB_IMAGE} `
echo -e "UPDATESERVICEDB_PORT is $UPDATESERVICEDB_PORT\n"

export DEV_RAWREPO_DB_URL="rawrepo:thePassword@${HOST_IP}:${RAWREPO_PORT}/rawrepo"
export DEV_HOLDINGS_ITEMS_DB_URL="holdingsitems:thePassword@${HOST_IP}:${HOLDINGSITEMSDB_PORT}/holdingsitems"
export DEV_UPDATE_DB_URL="updateservice:thePassword@${HOST_IP}:${UPDATESERVICEDB_PORT}/updateservice"
export DEV_HOLDINGS_URL="http://${HOST_IP}:${HOLDINGS_PORT}/api"

${DOCKER_COMPOSE_CMD} up -d rawrepo-record-service
docker tag docker-metascrum.artifacts.dbccloud.dk/rawrepo-record-service:${RAWREPO_RECORD_SERVICE_VERSION} docker-metascrum.artifacts.dbccloud.dk/rawrepo-record-service:${USER}
docker rmi docker-metascrum.artifacts.dbccloud.dk/rawrepo-record-service:${RAWREPO_RECORD_SERVICE_VERSION}

RAWREPO_RECORD_SERVICE_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q rawrepo-record-service`
RAWREPO_RECORD_SERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_8080 is ${RAWREPO_RECORD_SERVICE_PORT_8080}\n"
RAWREPO_RECORD_SERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_8686 is ${RAWREPO_RECORD_SERVICE_PORT_8686}\n"
RAWREPO_RECORD_SERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_4848 is ${RAWREPO_RECORD_SERVICE_PORT_4848}\n"

export DEV_RAWREPO_RECORD_SERVICE_URL="http://${HOST_IP}:${RAWREPO_RECORD_SERVICE_PORT_8080}"

${DOCKER_COMPOSE_CMD} up -d opencat-business-service
docker tag docker-metascrum.artifacts.dbccloud.dk/opencat-business-service:devel docker-metascrum.artifacts.dbccloud.dk/opencat-business-service:${USER}
docker rmi docker-metascrum.artifacts.dbccloud.dk/opencat-business-service:devel

OPENCAT_BUSINESS_SERVICE_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q opencat-business-service`
OPENCAT_BUSINESS_SERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_8080 is ${OPENCAT_BUSINESS_SERVICE_PORT_8080}\n"
OPENCAT_BUSINESS_SERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_8686 is ${OPENCAT_BUSINESS_SERVICE_PORT_8686}\n"
OPENCAT_BUSINESS_SERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_4848 is ${OPENCAT_BUSINESS_SERVICE_PORT_4848}\n"

export DEV_OPENCAT_BUSINESS_SERVICE_URL="http://${HOST_IP}:${OPENCAT_BUSINESS_SERVICE_PORT_8080}"

${DOCKER_COMPOSE_CMD} up -d updateservice
docker tag docker-metascrum.artifacts.dbccloud.dk/update-service:${PROD_VERSION} docker-metascrum.artifacts.dbccloud.dk/update-service:${USER}
docker rmi docker-metascrum.artifacts.dbccloud.dk/update-service:${PROD_VERSION}

UPDATESERVICE_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q updateservice`
UPDATESERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_8080 is ${UPDATESERVICE_PORT_8080}\n"
UPDATESERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_8686 is ${UPDATESERVICE_PORT_8686}\n"
UPDATESERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_4848 is ${UPDATESERVICE_PORT_4848}\n"

export UPDATE_SERVICE_URL="http://${HOST_IP}:${UPDATESERVICE_PORT_8080}/UpdateService/rest"
export BUILD_SERVICE_URL="http://${HOST_IP}:${UPDATESERVICE_PORT_8080}/UpdateService/rest"

${DOCKER_COMPOSE_CMD} up -d updateservice-facade
docker tag docker-metascrum.artifacts.dbccloud.dk/updateservice-facade:${UPDATE_FACADE_TAG} docker-metascrum.artifacts.dbccloud.dk/updateservice-facade:${USER}
docker rmi docker-metascrum.artifacts.dbccloud.dk/updateservice-facade:${UPDATE_FACADE_TAG}

UPDATESERVICE_FACADE_IMAGE=`${DOCKER_COMPOSE_CMD} ps -q updateservice-facade`
UPDATESERVICE_FACADE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_8080 is ${UPDATESERVICE_FACADE_PORT_8080}\n"
UPDATESERVICE_FACADE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_8686 is ${UPDATESERVICE_FACADE_PORT_8686}\n"
UPDATESERVICE_FACADE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_4848 is ${UPDATESERVICE_FACADE_PORT_4848}\n"

clearOcbProperties

appendOcbProperty "updateservice.url = http://${HOST_IP}:${UPDATESERVICE_FACADE_PORT_8080}"
appendOcbProperty "buildservice.url = http://${HOST_IP}:${UPDATESERVICE_FACADE_PORT_8080}"
appendOcbProperty "rawrepo.jdbc.driver = org.postgresql.Driver"
appendOcbProperty "rawrepo.jdbc.conn.url = jdbc:postgresql://${HOST_IP}:${RAWREPO_PORT}/rawrepo"
appendOcbProperty "rawrepo.jdbc.conn.user = rawrepo"
appendOcbProperty "rawrepo.jdbc.conn.passwd = thePassword"
appendOcbProperty "solr.port = ${SOLR_PORT_NR}"
appendOcbProperty "holdings.port = ${HOLDINGS_PORT}"

appendOcbProperty "request.headers.x.forwarded.for = 172.17.20.165"

appendOcbProperty "rawrepo.provider.name.dbc = dataio-update"
appendOcbProperty "rawrepo.provider.name.fbs = opencataloging-update"
appendOcbProperty "rawrepo.provider.name.ph = fbs-ph-update"
appendOcbProperty "rawrepo.provider.name.ph.holdings = dataio-ph-holding-update"

echo "export SOLR_PORT_NR=${SOLR_PORT_NR}"

../../bin/healthcheck-opencat-business-service.sh ${HOST_IP} ${OPENCAT_BUSINESS_SERVICE_PORT_8080} 220 || fail "could not start opencat-business-service"
../../bin/healthcheck-rawrepo-record-service.sh ${HOST_IP} ${RAWREPO_RECORD_SERVICE_PORT_8080} 220 || fail "could not start rawrepo-record-service"
../../bin/healthcheck-update-service.sh ${HOST_IP} ${UPDATESERVICE_PORT_8080} 220 || fail "could not start update-service"
../../bin/healthcheck-update-facade-service.sh ${HOST_IP} ${UPDATESERVICE_FACADE_PORT_8080} 220 || fail "could not start update-facade-service"
