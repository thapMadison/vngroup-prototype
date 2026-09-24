#!/bin/bash
# dùng: shot.sh <file.html tương đối> <out.png> <w> <h>
ROOT="$(cd "$(dirname "$0")/.." && pwd -W)"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=4000 --screenshot="$ROOT/_qa/$2" --window-size=$3,$4 "file:///$ROOT/$1" >/dev/null 2>&1
echo "$ROOT/_qa/$2"
