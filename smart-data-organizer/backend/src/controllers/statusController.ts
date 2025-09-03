import { Router, Request, Response } from 'express';
import { setupLogger } from '../utils/logger';
import { StatusResponse } from '../types';

const logger = setupLogger();
const router = Router();

// Get processing status
router.get('/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      } as StatusResponse);
    }

    // TODO: Fetch actual status from database/cache
    // For now, return mock data
    const mockStatus = {
      jobId,
      status: 'processing' as const,
      progress: 65,
      message: 'Processing data transformations...',
      steps: [
        { name: 'File Analysis', status: 'completed', progress: 100 },
        { name: 'Data Cleaning', status: 'completed', progress: 100 },
        { name: 'Transformations', status: 'processing', progress: 65 },
        { name: 'Chart Generation', status: 'pending', progress: 0 },
        { name: 'File Organization', status: 'pending', progress: 0 }
      ]
    };

    logger.info(`Status requested for job ${jobId}`);

    return res.json({
      success: true,
      data: mockStatus
    } as StatusResponse);

  } catch (error) {
    logger.error('Status request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get processing status'
    } as StatusResponse);
  }
});

// Get all jobs status (for admin/debugging)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // TODO: Fetch from database
    const mockJobs = [
      {
        jobId: 'job-1',
        status: 'completed',
        progress: 100,
        createdAt: new Date(),
        completedAt: new Date()
      },
      {
        jobId: 'job-2',
        status: 'processing',
        progress: 45,
        createdAt: new Date(),
        completedAt: null
      }
    ];

    res.json({
      success: true,
      data: {
        jobs: mockJobs.slice(offset, offset + limit),
        total: mockJobs.length,
        limit,
        offset
      }
    });

  } catch (error) {
    logger.error('Jobs status request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get jobs status'
    });
  }
});

// Cancel processing job
router.delete('/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    // TODO: Cancel actual job in queue/database
    logger.info(`Cancellation requested for job ${jobId}`);

    return res.json({
      success: true,
      data: {
        jobId,
        status: 'cancelled',
        message: 'Job cancelled successfully'
      }
    });

  } catch (error) {
    logger.error('Job cancellation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel job'
    });
  }
});

export const statusRoutes = router;
