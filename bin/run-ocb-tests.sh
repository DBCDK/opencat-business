#!/usr/bin/env bash

export PROJECT_ROOT=$(dirname $(dirname $(realpath ${0})))

cd ${PROJECT_ROOT}

/bin/bash target/dist/ocb-tools-1.0.0/bin/ocb-test.sh run -c testrun --summary