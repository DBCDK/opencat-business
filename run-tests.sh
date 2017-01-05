#!/bin/bash

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q http://is.dbc.dk/job/ocb-tools-head/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz || die "wget -q http://is.dbc.dk/job/ocb-tools-head/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz"
tar -xf ocb-tools-1.0.0.tar.gz || die "tar -xf ocb-tools-1.0.0.tar.gz"

template-transpiler/bin/transpile-templates.sh || die "template-transpiler/bin/transpile-templates.sh"

/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "ocb-test.sh js-tests"
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run -a u -s || die "ocb-test.sh run -a u -s"
/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh run -a b -s || die "ocb-test.sh run -a b -s"

rm -rf deploy || die "Failed to remove deploy"

mkdir -p deploy/opencat-business || die "mkdir -p deploy/opencat-business"
cp -r bin deploy/opencat-business/ || die "cp -r bin deploy/opencat-business/"
cp -r distributions deploy/opencat-business/ || die "cp -r distributions deploy/opencat-business/"
$1 > deploy/opencat-business/svn_revision.txt

cd deploy || die "cd deploy"
tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business || die "tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business"
