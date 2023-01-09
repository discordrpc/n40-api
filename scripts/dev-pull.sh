#!/bin/bash

# Pulls the latest commit from the dev branch
git fetch origin dev
git reset --hard origin/dev

# Install or update dependencies
npm install

# Builds the latest commit
npm run build