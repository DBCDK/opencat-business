#!/bin/bash -x

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

DOCKER_IMAGE=dbc-jsshell

echo UID $(id -u)
echo GID $(id -g)


#Preemptive cleaning
docker stop $DOCKER_IMAGE 2>/dev/null && docker rm $DOCKER_IMAGE 2>/dev/null

docker run -t -d --name $DOCKER_IMAGE -e HOST_USER_ID=$(id -u) -e HOST_USER_GID=$(id -g) -v ${PWD}:/home/jsshell docker-io.dbc.dk/dbc-jsshell /bin/bash || die "Docker run"

docker exec $DOCKER_IMAGE /home/jsshell/template-transpiler/bin/transpile-templates.sh  || die "docker exec $DOCKER_IMAGE template-transpiler/bin/transpile-templates.sh"

docker stop $DOCKER_IMAGE 2>/dev/null && docker rm $DOCKER_IMAGE 2>/dev/null
