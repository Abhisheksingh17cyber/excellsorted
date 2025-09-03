import { ProcessingInstruction, ProcessingJob, ProcessingResult } from '../types';
import { setupLogger } from '../utils/logger';
import { ExcelGeneratorService } from './excelGeneratorService';
import { ChartGeneratorService } from './chartGeneratorService';
import { FolderOrganizerService } from './folderOrganizerService';

const logger = setupLogger();

export class DataProcessingService {
  private excelGenerator: ExcelGeneratorService;
  private chartGenerator: ChartGeneratorService;
  private folderOrganizer: FolderOrganizerService;

  constructor() {
    this.excelGenerator = new ExcelGeneratorService();
    this.chartGenerator = new ChartGeneratorService();
    this.folderOrganizer = new FolderOrganizerService();
  }

  /**
   * Estimate processing time based on instructions
   */
  estimateProcessingTime(instructions: ProcessingInstruction[]): number {
    let estimatedSeconds = 5; // Base time
    
    for (const instruction of instructions) {
      switch (instruction.type) {
        case 'sort':
          estimatedSeconds += 2;
          break;
        case 'filter':
          estimatedSeconds += 3;
          break;
        case 'group':
          estimatedSeconds += 5;
          break;
        case 'chart':
          estimatedSeconds += 8;
          break;
        case 'calculate':
          estimatedSeconds += 4;
          break;
        case 'format':
          estimatedSeconds += 3;
          break;
        case 'custom':
          estimatedSeconds += 10;
          break;
      }
    }
    
    return estimatedSeconds;
  }

  /**
   * Start processing data with given instructions
   */
  async startProcessing(
    processingJobId: string,
    uploadJobId: string,
    instructions: ProcessingInstruction[],
    options: Record<string, any> = {}
  ): Promise<ProcessingResult> {
    logger.info(`Starting data processing for job ${processingJobId}`);
    
    try {
      // Initialize job tracking
      this.updateJobStatus(processingJobId, 'processing', 0, 'Initializing...');

      // Step 1: Load and validate data
      this.updateJobStatus(processingJobId, 'processing', 10, 'Loading data...');
      const data = await this.loadJobData(uploadJobId);
      
      // Step 2: Execute instructions sequentially
      let processedData = data;
      let progress = 20;
      const progressStep = 60 / instructions.length;

      for (const instruction of instructions) {
        logger.info(`Executing instruction: ${instruction.type} - ${instruction.description}`);
        
        processedData = await this.executeInstruction(processedData, instruction);
        progress += progressStep;
        
        this.updateJobStatus(
          processingJobId, 
          'processing', 
          Math.round(progress), 
          `Executing: ${instruction.description}`
        );
      }

      // Step 3: Generate charts
      this.updateJobStatus(processingJobId, 'processing', 80, 'Generating charts...');
      const charts = await this.chartGenerator.generateCharts(processedData, instructions);

      // Step 4: Create Excel files
      this.updateJobStatus(processingJobId, 'processing', 90, 'Creating Excel files...');
      const excelFiles = await this.excelGenerator.generateExcelFiles(processedData, charts, options);

      // Step 5: Organize files and create download package
      this.updateJobStatus(processingJobId, 'processing', 95, 'Organizing files...');
      const result = await this.folderOrganizer.organizeResults(
        processingJobId,
        excelFiles,
        charts,
        instructions
      );

      // Complete
      this.updateJobStatus(processingJobId, 'completed', 100, 'Processing completed successfully');
      logger.info(`Data processing completed for job ${processingJobId}`);

      return result;

    } catch (error) {
      logger.error(`Data processing failed for job ${processingJobId}:`, error);
      this.updateJobStatus(processingJobId, 'failed', 0, `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Execute a single instruction on the data
   */
  private async executeInstruction(data: any[], instruction: ProcessingInstruction): Promise<any[]> {
    switch (instruction.type) {
      case 'sort':
        return this.executeSortInstruction(data, instruction);
      case 'filter':
        return this.executeFilterInstruction(data, instruction);
      case 'group':
        return this.executeGroupInstruction(data, instruction);
      case 'calculate':
        return this.executeCalculateInstruction(data, instruction);
      case 'format':
        return this.executeFormatInstruction(data, instruction);
      case 'chart':
        // Charts are handled separately in chart generation step
        return data;
      case 'custom':
        return this.executeCustomInstruction(data, instruction);
      default:
        logger.warn(`Unknown instruction type: ${instruction.type}`);
        return data;
    }
  }

  /**
   * Execute sort instruction
   */
  private executeSortInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    const { column, direction = 'asc' } = instruction.parameters;
    
    if (!column || data.length === 0) return data;
    
    // Find column index
    const headers = data[0];
    const columnIndex = headers.findIndex((header: string) => 
      header?.toLowerCase().includes(column.toLowerCase())
    );
    
    if (columnIndex === -1) {
      logger.warn(`Column '${column}' not found for sorting`);
      return data;
    }
    
    const [headerRow, ...dataRows] = data;
    
    const sortedRows = dataRows.sort((a, b) => {
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];
      
      // Handle different data types
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        // Numeric comparison
        return direction === 'desc' ? bNum - aNum : aNum - bNum;
      } else {
        // String comparison
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return direction === 'desc' ? -comparison : comparison;
      }
    });
    
    return [headerRow, ...sortedRows];
  }

  /**
   * Execute filter instruction
   */
  private executeFilterInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    const { column, operator, value } = instruction.parameters;
    
    if (!column || !operator || data.length === 0) return data;
    
    const [headerRow, ...dataRows] = data;
    const headers = headerRow;
    const columnIndex = headers.findIndex((header: string) => 
      header?.toLowerCase().includes(column.toLowerCase())
    );
    
    if (columnIndex === -1) {
      logger.warn(`Column '${column}' not found for filtering`);
      return data;
    }
    
    const filteredRows = dataRows.filter(row => {
      const cellValue = row[columnIndex];
      const cellNum = parseFloat(cellValue);
      const valueNum = parseFloat(value);
      
      switch (operator) {
        case 'gt':
          return !isNaN(cellNum) && !isNaN(valueNum) && cellNum > valueNum;
        case 'lt':
          return !isNaN(cellNum) && !isNaN(valueNum) && cellNum < valueNum;
        case 'eq':
          return String(cellValue).toLowerCase() === String(value).toLowerCase();
        default:
          return true;
      }
    });
    
    return [headerRow, ...filteredRows];
  }

  /**
   * Execute group instruction
   */
  private executeGroupInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    const { column } = instruction.parameters;
    
    if (!column || data.length === 0) return data;
    
    const [headerRow, ...dataRows] = data;
    const headers = headerRow;
    const columnIndex = headers.findIndex((header: string) => 
      header?.toLowerCase().includes(column.toLowerCase())
    );
    
    if (columnIndex === -1) {
      logger.warn(`Column '${column}' not found for grouping`);
      return data;
    }
    
    // Group by column value
    const groups = new Map<string, any[]>();
    
    dataRows.forEach(row => {
      const groupKey = String(row[columnIndex] || 'Unknown');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(row);
    });
    
    // Rebuild data with grouped sections
    const result = [headerRow];
    
    groups.forEach((groupRows, groupKey) => {
      // Add group header
      const groupHeader = new Array(headers.length).fill('');
      groupHeader[0] = `=== ${groupKey} ===`;
      result.push(groupHeader);
      
      // Add group data
      result.push(...groupRows);
      
      // Add empty row for separation
      result.push(new Array(headers.length).fill(''));
    });
    
    return result;
  }

  /**
   * Execute calculate instruction
   */
  private executeCalculateInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    const { operation, column } = instruction.parameters;
    
    if (!operation || data.length === 0) return data;
    
    const [headerRow, ...dataRows] = data;
    
    if (column) {
      // Calculate for specific column
      const headers = headerRow;
      const columnIndex = headers.findIndex((header: string) => 
        header?.toLowerCase().includes(column.toLowerCase())
      );
      
      if (columnIndex !== -1) {
        const values = dataRows
          .map(row => parseFloat(row[columnIndex]))
          .filter(val => !isNaN(val));
        
        let result: number;
        switch (operation) {
          case 'sum':
            result = values.reduce((sum, val) => sum + val, 0);
            break;
          case 'average':
            result = values.reduce((sum, val) => sum + val, 0) / values.length;
            break;
          case 'max':
            result = Math.max(...values);
            break;
          case 'min':
            result = Math.min(...values);
            break;
          case 'count':
            result = values.length;
            break;
          default:
            result = 0;
        }
        
        // Add calculation result as a new row
        const calculationRow = new Array(headers.length).fill('');
        calculationRow[columnIndex] = `${operation.toUpperCase()}: ${result}`;
        
        return [...data, [''], calculationRow];
      }
    }
    
    return data;
  }

  /**
   * Execute format instruction
   */
  private executeFormatInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    // Formatting will be handled in Excel generation
    // For now, just return the data unchanged
    return data;
  }

  /**
   * Execute custom instruction
   */
  private executeCustomInstruction(data: any[], instruction: ProcessingInstruction): any[] {
    logger.info(`Executing custom instruction: ${instruction.description}`);
    // For now, just return data unchanged
    // In the future, this could integrate with AI services for complex operations
    return data;
  }

  /**
   * Load job data from upload job ID
   */
  private async loadJobData(uploadJobId: string): Promise<any[]> {
    // TODO: Load actual data from storage
    // For now, return mock data
    return [
      ['Name', 'Age', 'City', 'Salary'],
      ['John Doe', 30, 'New York', 50000],
      ['Jane Smith', 25, 'Los Angeles', 60000],
      ['Bob Johnson', 35, 'Chicago', 55000]
    ];
  }

  /**
   * Update job status (would typically update database)
   */
  private updateJobStatus(jobId: string, status: string, progress: number, message: string): void {
    logger.info(`Job ${jobId} status update:`, { status, progress, message });
    // TODO: Update in database/cache
  }
}
