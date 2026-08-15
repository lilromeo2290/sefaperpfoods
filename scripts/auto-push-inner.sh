#!/bin/bash
# Sefaperp Foods — Auto-push watcher (inner loop)
# Watches for file changes every 2 seconds and immediately commits + pushes.
# Supervised by auto-push-supervisor.sh which restarts it if it dies.
#
# SECURITY: The GitHub token is read from the GH_TOKEN environment variable.
# We use git's -c credential helper to pass the token WITHOUT putting it in
# any URL or file, so GitHub's secret scanning won't flag this script.

cd /home/z/my-project || exit 1

LOG="/home/z/my-project/scripts/auto-push.log"

GH_TOKEN="${GH_TOKEN:-}"
if [ -z "$GH_TOKEN" ]; then
  echo "[auto-push] $(date '+%H:%M:%S') — ERROR: GH_TOKEN env var not set. Exiting." >> "$LOG"
  exit 1
fi

while true; do
  CHANGES=$(git status --porcelain 2>/dev/null)
  if [ -n "$CHANGES" ]; then
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    CHANGED_COUNT=$(echo "$CHANGES" | wc -l | xargs)

    echo "[auto-push] $TIMESTAMP — $CHANGED_COUNT files changed, committing..." >> "$LOG"

    git add -A >>"$LOG" 2>&1
    git commit -m "Auto-push: $CHANGED_COUNT files updated ($TIMESTAMP)" --no-verify >>"$LOG" 2>&1

    # Push using credential helper (token passed via process substitution, never in URL or file)
    GIT_TERMINAL_PROMPT=0 git -c credential.helper='!f() { echo "username=lilromeo2290"; echo "password=$GH_TOKEN"; }; f' push origin main >>"$LOG" 2>&1
    if [ $? -eq 0 ]; then
      NEW_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "?")
      echo "[auto-push] $(date '+%H:%M:%S') — Pushed $NEW_HASH ($CHANGED_COUNT files)" >> "$LOG"
    else
      echo "[auto-push] $(date '+%H:%M:%S') — Push failed" >> "$LOG"
    fi
    echo "" >> "$LOG"
  fi

  sleep 2
done
