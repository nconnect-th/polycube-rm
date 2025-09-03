#!/bin/bash

echo "Advanced URL cleanup process..."

# Process all files recursively
find . -type f \( -name "*.html" -o -name "*.json" -o -name "*.txt" -o -name "*.js" -o -name "*.css" \) -not -path "./.git/*" -not -name "*.bak*" | while read file; do
    if [[ -f "$file" ]]; then
        # Check if file contains nc.co.th references
        if grep -q "nc\.co\.th" "$file" 2>/dev/null; then
            echo "Cleaning: $file"
            
            # Create backup
            cp "$file" "$file.backup"
            
            # Multiple replacement patterns
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/en/|./|g' "$file"
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/|./|g' "$file"
            sed -i '' 's|https:\\/\\/nc\\.co\\.th\\/livedemo\\/polycube\\/en\\/|./|g' "$file"
            sed -i '' 's|https:\\/\\/nc\\.co\\.th\\/livedemo\\/polycube\\/|./|g' "$file"
            sed -i '' 's|nc\.co\.th/livedemo/polycube/en/|./|g' "$file"
            sed -i '' 's|nc\.co\.th/livedemo/polycube/|./|g' "$file"
            sed -i '' 's|nc\\.co\\.th\\/livedemo\\/polycube\\/en\\/|./|g' "$file"
            sed -i '' 's|nc\\.co\\.th\\/livedemo\\/polycube\\/|./|g' "$file"
            
            # Clean up any remaining nc.co.th references
            sed -i '' 's|nc\.co\.th[^"]*||g' "$file"
            sed -i '' 's|nc\\.co\\.th[^"]*||g' "$file"
        fi
    fi
done

echo "Advanced cleanup completed!"
