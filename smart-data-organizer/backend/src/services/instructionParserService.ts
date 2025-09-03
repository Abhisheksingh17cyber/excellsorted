import { ProcessingInstruction, DataSchema } from '../types';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class InstructionParserService {

  /**
   * Parse natural language instructions into structured commands
   */
  async parseInstructions(instructions: string): Promise<ProcessingInstruction[]> {
    try {
      logger.info('Parsing instructions:', { length: instructions.length });
      
      const parsedInstructions: ProcessingInstruction[] = [];
      const sentences = this.splitIntoSentences(instructions);
      
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (!sentence) continue;
        
        const instruction = this.parseSentence(sentence, i);
        if (instruction) {
          parsedInstructions.push(instruction);
        }
      }
      
      // If no specific instructions found, create default ones
      if (parsedInstructions.length === 0) {
        parsedInstructions.push({
          id: 'default-organize',
          type: 'format',
          description: 'Organize and format data professionally',
          parameters: { autoFormat: true },
          priority: 1
        });
      }
      
      return this.optimizeInstructions(parsedInstructions);
    } catch (error) {
      logger.error('Error parsing instructions:', error);
      throw error;
    }
  }

  /**
   * Validate parsed instructions
   */
  validateInstructions(instructions: ProcessingInstruction[]): {
    valid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check for conflicting instructions
    const sortInstructions = instructions.filter(i => i.type === 'sort');
    if (sortInstructions.length > 1) {
      issues.push('Multiple sorting instructions found. Only the last one will be applied.');
      suggestions.push('Combine sorting criteria into a single instruction.');
    }
    
    // Check for complex operations
    const complexTypes = ['calculate', 'custom'];
    const hasComplexOps = instructions.some(i => complexTypes.includes(i.type));
    if (hasComplexOps) {
      suggestions.push('Complex operations detected. Processing may take longer than usual.');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Generate instruction suggestions based on data schema
   */
  generateSuggestions(dataSchema: DataSchema): string[] {
    const suggestions: string[] = [];
    const { columns, rowCount } = dataSchema;
    
    // Suggest sorting based on column types
    const dateColumns = columns.filter(c => c.type === 'date');
    const numberColumns = columns.filter(c => c.type === 'number');
    
    if (dateColumns.length > 0) {
      suggestions.push(`Sort by ${dateColumns[0].name} to show chronological order`);
    }
    
    if (numberColumns.length > 0) {
      suggestions.push(`Create charts for ${numberColumns.slice(0, 2).map(c => c.name).join(' and ')}`);
    }
    
    // Suggest grouping for categorical data
    const stringColumns = columns.filter(c => c.type === 'string' && !c.unique);
    if (stringColumns.length > 0) {
      suggestions.push(`Group data by ${stringColumns[0].name} for better organization`);
    }
    
    // Suggest aggregations for large datasets
    if (rowCount > 1000) {
      suggestions.push('Create summary statistics and aggregations for large dataset');
    }
    
    return suggestions;
  }

  /**
   * Split instructions into sentences
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  /**
   * Parse individual sentence into instruction
   */
  private parseSentence(sentence: string, index: number): ProcessingInstruction | null {
    const lower = sentence.toLowerCase();
    const id = `instruction-${index + 1}`;
    
    // Sort instructions
    if (lower.includes('sort') || lower.includes('order')) {
      return {
        id,
        type: 'sort',
        description: sentence,
        parameters: this.extractSortParameters(sentence),
        priority: 1
      };
    }
    
    // Filter instructions
    if (lower.includes('filter') || lower.includes('where') || lower.includes('only show')) {
      return {
        id,
        type: 'filter',
        description: sentence,
        parameters: this.extractFilterParameters(sentence),
        priority: 2
      };
    }
    
    // Group instructions
    if (lower.includes('group') || lower.includes('organize by') || lower.includes('categorize')) {
      return {
        id,
        type: 'group',
        description: sentence,
        parameters: this.extractGroupParameters(sentence),
        priority: 3
      };
    }
    
    // Chart instructions
    if (lower.includes('chart') || lower.includes('graph') || lower.includes('visualiz')) {
      return {
        id,
        type: 'chart',
        description: sentence,
        parameters: this.extractChartParameters(sentence),
        priority: 4
      };
    }
    
    // Calculate instructions
    if (lower.includes('calculat') || lower.includes('sum') || lower.includes('average') || lower.includes('total')) {
      return {
        id,
        type: 'calculate',
        description: sentence,
        parameters: this.extractCalculateParameters(sentence),
        priority: 5
      };
    }
    
    // Format instructions
    if (lower.includes('format') || lower.includes('highlight') || lower.includes('color')) {
      return {
        id,
        type: 'format',
        description: sentence,
        parameters: this.extractFormatParameters(sentence),
        priority: 6
      };
    }
    
    // Default to custom instruction
    return {
      id,
      type: 'custom',
      description: sentence,
      parameters: { text: sentence },
      priority: 10
    };
  }

  private extractSortParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lower = sentence.toLowerCase();
    
    // Extract sort direction
    if (lower.includes('descending') || lower.includes('desc') || lower.includes('highest') || lower.includes('largest')) {
      params.direction = 'desc';
    } else {
      params.direction = 'asc';
    }
    
    // Extract column names (simple extraction)
    const byMatch = sentence.match(/by\s+(\w+)/i);
    if (byMatch) {
      params.column = byMatch[1];
    }
    
    return params;
  }

  private extractFilterParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lower = sentence.toLowerCase();
    
    // Extract simple filter conditions
    if (lower.includes('greater than') || lower.includes('>')) {
      params.operator = 'gt';
    } else if (lower.includes('less than') || lower.includes('<')) {
      params.operator = 'lt';
    } else if (lower.includes('equals') || lower.includes('=')) {
      params.operator = 'eq';
    }
    
    return params;
  }

  private extractGroupParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract grouping column
    const byMatch = sentence.match(/by\s+(\w+)/i);
    if (byMatch) {
      params.column = byMatch[1];
    }
    
    return params;
  }

  private extractChartParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lower = sentence.toLowerCase();
    
    // Detect chart type
    if (lower.includes('bar') || lower.includes('column')) {
      params.type = 'bar';
    } else if (lower.includes('line') || lower.includes('trend')) {
      params.type = 'line';
    } else if (lower.includes('pie') || lower.includes('donut')) {
      params.type = 'pie';
    } else if (lower.includes('scatter') || lower.includes('plot')) {
      params.type = 'scatter';
    } else {
      params.type = 'bar'; // default
    }
    
    return params;
  }

  private extractCalculateParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lower = sentence.toLowerCase();
    
    // Detect calculation type
    if (lower.includes('sum') || lower.includes('total')) {
      params.operation = 'sum';
    } else if (lower.includes('average') || lower.includes('mean')) {
      params.operation = 'average';
    } else if (lower.includes('count')) {
      params.operation = 'count';
    } else if (lower.includes('max') || lower.includes('maximum')) {
      params.operation = 'max';
    } else if (lower.includes('min') || lower.includes('minimum')) {
      params.operation = 'min';
    }
    
    return params;
  }

  private extractFormatParameters(sentence: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lower = sentence.toLowerCase();
    
    // Detect formatting type
    if (lower.includes('highlight')) {
      params.type = 'highlight';
    } else if (lower.includes('color')) {
      params.type = 'color';
    } else if (lower.includes('bold')) {
      params.type = 'bold';
    }
    
    return params;
  }

  /**
   * Optimize instructions by removing duplicates and ordering by priority
   */
  private optimizeInstructions(instructions: ProcessingInstruction[]): ProcessingInstruction[] {
    // Remove duplicates based on type and similar parameters
    const unique = instructions.filter((instruction, index, array) => {
      return index === array.findIndex(i => 
        i.type === instruction.type && 
        JSON.stringify(i.parameters) === JSON.stringify(instruction.parameters)
      );
    });
    
    // Sort by priority
    return unique.sort((a, b) => a.priority - b.priority);
  }
}
