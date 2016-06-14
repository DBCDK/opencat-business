#!/usr/bin/env bash


function die() {
  echo "ERROR : " "$@"
  exit 3
}

cd $(realpath $(dirname $0)/..)
echo PWD: $PWD

SHELL_CMD='dbc-jsshell'
DISTRIBUTIONS_PATH=`realpath ../distributions`

LOG_FILE=transpiler.log
#LOG_LEVEL=trace
LOG_LEVEL=info
CONFIG_FILE='bin/config.json'

test -f $CONFIG_FILE || die  "Umnable to Load file $CONFIG_FILE"

modules=( "common/src/entrypoints/build"
          "common/src/entrypoints/update"
          "common/src/templates"
          "common/src/modules"
          "common/src/modules/unittests"
        )

search_args="-a file:. -a file:${PWD}/modules "
for i in "${modules[@]}"
do
    search_args=$search_args"-a file:$DISTRIBUTIONS_PATH/$i "
done

for d in `find ${DISTRIBUTIONS_PATH}/common/src/validation/rules -type d` ; do
   search_args=$search_args"-a file:${d} "
done

rm -r $DISTRIBUTIONS_PATH/*/compiled_templates
rm $LOG_FILE

if [ "x$1" == "x--shell" ] ; then
  echo $SHELL_CMD $search_args -l $LOG_FILE -L $LOG_LEVEL -c main\(\) bin/transpile-templates.js $CONFIG_FILE
  $SHELL_CMD $search_args -l $LOG_FILE -L $LOG_LEVEL
else
  time $SHELL_CMD $search_args -l $LOG_FILE -L $LOG_LEVEL -c main\(\) bin/transpile-templates.js $CONFIG_FILE
fi
