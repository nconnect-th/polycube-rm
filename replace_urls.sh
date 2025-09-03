#!/bin/bash

# Script to replace nc.co.th references with local paths
echo "Starting URL replacement process..."

# Define the replacements
OLD_DOMAIN="https://nc.co.th/livedemo/polycube/en/"
NEW_DOMAIN=""

OLD_DOMAIN_ESCAPED="https:\/\/nc\.co\.th\/livedemo\/polycube\/en\/"
NEW_DOMAIN_ESCAPED=""

# Function to replace URLs in files
replace_in_file() {
    local file="$1"
    echo "Processing: $file"
    
    # Replace the full domain URLs with relative paths
    sed -i.bak "s|$OLD_DOMAIN_ESCAPED||g" "$file"
    
    # Clean up specific patterns
    sed -i.bak 's|https:\/\/nc\.co\.th\/livedemo\/polycube\/||g' "$file"
    sed -i.bak 's|nc\.co\.th\/livedemo\/polycube\/en\/||g' "$file"
    sed -i.bak 's|nc\.co\.th\/livedemo\/polycube\/||g' "$file"
}

# Find and process all relevant files
echo "Finding files to process..."

# Process HTML files
find . -name "*.html" -not -path "./.git/*" | while read file; do
    replace_in_file "$file"
done

# Process JSON files
find . -name "*.json" -not -path "./.git/*" | while read file; do
    replace_in_file "$file"
done

# Process JavaScript files in nc-assets-js.txt
if [ -f "nc-assets-js.txt" ]; then
    replace_in_file "nc-assets-js.txt"
fi

# Process CSS files in nc-assets-css.txt  
if [ -f "nc-assets-css.txt" ]; then
    replace_in_file "nc-assets-css.txt"
fi

echo "URL replacement completed!"
echo "Backup files with .bak extension have been created."
