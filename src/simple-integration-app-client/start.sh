#!/bin/sh

# Function to log with timestamps
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1"
}

log "Starting Remix app..."
# Use pnpm's bin directory
NODE_ENV=production pnpm remix-serve build/server/index.js 2>&1 | tee remix.log &
REMIX_PID=$!

log "Starting Storybook static server..."
# Start Storybook static server in the background
serve -s storybook-static -l 6006 2>&1 | tee storybook.log &
STORYBOOK_PID=$!

log "Services started. Monitoring..."

# Function to check if a process is still running
is_running() {
    kill -0 $1 2>/dev/null
    return $?
}

# Monitor both processes and log their status
while true; do
    if ! is_running $REMIX_PID; then
        log "Remix app (PID $REMIX_PID) stopped unexpectedly"
        log "Last 10 lines of Remix logs:"
        tail -n 10 remix.log
        exit 1
    fi
    
    if ! is_running $STORYBOOK_PID; then
        log "Storybook (PID $STORYBOOK_PID) stopped unexpectedly"
        log "Last 10 lines of Storybook logs:"
        tail -n 10 storybook.log
        exit 1
    fi
    
    sleep 5
done