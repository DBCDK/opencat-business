#!/bin/bash

SHELL_CMD=dbc-jsshell
DISTRIBUTIONS_PATH="../distributions"

LOG_FILE=jstest.log
LOG_LEVEL=debug

modules=( "common/src/entrypoints/update"
          "common/src/validation"
          "common/src/validation/rules"
          "common/src/templates"
          "common/src/modules"
          "common/src/modules/unittests"
        )

search_args=""
for i in "${modules[@]}"
do
    search_args=$search_args"-a file:$DISTRIBUTIONS_PATH/$i "
done

$SHELL_CMD "$search_args -l $LOG_FILE -L $LOG_LEVEL -c main() run_unittests.js"
