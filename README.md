# 💰 Cash Flow Analysis Tool 2025-2026

Advanced strategic financial planning dashboard with real-time calculations and interactive visualizations.

## 🚀 Features

- **📊 Complete Monthly Analysis**: Detailed month-by-month cash flow breakdowns for 2025-2026
- **🌊 Interactive Waterfall Charts**: Visual representation of cash flow components
- **✏️ Real-time Editing**: Editable consultation income with instant recalculations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **📈 Scenario Comparison**: Compare two strategic approaches side-by-side
- **🎯 Executive Summary**: Key metrics and recommendations
- **⌨️ Keyboard Navigation**: Efficient navigation with Ctrl+1-4 shortcuts

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js 3.9.1
- **Styling**: Modern CSS with flexbox/grid, glassmorphism effects
- **Performance**: Optimized for fast loading and smooth interactions

## 📂 Project Structure

```
cashflow-analysis-tool/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css       # Complete styling
│   └── js/
│       └── main.js          # Application logic
├── package.json             # Dependencies and scripts
├── .cpanel.yml             # cPanel deployment config
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cashflow-analysis-tool.git
   cd cashflow-analysis-tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:8080
   ```

### Production Deployment

#### Option 1: cPanel Git Deployment

1. **Enable Git in cPanel**:
   - Go to Git™ Version Control in cPanel
   - Click "Create" and clone your repository
   - Set deployment path to `public_html/cashflow-tool`

2. **Configure auto-deployment**:
   - The `.cpanel.yml` file will automatically handle deployment
   - Files will be copied to the correct directories
   - Permissions and optimization will be set automatically

3. **Manual deployment trigger**:
   ```bash
   # In cPanel terminal or via Git interface
   git pull origin main
   ```

#### Option 2: Manual Upload

1. **Upload files to your hosting**:
   - Upload `index.html` to your domain root or subdirectory
   - Upload `assets/` folder maintaining the structure
   - Ensure proper file permissions (644 for files, 755 for directories)

#### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select source branch (usually `main`)
   - Your site will be available at `https://yourusername.github.io/cashflow-analysis-tool/`

## 🔧 Configuration

### Customizing for Your Data

1. **Edit initial values** in `assets/js/main.js`:
   ```javascript
   // Update default consultation values
   currentData.scenario1.consultation = [0, 15, 25, 20, 0, 40, 50, 35];
   ```

2. **Modify scenarios** in `index.html`:
   - Update income/expense values in the tables
   - Adjust scenario titles and descriptions

3. **Customize styling** in `assets/css/styles.css`:
   - Change color schemes
   - Modify responsive breakpoints
   - Adjust chart container sizes

## 📊 Usage Guide

### Navigation
- **Tab 1**: Monthly Analysis - Detailed financial tables
- **Tab 2**: Waterfall Charts - Visual cash flow representations  
- **Tab 3**: Executive Summary - Key metrics comparison
- **Tab 4**: Recommendations - Strategic advice

### Keyboard Shortcuts
- `Ctrl + 1-4`: Switch between tabs
- `Alt`: Show shortcuts help
- `Tab`: Navigate between editable fields

### Editing Data
- Click on yellow-highlighted "Consultoría" cells
- Enter new values and press Enter
- Watch real-time updates across all calculations and charts

## 🎨 Customization

### Color Themes
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
}
```

### Adding New Scenarios
1. Duplicate existing scenario HTML structure
2. Update IDs and data attributes
3. Add corresponding JavaScript calculation logic
4. Update chart data sources

## 🔒 Security Features

- **Content Security Policy** headers
- **XSS Protection** enabled
- **Frame Options** set to SAMEORIGIN
- **Input validation** for all editable fields
- **No external API calls** - works completely offline

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

## 🚀 Performance

- **Lightweight**: < 500KB total size
- **Fast loading**: Optimized CSS and JavaScript
- **Smooth animations**: Hardware-accelerated transitions
- **Responsive charts**: Efficient Chart.js implementation

## 🔧 Development

### Available Scripts

```bash
npm run start      # Start production server
npm run dev        # Start development server with live reload
npm run build      # Prepare for production (static site)
npm run deploy     # Deploy to production
npm run lint       # Check code quality
npm run validate   # Validate HTML structure
```

### File Structure Details

```
assets/
├── css/
│   └── styles.css           # 15KB - Complete styling
│       ├── Reset & Base     # Global styles
│       ├── Navigation       # Tab system
│       ├── Tables          # Data presentation
│       ├── Charts          # Chart containers
│       ├── Responsive      # Mobile optimization
│       └── Utilities       # Helper classes
│
└── js/
    └── main.js             # 25KB - Application logic
        ├── Initialization  # App setup
        ├── Calculations    # Real-time math
        ├── Charts          # Chart.js integration
        ├── UI Handlers     # User interactions
        ├── Utilities       # Helper functions
        └── Accessibility   # A11y features
```

## 📈 Features Deep Dive

### Real-time Calculations
- **Instant updates**: Changes reflect immediately across all views
- **Validation**: Input sanitization and error handling
- **Persistence**: Values maintained during session

### Interactive Charts
- **Waterfall visualizations**: Income and expense flow representation
- **Comparison charts**: Side-by-side scenario analysis
- **Responsive design**: Adapts to screen size
- **Hover interactions**: Detailed tooltips and highlights

### Data Export
```javascript
// Export current analysis data
window.CashFlowApp.exportData();

// Get current calculations
window.CashFlowApp.getCurrentCalculations();
```

## 🐛 Troubleshooting

### Common Issues

1. **Charts not loading**:
   - Ensure Chart.js CDN is accessible
   - Check browser console for errors
   - Verify canvas elements exist

2. **Calculations not updating**:
   - Check JavaScript console for errors
   - Ensure input values are numeric
   - Verify event listeners are attached

3. **Styling issues**:
   - Clear browser cache
   - Check CSS file is loading correctly
   - Verify responsive meta tag is present

4. **cPanel deployment issues**:
   - Check file permissions (644 for files, 755 for directories)
   - Verify .cpanel.yml syntax
   - Ensure deployment path exists

### Debug Mode
Enable console logging:
```javascript
// In browser console
localStorage.setItem('debugMode', 'true');
location.reload();
```

## 🔄 Updates and Maintenance

### Regular Updates
- Update Chart.js version in CDN link
- Review and update browser compatibility
- Optimize performance based on usage analytics

### Backup Strategy
- Regular Git commits
- Export configuration data
- Backup hosting files

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m "Add new feature"`
5. Push: `git push origin feature/new-feature`
6. Create Pull Request

### Code Standards
- Use semantic HTML5 elements
- Follow BEM CSS methodology
- Write vanilla JavaScript (ES6+)
- Include inline comments for complex logic
- Maintain responsive design principles

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/cashflow-analysis-tool/issues)
- **Documentation**: This README and inline code comments
- **Updates**: Watch repository for notifications

## 🎯 Roadmap

### Version 1.1 (Planned)
- [ ] Database integration for data persistence
- [ ] PDF export functionality
- [ ] Additional scenario templates
- [ ] Advanced chart types (pie, donut, area)

### Version 1.2 (Future)
- [ ] Multi-user support
- [ ] Real-time collaboration
- [ ] API integration for live financial data
- [ ] Mobile app version

### Version 2.0 (Long-term)
- [ ] Machine learning predictions
- [ ] Advanced financial modeling
- [ ] Integration with accounting software
- [ ] Multi-currency support

## 📊 Analytics

Track usage with Google Analytics or similar:

```html
<!-- Add to index.html head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🌟 Acknowledgments

- **Chart.js**: Excellent charting library
- **Modern CSS**: Inspiration from contemporary web design
- **Financial Planning**: Best practices from financial advisory industry

---

**Built with ❤️ for strategic financial planning**

*Last updated: May 30, 2025*
