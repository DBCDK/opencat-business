#!/bin/bash

function die() {
  echo "ERROR: " "$@"
  exit 1
};

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q http://is.dbc.dk/job/ocb-tools-head/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz || die "failed to wget the tarbalL"
tar -xf ocb-tools-1.0.0.tar.gz || die "failed to unpack the tarbalL"

template-transpiler/bin/transpile-templates.sh || die "Error from transpile-templates.sh";

/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "ocb-test.sh js-tests failed";
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run --application update --summary || die "ocb-test.sh run --application update failed";
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run --application build --summary || die "ocb-test.sh run --application build failed";

rm -rf deploy || die "Failed to remove deploy";

mkdir -p deploy/opencat-business || die "Failed to mkdir deploy/opencat-business";
cp -r bin deploy/opencat-business/. || die "Failed cp -r bin deploy/opencat-business/. ";
cp -r distributions deploy/opencat-business/. || die "failed cp -r distributions deploy/opencat-business/.";

cd deploy || die "Failed to cd deploy";
tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business || die "Failed to pack the file";
