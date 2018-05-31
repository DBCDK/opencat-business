#!/bin/bash -x
# This script must be run from updateservice root and not updateservice/bin

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

DOCKER_IMAGE=dbc-jsshell

echo UID $(id -u)
echo GID $(id -g)

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q https://is.dbc.dk/job/updateservice/job/ocb-tools/job/master/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz || die "wget -q ocb-tools"

tar -xf ocb-tools-1.0.0.tar.gz || die "tar -xf ocb-tools-1.0.0.tar.gz"

#Preemptive cleaning
docker stop $DOCKER_IMAGE 2>/dev/null && docker rm $DOCKER_IMAGE 2>/dev/null

docker run -t -d --name $DOCKER_IMAGE -e HOST_USER_ID=$(id -u) -e HOST_USER_GID=$(id -g) -v ${PWD}:/home/jsshell docker-io.dbc.dk/dbc-jsshell /bin/bash || die "Docker run"
docker exec $DOCKER_IMAGE /home/jsshell/template-transpiler/bin/transpile-templates.sh  || die "docker exec $DOCKER_IMAGE template-transpiler/bin/transpile-templates.sh"

docker stop $DOCKER_IMAGE 2>/dev/null && docker rm $DOCKER_IMAGE 2>/dev/null

/bin/bash target/dist/ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests"