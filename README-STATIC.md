# Smart Data Organizer & Analyzer

🚀 **Live Demo:** https://abhisheksingh17cyber.github.io/excellsorted

## Overview

A comprehensive web application that allows users to upload raw data files and receive organized Excel files with automated analysis, charts, and downloadable folder structures using natural language instructions.

**Note:** This is currently a frontend demo showcasing the interface and user experience. The actual data processing features are simulated for demonstration purposes.

## Features

- 📁 **Multi-file Upload**: Support for CSV, Excel, JSON, and TXT files
- 🗣️ **Natural Language Processing**: Describe what you want in plain English
- 📊 **Automated Analysis**: Generate charts, insights, and organized data automatically
- 📋 **Smart Organization**: Organize data into multiple sheets or files based on instructions
- 📈 **Visualization**: Create various chart types (line, bar, pie, scatter)
- 📦 **Export Options**: Download individual files or complete ZIP packages
- 🎯 **User-Friendly**: Intuitive interface with step-by-step workflow

## Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Bootstrap 5** for responsive design and components
- **Chart.js** for data visualizations
- **Bootstrap Icons** for iconography

## Quick Start

### Option 1: Use the Live Demo

Visit https://abhisheksingh17cyber.github.io/excellsorted to try the application immediately.

### Option 2: Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhisheksingh17cyber/excellsorted.git
   cd excellsorted
   ```

2. **Open in browser:**
   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server like:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Usage Guide

### 1. Upload Files
- Navigate to the Upload section
- Select or drag & drop your data files
- Supported formats: CSV, Excel (.xlsx, .xls), JSON, TXT
- Files are processed in the browser for demonstration

### 2. Provide Instructions
- Describe what you want to do with your data in plain English
- Examples:
  - "Sort data by sales amount and create a monthly trend chart"
  - "Group customers by region and highlight top performers"
  - "Calculate quarterly totals and create comparison charts"
  - "Identify outliers and create data quality report"

### 3. Processing
- The system simulates analyzing your data and applying your instructions
- Watch the progress through multiple stages:
  - Data analysis and schema detection
  - Instruction parsing and validation
  - Data transformations and calculations
  - Chart and visualization generation
  - File organization and packaging

### 4. Download Results
- View generated files, charts, and insights (simulated)
- Experience the download workflow
- See sample analysis reports and visualizations

## Example Use Cases

### Business Analytics
- **Input**: Sales data CSV file
- **Instruction**: "Sort by region, create monthly trend charts, highlight top 10 performers"
- **Output**: Organized Excel workbook with regional analysis, trend charts, and performance reports

### Financial Analysis
- **Input**: Transaction data
- **Instruction**: "Group by category, calculate monthly totals, identify unusual spending patterns"
- **Output**: Financial summary with category breakdowns and anomaly detection

### Inventory Management
- **Input**: Product inventory data
- **Instruction**: "Sort by stock levels, create reorder alerts, generate supplier performance charts"
- **Output**: Inventory dashboard with alerts and supplier analysis

## Project Structure
```
excellsorted/
├── index.html              # Main HTML file
├── styles.css              # Custom CSS styles
├── script.js               # JavaScript functionality
├── README.md               # Project documentation
└── .github/
    └── workflows/
        └── static-deploy.yml # GitHub Actions workflow
```

## Deployment

### GitHub Pages

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions.

The deployment workflow:
1. Triggers on push to main branch
2. Sets up GitHub Pages environment
3. Uploads static content
4. Deploys to GitHub Pages

## Features Demonstration

### File Upload System
- Drag and drop interface
- File type validation
- File size display
- Remove files functionality

### Processing Simulation
- Realistic progress indicators
- Step-by-step processing stages
- Status updates and animations
- Error handling demonstrations

### Results Preview
- Sample chart generation using Chart.js
- File listing with download buttons
- Summary statistics display
- Export options interface

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- Progressive enhancement approach

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests:

- 🐛 GitHub Issues: [Create an issue](https://github.com/Abhisheksingh17cyber/excellsorted/issues)
- 📚 Documentation: This README file

---

**Made with ❤️ for data enthusiasts and business analysts**
