#!/bin/bash

# move to app root so node can use .env
cd "$(pwd)/$(dirname $0)/.."

echo 'Server is starting...'

node authorization-server.js

echo 'You are now authenticated.'
