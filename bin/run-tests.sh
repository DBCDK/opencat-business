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

rm -rf deploy || die "rm -rf deploy"

mkdir -p deploy/opencat-business || die "mkdir -p deploy/opencat-business"
cp -r bin deploy/opencat-business/ || die "cp -r bin deploy/opencat-business/"
cp -r distributions deploy/opencat-business/ || die "cp -r distributions deploy/opencat-business/"

if [ -n "$1" ];
    then
        echo "opencat-business revision : $1" > deploy/opencat-business/svn_revision.txt;
    else
        echo "svn revision could not be resolved" > deploy/opencat-business/svn_revision.txt;
fi

cd deploy || die "cd deploy"
tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business || die "tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business"
