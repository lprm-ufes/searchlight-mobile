#!/bin/bash
docker  run --rm -v $(pwd):/root/searchlight-mobile -it --name searchlight-mobile wancharle/cordova  bash
