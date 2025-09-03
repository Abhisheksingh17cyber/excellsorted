import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { setupLogger } from '../utils/logger';
import { DataAnalysisService } from '../services/dataAnalysisService';
import { UploadResponse, UploadedFile, DataSchema } from '../types';

const logger = setupLogger();
const router = Router();
const dataAnalysisService = new DataAnalysisService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not supported`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files
  }
});

// Upload endpoint
router.post('/', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      } as UploadResponse);
    }

    const files = req.files as Express.Multer.File[];
    const jobId = uuidv4();

    logger.info(`File upload started for job ${jobId}`, {
      fileCount: files.length,
      files: files.map(f => ({ name: f.originalname, size: f.size, type: f.mimetype }))
    });

    // Convert multer files to our UploadedFile type
    const uploadedFiles: UploadedFile[] = files.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      destination: file.destination,
      filename: file.filename,
      path: file.path
    }));

    // Analyze uploaded files to extract schemas
    const schemas: DataSchema[] = [];
    for (const file of uploadedFiles) {
      try {
        const schema = await dataAnalysisService.analyzeFileSchema(file);
        schemas.push(schema);
      } catch (error) {
        logger.error(`Error analyzing file ${file.originalname}:`, error);
        schemas.push({
          columns: [],
          rowCount: 0,
          hasHeaders: false
        });
      }
    }

    // Store job information (in production, this would go to a database)
    const jobData = {
      id: jobId,
      files: uploadedFiles,
      schemas,
      createdAt: new Date()
    };

    // TODO: Store in database or cache
    logger.info(`File upload completed for job ${jobId}`);

    return res.json({
      success: true,
      data: {
        jobId,
        files: uploadedFiles,
        schemas
      }
    } as UploadResponse);

  } catch (error) {
    logger.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload files'
    } as UploadResponse);
  }
});

// Upload status endpoint
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // TODO: Fetch job status from database
    // For now, return a mock response
    res.json({
      success: true,
      data: {
        jobId,
        status: 'completed',
        filesCount: 1,
        totalSize: 1024
      }
    });

  } catch (error) {
    logger.error('Upload status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upload status'
    });
  }
});

// File preview endpoint
router.get('/preview/:jobId/:fileIndex', async (req: Request, res: Response) => {
  try {
    const { jobId, fileIndex } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // TODO: Fetch file data and return preview
    // For now, return a mock response
    res.json({
      success: true,
      data: {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['Sample', 'Data', '123'],
          ['More', 'Sample', '456']
        ],
        totalRows: 100,
        previewRows: limit
      }
    });

  } catch (error) {
    logger.error('File preview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get file preview'
    });
  }
});

export const uploadRoutes = router;
