#!/bin/sh

# Start Remix app in the background
node build/server/index.js &

# Start Storybook static server in the background
# Using port 6006 which is Storybook's default port
serve -s storybook-static -l 6006 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?