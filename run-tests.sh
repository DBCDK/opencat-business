#!/bin/bash

function die() {
  echo "ERROR: " "$@"
  exit 1
};

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q http://is.dbc.dk/view/Iscrum/job/ocb-tools-head-guesstimate/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz
tar -xf ocb-tools-1.0.0.tar.gz

template-transpiler/bin/transpile-templates.sh || die "Errro from transpile-templates.sh";

/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "ocb-test.sh js-tests failed";
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run --application update --summary || die "ocb-test.sh run --application update failed";
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run --application build --summary || die "ocb-test.sh run --application build failed";

rm -rf deploy

mkdir -p deploy/opencat-business
cp -r bin deploy/opencat-business/.
cp -r distributions deploy/opencat-business/.

cd deploy
tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business
