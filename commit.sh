#!/usr/bin/env bash

set -euo pipefail

REQUIRED_EMAIL="li_ao_365@outlook.com"
REQUIRED_NAME="LiAo365"

CURRENT_EMAIL=$(git config --local --get user.email || true)
CURRENT_NAME=$(git config --local --get user.name || true)

if [ "$CURRENT_EMAIL" != "$REQUIRED_EMAIL" ]; then
	git config --local user.email "$REQUIRED_EMAIL"
	echo "user.email set to $REQUIRED_EMAIL"
fi

if [ "$CURRENT_NAME" != "$REQUIRED_NAME" ]; then
	git config --local user.name "$REQUIRED_NAME"
	echo "user.name set to $REQUIRED_NAME"
fi

git pull
git add .

read -rp "Commit message: " COMMIT_MSG
while [ -z "${COMMIT_MSG}" ]; do
	read -rp "Commit message (cannot be empty): " COMMIT_MSG
done

git commit -a -m "[$(TZ='UTC-8' date +'%m-%d %H:%M:%S')] ${COMMIT_MSG}"
git push origin main