#!/bin/bash
# Sefaperp Foods — Auto-push supervisor (robust version)
# Restarts the inner watcher if it ever dies, ensuring continuous auto-push.
# The GH_TOKEN is read from /home/z/my-project/.gh_token (gitignored) or env var.

cd /home/z/my-project || exit 1

LOG="/home/z/my-project/scripts/auto-push.log"

# Load token from gitignored file if it exists, otherwise from env
if [ -f /home/z/my-project/.gh_token ]; then
  export GH_TOKEN=$(cat /home/z/my-project/.gh_token | tr -d '[:space:]')
fi

if [ -z "$GH_TOKEN" ]; then
  echo "[supervisor] $(date '+%H:%M:%S') — ERROR: GH_TOKEN not set. Put token in /home/z/my-project/.gh_token or set GH_TOKEN env var." >> "$LOG"
  exit 1
fi

echo "[supervisor] $(date '+%H:%M:%S') — Supervisor started. Token loaded. Watching for changes..." >> "$LOG"

while true; do
  echo "[supervisor] $(date '+%H:%M:%S') — Starting inner watcher..." >> "$LOG"
  bash /home/z/my-project/scripts/auto-push-inner.sh
  EXIT_CODE=$?
  echo "[supervisor] $(date '+%H:%M:%S') — Inner watcher exited (code $EXIT_CODE), restarting in 3s..." >> "$LOG"
  sleep 3
done
