#!/bin/bash
for f in *.sh; do
    if [[ "$f" == "_runall.sh" ]]
    then
        continue
    fi
    bash "$f" -H 
done