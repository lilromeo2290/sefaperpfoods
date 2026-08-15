#!/bin/bash
# Sefaperp Foods — Auto-push supervisor
# This wrapper restarts the watcher if it ever dies, ensuring continuous auto-push.
cd /home/z/my-project || exit 1

while true; do
  echo "[supervisor] $(date '+%H:%M:%S') — Starting auto-push watcher..." >> /home/z/my-project/scripts/auto-push.log
  bash /home/z/my-project/scripts/auto-push-inner.sh
  EXIT_CODE=$?
  echo "[supervisor] $(date '+%H:%M:%S') — Watcher exited with code $EXIT_CODE, restarting in 3s..." >> /home/z/my-project/scripts/auto-push.log
  sleep 3
done
