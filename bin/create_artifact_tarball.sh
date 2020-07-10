#!/bin/bash -x

function die() {
  echo "ERROR: $@ failed"
  exit 1
}

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

TAR=tar

# Special case handling for macOS. The built-in "tar" command of macOS doesn't support the --exclude-vcs argument.
# Instead gnu-tar or gtar have to be used. Install wth "brew install gnu-tar"
if [ "$(uname)" == "Darwin" ]
then
    TAR=gtar
fi

${TAR} --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business || die "tar --exclude-vcs --exclude=.idea -czf opencat-business.tar.gz opencat-business"