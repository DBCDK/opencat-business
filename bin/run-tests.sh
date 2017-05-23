#!/bin/bash -x

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q http://is.dbc.dk/job/ocb-tools-head/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz || die "wget -q http://is.dbc.dk/job/ocb-tools-head/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz"
tar -xf ocb-tools-1.0.0.tar.gz || die "tar -xf ocb-tools-1.0.0.tar.gz"

template-transpiler/bin/transpile-templates.sh || die "template-transpiler/bin/transpile-templates.sh"

/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests"


