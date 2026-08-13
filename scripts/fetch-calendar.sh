#!/bin/bash
# Fetch the live Google Calendar ICS feed and save it as a static asset.
# Runs before each Hugo build (configured in hugo.toml).
# Result: /calendar.ics is served from the same origin, no CORS issues.

set -euo pipefail

OUT="$(dirname "$0")/../themes/rodillian/static/calendar.ics"
URL="https://calendar.google.com/calendar/ical/6jcd9u7log0u6clot6kduuntms%40group.calendar.google.com/public/basic.ics"

# Use curl with a real user-agent (Google sometimes 403s bot UAs).
if curl -sSL -A "Mozilla/5.0 (Rodillian Runners Static Site Builder)" \
        --max-time 30 \
        -o "$OUT.tmp" "$URL"; then
    # Sanity check: must look like a VCALENDAR
    if head -1 "$OUT.tmp" | grep -q "BEGIN:VCALENDAR"; then
        mv "$OUT.tmp" "$OUT"
        SIZE=$(wc -c < "$OUT")
        echo "[fetch-calendar] Saved $SIZE bytes to $OUT"
    else
        echo "[fetch-calendar] WARNING: response did not start with BEGIN:VCALENDAR"
        head -3 "$OUT.tmp" >&2
        rm -f "$OUT.tmp"
        # Don't fail the build — leave any old calendar.ics in place
        exit 0
    fi
else
    echo "[fetch-calendar] WARNING: curl failed, using cached calendar.ics if present"
    rm -f "$OUT.tmp"
    exit 0
fi
