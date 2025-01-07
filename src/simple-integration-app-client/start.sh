#!/bin/sh

# Default ports if environment variables are not set
: "${REMIX_PORT:=3000}"
: "${STORYBOOK_PORT:=6006}"

# Start Remix app in the background
PORT=$REMIX_PORT node build/server/index.js &

# Start Storybook static server in the background
serve -s storybook-static -l $STORYBOOK_PORT &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?