#!/bin/ksh
#set -x

export SOLR_PORT_NR=$((18000 + `id -u ${USER}`))