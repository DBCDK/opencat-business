#!/bin/bash -x

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

rm -rf ocb-tools-1.0.0 2>/dev/null
rm ocb-tools-1.0.0.* 2>/dev/null

wget -q https://is.dbc.dk/view/metascrum/job/updateservice/job/ocb-tools/job/master/lastSuccessfulBuild/artifact/target/dist/ocb-tools-1.0.0.tar.gz || die "wget -q ocb-tools failed"
tar -xf ocb-tools-1.0.0.tar.gz || die "tar -xf ocb-tools-1.0.0.tar.gz"

/bin/bash target/dist/ocb-tools-1.0.0/bin/ocb-test.sh js-tests  || die "/bin/bash ocb-tools-1.0.0/bin/ocb-test.sh js-tests"


