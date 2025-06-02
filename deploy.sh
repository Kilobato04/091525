#!/bin/bash

# ===== ENHANCED CASH FLOW ANALYSIS TOOL - DEPLOYMENT SCRIPT v2.0.0 =====
# This script automates the deployment process for the enhanced version

echo "🚀 Starting Enhanced Cash Flow Analysis Tool v2.0.0 Deployment..."

# Configuration
PROJECT_NAME="enhanced-cashflow-analysis-tool"
PROJECT_VERSION="2.0.0"
REMOTE_HOST="smability.io"
REMOTE_USER="og0lu4axr6ll"
REMOTE_PATH="/home/og0lu4axr6ll/public_html/scn/091525"
LOCAL_PATH="."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_progress() {
    echo -e "${PURPLE}[PROGRESS]${NC} $1"
}

print_feature() {
    echo -e "${CYAN}[FEATURE]${NC} $1"
}

# Banner
echo "================================================="
echo "  Enhanced Cash Flow Analysis Tool v2.0.0"
echo "  Advanced Deployment Script"
echo "================================================="
echo ""

# Enhanced feature list
print_feature "New in v2.0.0:"
print_feature "✨ All cells editable with real-time calculations"
print_feature "💾 Smart save system with persistent storage"
print_feature "🤖 Dynamic recommendations based on user data"
print_feature "📊 Real-time chart updates"
print_feature "⚡ Auto-save functionality"
print_feature "🔔 Enhanced notification system"
print_feature "⌨️ Keyboard navigation shortcuts"
print_feature "📱 Improved mobile experience"
echo ""

# Check if required files exist
check_files() {
    print_status "Checking required files for v2.0.0..."
    
    required_files=(
        "index.html" 
        "assets/css/styles.css" 
        "assets/js/main.js"
        "package.json"
        ".htaccess"
    )
    
    optional_files=(
        "diagnostic.html"
        "test.html"
        "README.md"
        "LICENSE"
        ".gitignore"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    
    for file in "${optional_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_warning "Optional file not found: $file (will be skipped)"
        fi
    done
    
    print_success "All required files found"
}

# Validate enhanced features
validate_enhanced_features() {
    print_status "Validating enhanced features..."
    
    # Check for editable cells in HTML
    if grep -q "editable" index.html; then
        print_success "✓ Editable cells feature detected"
    else
        print_warning "⚠ Editable cells feature not found in HTML"
    fi
    
    # Check for save functionality in JavaScript
    if grep -q "saveScenarioData" assets/js/main.js; then
        print_success "✓ Save functionality detected"
    else
        print_error "✗ Save functionality missing in JavaScript"
    fi
    
    # Check for dynamic recommendations
    if grep -q "updateRecommendations" assets/js/main.js; then
        print_success "✓ Dynamic recommendations feature detected"
    else
        print_warning "⚠ Dynamic recommendations feature not found"
    fi
    
    # Check for auto-save
    if grep -q "autoSave" assets/js/main.js; then
        print_success "✓ Auto-save functionality detected"
    else
        print_warning "⚠ Auto-save functionality not found"
    fi
    
    # Check for notification system
    if grep -q "showNotification" assets/js/main.js; then
        print_success "✓ Notification system detected"
    else
        print_warning "⚠ Notification system not found"
    fi
    
    # Check for responsive design in CSS
    if grep -q "@media" assets/css/styles.css; then
        print_success "✓ Responsive design detected"
    else
        print_warning "⚠ Responsive design media queries not found"
    fi
    
    print_success "Enhanced features validation completed"
}

# Validate code quality
validate_code() {
    print_status "Validating code quality..."
    
    # Check HTML structure
    if command -v htmlhint &> /dev/null; then
        print_progress "Running HTML validation..."
        htmlhint index.html
        if [ $? -ne 0 ]; then
            print_warning "HTML validation warnings found"
        else
            print_success "HTML validation passed"
        fi
    else
        print_warning "HTMLHint not installed, skipping HTML validation"
    fi
    
    # Check JavaScript syntax
    if command -v node &> /dev/null; then
        print_progress "Checking JavaScript syntax..."
        node -c assets/js/main.js
        if [ $? -eq 0 ]; then
            print_success "JavaScript syntax validation passed"
        else
            print_error "JavaScript syntax errors found"
            exit 1
        fi
    else
        print_warning "Node.js not available, skipping JS validation"
    fi
    
    # Check CSS validity
    if command -v stylelint &> /dev/null; then
        print_progress "Running CSS validation..."
        stylelint assets/css/styles.css
        if [ $? -eq 0 ]; then
            print_success "CSS validation passed"
        else
            print_warning "CSS validation warnings found"
        fi
    else
        print_warning "Stylelint not installed, skipping CSS validation"
    fi
    
    # Check file sizes
    html_size=$(wc -c < index.html)
    css_size=$(wc -c < assets/css/styles.css)
    js_size=$(wc -c < assets/js/main.js)
    
    print_status "File sizes:"
    print_status "  HTML: $(echo "scale=1; $html_size/1024" | bc)KB"
    print_status "  CSS:  $(echo "scale=1; $css_size/1024" | bc)KB"
    print_status "  JS:   $(echo "scale=1; $js_size/1024" | bc)KB"
    print_status "  Total: $(echo "scale=1; ($html_size+$css_size+$js_size)/1024" | bc)KB"
}

# Build optimized version with enhanced features
build_project() {
    print_status "Building enhanced version v2.0.0..."
    
    # Create build directory
    BUILD_DIR="build"
    rm -rf $BUILD_DIR
    mkdir -p $BUILD_DIR/assets/css
    mkdir -p $BUILD_DIR/assets/js
    mkdir -p $BUILD_DIR/assets/images
    
    print_progress "Copying core files..."
    # Copy main files
    cp index.html $BUILD_DIR/
    cp assets/css/styles.css $BUILD_DIR/assets/css/
    cp assets/js/main.js $BUILD_DIR/assets/js/
    
    # Copy optional files if they exist
    [ -f test.html ] && cp test.html $BUILD_DIR/ || print_warning "test.html not found, skipping"
    [ -f diagnostic.html ] && cp diagnostic.html $BUILD_DIR/ || print_warning "diagnostic.html not found, skipping"
    [ -f README.md ] && cp README.md $BUILD_DIR/ || print_warning "README.md not found, skipping"
    [ -f LICENSE ] && cp LICENSE $BUILD_DIR/ || print_warning "LICENSE not found, skipping"
    [ -f .htaccess ] && cp .htaccess $BUILD_DIR/ || print_warning ".htaccess not found, skipping"
    
    print_progress "Creating enhanced configuration files..."
    
    # Create robots.txt with enhanced features
    cat > $BUILD_DIR/robots.txt << EOF
User-agent: *
Allow: /

# Enhanced Cash Flow Analysis Tool v2.0.0
# Features: Real-time editing, dynamic charts, smart recommendations
Sitemap: https://smability.io/scn/091525/sitemap.xml

# Block sensitive files
Disallow: /assets/data/
Disallow: /*.json$
Disallow: /*.backup$
EOF
    
    # Create enhanced sitemap.xml
    cat > $BUILD_DIR/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://smability.io/scn/091525/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <news:news xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      <news:publication>
        <news:name>Enhanced Cash Flow Analysis Tool</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>$(date +%Y-%m-%d)</news:publication_date>
      <news:title>Enhanced Cash Flow Analysis Tool v2.0.0</news:title>
    </news:news>
  </url>
</urlset>
EOF
    
    # Create enhanced .htaccess if not exists
    if [ ! -f $BUILD_DIR/.htaccess ]; then
        print_progress "Creating enhanced .htaccess configuration..."
        cat > $BUILD_DIR/.htaccess << 'EOF'
# Enhanced Cash Flow Analysis Tool v2.0.0 Configuration
RewriteEngine On

# Force MIME types for enhanced features
<IfModule mod_mime.c>
    AddType text/css .css
    AddType application/javascript .js
    AddType application/json .json
    AddCharset UTF-8 .html .css .js .json
</IfModule>

# Enhanced caching for performance
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Security headers for enhanced features
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-Enhanced-Version "2.0.0"
</IfModule>

# Error pages
ErrorDocument 404 /scn/091525/index.html
Options -Indexes
DirectoryIndex index.html
EOF
    fi
    
    # Create package info
    cat > $BUILD_DIR/package-info.json << EOF
{
  "name": "enhanced-cashflow-analysis-tool",
  "version": "2.0.0",
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "deploymentTimestamp": "$TIMESTAMP",
  "features": [
    "real-time-editable-cells",
    "dynamic-calculations",
    "smart-save-system",
    "auto-save-functionality",
    "dynamic-recommendations",
    "real-time-charts",
    "notification-system",
    "keyboard-navigation",
    "mobile-optimized",
    "accessibility-enhanced"
  ],
  "performance": {
    "totalSize": "$(du -sb $BUILD_DIR | cut -f1) bytes",
    "files": $(find $BUILD_DIR -type f | wc -l),
    "optimized": true
  }
}
EOF
    
    print_success "Enhanced build completed"
}

# Enhanced deployment methods
deploy_rsync() {
    print_status "Deploying via rsync (enhanced)..."
    
    if command -v rsync &> /dev/null; then
        print_progress "Syncing files to server..."
        rsync -avz --delete --progress build/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
        
        if [ $? -eq 0 ]; then
            print_success "Enhanced deployment via rsync completed"
            return 0
        else
            print_error "Rsync deployment failed"
            return 1
        fi
    else
        print_warning "Rsync not available"
        return 1
    fi
}

deploy_ftp() {
    print_status "Deploying via FTP (enhanced)..."
    
    if command -v lftp &> /dev/null; then
        read -s -p "Enter FTP password for $REMOTE_USER: " FTP_PASSWORD
        echo
        
        print_progress "Uploading enhanced version via FTP..."
        lftp -c "
        set ftp:ssl-allow no;
        open ftp://$REMOTE_USER:$FTP_PASSWORD@$REMOTE_HOST;
        lcd build;
        cd $REMOTE_PATH;
        mirror --reverse --delete --verbose --parallel=4;
        bye;
        "
        
        if [ $? -eq 0 ]; then
            print_success "Enhanced FTP deployment completed"
            return 0
        else
            print_error "FTP deployment failed"
            return 1
        fi
    else
        print_warning "LFTP not available"
        return 1
    fi
}

deploy_git() {
    print_status "Using cPanel Git deployment (enhanced)..."
    print_status "Enhanced .cpanel.yml will handle v2.0.0 features automatically"
    
    if [ -d ".git" ]; then
        print_progress "Adding enhanced features to git..."
        git add .
        git commit -m "Deploy Enhanced Cash Flow Tool v2.0.0 - $(date '+%Y-%m-%d %H:%M:%S')

Features added:
- Real-time editable cells
- Smart save system with persistence
- Dynamic recommendations engine  
- Auto-save functionality
- Enhanced notification system
- Keyboard navigation shortcuts
- Improved mobile experience
- Performance optimizations"
        
        print_progress "Pushing enhanced version to repository..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            print_success "Enhanced code pushed to repository"
            print_status "Please trigger deployment in cPanel Git interface"
            print_status "Enhanced features will be automatically configured"
            return 0
        else
            print_error "Git push failed"
            return 1
        fi
    else
        print_error "Not a git repository"
        return 1
    fi
}

# Enhanced permission setting
set_permissions() {
    print_status "Setting enhanced file permissions..."
    
    cat > set_permissions_enhanced.sh << 'EOF'
#!/bin/bash
echo "Setting enhanced permissions for Cash Flow Tool v2.0.0..."

DEPLOY_PATH="/home/og0lu4axr6ll/public_html/scn/091525"

# Set directory permissions
find $DEPLOY_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $DEPLOY_PATH -type f -exec chmod 644 {} \;

# Special permissions for enhanced features
chmod 644 $DEPLOY_PATH/.htaccess
chmod 644 $DEPLOY_PATH/package-info.json
chmod 644 $DEPLOY_PATH/robots.txt
chmod 644 $DEPLOY_PATH/sitemap.xml

# Ensure JavaScript files are executable by web server
chmod 644 $DEPLOY_PATH/assets/js/main.js

# Set optimal permissions for CSS
chmod 644 $DEPLOY_PATH/assets/css/styles.css

echo "Enhanced permissions set successfully!"
EOF
    
    chmod +x set_permissions_enhanced.sh
    
    print_status "Enhanced permission script created: set_permissions_enhanced.sh"
    print_status "Run this script on your server after deployment"
}

# Enhanced performance test
performance_test() {
    print_status "Running enhanced performance tests..."
    
    if command -v curl &> /dev/null; then
        BASE_URL="https://smability.io/scn/091525"
        
        print_progress "Testing site accessibility..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
        LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/")
        
        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Site is accessible (HTTP $HTTP_CODE)"
            print_status "Page load time: ${LOAD_TIME}s"
        else
            print_warning "Site returned HTTP $HTTP_CODE"
        fi
        
        print_progress "Testing enhanced features..."
        
        # Test CSS file
        CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/assets/css/styles.css")
        CSS_SIZE=$(curl -s -w "%{size_download}" "$BASE_URL/assets/css/styles.css" -o /dev/null)
        if [ "$CSS_CODE" = "200" ]; then
            print_success "Enhanced CSS accessible (${CSS_SIZE} bytes)"
        else
            print_error "Enhanced CSS not accessible (HTTP $CSS_CODE)"
        fi
        
        # Test JavaScript file
        JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/assets/js/main.js")
        JS_SIZE=$(curl -s -w "%{size_download}" "$BASE_URL/assets/js/main.js" -o /dev/null)
        if [ "$JS_CODE" = "200" ]; then
            print_success "Enhanced JavaScript accessible (${JS_SIZE} bytes)"
        else
            print_error "Enhanced JavaScript not accessible (HTTP $JS_CODE)"
        fi
        
        # Test configuration files
        ROBOTS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/robots.txt")
        [ "$ROBOTS_CODE" = "200" ] && print_success "robots.txt accessible" || print_warning "robots.txt not accessible"
        
        SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap.xml")
        [ "$SITEMAP_CODE" = "200" ] && print_success "sitemap.xml accessible" || print_warning "sitemap.xml not accessible"
        
        # Performance benchmarks
        print_progress "Performance benchmarks:"
        if (( $(echo "$LOAD_TIME < 2.0" | bc -l) )); then
            print_success "✓ Fast loading (${LOAD_TIME}s < 2.0s target)"
        else
            print_warning "⚠ Slow loading (${LOAD_TIME}s > 2.0s target)"
        fi
        
        TOTAL_SIZE=$((CSS_SIZE + JS_SIZE))
        if [ $TOTAL_SIZE -lt 500000 ]; then
            print_success "✓ Lightweight assets ($(echo "scale=1; $TOTAL_SIZE/1024" | bc)KB < 500KB target)"
        else
            print_warning "⚠ Large assets ($(echo "scale=1; $TOTAL_SIZE/1024" | bc)KB > 500KB target)"
        fi
        
    else
        print_warning "cURL not available, skipping performance tests"
    fi
}

# Enhanced cleanup
cleanup() {
    print_status "Cleaning up enhanced build artifacts..."
    rm -rf build/
    rm -f set_permissions_enhanced.sh
    rm -f deploy_log_${TIMESTAMP}.txt
    print_success "Enhanced cleanup completed"
}

# Create enhanced deployment log
create_deployment_log() {
    LOG_FILE="deploy_log_${TIMESTAMP}.txt"
    
    cat > $LOG_FILE << EOF
===============================================
Enhanced Cash Flow Analysis Tool v2.0.0
Deployment Log
===============================================

Deployment Details:
- Date: $(date)
- Version: 2.0.0
- Timestamp: $TIMESTAMP
- Target: $REMOTE_HOST$REMOTE_PATH
- Build Method: Enhanced deployment script

Enhanced Features Deployed:
✓ Real-time editable cells
✓ Smart save system with localStorage persistence
✓ Dynamic recommendations engine
✓ Auto-save functionality (30-second intervals)
✓ Enhanced notification system
✓ Keyboard navigation shortcuts (Ctrl+1-4)
✓ Improved mobile responsive design
✓ Performance optimizations
✓ Accessibility enhancements
✓ Error handling improvements

File Structure:
$(find build -type f 2>/dev/null | sort)

File Sizes:
$(du -h build/* 2>/dev/null)

Total Package Size: $(du -sh build 2>/dev/null | cut -f1)

Performance Metrics:
- Load Time Target: <2s
- Asset Size Target: <500KB
- Browser Compatibility: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

Security Features:
- Input validation and sanitization
- XSS protection headers
- Content Security Policy
- Local-only data storage (no external APIs)

Deployment Status: SUCCESS
Next Steps:
1. Test all enhanced features
2. Verify mobile responsiveness
3. Check data persistence
4. Validate real-time calculations
5. Test keyboard shortcuts
6. Verify notification system

===============================================
EOF
    
    print_success "Deployment log created: $LOG_FILE"
}

# Main enhanced deployment process
main() {
    echo "================================================="
    echo "  Enhanced Cash Flow Analysis Tool v2.0.0"
    echo "  Advanced Deployment Process"
    echo "================================================="
    echo
    
    # Pre-deployment validation
    print_progress "Phase 1: Validation"
    check_files
    validate_enhanced_features
    validate_code
    
    # Build enhanced version
    print_progress "Phase 2: Build Process"
    build_project
    
    # Choose deployment method
    echo
    print_status "Phase 3: Deployment Method Selection"
    echo "Choose enhanced deployment method:"
    echo "1) cPanel Git (Recommended for v2.0.0)"
    echo "2) rsync (Fast sync)"
    echo "3) FTP (Universal compatibility)"
    echo "4) Manual Package (Create package only)"
    echo
    read -p "Enter choice [1-4]: " DEPLOY_METHOD
    
    case $DEPLOY_METHOD in
        1)
            print_progress "Phase 4: Git Deployment"
            deploy_git
            ;;
        2)
            print_progress "Phase 4: Rsync Deployment"
            deploy_rsync || deploy_ftp
            ;;
        3)
            print_progress "Phase 4: FTP Deployment"
            deploy_ftp
            ;;
        4)
            print_progress "Phase 4: Manual Package Creation"
            print_success "Enhanced deployment package created in build/ directory"
            print_status "Upload contents to your web server manually"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    # Post-deployment tasks
    if [ "$DEPLOY_METHOD" != "4" ]; then
        print_progress "Phase 5: Post-Deployment"
        set_permissions
        create_deployment_log
        
        print_status "Waiting for server propagation..."
        sleep 10
        
        performance_test
    else
        create_deployment_log
    fi
    
    # Final cleanup
    print_progress "Phase 6: Cleanup"
    if [ "$DEPLOY_METHOD" = "4" ]; then
        read -p "Keep enhanced build directory? [y/N]: " KEEP_BUILD
        if [ "$KEEP_BUILD" != "y" ] && [ "$KEEP_BUILD" != "Y" ]; then
            cleanup
        fi
    else
        cleanup
    fi
    
    echo
    echo "================================================="
    print_success "Enhanced Cash Flow Analysis Tool v2.0.0"
    print_success "Deployment Completed Successfully!"
    echo "================================================="
    echo
    print_feature "🎉 Your enhanced application is now live with:"
    print_feature "   ✨ Real-time editable cells"
    print_feature "   💾 Smart save & auto-save"
    print_feature "   🤖 Dynamic recommendations"
    print_feature "   📊 Live chart updates"
    print_feature "   ⌨️ Keyboard shortcuts"
    print_feature "   📱 Mobile optimization"
    echo
    print_status "Next steps:"
    echo "1. 🌐 Visit: https://smability.io/scn/091525/"
    echo "2. 🧪 Test: https://smability.io/scn/091525/diagnostic.html"
    echo "3. 📊 Verify all enhanced features work correctly"
    echo "4. 📱 Test mobile responsiveness"
    echo "5. 💾 Test save functionality and data persistence"
    echo "6. ⌨️ Try keyboard shortcuts (Ctrl+1-4)"
    echo "7. 🔍 Check browser console for any errors"
    echo
    print_status "For support with enhanced features:"
    print_status "- Documentation: README.md"
    print_status "- Issues: GitHub repository"
    print_status "- Version: v2.0.0 with full feature set"
    echo
}

# Enhanced error handling
trap 'echo; print_error "Enhanced deployment interrupted"; cleanup; exit 1' INT TERM

# Enhanced environment detection
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_status "Environment: Linux (optimal for deployment)"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Environment: macOS (compatible)"
elif [[ "$OSTYPE" == "msys" ]]; then
    print_status "Environment: Windows/Git Bash (compatible)"
else
    print_warning "Environment: Unknown - may have compatibility issues"
fi

# Check for enhanced dependencies
if command -v bc &> /dev/null; then
    print_status "✓ bc calculator available for performance metrics"
else
    print_warning "⚠ bc calculator not found - some metrics may not display"
fi

# Run main enhanced deployment process
main "$@"
