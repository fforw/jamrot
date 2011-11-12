#!/bin/sh

DEPLOY_SERVER=myweb
DEPLOY_PATH=/var/www/static/demo/jamrot

rsync -rvIz --rsh=ssh --exclude=.git/** ./ $DEPLOY_SERVER:$DEPLOY_PATH
