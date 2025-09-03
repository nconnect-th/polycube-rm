#!/bin/bash

echo "Final comprehensive cleanup of nc.co.th references..."

# Exclude our own scripts from being processed
cd "/Users/mac/Desktop/Freelance1/Not Edit 2 30 Aug/polycube-rm-main"

# Clean up JSON API endpoint files with careful escaping
find . -name "*.json" -o -path "*/wp-json/*" -type f | while IFS= read -r file; do
    if [[ ! "$file" == *"replace_urls.sh"* ]] && [[ ! "$file" == *"advanced_cleanup.sh"* ]] && [[ ! "$file" == *"final_cleanup.sh"* ]]; then
        if grep -q "nc\.co\.th" "$file" 2>/dev/null; then
            echo "Cleaning JSON file: $file"
            # Create backup
            cp "$file" "$file.final_bak"
            
            # Replace JSON-escaped URLs
            sed -i '' 's|https:\\/\\/nc\\.co\\.th\\/livedemo\\/polycube\\/en\\/|./|g' "$file"
            sed -i '' 's|https:\\/\\/nc\\.co\\.th\\/livedemo\\/polycube\\/|../|g' "$file"
            sed -i '' 's|nc\\.co\\.th\\/livedemo\\/polycube\\/en|.|g' "$file"
            sed -i '' 's|nc\\.co\\.th\\/livedemo\\/polycube|..|g' "$file"
            sed -i '' 's|nc\\.co\\.th|localhost|g' "$file"
        fi
    fi
done

# Clean remaining HTML files that might have been missed
find . -name "*.html" -type f | while IFS= read -r file; do
    if [[ ! "$file" == *"replace_urls.sh"* ]] && [[ ! "$file" == *"advanced_cleanup.sh"* ]] && [[ ! "$file" == *"final_cleanup.sh"* ]]; then
        if grep -q "nc\.co\.th" "$file" 2>/dev/null; then
            echo "Final HTML cleanup: $file"
            cp "$file" "$file.final_bak"
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/en/|./|g' "$file"
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/|../|g' "$file"
            sed -i '' 's|nc\.co\.th/livedemo/polycube/en|.|g' "$file"
            sed -i '' 's|nc\.co\.th/livedemo/polycube|..|g' "$file"
            sed -i '' 's|nc\.co\.th|localhost|g' "$file"
        fi
    fi
done

# Clean any remaining text files
find . -name "*.txt" -type f | while IFS= read -r file; do
    if [[ ! "$file" == *"replace_urls.sh"* ]] && [[ ! "$file" == *"advanced_cleanup.sh"* ]] && [[ ! "$file" == *"final_cleanup.sh"* ]]; then
        if grep -q "nc\.co\.th" "$file" 2>/dev/null; then
            echo "Final text file cleanup: $file"
            cp "$file" "$file.final_bak"
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/en/|./|g' "$file"
            sed -i '' 's|https://nc\.co\.th/livedemo/polycube/|../|g' "$file"
            sed -i '' 's|nc\.co\.th|localhost|g' "$file"
        fi
    fi
done

echo "Final cleanup completed!"
echo "All backups saved with .final_bak extension"
