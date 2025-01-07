#!/bin/sh
# Start Storybook static server in background
serve -s storybook-static -l 6006 &
# Start Remix
npm start