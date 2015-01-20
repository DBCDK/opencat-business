#!/bin/bash

for filename in *.json; do
    echo "Tester fil <$filename>"
    python -m json.tool $filename > /dev/null
    if (($? == 0)); then
        echo "JSON filen <$filename> validerer ok"
        echo ""
    else
        echo "JSON filen <$filename> validerer ikke ok"
        echo ""
    fi
done
