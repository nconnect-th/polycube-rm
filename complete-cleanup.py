#!/usr/bin/env python3
"""
Complete cleanup script to handle ALL remaining external nc.co.th references
This script handles:
1. WordPress REST API JSON files
2. Background video URLs
3. Files with special characters in names
4. Any other remaining references
"""

import os
import re
import json
from pathlib import Path

def find_all_files(directory):
    """Recursively find all HTML files including ones with special characters"""
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def fix_wp_json_file(file_path):
    """Special handling for WordPress REST API JSON files"""
    print(f"Processing REST API file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace ALL nc.co.th domain references with local equivalents
    # This handles the WordPress REST API JSON content
    
    # 1. Replace site URL and home URL
    content = re.sub(
        r'"url":"https:\\?/?\\?/?nc\.co\.th\\?/?livedemo\\?/?polycube\\?/?([^"]*)"',
        '"url":"."',
        content
    )
    
    content = re.sub(
        r'"home":"https:\\?/?\\?/?nc\.co\.th\\?/?livedemo\\?/?polycube\\?/?([^"]*)"',
        '"home":"."',
        content
    )
    
    # 2. Replace authorization endpoints
    content = re.sub(
        r'"authorization":"https:\\?/?\\?/?nc\.co\.th[^"]*"',
        '"authorization":"#"',
        content
    )
    
    # 3. Replace all API endpoints and links
    content = re.sub(
        r'"href":"https:\\?/?\\?/?nc\.co\.th[^"]*"',
        '"href":"#"',
        content
    )
    
    # 4. Replace site icon URL
    content = re.sub(
        r'"site_icon_url":"https:\\?/?\\?/?nc\.co\.th[^"]*"',
        '"site_icon_url":"wp-content/uploads/2024/09/cropped-Favicon.png"',
        content
    )
    
    # 5. Replace any remaining nc.co.th references
    content = re.sub(
        r'https:\\?/?\\?/?nc\.co\.th\\?/?livedemo\\?/?polycube[^"]*',
        '#',
        content
    )
    
    return content != original_content, content

def fix_background_video(file_path):
    """Fix background video URLs in Elementor settings"""
    print(f"Processing background video: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix background video URL
    content = re.sub(
        r'"background_video_link":"https:\\?/?\\?/?nc\.co\.th\\?/?livedemo\\?/?polycube\\?/?([^"]*wp-content\\?/?uploads[^"]*)"',
        r'"background_video_link":"wp-content/uploads/2024/12/6843213_Animation_Globe_1920x1080-3.mp4"',
        content
    )
    
    return content != original_content, content

def fix_standard_references(file_path):
    """Fix standard HTML files with any remaining references"""
    print(f"Processing standard file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix any remaining nc.co.th references
    content = re.sub(
        r'https://nc\.co\.th/livedemo/polycube[^"\'>\s]*',
        '#',
        content
    )
    
    content = re.sub(
        r'https:\\?/?\\?/?nc\.co\.th\\?/?livedemo\\?/?polycube[^"\'>\s]*',
        '#',
        content
    )
    
    return content != original_content, content

def main():
    """Main function to process ALL remaining files"""
    base_dir = Path(__file__).parent
    
    # Find ALL HTML files recursively
    html_files = find_all_files(str(base_dir))
    
    print(f"Found {len(html_files)} HTML files to check")
    print("=" * 60)
    
    updated_count = 0
    
    for file_path in html_files:
        # Check if file contains nc.co.th
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if 'nc.co.th' not in f.read():
                    continue
            
            file_updated = False
            new_content = None
            
            # Special handling for different file types
            if 'wp-json' in file_path:
                file_updated, new_content = fix_wp_json_file(file_path)
            elif 'dynamic-currency-conversion-dcc' in file_path:
                file_updated, new_content = fix_background_video(file_path)
            else:
                file_updated, new_content = fix_standard_references(file_path)
            
            # Write back if content changed
            if file_updated and new_content is not None:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"  ✅ Updated: {file_path}")
                updated_count += 1
            else:
                print(f"  ⚠️  No changes needed: {file_path}")
                
        except Exception as e:
            print(f"  ❌ Error processing {file_path}: {e}")
    
    print("=" * 60)
    print(f"Complete cleanup finished! Updated {updated_count} files")
    
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
        for file_path in remaining_files:
            print(f"  - {file_path}")
    else:
        print("🎉 SUCCESS! All nc.co.th references have been completely removed!")
        print("Your website is now fully localized and ready to run offline.")

if __name__ == "__main__":
    main()