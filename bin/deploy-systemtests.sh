#!/bin/bash
#set -x

SOLR_PORT_NR=${SOLR_PORT_NR:-WHAT}     # silencing annoying intellij quibble
export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))

RAWREPO_VERSION=1.13-snapshot
RAWREPO_DIT_TAG=DIT-5016
RAWREPO_RECORD_SERVICE_VERSION=DIT-281
HOLDINGS_ITEMS_VERSION=1.1.4-snapshot
UPDATE_FACADE_TAG=master-31

docker build target/docker -t docker-io.dbc.dk/opencat-business-service:devel

cd ${PROJECT_ROOT}/docker/compose

. ${PROJECT_ROOT}/bin/get_solr_port_nr.sh

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

# Create docker network if it doesn't exists
[[ ! "$(docker network ls | grep update-compose-network)" ]] && docker network create --subnet=192.180.0.0/22 update-compose-network

export PROD_VERSION=$(curl -f --silent --globoff "https://is.dbc.dk/view/metascrum/job/updateservice/job/tag-updateservice-for-prod/lastSuccessfulBuild/api/xml?xpath=//action/parameter/name[text()='DOCKER_TAG']/following-sibling::value" | sed -En 's|<value>(.+)</value>|\1|p')
echo "Using prod version ${PROD_VERSION} of updateservice"

# On macOS you have to install envsubst first. Run these commands: brew install gettext && brew link --force gettext
envsubst '${PROD_VERSION}' < docker-compose.yml.tmpl > docker-compose.yml

DEV_NUMBERROLL_URL=${DEV_NUMBERROLL_URL:-NOTSET}
if [ ${DEV_NUMBERROLL_URL} = "NOTSET" ]
then
    export DEV_NUMBERROLL_URL="http://${HOST_IP}:${SOLR_PORT_NR}"
fi
DEV_OPENAGENCY_URL=${DEV_OPENAGENCY_URL:-NOTSET}
if [ ${DEV_OPENAGENCY_URL} = "NOTSET" ]
then
    export DEV_OPENAGENCY_URL="http://${HOST_IP}:${SOLR_PORT_NR}"
fi

# Solr FBS settings
DEV_SOLR_ADDR=${DEV_SOLR_ADDR:-NOTSET}
if [ ${DEV_SOLR_ADDR} = "NOTSET" ]
then
    export DEV_SOLR_ADDR="solrserver"
fi
DEV_SOLR_PORT=${DEV_SOLR_PORT:-NOTSET}
if [ ${DEV_SOLR_PORT} = "NOTSET" ]
then
    export DEV_SOLR_PORT="${SOLR_PORT_NR}"
fi
DEV_SOLR_PATH=${DEV_SOLR_PATH:-NOTSET}
if [ ${DEV_SOLR_PATH} = "NOTSET" ]
then
    export DEV_SOLR_PATH="solr/raapost-index"
fi

export DEV_SOLR_URL="http://${DEV_SOLR_ADDR}:${DEV_SOLR_PORT}/${DEV_SOLR_PATH}"

#Solr basis settings
DEV_SOLR_BASIS_ADDR=${DEV_SOLR_BASIS_ADDR:-NOTSET}
if [ ${DEV_SOLR_BASIS_ADDR} = "NOTSET" ]
then
    export DEV_SOLR_BASIS_ADDR="solrbasis"
fi
DEV_SOLR_BASIS_PORT=${DEV_SOLR_BASIS_PORT:-NOTSET}
if [ ${DEV_SOLR_BASIS_PORT} = "NOTSET" ]
then
    export DEV_SOLR_BASIS_PORT="${SOLR_PORT_NR}"
fi
DEV_SOLR_BASIS_PATH=${DEV_SOLR_BASIS_PATH:-NOTSET}
if [ ${DEV_SOLR_BASIS_PATH} = "NOTSET" ]
then
    export DEV_SOLR_BASIS_PATH="solr/basis-index"
fi

export DEV_SOLR_BASIS_URL="http://${DEV_SOLR_BASIS_ADDR}:${DEV_SOLR_BASIS_PORT}/${DEV_SOLR_BASIS_PATH}"

docker-compose down
docker-compose ps
echo "docker ps : $?"

docker rmi -f docker-io.dbc.dk/rawrepo-postgres-${RAWREPO_VERSION}:${USER}
docker rmi -f docker-os.dbc.dk/holdings-items-postgres-${HOLDINGS_ITEMS_VERSION}:${USER}
docker rmi -f docker-i.dbc.dk/update-postgres:${USER}
docker rmi -f docker-i.dbc.dk/update-payara-deployer:${USER}
docker rmi -f docker-io.dbc.dk/opencat-business-service:${USER}
docker rmi -f docker-io.dbc.dk/rawrepo-record-service:${USER}
docker-compose pull
docker-compose up -d rawrepoDb updateserviceDb holdingsitemsDb fakeSmtp
sleep 3
docker tag docker-io.dbc.dk/rawrepo-postgres-${RAWREPO_VERSION}:${RAWREPO_DIT_TAG} docker-io.dbc.dk/rawrepo-postgres-${RAWREPO_VERSION}:${USER}
docker rmi docker-io.dbc.dk/rawrepo-postgres-${RAWREPO_VERSION}:${RAWREPO_DIT_TAG}
docker tag docker-os.dbc.dk/holdings-items-postgres-${HOLDINGS_ITEMS_VERSION}:latest docker-os.dbc.dk/holdings-items-postgres-${HOLDINGS_ITEMS_VERSION}:${USER}
docker rmi docker-os.dbc.dk/holdings-items-postgres-${HOLDINGS_ITEMS_VERSION}:latest
docker tag docker-i.dbc.dk/update-postgres:staging docker-i.dbc.dk/update-postgres:${USER}
docker rmi docker-i.dbc.dk/update-postgres:staging

RAWREPO_IMAGE=`docker-compose ps -q rawrepoDb`
export RAWREPO_PORT=`docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' ${RAWREPO_IMAGE} `
echo -e "RAWREPO_PORT is $RAWREPO_PORT\n"

HOLDINGSITEMSDB_IMAGE=`docker-compose ps -q holdingsitemsDb`
export HOLDINGSITEMSDB_PORT=`docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' ${HOLDINGSITEMSDB_IMAGE} `
echo -e "HOLDINGSITEMSDB_PORT is $HOLDINGSITEMSDB_PORT\n"

UPDATESERVICEDB_IMAGE=`docker-compose ps -q updateserviceDb`
export UPDATESERVICEDB_PORT=`docker inspect --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}' ${UPDATESERVICEDB_IMAGE} `
echo -e "UPDATESERVICEDB_PORT is $UPDATESERVICEDB_PORT\n"

export DEV_RAWREPO_DB_URL="rawrepo:thePassword@${HOST_IP}:${RAWREPO_PORT}/rawrepo"
export DEV_HOLDINGS_ITEMS_DB_URL="holdingsitems:thePassword@${HOST_IP}:${HOLDINGSITEMSDB_PORT}/holdingsitems"
export DEV_UPDATE_DB_URL="updateservice:thePassword@${HOST_IP}:${UPDATESERVICEDB_PORT}/updateservice"

docker-compose up -d rawrepo-record-service
docker tag docker-io.dbc.dk/rawrepo-record-service:${RAWREPO_RECORD_SERVICE_VERSION} docker-io.dbc.dk/rawrepo-record-service:${USER}
docker rmi docker-io.dbc.dk/rawrepo-record-service:${RAWREPO_RECORD_SERVICE_VERSION}

RAWREPO_RECORD_SERVICE_IMAGE=`docker-compose ps -q rawrepo-record-service`
RAWREPO_RECORD_SERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_8080 is ${RAWREPO_RECORD_SERVICE_PORT_8080}\n"
RAWREPO_RECORD_SERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_8686 is ${RAWREPO_RECORD_SERVICE_PORT_8686}\n"
RAWREPO_RECORD_SERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${RAWREPO_RECORD_SERVICE_IMAGE} `
echo -e "RAWREPO_RECORD_SERVICE_PORT_4848 is ${RAWREPO_RECORD_SERVICE_PORT_4848}\n"

export DEV_RAWREPO_RECORD_SERVICE_URL="http://${HOST_IP}:${RAWREPO_RECORD_SERVICE_PORT_8080}"

docker-compose up -d opencat-business-service
docker tag docker-io.dbc.dk/opencat-business-service:devel docker-io.dbc.dk/opencat-business-service:${USER}
docker rmi docker-io.dbc.dk/opencat-business-service:devel

OPENCAT_BUSINESS_SERVICE_IMAGE=`docker-compose ps -q opencat-business-service`
OPENCAT_BUSINESS_SERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_8080 is ${OPENCAT_BUSINESS_SERVICE_PORT_8080}\n"
OPENCAT_BUSINESS_SERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_8686 is ${OPENCAT_BUSINESS_SERVICE_PORT_8686}\n"
OPENCAT_BUSINESS_SERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${OPENCAT_BUSINESS_SERVICE_IMAGE} `
echo -e "OPENCAT_BUSINESS_SERVICE_PORT_4848 is ${OPENCAT_BUSINESS_SERVICE_PORT_4848}\n"

export DEV_OPENCAT_BUSINESS_SERVICE_URL="http://${HOST_IP}:${OPENCAT_BUSINESS_SERVICE_PORT_8080}"

docker-compose up -d updateservice
docker tag docker-i.dbc.dk/update-payara-deployer:${PROD_VERSION} docker-i.dbc.dk/update-payara-deployer:${USER}
docker rmi docker-i.dbc.dk/update-payara-deployer:${PROD_VERSION}

UPDATESERVICE_IMAGE=`docker-compose ps -q updateservice`
UPDATESERVICE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_8080 is ${UPDATESERVICE_PORT_8080}\n"
UPDATESERVICE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_8686 is ${UPDATESERVICE_PORT_8686}\n"
UPDATESERVICE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${UPDATESERVICE_IMAGE} `
echo -e "UPDATESERVICE_PORT_4848 is ${UPDATESERVICE_PORT_4848}\n"

export UPDATE_SERVICE_URL="http://${HOST_IP}:${UPDATESERVICE_PORT_8080}/UpdateService/rest"
export BUILD_SERVICE_URL="http://${HOST_IP}:${UPDATESERVICE_PORT_8080}/UpdateService/rest"

docker-compose up -d updateservice-facade
docker tag docker-io.dbc.dk/updateservice-facade:${UPDATE_FACADE_TAG} docker-io.dbc.dk/updateservice-facade:${USER}
docker rmi docker-io.dbc.dk/updateservice-facade:${UPDATE_FACADE_TAG}

UPDATESERVICE_FACADE_IMAGE=`docker-compose ps -q updateservice-facade`
UPDATESERVICE_FACADE_PORT_8080=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_8080 is ${UPDATESERVICE_FACADE_PORT_8080}\n"
UPDATESERVICE_FACADE_PORT_8686=`docker inspect --format='{{(index (index .NetworkSettings.Ports "8686/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_8686 is ${UPDATESERVICE_FACADE_PORT_8686}\n"
UPDATESERVICE_FACADE_PORT_4848=`docker inspect --format='{{(index (index .NetworkSettings.Ports "4848/tcp") 0).HostPort}}' ${UPDATESERVICE_FACADE_IMAGE} `
echo -e "UPDATESERVICE_FACADE_PORT_4848 is ${UPDATESERVICE_FACADE_PORT_4848}\n"

echo "updateservice.url = http://${HOST_IP}:${UPDATESERVICE_FACADE_PORT_8080}" > ${HOME}/.ocb-tools/testrun.properties
echo "buildservice.url = http://${HOST_IP}:${UPDATESERVICE_FACADE_PORT_8080}" >> ${HOME}/.ocb-tools/testrun.properties

echo "rawrepo.jdbc.driver = org.postgresql.Driver" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.jdbc.conn.url = jdbc:postgresql://${HOST_IP}:${RAWREPO_PORT}/rawrepo" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.jdbc.conn.user = rawrepo" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.jdbc.conn.passwd = thePassword" >> ${HOME}/.ocb-tools/testrun.properties

echo "holdings.jdbc.driver = org.postgresql.Driver" >> ${HOME}/.ocb-tools/testrun.properties
echo "holdings.jdbc.conn.url = jdbc:postgresql://${HOST_IP}:${HOLDINGSITEMSDB_PORT}/holdingsitems" >> ${HOME}/.ocb-tools/testrun.properties
echo "holdings.jdbc.conn.user = holdingsitems" >> ${HOME}/.ocb-tools/testrun.properties
echo "holdings.jdbc.conn.passwd = thePassword" >> ${HOME}/.ocb-tools/testrun.properties

echo "solr.port = ${SOLR_PORT_NR}" >> ${HOME}/.ocb-tools/testrun.properties

echo "request.headers.x.forwarded.for = 172.17.20.165" >> ${HOME}/.ocb-tools/testrun.properties

echo "rawrepo.provider.name.dbc = dataio-update" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.provider.name.fbs = opencataloging-update" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.provider.name.ph = fbs-ph-update" >> ${HOME}/.ocb-tools/testrun.properties
echo "rawrepo.provider.name.ph.holdings = dataio-ph-holding-update" >> ${HOME}/.ocb-tools/testrun.properties

echo "export SOLR_PORT_NR=${SOLR_PORT_NR}"

../../bin/healthcheck-opencat-business-service.sh ${HOST_IP} ${OPENCAT_BUSINESS_SERVICE_PORT_8080} 220 || die "could not start opencat-business-service"
../../bin/healthcheck-rawrepo-record-service.sh ${HOST_IP} ${RAWREPO_RECORD_SERVICE_PORT_8080} 220 || die "could not start rawrepo-record-service"
../../bin/healthcheck-update-service.sh ${HOST_IP} ${UPDATESERVICE_PORT_8080} 220 || die "could not start update-service"
../../bin/healthcheck-update-facade-service.sh ${HOST_IP} ${UPDATESERVICE_FACADE_PORT_8080} 220 || die "could not start update-facade-service"

