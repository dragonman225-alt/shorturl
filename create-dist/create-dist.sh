#!/bin/bash

# Run this script at the top level directory of the project.

# Build frontend
pushd frontend
yarn build
popd

# Build backend
pushd backend
yarn build
popd

# Create dist
rm -rf dist
mkdir -p dist
cp -r frontend/build dist/frontend
cp -r backend/build dist/backend
node create-dist/generatePackageJson.js > dist/package.json
cp create-dist/ormconfig.json dist/ormconfig.json

# Need to commit to current branch so that git subtree can detect changes
git add dist
git commit -m "chore: create dist"

# Create (force-push) subtree and deploy
# https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b
git subtree split --prefix dist -b deploy # Create tmp local branch
git push -f origin deploy:deploy # Force-push the branch
git branch -D deploy # Delete tmp local branch
