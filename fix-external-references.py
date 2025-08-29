#!/usr/bin/env python3
"""
Script to remove/replace external nc.co.th references in HTML files
and make the website fully functional locally
"""

import os
import re
import glob
from pathlib import Path

def fix_html_file(file_path):
    """Fix external references in a single HTML file"""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Fix WordPress emoji settings - disable external script
    content = re.sub(
        r'"source":\{"concatemoji":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/[^"]*"\}',
        '"source":{}',
        content
    )
    
    # 2. Remove or fix oEmbed links that reference external domain
    content = re.sub(
        r'<link rel="alternate" title="oEmbed \([^"]*\)" type="[^"]*" href="[^"]*https:%252F%252Fnc\.co\.th[^"]*" />',
        '<!-- oEmbed link removed for local usage -->',
        content
    )
    
    # 3. Fix JavaScript configuration objects
    # jetMenuPublicSettings
    content = re.sub(
        r'"ajaxUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-admin\\\/admin-ajax\.php"',
        '"ajaxUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getElementorTemplateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-json[^"]*"',
        '"getElementorTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getBlocksTemplateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-json[^"]*"',
        '"getBlocksTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"menuItemsApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-json[^"]*"',
        '"menuItemsApiUrl":"#"',
        content
    )
    
    # elementorFrontendConfig
    content = re.sub(
        r'"assets":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-content\\\/plugins\\\/elementor\\\/assets\\\/"',
        '"assets":"wp-content/plugins/elementor/assets/"',
        content
    )
    
    content = re.sub(
        r'"ajaxurl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-admin\\\/admin-ajax\.php"',
        '"ajaxurl":"#"',
        content
    )
    
    content = re.sub(
        r'"uploadUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-content\\\/uploads"',
        '"uploadUrl":"wp-content/uploads"',
        content
    )
    
    # ElementorProFrontendConfig
    content = re.sub(
        r'"rest":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-json\\\/"',
        '"rest":"#"',
        content
    )
    
    content = re.sub(
        r'"defaultAnimationUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-content[^"]*"',
        '"defaultAnimationUrl":"wp-content/plugins/elementor-pro/modules/lottie/assets/animations/default.json"',
        content
    )
    
    # Other plugin configurations
    content = re.sub(
        r'"templateApiUrl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-json[^"]*"',
        '"templateApiUrl":"#"',
        content
    )
    
    # JetBlogSettings
    content = re.sub(
        r'"ajaxurl":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/[^"]*"',
        '"ajaxurl":"#"',
        content
    )
    
    # 4. Fix featured images that still reference external domain
    content = re.sub(
        r'"featuredImage":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/wp-content\\\/uploads\\\/([^"]*)"',
        r'"featuredImage":"wp-content/uploads/\1"',
        content
    )
    
    # 5. Fix privacy policy content
    content = re.sub(
        r'Our website address is: https://nc\.co\.th/livedemo/polycube\.',
        'Our website address is: [Your Local Website URL].',
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
    """Main function to process all HTML files"""
    # Get current directory
    base_dir = Path(__file__).parent
    
    # Find all HTML files
    html_files = []
    
    # Add specific patterns to search
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
    
    print(f"Found {len(html_files)} HTML files to process")
    print("-" * 50)
    
    updated_count = 0
    for file_path in html_files:
        if fix_html_file(file_path):
            updated_count += 1
    
    print("-" * 50)
    print(f"Processing complete!")
    print(f"Updated {updated_count} files out of {len(html_files)} total files")
    
    # Additional recommendations
    print("\n📋 Additional Recommendations:")
    print("1. The website should now work locally without external dependencies")
    print("2. JavaScript functionality requiring server-side APIs will be disabled")
    print("3. Contact forms and dynamic features may not work without a backend")
    print("4. Consider setting up a local web server for testing")
    print("5. Update any remaining domain references manually if needed")

if __name__ == "__main__":
    main()