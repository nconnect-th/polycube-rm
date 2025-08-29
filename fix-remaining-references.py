#!/usr/bin/env python3
"""
Enhanced script to handle remaining external nc.co.th references
"""

import os
import re
import glob
from pathlib import Path

def fix_remaining_references(file_path):
    """Fix the remaining external references that were missed in the first pass"""
    print(f"Processing remaining refs in: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix the remaining ElementorProFrontendConfig assets paths
    content = re.sub(
        r'"assets":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/([^"]*)"',
        r'"assets":"wp-content/plugins/elementor-pro/assets/"',
        content
    )
    
    # Fix the remaining elementorFrontendConfig assets and upload paths
    content = re.sub(
        r'"assets":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/([^"]*)"',
        r'"assets":"wp-content/plugins/elementor/assets/"',
        content
    )
    
    content = re.sub(
        r'"uploadUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/([^"]*)"',
        r'"uploadUrl":"wp-content/uploads"',
        content
    )
    
    # Fix jetMenuPublicSettings and jetElements URLs for /en subdirectory
    content = re.sub(
        r'"ajaxUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-admin\\\/admin-ajax\.php"',
        '"ajaxUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getElementorTemplateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-json[^"]*"',
        '"getElementorTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getBlocksTemplateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-json[^"]*"',
        '"getBlocksTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"menuItemsApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-json[^"]*"',
        '"menuItemsApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"templateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-json[^"]*"',
        '"templateApiUrl":"#"',
        content
    )
    
    # Fix ElementorProFrontendConfig rest URLs
    content = re.sub(
        r'"rest":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-json\\\/"',
        '"rest":"#"',
        content
    )
    
    # Fix lottie defaultAnimationUrl for /en subdirectory
    content = re.sub(
        r'"defaultAnimationUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-content[^"]*"',
        '"defaultAnimationUrl":"en/wp-content/plugins/elementor-pro/modules/lottie/assets/animations/default.json"',
        content
    )
    
    # Fix featured images for /en subdirectory
    content = re.sub(
        r'"featuredImage":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/en\\\/wp-content\\\/uploads\\\/([^"]*)"',
        r'"featuredImage":"en/wp-content/uploads/\1"',
        content
    )
    
    # Fix remaining oEmbed links that have URL-encoded domain in href attributes
    content = re.sub(
        r'<link rel="alternate" title="oEmbed \([^"]*\)" type="[^"]*" href="[^"]*https%3A%2F%2Fnc\.co\.th[^"]*" />',
        '<!-- oEmbed link removed for local usage -->',
        content
    )
    
    # Write back if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {file_path}")
        return True
    else:
        print(f"  - No changes needed for {file_path}")
        return False

def main():
    """Main function to process files with remaining references"""
    base_dir = Path(__file__).parent
    
    # Find all HTML files with remaining nc.co.th references
    html_files = []
    
    patterns = [
        "*.html",
        "*/*.html",
        "*/*/*.html",
        "en/*.html",
        "en/*/*.html"
    ]
    
    for pattern in patterns:
        html_files.extend(glob.glob(str(base_dir / pattern)))
    
    # Remove duplicates and sort
    html_files = sorted(list(set(html_files)))
    
    print(f"Processing {len(html_files)} HTML files for remaining references")
    print("-" * 50)
    
    updated_count = 0
    for file_path in html_files:
        # Check if file contains nc.co.th
        with open(file_path, 'r', encoding='utf-8') as f:
            if 'nc.co.th' in f.read():
                if fix_remaining_references(file_path):
                    updated_count += 1
    
    print("-" * 50)
    print(f"Second pass complete! Updated {updated_count} additional files")

if __name__ == "__main__":
    main()