#!/bin/bash

CHROME_SANDBOX_PATH="/opt/ReMon/chrome-sandbox"
EXEC_PATH="/opt/ReMon/remon"
LINK_PATH="/usr/local/bin/remon"

# Fix sandbox perms
if [ -f "$CHROME_SANDBOX_PATH" ]; then
  chown root "$CHROME_SANDBOX_PATH"
  chmod 4755 "$CHROME_SANDBOX_PATH"
fi

# Create global symlink
if [ -f "$EXEC_PATH" ] && [ ! -e "$LINK_PATH" ]; then
  ln -s "$EXEC_PATH" "$LINK_PATH"
fi