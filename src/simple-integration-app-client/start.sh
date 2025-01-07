#!/bin/sh

# Function to log with timestamps
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1"
}

# Make sure the port is correctly set
: "${PORT:=8080}"
: "${HOST:=0.0.0.0}"

log "Starting Remix app on ${HOST}:${PORT}..."
NODE_ENV=production pnpm remix-serve build/server/index.js --port $PORT --host $HOST 2>&1 | tee app.log &
APP_PID=$!

# Give process a moment to start up
sleep 5

# Initial check to make sure process started successfully
if ! kill -0 $APP_PID 2>/dev/null; then
    log "ERROR: App failed to start! Check logs:"
    cat app.log
    exit 1
fi

log "Service started successfully. Monitoring..."

# Function to check if a process is still running
is_running() {
    kill -0 $1 2>/dev/null
    return $?
}

# Monitor the process and log its status
while true; do
    if ! is_running $APP_PID; then
        log "App (PID $APP_PID) stopped unexpectedly"
        log "Last 10 lines of logs:"
        tail -n 10 app.log
        exit 1
    fi
    
    sleep 5
done