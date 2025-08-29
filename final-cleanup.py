#!/usr/bin/env python3
"""
Final comprehensive script to handle ALL remaining external nc.co.th references
"""

import os
import re
from pathlib import Path

def find_all_html_files(directory):
    """Recursively find all HTML files"""
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def fix_all_references(file_path):
    """Fix ALL external references in a file"""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Fix WordPress emoji settings
    content = re.sub(
        r'"source":\{"concatemoji":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube[^"]*"\}',
        '"source":{}',
        content
    )
    
    # 2. Remove ALL oEmbed links
    content = re.sub(
        r'<link rel="alternate" title="oEmbed \([^"]*\)" type="[^"]*" href="[^"]*nc\.co\.th[^"]*" />',
        '<!-- oEmbed link removed for local usage -->',
        content
    )
    
    # 3. Fix ALL JavaScript configurations
    # jetMenuPublicSettings
    content = re.sub(
        r'"ajaxUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"ajaxUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getElementorTemplateApiUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"getElementorTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"getBlocksTemplateApiUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"getBlocksTemplateApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"menuItemsApiUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"menuItemsApiUrl":"#"',
        content
    )
    
    content = re.sub(
        r'"templateApiUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"templateApiUrl":"#"',
        content
    )
    
    # elementorFrontendConfig and ElementorProFrontendConfig
    content = re.sub(
        r'"assets":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/[^"]*wp-content\\\/plugins\\\/elementor\\\/assets[^"]*"',
        '"assets":"wp-content/plugins/elementor/assets/"',
        content
    )
    
    content = re.sub(
        r'"assets":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/[^"]*wp-content\\\/plugins\\\/elementor-pro\\\/assets[^"]*"',
        '"assets":"wp-content/plugins/elementor-pro/assets/"',
        content
    )
    
    content = re.sub(
        r'"uploadUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"uploadUrl":"wp-content/uploads"',
        content
    )
    
    content = re.sub(
        r'"rest":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"rest":"#"',
        content
    )
    
    # element_pack_ajax_login_config and ElementPackConfig
    content = re.sub(
        r'"ajaxurl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"ajaxurl":"#"',
        content
    )
    
    # JetBlogSettings
    content = re.sub(
        r'"ajaxurl":"https:\\\/\\\/nc\.co\.th[^"]*jet_blog_ajax=1"',
        '"ajaxurl":"#"',
        content
    )
    
    # Lottie animations
    content = re.sub(
        r'"defaultAnimationUrl":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"defaultAnimationUrl":"wp-content/plugins/elementor-pro/modules/lottie/assets/animations/default.json"',
        content
    )
    
    # 4. Fix background video URLs
    content = re.sub(
        r'"background_video_link":"https:\\\/\\\/nc\.co\.th\\\/livedemo\\\/polycube\\\/[^"]*wp-content\\\/uploads\\\/([^"]*)"',
        r'"background_video_link":"wp-content/uploads/\1"',
        content
    )
    
    # 5. Fix featured images
    content = re.sub(
        r'"featuredImage":"https:\\\/\\\/nc\.co\.th[^"]*"',
        '"featuredImage":false',
        content
    )
    
    # 6. Fix privacy policy content
    content = re.sub(
        r'Our website address is: https://nc\.co\.th[^.]*\.',
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
    """Main function to process ALL HTML files recursively"""
    base_dir = Path(__file__).parent
    
    # Find ALL HTML files recursively
    html_files = find_all_html_files(str(base_dir))
    
    print(f"Found {len(html_files)} HTML files to process recursively")
    print("-" * 50)
    
    updated_count = 0
    for file_path in html_files:
        # Check if file contains nc.co.th
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if 'nc.co.th' in f.read():
                    if fix_all_references(file_path):
                        updated_count += 1
        except Exception as e:
            print(f"  Error processing {file_path}: {e}")
    
    print("-" * 50)
    print(f"Final pass complete! Updated {updated_count} additional files")
    
    # Final verification
    print("\n🔍 Running final verification...")
    remaining_files = []
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if 'nc.co.th' in f.read():
                    remaining_files.append(file_path)
        except Exception:
            pass
    
    if remaining_files:
        print(f"⚠️  Warning: {len(remaining_files)} files still contain nc.co.th references:")
        for file_path in remaining_files[:10]:  # Show first 10
            print(f"  - {file_path}")
        if len(remaining_files) > 10:
            print(f"  ... and {len(remaining_files) - 10} more")
    else:
        print("✅ Success! All nc.co.th references have been removed!")

if __name__ == "__main__":
    main()