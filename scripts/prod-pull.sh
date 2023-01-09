#!/bin/bash

# Pulls the latest commit from the production branch
git fetch origin master
get reset --hard origin/master

# Install or update dependencies
npm install

# Builds the latest commit
npm run build