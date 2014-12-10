#!/bin/bash

SHELL_CMD=dbc-jsshell
SEARCH_PATH_ARGS="-a file:. -a file:../rules -a file:../modules -a file:../modules/unittests -l jstest.log -L info" 

$SHELL_CMD $SEARCH_PATH_ARGS TemplateTest.js
