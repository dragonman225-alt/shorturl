#!/bin/bash

# Run this script at the top level directory of the project.

rm -rf dist
mkdir -p dist
cp -r frontend/build dist/frontend
cp -r backend/build dist/backend
cp create-dist/package.json dist/package.json
cp create-dist/ormconfig.json dist/ormconfig.json
git subtree push --prefix dist origin deploy