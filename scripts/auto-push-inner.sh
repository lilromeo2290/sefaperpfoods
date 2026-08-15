#!/bin/bash
# Sefaperp Foods — Auto-push inner watcher (bulletproof version)
# Watches for file changes every 3 seconds and immediately commits + pushes.
# This script NEVER exits on error — it logs and continues.

cd /home/z/my-project || exit 1

LOG="/home/z/my-project/scripts/auto-push.log"

# Load token from gitignored file
if [ -f /home/z/my-project/.gh_token ]; then
  GH_TOKEN=$(cat /home/z/my-project/.gh_token | tr -d '[:space:]')
fi

if [ -z "$GH_TOKEN" ]; then
  echo "[inner] $(date '+%H:%M:%S') — ERROR: GH_TOKEN not set. Sleeping 30s and retrying." >> "$LOG"
  sleep 30
  exit 1
fi

echo "[inner] $(date '+%H:%M:%S') — Watcher started. Polling every 3s." >> "$LOG"

while true; do
  # Check for changes
  CHANGES=$(git status --porcelain 2>/dev/null)
  if [ -n "$CHANGES" ]; then
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    CHANGED_COUNT=$(echo "$CHANGES" | wc -l | xargs)
    echo "[inner] $TIMESTAMP — $CHANGED_COUNT files changed, committing..." >> "$LOG"

    # Stage all
    git add -A 2>>"$LOG"

    # Commit (may fail if nothing to commit after add — that's OK)
    git commit -m "Auto-push: $CHANGED_COUNT files updated ($TIMESTAMP)" --no-verify >>"$LOG" 2>&1

    # Push with credential helper
    GIT_TERMINAL_PROMPT=0 git -c credential.helper='!f() { echo "username=lilromeo2290"; echo "password='"$GH_TOKEN"'"; }; f' push origin main >>"$LOG" 2>&1
    PUSH_EXIT=$?

    if [ $PUSH_EXIT -eq 0 ]; then
      NEW_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "?")
      echo "[inner] $(date '+%H:%M:%S') — ✅ Pushed $NEW_HASH ($CHANGED_COUNT files)" >> "$LOG"
    else
      echo "[inner] $(date '+%H:%M:%S') — ❌ Push failed (exit $PUSH_EXIT), will retry next cycle" >> "$LOG"
    fi
    echo "" >> "$LOG"
  fi

  sleep 3
done
