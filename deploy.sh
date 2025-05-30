#!/bin/bash

# ===== CASH FLOW ANALYSIS TOOL - DEPLOYMENT SCRIPT =====
# This script automates the deployment process for cPanel hosting

echo "🚀 Starting Cash Flow Analysis Tool Deployment..."

# Configuration
PROJECT_NAME="cashflow-analysis-tool"
REMOTE_HOST="your-domain.com"
REMOTE_USER="og0lu4axr6ll"
REMOTE_PATH="/home/og0lu4axr6ll/public_html/scn/091525"
LOCAL_PATH="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    required_files=("index.html" "assets/css/styles.css" "assets/js/main.js")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    
    print_success "All required files found"
}

# Validate HTML and CSS
validate_code() {
    print_status "Validating code..."
    
    # Check if validation tools are installed
    if command -v htmlhint &> /dev/null; then
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
        node -c assets/js/main.js
        if [ $? -eq 0 ]; then
            print_success "JavaScript syntax validation passed"
        else
            print_error "JavaScript syntax errors found"
            exit 1
        fi
    fi
}

# Build optimized version
build_project() {
    print_status "Building optimized version..."
    
    # Create build directory
    BUILD_DIR="build"
    rm -rf $BUILD_DIR
    mkdir -p $BUILD_DIR/assets/css
    mkdir -p $BUILD_DIR/assets/js
    mkdir -p $BUILD_DIR/assets/images
    
    # Copy files
    cp index.html $BUILD_DIR/
    cp assets/css/styles.css $BUILD_DIR/assets/css/
    cp assets/js/main.js $BUILD_DIR/assets/js/
    cp .htaccess $BUILD_DIR/ 2>/dev/null || true
    
    # Create robots.txt
    cat > $BUILD_DIR/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://$REMOTE_HOST/scn/091525/sitemap.xml
EOF
    
    # Create sitemap.xml
    cat > $BUILD_DIR/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://$REMOTE_HOST/scn/091525/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF
    
    print_success "Build completed"
}

# Deploy via rsync (if available)
deploy_rsync() {
    print_status "Deploying via rsync..."
    
    if command -v rsync &> /dev/null; then
        rsync -avz --delete build/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
        
        if [ $? -eq 0 ]; then
            print_success "Deployment via rsync completed"
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

# Deploy via FTP (fallback)
deploy_ftp() {
    print_status "Deploying via FTP..."
    
    if command -v lftp &> /dev/null; then
        read -s -p "Enter FTP password for $REMOTE_USER: " FTP_PASSWORD
        echo
        
        lftp -c "
        set ftp:ssl-allow no;
        open ftp://$REMOTE_USER:$FTP_PASSWORD@$REMOTE_HOST;
        lcd build;
        cd $REMOTE_PATH;
        mirror --reverse --delete --verbose;
        bye;
        "
        
        if [ $? -eq 0 ]; then
            print_success "FTP deployment completed"
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

# Deploy via cPanel Git (recommended)
deploy_git() {
    print_status "Using cPanel Git deployment..."
    print_status "Please ensure your repository is connected to cPanel Git Version Control"
    print_status "The .cpanel.yml file will handle the deployment automatically"
    
    # Push to repository
    if [ -d ".git" ]; then
        git add .
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        git push origin main
        
        if [ $? -eq 0 ]; then
            print_success "Code pushed to repository"
            print_status "Please trigger deployment in cPanel Git interface"
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

# Set proper file permissions
set_permissions() {
    print_status "Setting file permissions..."
    
    # This would typically be run on the server
            cat > set_permissions.sh << 'EOF'
#!/bin/bash
find /home/og0lu4axr6ll/public_html/scn/091525 -type f -exec chmod 644 {} \;
find /home/og0lu4axr6ll/public_html/scn/091525 -type d -exec chmod 755 {} \;
chmod 644 /home/og0lu4axr6ll/public_html/scn/091525/.htaccess
EOF
    
    chmod +x set_permissions.sh
    
    print_status "Permission script created: set_permissions.sh"
    print_status "Run this script on your server after deployment"
}

# Performance test
performance_test() {
    print_status "Running basic performance tests..."
    
    if command -v curl &> /dev/null; then
        # Test if site is accessible
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$REMOTE_HOST/scn/091525/")
        
        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Site is accessible (HTTP $HTTP_CODE)"
        else
            print_warning "Site returned HTTP $HTTP_CODE"
        fi
        
        # Test loading time
        LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://$REMOTE_HOST/scn/091525/")
        print_status "Page load time: ${LOAD_TIME}s"
        
    else
        print_warning "cURL not available, skipping performance tests"
    fi
}

# Cleanup
cleanup() {
    print_status "Cleaning up..."
    rm -rf build/
    rm -f set_permissions.sh
    print_success "Cleanup completed"
}

# Main deployment process
main() {
    echo "================================================="
    echo "  Cash Flow Analysis Tool - Deployment Script"
    echo "================================================="
    echo
    
    # Pre-deployment checks
    check_files
    validate_code
    
    # Build project
    build_project
    
    # Choose deployment method
    echo
    echo "Choose deployment method:"
    echo "1) cPanel Git (Recommended)"
    echo "2) rsync"
    echo "3) FTP"
    echo "4) Manual (create package only)"
    echo
    read -p "Enter choice [1-4]: " DEPLOY_METHOD
    
    case $DEPLOY_METHOD in
        1)
            deploy_git
            ;;
        2)
            deploy_rsync || deploy_ftp
            ;;
        3)
            deploy_ftp
            ;;
        4)
            print_status "Manual deployment package created in build/ directory"
            print_status "Upload contents to your web server"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    # Post-deployment tasks
    if [ "$DEPLOY_METHOD" != "4" ]; then
        set_permissions
        sleep 5  # Wait for deployment to complete
        performance_test
    fi
    
    # Cleanup
    if [ "$DEPLOY_METHOD" = "4" ]; then
        read -p "Keep build directory? [y/N]: " KEEP_BUILD
        if [ "$KEEP_BUILD" != "y" ] && [ "$KEEP_BUILD" != "Y" ]; then
            cleanup
        fi
    else
        cleanup
    fi
    
    echo
    print_success "Deployment process completed!"
    echo
    echo "Next steps:"
    echo "1. Verify site is working: https://$REMOTE_HOST/scn/091525/"
    echo "2. Test all functionality"
    echo "3. Check mobile responsiveness"
    echo "4. Review browser console for errors"
    echo
    echo "Support: https://github.com/yourusername/$PROJECT_NAME/issues"
}

# Handle script interruption
trap 'echo; print_error "Deployment interrupted"; cleanup; exit 1' INT

# Run main function
main "$@"
