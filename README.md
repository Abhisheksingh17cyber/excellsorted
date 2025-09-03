# Smart Data Organizer & Analyzer

🚀 **Live Demo:** [https://abhisheksingh17cyber.github.io/excellsorted](https://abhisheksingh17cyber.github.io/excellsorted)

## Overview

A comprehensive web application that allows users to upload raw data files and receive organized Excel files with automated analysis, charts, and downloadable folder structures using natural language instructions.

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
- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **Chart.js** for data visualizations
- **React Query** for state management

### Backend
- **Node.js** with Express and TypeScript
- **Multer** for file uploads
- **xlsx** library for Excel processing
- **papaparse** for CSV parsing
- **Chart.js** for server-side chart generation
- **JSZip** for file packaging

## Quick Start

### Option 1: Use the Live Demo
Visit [https://abhisheksingh17cyber.github.io/excellsorted](https://abhisheksingh17cyber.github.io/excellsorted) to try the application immediately.

### Option 2: Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhisheksingh17cyber/excellsorted.git
   cd excellsorted/smart-data-organizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start development servers:**
   ```bash
   # From the root directory
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage Guide

### 1. Upload Files
- Navigate to the Upload page
- Select or drag & drop your data files
- Supported formats: CSV, Excel (.xlsx, .xls), JSON, TXT
- Click "Upload Files" to proceed

### 2. Provide Instructions
- Describe what you want to do with your data in plain English
- Examples:
  - "Sort data by sales amount and create a monthly trend chart"
  - "Group customers by region and highlight top performers"
  - "Calculate quarterly totals and create comparison charts"
  - "Identify outliers and create data quality report"

### 3. Processing
- The system will analyze your data and apply your instructions
- Watch the progress through multiple stages:
  - Data analysis and schema detection
  - Instruction parsing and validation
  - Data transformations and calculations
  - Chart and visualization generation
  - File organization and packaging

### 4. Download Results
- View generated files, charts, and insights
- Download individual files or complete ZIP package
- Access detailed analysis reports and visualizations

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

## API Endpoints

### Upload Files
```
POST /api/upload
Content-Type: multipart/form-data
```

### Process Data
```
POST /api/process
{
  "jobId": "string",
  "instructions": "string",
  "options": {}
}
```

### Get Status
```
GET /api/status/:jobId
```

### Download Results
```
GET /api/download/:jobId
GET /api/download/:jobId/file/:filename
GET /api/download/:jobId/info
```

## Development

### Project Structure
```
smart-data-organizer/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Helper functions
│   └── package.json
├── frontend/             # React web application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── services/     # API integration
│   │   └── App.tsx       # Main application
│   └── package.json
└── package.json          # Root configuration
```

### Available Scripts

```bash
# Root directory
npm run dev          # Start both backend and frontend
npm run build        # Build both applications
npm run test         # Run tests for both
npm run lint         # Lint all code

# Backend only
cd backend
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm run test         # Run backend tests

# Frontend only
cd frontend
npm start            # Start development server
npm run build        # Create production build
npm run test         # Run frontend tests
```

### Environment Variables

Create `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
UPLOAD_DIR=./uploads
OUTPUT_DIR=./output
```

## Deployment

### GitHub Pages (Frontend Only)
The frontend is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Full Stack Deployment
For production deployment with backend:

1. **Backend**: Deploy to platforms like:
   - Heroku
   - AWS EC2/ECS
   - Google Cloud Platform
   - DigitalOcean

2. **Frontend**: Build and deploy to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

3. **Database**: Use services like:
   - MongoDB Atlas
   - PostgreSQL on AWS RDS
   - Redis for caching

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
- 📧 Email: support@smartdataorganizer.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/Abhisheksingh17cyber/excellsorted/issues)
- 📚 Documentation: [Wiki](https://github.com/Abhisheksingh17cyber/excellsorted/wiki)

---

**Made with ❤️ for data enthusiasts and business analysts**
