import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { setupLogger } from '../utils/logger';
import { DownloadResponse, DownloadInfoResponse } from '../types';

const logger = setupLogger();
const router = Router();

// Download processed results
router.get('/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { format = 'zip' } = req.query;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      } as DownloadResponse);
    }

    // TODO: Fetch job results from database
    const outputPath = path.join(__dirname, '../../output', jobId);
    
    if (!fs.existsSync(outputPath)) {
      return res.status(404).json({
        success: false,
        error: 'Download not available or job not completed'
      } as DownloadResponse);
    }

    logger.info(`Download requested for job ${jobId}, format: ${format}`);

    if (format === 'zip') {
      const zipPath = path.join(outputPath, `${jobId}.zip`);
      
      if (fs.existsSync(zipPath)) {
        const stats = fs.statSync(zipPath);
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${jobId}-results.zip"`);
        res.setHeader('Content-Length', stats.size);
        
        const fileStream = fs.createReadStream(zipPath);
        fileStream.pipe(res);
        
        fileStream.on('end', () => {
          logger.info(`Download completed for job ${jobId}`);
        });
        
        fileStream.on('error', (error) => {
          logger.error(`Download stream error for job ${jobId}:`, error);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: 'Download failed'
            });
          }
        });
        return; // End function after setting up stream
      } else {
        return res.status(404).json({
          success: false,
          error: 'ZIP file not found'
        } as DownloadResponse);
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported download format'
      } as DownloadResponse);
    }

  } catch (error) {
    logger.error('Download error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to download results'
    } as DownloadResponse);
  }
});

// Download individual file
router.get('/:jobId/file/:filename', async (req: Request, res: Response) => {
  try {
    const { jobId, filename } = req.params;

    if (!jobId || !filename) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and filename are required'
      });
    }

    const filePath = path.join(__dirname, '../../output', jobId, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Security check - ensure file is within the job directory
    const resolvedPath = path.resolve(filePath);
    const jobDir = path.resolve(path.join(__dirname, '../../output', jobId));
    
    if (!resolvedPath.startsWith(jobDir)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    logger.info(`Individual file download requested: ${filename} for job ${jobId}`);

    const stats = fs.statSync(filePath);
    const extension = path.extname(filename).toLowerCase();
    
    // Set appropriate content type
    let contentType = 'application/octet-stream';
    switch (extension) {
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case '.csv':
        contentType = 'text/csv';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      logger.info(`File download completed: ${filename} for job ${jobId}`);
    });

    fileStream.on('error', (error) => {
      logger.error(`File download error for ${filename}:`, error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'File download failed'
        });
      }
    });
    
    return; // End function after setting up stream

  } catch (error) {
    logger.error('Individual file download error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

// Get download information
router.get('/:jobId/info', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    const outputPath = path.join(__dirname, '../../output', jobId);
    
    if (!fs.existsSync(outputPath)) {
      return res.status(404).json({
        success: false,
        error: 'Job results not found'
      });
    }

    // Get directory contents
    const files = fs.readdirSync(outputPath).map(filename => {
      const filePath = path.join(outputPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        name: filename,
        size: stats.size,
        type: stats.isDirectory() ? 'directory' : 'file',
        extension: path.extname(filename),
        modifiedAt: stats.mtime
      };
    });

    const totalSize = files.reduce((sum, file) => sum + (file.type === 'file' ? file.size : 0), 0);

    return res.json({
      success: true,
      data: {
        jobId,
        files,
        totalSize,
        fileCount: files.filter(f => f.type === 'file').length,
        folderCount: files.filter(f => f.type === 'directory').length,
        downloadUrl: `/api/download/${jobId}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    } as DownloadInfoResponse);

  } catch (error) {
    logger.error('Download info error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get download information'
    });
  }
});

export const downloadRoutes = router;
