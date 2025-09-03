import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import { UploadedFile, DataSchema, DataColumn } from '../types';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class DataAnalysisService {
  
  /**
   * Analyze the schema of an uploaded file
   */
  async analyzeFileSchema(file: UploadedFile): Promise<DataSchema> {
    try {
      logger.info(`Analyzing schema for file: ${file.originalname}`);
      
      const extension = path.extname(file.originalname).toLowerCase();
      let data: any[][] = [];
      
      switch (extension) {
        case '.csv':
          data = await this.parseCsvFile(file.path);
          break;
        case '.xlsx':
        case '.xls':
          data = await this.parseExcelFile(file.path);
          break;
        case '.json':
          data = await this.parseJsonFile(file.path);
          break;
        case '.txt':
          data = await this.parseTextFile(file.path);
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      return this.analyzeDataStructure(data);
    } catch (error) {
      logger.error(`Error analyzing file schema for ${file.originalname}:`, error);
      throw error;
    }
  }

  /**
   * Parse CSV file
   */
  private async parseCsvFile(filePath: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      const results = Papa.parse(fileContent, {
        skipEmptyLines: true
      });
      
      if (results.errors && results.errors.length > 0) {
        reject(new Error(results.errors[0].message));
      } else {
        resolve(results.data as any[][]);
      }
    });
  }

  /**
   * Parse Excel file
   */
  private async parseExcelFile(filePath: string): Promise<any[][]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
      
      return jsonData as any[][];
    } catch (error) {
      logger.error(`Error parsing Excel file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Parse JSON file
   */
  private async parseJsonFile(filePath: string): Promise<any[][]> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // Convert JSON to 2D array format
      if (Array.isArray(jsonData)) {
        if (jsonData.length > 0 && typeof jsonData[0] === 'object') {
          // Array of objects - extract headers and values
          const headers = Object.keys(jsonData[0]);
          const rows = jsonData.map(obj => headers.map(header => obj[header]));
          return [headers, ...rows];
        } else {
          // Array of primitives
          return jsonData.map((item, index) => [index.toString(), item]);
        }
      } else if (typeof jsonData === 'object') {
        // Single object - convert to key-value pairs
        const entries = Object.entries(jsonData);
        return [['Key', 'Value'], ...entries];
      } else {
        // Primitive value
        return [['Value'], [jsonData]];
      }
    } catch (error) {
      logger.error(`Error parsing JSON file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Parse text file
   */
  private async parseTextFile(filePath: string): Promise<any[][]> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      // Try to detect delimiter
      const delimiters = ['\t', ',', ';', '|'];
      let bestDelimiter = '\t';
      let maxColumns = 0;
      
      for (const delimiter of delimiters) {
        const testRow = lines[0]?.split(delimiter);
        if (testRow && testRow.length > maxColumns) {
          maxColumns = testRow.length;
          bestDelimiter = delimiter;
        }
      }
      
      return lines.map(line => line.split(bestDelimiter));
    } catch (error) {
      logger.error(`Error parsing text file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Analyze data structure to determine column types and characteristics
   */
  private analyzeDataStructure(data: any[][]): DataSchema {
    if (!data || data.length === 0) {
      return {
        columns: [],
        rowCount: 0,
        hasHeaders: false
      };
    }

    const hasHeaders = this.detectHeaders(data);
    const headerRow = hasHeaders ? data[0] : null;
    const dataRows = hasHeaders ? data.slice(1) : data;
    
    const columns: DataColumn[] = [];
    const columnCount = Math.max(...data.map(row => row.length));

    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      const columnName = headerRow?.[colIndex]?.toString() || `Column ${colIndex + 1}`;
      const columnValues = dataRows.map(row => row[colIndex]).filter(val => val !== null && val !== undefined && val !== '');
      
      columns.push({
        name: columnName,
        type: this.detectColumnType(columnValues),
        samples: columnValues.slice(0, 5), // First 5 non-empty values as samples
        nullable: columnValues.length < dataRows.length,
        unique: new Set(columnValues).size === columnValues.length
      });
    }

    return {
      columns,
      rowCount: dataRows.length,
      hasHeaders
    };
  }

  /**
   * Detect if first row contains headers
   */
  private detectHeaders(data: any[][]): boolean {
    if (data.length < 2) return false;
    
    const firstRow = data[0];
    const secondRow = data[1];
    
    // Check if first row contains strings while second row contains numbers
    let firstRowStrings = 0;
    let secondRowNumbers = 0;
    
    for (let i = 0; i < Math.min(firstRow.length, secondRow.length); i++) {
      if (typeof firstRow[i] === 'string' && isNaN(Number(firstRow[i]))) {
        firstRowStrings++;
      }
      if (!isNaN(Number(secondRow[i]))) {
        secondRowNumbers++;
      }
    }
    
    return firstRowStrings > 0 && secondRowNumbers > 0;
  }

  /**
   * Detect column data type
   */
  private detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
    if (values.length === 0) return 'string';
    
    let numberCount = 0;
    let dateCount = 0;
    let booleanCount = 0;
    
    for (const value of values.slice(0, 10)) { // Check first 10 values
      const str = value?.toString().trim();
      if (!str) continue;
      
      // Check if it's a number
      if (!isNaN(Number(str)) && isFinite(Number(str))) {
        numberCount++;
        continue;
      }
      
      // Check if it's a boolean
      if (str.toLowerCase() === 'true' || str.toLowerCase() === 'false' || 
          str === '1' || str === '0' || str.toLowerCase() === 'yes' || str.toLowerCase() === 'no') {
        booleanCount++;
        continue;
      }
      
      // Check if it's a date
      const dateValue = new Date(str);
      if (!isNaN(dateValue.getTime()) && str.length > 6) { // Basic date validation
        dateCount++;
        continue;
      }
    }
    
    const sampleSize = Math.min(values.length, 10);
    
    if (numberCount / sampleSize > 0.7) return 'number';
    if (dateCount / sampleSize > 0.7) return 'date';
    if (booleanCount / sampleSize > 0.7) return 'boolean';
    
    return 'string';
  }
}
