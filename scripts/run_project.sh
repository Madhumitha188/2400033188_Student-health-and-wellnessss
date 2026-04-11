#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .venv/bin/activate ]; then
  echo "Run ./scripts/setup_env.sh first."
  exit 1
fi

# shellcheck source=/dev/null
source .venv/bin/activate

if [ -z "${JAVA_HOME:-}" ]; then
  if command -v /usr/libexec/java_home >/dev/null 2>&1; then
    JAVA_HOME="$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null || true)"
    export JAVA_HOME
  fi
fi
if [ -n "${JAVA_HOME:-}" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

if ! command -v java >/dev/null 2>&1; then
  echo "Java not found. Install JDK 17, for example:"
  echo "  brew install openjdk@17"
  echo "Then add to ~/.zshrc:"
  echo "  export PATH=\"/opt/homebrew/opt/openjdk@17/bin:\$PATH\""
  exit 1
fi

if [ ! -x "$ROOT/backend/mvnw" ]; then
  echo "backend/mvnw not found or not executable."
  exit 1
fi

echo "Starting API (port 8080) and web (port 3000). Press Ctrl+C to stop both."
exec honcho start
