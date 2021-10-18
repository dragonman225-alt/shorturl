#!/bin/bash

# Run this script at the top level directory of the project.

rm -rf dist
mkdir -p dist
cp -r frontend/build dist/frontend
cp -r backend/build dist/backend
cp create-dist/package.json dist/package.json
cp create-dist/ormconfig.json dist/ormconfig.json

# Force-push subtree
# https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b

git subtree split --prefix dist -b deploy # Create tmp local branch
git push -f origin deploy:deploy # Force-push the branch
git branch -D deploy # Delete tmp local branch