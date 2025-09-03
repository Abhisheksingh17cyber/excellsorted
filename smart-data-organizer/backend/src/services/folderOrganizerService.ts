import JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';
import { GeneratedFile, GeneratedChart, ProcessingResult, FolderItem, ProcessingInstruction } from '../types';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class FolderOrganizerService {

  /**
   * Organize processing results into a structured folder and create download package
   */
  async organizeResults(
    jobId: string,
    files: GeneratedFile[],
    charts: GeneratedChart[],
    instructions: ProcessingInstruction[]
  ): Promise<ProcessingResult> {
    try {
      logger.info(`Organizing results for job ${jobId}`);

      // Create output directory structure
      const outputDir = path.join(process.cwd(), 'output', jobId);
      await this.createDirectoryStructure(outputDir);

      // Organize files into appropriate folders
      const organizedFiles = await this.organizeFiles(files, outputDir);
      const organizedCharts = await this.organizeCharts(charts, outputDir);

      // Create documentation
      await this.createDocumentation(outputDir, instructions, organizedFiles, organizedCharts);

      // Create folder structure info
      const folderStructure = await this.generateFolderStructure(outputDir);

      // Create ZIP package
      const zipPath = await this.createZipPackage(outputDir, jobId);

      // Generate summary
      const summary = this.generateSummary(organizedFiles, organizedCharts, instructions);

      const result: ProcessingResult = {
        files: organizedFiles,
        charts: organizedCharts,
        summary,
        downloadUrl: `/api/download/${jobId}`,
        folderStructure
      };

      logger.info(`Results organized successfully for job ${jobId}`);
      return result;

    } catch (error) {
      logger.error(`Error organizing results for job ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Create directory structure
   */
  private async createDirectoryStructure(outputDir: string): Promise<void> {
    const directories = [
      outputDir,
      path.join(outputDir, 'Excel_Files'),
      path.join(outputDir, 'Charts'),
      path.join(outputDir, 'Documentation'),
      path.join(outputDir, 'Raw_Data')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Organize Excel files into appropriate folders
   */
  private async organizeFiles(files: GeneratedFile[], outputDir: string): Promise<GeneratedFile[]> {
    const organizedFiles: GeneratedFile[] = [];

    for (const file of files) {
      try {
        let targetFolder = 'Excel_Files';
        
        // Determine target folder based on file type
        switch (file.type) {
          case 'excel':
            targetFolder = 'Excel_Files';
            break;
          case 'csv':
            targetFolder = 'Raw_Data';
            break;
          case 'pdf':
            targetFolder = 'Documentation';
            break;
          default:
            targetFolder = 'Other';
        }

        const targetDir = path.join(outputDir, targetFolder);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const targetPath = path.join(targetDir, file.name);
        
        // Copy file to target location
        if (fs.existsSync(file.path)) {
          fs.copyFileSync(file.path, targetPath);
          
          // Update file info
          const stats = fs.statSync(targetPath);
          organizedFiles.push({
            ...file,
            path: targetPath,
            size: stats.size
          });
        }

      } catch (error) {
        logger.error(`Error organizing file ${file.name}:`, error);
      }
    }

    return organizedFiles;
  }

  /**
   * Organize chart images into charts folder
   */
  private async organizeCharts(charts: GeneratedChart[], outputDir: string): Promise<GeneratedChart[]> {
    const organizedCharts: GeneratedChart[] = [];
    const chartsDir = path.join(outputDir, 'Charts');

    for (const chart of charts) {
      try {
        if (chart.imagePath && fs.existsSync(chart.imagePath)) {
          const fileName = `${chart.id}.png`;
          const targetPath = path.join(chartsDir, fileName);
          
          fs.copyFileSync(chart.imagePath, targetPath);
          
          organizedCharts.push({
            ...chart,
            imagePath: targetPath
          });
        } else {
          organizedCharts.push(chart);
        }
      } catch (error) {
        logger.error(`Error organizing chart ${chart.id}:`, error);
      }
    }

    return organizedCharts;
  }

  /**
   * Create documentation files
   */
  private async createDocumentation(
    outputDir: string,
    instructions: ProcessingInstruction[],
    files: GeneratedFile[],
    charts: GeneratedChart[]
  ): Promise<void> {
    const docsDir = path.join(outputDir, 'Documentation');

    // Create README file
    const readmeContent = this.generateReadmeContent(instructions, files, charts);
    fs.writeFileSync(path.join(docsDir, 'README.md'), readmeContent);

    // Create processing log
    const logContent = this.generateProcessingLog(instructions);
    fs.writeFileSync(path.join(docsDir, 'processing-log.txt'), logContent);

    // Create file manifest
    const manifestContent = this.generateFileManifest(files, charts);
    fs.writeFileSync(path.join(docsDir, 'file-manifest.json'), JSON.stringify(manifestContent, null, 2));
  }

  /**
   * Generate README content
   */
  private generateReadmeContent(
    instructions: ProcessingInstruction[],
    files: GeneratedFile[],
    charts: GeneratedChart[]
  ): string {
    const timestamp = new Date().toISOString();
    
    return `# Smart Data Organizer - Processing Results

Generated on: ${timestamp}

## Overview
This package contains the results of your data processing request. The data has been organized and analyzed according to your instructions.

## Folder Structure

### Excel_Files/
Contains the main Excel workbooks with your organized data:
${files.filter(f => f.type === 'excel').map(f => `- ${f.name}`).join('\n')}

### Charts/
Contains generated visualizations:
${charts.map(c => `- ${c.id}.png - ${c.title}`).join('\n')}

### Documentation/
Contains this README and other documentation files:
- README.md - This file
- processing-log.txt - Log of processing steps
- file-manifest.json - Complete file listing

### Raw_Data/
Contains any CSV exports or raw data files

## Processing Instructions Applied

${instructions.map((inst, index) => `${index + 1}. ${inst.description} (${inst.type})`).join('\n')}

## File Summary

- Total Files: ${files.length}
- Total Charts: ${charts.length}
- Excel Workbooks: ${files.filter(f => f.type === 'excel').length}
- CSV Files: ${files.filter(f => f.type === 'csv').length}

## How to Use

1. Open the Excel files in the Excel_Files folder for your organized data
2. View charts in the Charts folder for visual insights
3. Refer to the documentation for details about processing steps

For questions or support, please contact the Smart Data Organizer team.
`;
  }

  /**
   * Generate processing log
   */
  private generateProcessingLog(instructions: ProcessingInstruction[]): string {
    const timestamp = new Date().toISOString();
    
    let log = `Smart Data Organizer - Processing Log\n`;
    log += `Generated: ${timestamp}\n\n`;
    log += `Processing Instructions Executed:\n`;
    log += `=====================================\n\n`;

    instructions.forEach((instruction, index) => {
      log += `Step ${index + 1}: ${instruction.type.toUpperCase()}\n`;
      log += `Description: ${instruction.description}\n`;
      log += `Parameters: ${JSON.stringify(instruction.parameters, null, 2)}\n`;
      log += `Priority: ${instruction.priority}\n\n`;
    });

    log += `Processing completed successfully.\n`;
    
    return log;
  }

  /**
   * Generate file manifest
   */
  private generateFileManifest(files: GeneratedFile[], charts: GeneratedChart[]): any {
    return {
      generated: new Date().toISOString(),
      files: files.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        sheets: f.sheets || []
      })),
      charts: charts.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        hasImage: !!c.imagePath
      })),
      summary: {
        totalFiles: files.length,
        totalCharts: charts.length,
        totalSize: files.reduce((sum, f) => sum + f.size, 0)
      }
    };
  }

  /**
   * Generate folder structure
   */
  private async generateFolderStructure(outputDir: string): Promise<FolderItem[]> {
    const structure: FolderItem[] = [];

    const scanDirectory = (dirPath: string, relativePath: string = ''): FolderItem[] => {
      const items: FolderItem[] = [];
      
      try {
        const entries = fs.readdirSync(dirPath);
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry);
          const stats = fs.statSync(fullPath);
          const itemPath = relativePath ? path.join(relativePath, entry) : entry;
          
          if (stats.isDirectory()) {
            const folderItem: FolderItem = {
              name: entry,
              type: 'folder',
              path: itemPath,
              children: scanDirectory(fullPath, itemPath)
            };
            items.push(folderItem);
          } else {
            const fileItem: FolderItem = {
              name: entry,
              type: 'file',
              path: itemPath,
              size: stats.size
            };
            items.push(fileItem);
          }
        }
      } catch (error) {
        logger.error(`Error scanning directory ${dirPath}:`, error);
      }
      
      return items;
    };

    return scanDirectory(outputDir);
  }

  /**
   * Create ZIP package
   */
  private async createZipPackage(outputDir: string, jobId: string): Promise<string> {
    const zip = new JSZip();
    const zipPath = path.join(outputDir, `${jobId}.zip`);

    const addToZip = (dirPath: string, zipFolder: JSZip | null = null) => {
      const entries = fs.readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          const folder = zipFolder ? zipFolder.folder(entry) : zip.folder(entry);
          if (folder) {
            addToZip(fullPath, folder);
          }
        } else {
          const fileContent = fs.readFileSync(fullPath);
          if (zipFolder) {
            zipFolder.file(entry, fileContent);
          } else {
            zip.file(entry, fileContent);
          }
        }
      }
    };

    addToZip(outputDir);

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    fs.writeFileSync(zipPath, zipContent);

    logger.info(`Created ZIP package: ${zipPath}`);
    return zipPath;
  }

  /**
   * Generate summary
   */
  private generateSummary(
    files: GeneratedFile[],
    charts: GeneratedChart[],
    instructions: ProcessingInstruction[]
  ): string {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    return `Processing completed successfully! Generated ${files.length} files and ${charts.length} charts. ` +
           `Applied ${instructions.length} processing instructions. Total package size: ${sizeMB} MB. ` +
           `Files are organized into Excel workbooks, charts, and documentation.`;
  }
}
