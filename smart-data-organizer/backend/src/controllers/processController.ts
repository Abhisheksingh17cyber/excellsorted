import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { setupLogger } from '../utils/logger';
import { InstructionParserService } from '../services/instructionParserService';
import { DataProcessingService } from '../services/dataProcessingService';
import { ProcessResponse, ProcessingInstruction } from '../types';

const logger = setupLogger();
const router = Router();
const instructionParser = new InstructionParserService();
const dataProcessor = new DataProcessingService();

// Process data with instructions
router.post('/', async (req: Request, res: Response) => {
  try {
    const { jobId, instructions, options = {} } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      } as ProcessResponse);
    }

    if (!instructions || typeof instructions !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Instructions are required and must be a string'
      } as ProcessResponse);
    }

    logger.info(`Processing request for job ${jobId}`, {
      instructionsLength: instructions.length,
      options
    });

    // Parse natural language instructions
    const parsedInstructions: ProcessingInstruction[] = await instructionParser.parseInstructions(instructions);
    
    // Estimate processing time
    const estimatedTime = dataProcessor.estimateProcessingTime(parsedInstructions);

    // Start processing in background
    const processingJobId = uuidv4();
    dataProcessor.startProcessing(processingJobId, jobId, parsedInstructions, options)
      .catch((error: any) => {
        logger.error(`Background processing failed for job ${processingJobId}:`, error);
      });

    logger.info(`Processing started for job ${processingJobId}`);

    return res.json({
      success: true,
      data: {
        jobId: processingJobId,
        estimatedTime,
        instructions: parsedInstructions
      }
    } as ProcessResponse);

  } catch (error) {
    logger.error('Processing request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to start processing'
    } as ProcessResponse);
  }
});

// Get processing templates
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = [
      {
        id: 'business-analytics',
        name: 'Business Analytics',
        description: 'Organize sales data by region, create trend charts, and highlight top performers',
        instructions: 'Sort data by region and date. Create monthly sales trend charts. Highlight top 10 performers. Generate executive summary dashboard.',
        category: 'business',
        tags: ['sales', 'analytics', 'dashboard']
      },
      {
        id: 'inventory-management',
        name: 'Inventory Management',
        description: 'Group by category and supplier, add reorder alerts, create trend analysis',
        instructions: 'Group items by category and supplier. Calculate current stock levels. Add reorder point alerts for low stock. Create stock trend analysis charts.',
        category: 'operations',
        tags: ['inventory', 'alerts', 'trends']
      },
      {
        id: 'survey-analysis',
        name: 'Survey Analysis',
        description: 'Create demographic breakdown with statistical analysis',
        instructions: 'Group responses by demographics. Calculate response percentages and statistics. Create visualization charts. Generate correlation analysis.',
        category: 'research',
        tags: ['survey', 'statistics', 'demographics']
      },
      {
        id: 'financial-report',
        name: 'Financial Report',
        description: 'Organize financial data with period comparisons and ratios',
        instructions: 'Group by time periods. Calculate financial ratios. Create period-over-period comparisons. Generate summary charts and tables.',
        category: 'finance',
        tags: ['finance', 'ratios', 'comparison']
      }
    ];

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    logger.error('Templates request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get templates'
    });
  }
});

// Validate instructions
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { instructions } = req.body;

    if (!instructions || typeof instructions !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Instructions are required and must be a string'
      });
    }

    const parsedInstructions = await instructionParser.parseInstructions(instructions);
    const validation = instructionParser.validateInstructions(parsedInstructions);

    return res.json({
      success: true,
      data: {
        valid: validation.valid,
        instructions: parsedInstructions,
        issues: validation.issues,
        suggestions: validation.suggestions
      }
    });

  } catch (error) {
    logger.error('Instruction validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to validate instructions'
    });
  }
});

// Get instruction suggestions based on data
router.post('/suggest', async (req: Request, res: Response) => {
  try {
    const { jobId, dataSchema } = req.body;

    if (!jobId || !dataSchema) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and data schema are required'
      });
    }

    const suggestions = instructionParser.generateSuggestions(dataSchema);

    return res.json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    logger.error('Instruction suggestions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
});

export const processRoutes = router;
