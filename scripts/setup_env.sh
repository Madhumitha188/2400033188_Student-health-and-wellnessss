#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required. Install Python 3 from python.org or: brew install python"
  exit 1
fi

if [ ! -d .venv ]; then
  echo "Creating Python virtual environment at .venv ..."
  python3 -m venv .venv
fi

# shellcheck source=/dev/null
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

echo "Installing Node dependencies ..."
npm install
# Some systems leave node_modules/.bin shims without +x; node avoids that.
chmod -R u+x node_modules/.bin 2>/dev/null || true

echo ""
echo "Done."
echo "Activate the environment in this shell:"
echo "  source .venv/bin/activate"
echo "Then start both servers:"
echo "  ./scripts/run_project.sh"
echo ""
echo "You need JDK 17 on your PATH (backend uses ./mvnw — no global Maven required):"
echo "  brew install openjdk@17 && echo 'export PATH=\"/opt/homebrew/opt/openjdk@17/bin:\$PATH\"' >> ~/.zshrc"
