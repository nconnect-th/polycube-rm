#!/bin/bash

# PolycubeWeb2025 Deployment Script
# This script prepares the website for deployment to GitHub Pages or other static hosting

echo "🚀 Preparing PolycubeWeb2025 for deployment..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root directory."
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="deploy"
echo "📁 Creating deployment directory..."
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy all necessary files
echo "📋 Copying files..."
cp -r *.html $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  No HTML files found in root"
cp -r assets/ $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  Assets directory not found"
cp -r wp-content/ $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  wp-content directory not found"
cp -r en/ $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  en directory not found"
cp -r news/ $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  news directory not found"
cp -r product/ $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  product directory not found"
cp README.md $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  README.md not found"

# Don't copy server.py to deployment
echo "🔒 Excluding development files from deployment..."

# Verify deployment
echo "✅ Checking deployment integrity..."
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing in deployment"
    exit 1
fi

if [ -d "$DEPLOY_DIR/assets" ]; then
    echo "✅ assets directory found"
else
    echo "❌ assets directory missing in deployment"
    exit 1
fi

if [ -d "$DEPLOY_DIR/wp-content" ]; then
    echo "✅ wp-content directory found"
else
    echo "❌ wp-content directory missing in deployment"
    exit 1
fi

# Count files
FILE_COUNT=$(find $DEPLOY_DIR -type f | wc -l)
echo "📊 Total files in deployment: $FILE_COUNT"

echo ""
echo "🎉 Deployment ready!"
echo "📁 Files are in the '$DEPLOY_DIR' directory"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of '$DEPLOY_DIR' to your web hosting"
echo "2. For GitHub Pages: commit and push the '$DEPLOY_DIR' contents to your repository"
echo "3. For other hosting: upload '$DEPLOY_DIR' contents to your web server"
echo ""
echo "🌐 The website will work completely offline and on any static hosting service!"

# Optional: Create a zip file for easy upload
echo "📦 Creating deployment archive..."
cd $DEPLOY_DIR
zip -r ../polycube-website-$(date +%Y%m%d-%H%M%S).zip . -q
cd ..
echo "✅ Archive created: polycube-website-$(date +%Y%m%d-%H%M%S).zip"
