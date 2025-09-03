import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { GeneratedFile, GeneratedChart, SheetInfo } from '../types';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class ExcelGeneratorService {

  /**
   * Generate Excel files from processed data
   */
  async generateExcelFiles(
    data: any[],
    charts: GeneratedChart[],
    options: Record<string, any> = {}
  ): Promise<GeneratedFile[]> {
    try {
      logger.info('Generating Excel files');
      
      const files: GeneratedFile[] = [];
      
      // Create main data workbook
      const mainWorkbook = XLSX.utils.book_new();
      
      // Add main data sheet
      const dataSheet = this.createDataSheet(data, 'Data');
      XLSX.utils.book_append_sheet(mainWorkbook, dataSheet, 'Data');
      
      // Add summary sheet if data is large
      if (data.length > 100) {
        const summarySheet = this.createSummarySheet(data);
        XLSX.utils.book_append_sheet(mainWorkbook, summarySheet, 'Summary');
      }
      
      // Add charts sheet
      if (charts.length > 0) {
        const chartsSheet = this.createChartsSheet(charts);
        XLSX.utils.book_append_sheet(mainWorkbook, chartsSheet, 'Charts');
      }
      
      // Create output directory
      const outputDir = path.join(process.cwd(), 'output', 'temp');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write main workbook
      const mainFilePath = path.join(outputDir, 'organized-data.xlsx');
      XLSX.writeFile(mainWorkbook, mainFilePath);
      
      const mainFileStats = fs.statSync(mainFilePath);
      files.push({
        name: 'organized-data.xlsx',
        path: mainFilePath,
        type: 'excel',
        size: mainFileStats.size,
        sheets: [
          {
            name: 'Data',
            rowCount: data.length,
            columnCount: data[0]?.length || 0,
            charts: charts.map(c => c.id)
          }
        ]
      });
      
      // Generate additional specialized files based on options
      if (options.generateSeparateSheets) {
        const separateFiles = await this.generateSeparateSheetFiles(data, outputDir);
        files.push(...separateFiles);
      }
      
      logger.info(`Generated ${files.length} Excel files`);
      return files;
      
    } catch (error) {
      logger.error('Error generating Excel files:', error);
      throw error;
    }
  }

  /**
   * Create data sheet with formatting
   */
  private createDataSheet(data: any[], sheetName: string = 'Data'): XLSX.WorkSheet {
    if (!data || data.length === 0) {
      return XLSX.utils.aoa_to_sheet([['No data available']]);
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = this.calculateColumnWidths(data);
    worksheet['!cols'] = colWidths;
    
    // Add header formatting
    if (data.length > 0) {
      const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '366092' } },
            alignment: { horizontal: 'center' }
          };
        }
      }
    }
    
    // Add data validation and formatting
    this.addDataFormatting(worksheet, data);
    
    return worksheet;
  }

  /**
   * Create summary sheet with statistics
   */
  private createSummarySheet(data: any[]): XLSX.WorkSheet {
    if (!data || data.length <= 1) {
      return XLSX.utils.aoa_to_sheet([['No data for summary']]);
    }
    
    const [headers, ...rows] = data;
    const summaryData: any[][] = [
      ['Summary Statistics'],
      [''],
      ['Metric', 'Value']
    ];
    
    // Basic statistics
    summaryData.push(['Total Rows', rows.length]);
    summaryData.push(['Total Columns', headers.length]);
    
    // Column analysis
    summaryData.push([''], ['Column Analysis'], ['Column', 'Type', 'Unique Values', 'Null Count']);
    
    headers.forEach((header: string, index: number) => {
      const columnValues = rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = new Set(columnValues).size;
      const nullCount = rows.length - columnValues.length;
      
      // Detect column type
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(val)));
      const type = numericValues.length / columnValues.length > 0.7 ? 'Numeric' : 'Text';
      
      summaryData.push([header, type, uniqueValues, nullCount]);
    });
    
    return XLSX.utils.aoa_to_sheet(summaryData);
  }

  /**
   * Create charts sheet with chart references
   */
  private createChartsSheet(charts: GeneratedChart[]): XLSX.WorkSheet {
    const chartData: any[][] = [
      ['Generated Charts'],
      [''],
      ['Chart ID', 'Title', 'Type', 'Description']
    ];
    
    charts.forEach(chart => {
      chartData.push([
        chart.id,
        chart.title,
        chart.type,
        `Chart showing ${chart.data.datasets.map(d => d.label).join(', ')}`
      ]);
    });
    
    return XLSX.utils.aoa_to_sheet(chartData);
  }

  /**
   * Calculate optimal column widths
   */
  private calculateColumnWidths(data: any[]): XLSX.ColInfo[] {
    if (!data || data.length === 0) return [];
    
    const colWidths: XLSX.ColInfo[] = [];
    const maxCols = Math.max(...data.map(row => row.length));
    
    for (let col = 0; col < maxCols; col++) {
      let maxWidth = 8; // Minimum width
      
      for (let row = 0; row < Math.min(data.length, 100); row++) { // Check first 100 rows
        const cellValue = String(data[row][col] || '');
        maxWidth = Math.max(maxWidth, cellValue.length);
      }
      
      colWidths.push({ wch: Math.min(maxWidth + 2, 50) }); // Max width of 50
    }
    
    return colWidths;
  }

  /**
   * Add data formatting to worksheet
   */
  private addDataFormatting(worksheet: XLSX.WorkSheet, data: any[]): void {
    if (!data || data.length <= 1) return;
    
    const [headers, ...rows] = data;
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Apply formatting based on data type
    for (let col = range.s.c; col <= range.e.c; col++) {
      const columnValues = rows.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(val)));
      const isNumeric = numericValues.length / columnValues.length > 0.7;
      
      // Format numeric columns
      if (isNumeric) {
        for (let row = 1; row <= range.e.r; row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellAddress] && !isNaN(parseFloat(worksheet[cellAddress].v))) {
            worksheet[cellAddress].z = '#,##0.00'; // Number format
          }
        }
      }
    }
    
    // Add alternating row colors
    for (let row = 1; row <= range.e.r; row++) {
      if (row % 2 === 0) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              ...worksheet[cellAddress].s,
              fill: { fgColor: { rgb: 'F2F2F2' } }
            };
          }
        }
      }
    }
  }

  /**
   * Generate separate files for different data groups
   */
  private async generateSeparateSheetFiles(data: any[], outputDir: string): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    // This is a placeholder for generating separate files based on data groups
    // Implementation would depend on specific grouping requirements
    
    return files;
  }
}
