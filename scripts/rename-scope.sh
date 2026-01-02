#!/bin/bash

# This script renames the package scope across the project.
# Usage: ./scripts/rename-scope.sh @new-scope

NEW_SCOPE=$1

if [ -z "$NEW_SCOPE" ]; then
  echo "Usage: $0 @new-scope"
  exit 1
fi

# Validate new scope format
if [[ ! $NEW_SCOPE =~ ^@ ]]; then
  echo "Error: Scope must start with @ (e.g., @my-org)"
  exit 1
fi

# Detect current scope from package.json
OLD_SCOPE=$(grep '"name": "@' package.json | sed -E 's/.*"name": "(@[^/]+)\/.*/\1/')

if [ -z "$OLD_SCOPE" ]; then
  echo "Error: Could not detect current scope in package.json"
  exit 1
fi

echo "Targeting replacement of $OLD_SCOPE with $NEW_SCOPE"

# Define files to update
FILES=(
  "package.json"
  ".github/workflows/publish.yml"
  "src/index.ts"
)

# Function to perform replacement
replace_scope() {
  local target=$1
  local replacement=$2
  local file=$3

  if [ -f "$file" ]; then
    echo "Updating $file..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|$target|$replacement|g" "$file"
    else
      sed -i "s|$target|$replacement|g" "$file"
    fi
  fi
}

# 1. Replace the actual current scope
for file in "${FILES[@]}"; do
  replace_scope "$OLD_SCOPE" "$NEW_SCOPE" "$file"
done

# 2. Also replace common placeholders for better onboarding experience
replace_scope "@your-org" "$NEW_SCOPE" "README.md"
replace_scope "@<org>" "$NEW_SCOPE" "src/index.ts"

echo "✅ Scope successfully renamed to $NEW_SCOPE"
