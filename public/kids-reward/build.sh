#!/bin/sh
# Rebuild index.html (installable app) from stamp-card.html (the Artifact page).
cd "$(dirname "$0")" && { cat head.html; cat stamp-card.html; printf '\n</body></html>\n'; } > index.html
