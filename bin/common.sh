export METASCRUM_REPO="docker-metascrum.artifacts.dbccloud.dk"
export OCB_TOOLS="${HOME}/.ocb-tools"
export TEST_RUN="${OCB_TOOLS}/testrun.properties"

clearOcbProperties() {
  echo "" > "${TEST_RUN}"
}

appendOcbProperty() {
  echo "$*" >> "${TEST_RUN}"
}

readOcbProperty() {
  grep "${1:?Please supply a property name}" "${TEST_RUN}" | awk '{print $3}'
}

getFreePort() {
  cmd="ss -nlp"
  # Because macOS is "special"
  if [ "$(uname)" == "Darwin" ]
  then
      cmd="netstat -ap tcp"
  fi

  i=0
  FREE_PORT=-1
  while test $i -lt 20; do
      i=$((( $i + 1 )))
      p=$((( RANDOM % 60000) + 1025 ))
      eval ${cmd} | grep -q $p || { FREE_PORT=$p; break; }
  done
  echo ${FREE_PORT}
}

getHostIP() {
  if [ "$(uname)" == "Darwin" ]
  then
      HOST_IP=$(ip addr show | grep inet | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' | egrep -v '^127.0.0.1' | head -1)
  elif [ "$(uname -v | grep Ubuntu | cut -d- -f2 | cut -d' ' -f1)x" == "Ubuntux" ]; then
      HOST_IP=$(ip -o addr show | grep inet\ | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' | egrep -v '^127.0.0.1'  | grep 172 | head -1)
  else
      HOST_IP=$( ip -o addr show | grep "inet " | cut -d: -f2- | cut -c2- | egrep -v "^docker|^br" | grep "$(ip route list | grep default | cut -d' ' -f5) " | cut -d' ' -f6 | cut -d/ -f1)
  fi
  echo ${HOST_IP}
}

fail() {
  echo ${1?Must have a message}
  exit ${2:-1}
}
