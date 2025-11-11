#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VALIDATOR_JAR="$ROOT_DIR/tools/html5-validator/vnu.jar"

if [[ ! -f "$VALIDATOR_JAR" ]]; then
  echo "HTML5 validator jar not found at $VALIDATOR_JAR" >&2
  exit 1
fi

java -jar "$VALIDATOR_JAR" --skip-non-html --errors-only "$ROOT_DIR/index.html"
