# Smart Data Organizer & Analyzer

A comprehensive web application that allows users to upload raw data, provide natural language instructions, and receive organized Excel files with automated analysis, charts, and downloadable folder structures.

## Features

- 📊 Multi-format data upload (CSV, Excel, JSON, text)
- 🧠 Natural language instruction processing
- 📈 Automated chart and visualization generation
- 📁 Intelligent folder structure organization
- 💾 Professional Excel file generation
- 🎯 Real-time data processing and preview
- 📦 Downloadable ZIP packages with organized results

## Project Structure

```
smart-data-organizer/
├── frontend/          # React.js web application
├── backend/           # Node.js Express server
├── shared/            # Shared utilities and types
├── docs/              # Documentation
└── examples/          # Sample datasets and use cases
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository and navigate to the project:

```bash
cd smart-data-organizer
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. Start the development servers:

```bash
# Terminal 1: Start backend server
cd backend && npm run dev

# Terminal 2: Start frontend development server
cd frontend && npm start
```

4. Open your browser to `http://localhost:3000`

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI** for component library
- **React Query** for data fetching
- **Chart.js** for visualizations
- **React Dropzone** for file uploads

### Backend

- **Node.js** with Express and TypeScript
- **Multer** for file uploads
- **SheetJS** for Excel processing
- **Chart.js** for server-side chart generation
- **JSZip** for creating download packages
- **Bull** for job queue management

### Data Processing

- **xlsx** for Excel file manipulation
- **papaparse** for CSV processing
- **lodash** for data transformations
- **moment.js** for date handling

## API Documentation

### Endpoints

- `POST /api/upload` - Upload data files
- `POST /api/process` - Process data with instructions
- `GET /api/download/:id` - Download processed results
- `GET /api/status/:jobId` - Check processing status

## Usage Examples

### Business Analytics

Upload sales data and ask: "Organize by region and product, create monthly trend charts, and highlight top performers"

### Academic Research

Upload survey data and request: "Create demographic breakdown with statistical analysis and correlation matrices"

### Inventory Management

Upload stock data and specify: "Group by category and supplier, add reorder alerts, and create trend analysis"

## Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.
