#!/bin/bash

if [[ $# -ge 3 ]] ; then
    HOST=$1
    PORT=$2
    TIMEOUT=$3
    echo "HOST is : ${HOST}"
    echo "PORT is : ${PORT}"
    echo "TIMEOUT is : ${TIMEOUT}"

else
    echo "Must be called with three parameters <host> <port> <timeout> [label]:"
    echo "f.ex.: $0 localhost 8080 60 [label]"
    exit 1
fi

START_TIME=`date '+%s'`
echo -n "Waiting for opencat-business-service $3 to be ready ";

echo "curl -m 5 http://${HOST}:${PORT}/api/status 2>/dev/null"
for i in $(seq 1 ${TIMEOUT}) ; do
    RES=$(curl -m 5 http://${HOST}:${PORT}/api/status 2>/dev/null)
    if [ "$RES" == "{\"status\":200}" ] ; then
        echo " Done Waiting -$RES- (" $(( `date '+%s'` - START_TIME)) ")";
        exit 0
    fi
    echo -n '.'
    sleep 1
done

echo "\n Waited over ${TIMEOUT} seconds, failing build:"
exit 1
