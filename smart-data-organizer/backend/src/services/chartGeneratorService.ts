import * as fs from 'fs';
import * as path from 'path';
import { GeneratedChart, ProcessingInstruction, ChartData, ChartDataset } from '../types';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class ChartGeneratorService {

  constructor() {
    // No canvas initialization needed
  }

  /**
   * Generate charts based on data and instructions
   */
  async generateCharts(data: any[], instructions: ProcessingInstruction[]): Promise<GeneratedChart[]> {
    try {
      logger.info('Generating charts from data');
      
      if (!data || data.length <= 1) {
        logger.warn('Insufficient data for chart generation');
        return [];
      }

      const charts: GeneratedChart[] = [];
      const chartInstructions = instructions.filter(i => i.type === 'chart');
      
      // If no specific chart instructions, generate default charts
      if (chartInstructions.length === 0) {
        const defaultCharts = await this.generateDefaultCharts(data);
        charts.push(...defaultCharts);
      } else {
        // Generate charts based on instructions
        for (const instruction of chartInstructions) {
          const chart = await this.generateChartFromInstruction(data, instruction);
          if (chart) {
            charts.push(chart);
          }
        }
      }

      // Save chart images
      await this.saveChartImages(charts);

      logger.info(`Generated ${charts.length} charts`);
      return charts;

    } catch (error) {
      logger.error('Error generating charts:', error);
      throw error;
    }
  }

  /**
   * Generate default charts based on data analysis
   */
  private async generateDefaultCharts(data: any[]): Promise<GeneratedChart[]> {
    const charts: GeneratedChart[] = [];
    const [headers, ...rows] = data;

    // Analyze data to determine best chart types
    const numericColumns = this.findNumericColumns(headers, rows);
    const categoricalColumns = this.findCategoricalColumns(headers, rows);

    // Generate bar chart for first categorical and numeric column combination
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      const barChart = await this.createBarChart(
        data,
        categoricalColumns[0],
        numericColumns[0],
        `${headers[numericColumns[0]]} by ${headers[categoricalColumns[0]]}`
      );
      if (barChart) charts.push(barChart);
    }

    // Generate pie chart for first categorical column
    if (categoricalColumns.length > 0) {
      const pieChart = await this.createPieChart(
        data,
        categoricalColumns[0],
        `Distribution of ${headers[categoricalColumns[0]]}`
      );
      if (pieChart) charts.push(pieChart);
    }

    // Generate line chart if there's a date column
    const dateColumns = this.findDateColumns(headers, rows);
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      const lineChart = await this.createLineChart(
        data,
        dateColumns[0],
        numericColumns[0],
        `${headers[numericColumns[0]]} Over Time`
      );
      if (lineChart) charts.push(lineChart);
    }

    return charts;
  }

  /**
   * Generate chart from specific instruction
   */
  private async generateChartFromInstruction(
    data: any[],
    instruction: ProcessingInstruction
  ): Promise<GeneratedChart | null> {
    const { type = 'bar', title, xColumn, yColumn } = instruction.parameters;
    const [headers] = data;

    // Find appropriate columns if not specified
    const xColIndex = xColumn ? headers.findIndex((h: string) => h.toLowerCase().includes(xColumn.toLowerCase())) : 0;
    const yColIndex = yColumn ? headers.findIndex((h: string) => h.toLowerCase().includes(yColumn.toLowerCase())) : 1;

    const chartTitle = title || `${headers[yColIndex]} by ${headers[xColIndex]}`;

    switch (type) {
      case 'bar':
        return this.createBarChart(data, xColIndex, yColIndex, chartTitle);
      case 'line':
        return this.createLineChart(data, xColIndex, yColIndex, chartTitle);
      case 'pie':
        return this.createPieChart(data, xColIndex, chartTitle);
      case 'scatter':
        return this.createScatterChart(data, xColIndex, yColIndex, chartTitle);
      default:
        logger.warn(`Unsupported chart type: ${type}`);
        return null;
    }
  }

  /**
   * Create bar chart
   */
  private async createBarChart(
    data: any[],
    xColumnIndex: number,
    yColumnIndex: number,
    title: string
  ): Promise<GeneratedChart | null> {
    try {
      const [headers, ...rows] = data;
      
      // Aggregate data
      const aggregated = this.aggregateData(rows, xColumnIndex, yColumnIndex);
      const labels = Object.keys(aggregated);
      const values = Object.values(aggregated);

      const chartData: ChartData = {
        labels,
        datasets: [{
          label: headers[yColumnIndex],
          data: values,
          backgroundColor: this.generateColors(labels.length),
          borderColor: this.generateColors(labels.length, 0.8),
          borderWidth: 2
        }]
      };

      const chart: GeneratedChart = {
        id: `bar-${Date.now()}`,
        title,
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: headers[xColumnIndex]
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: headers[yColumnIndex]
              }
            }
          }
        }
      };

      return chart;
    } catch (error) {
      logger.error('Error creating bar chart:', error);
      return null;
    }
  }

  /**
   * Create pie chart
   */
  private async createPieChart(
    data: any[],
    columnIndex: number,
    title: string
  ): Promise<GeneratedChart | null> {
    try {
      const [headers, ...rows] = data;
      
      // Count occurrences
      const counts: Record<string, number> = {};
      rows.forEach(row => {
        const value = String(row[columnIndex] || 'Unknown');
        counts[value] = (counts[value] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);

      const chartData: ChartData = {
        labels,
        datasets: [{
          label: 'Count',
          data: values,
          backgroundColor: this.generateColors(labels.length),
          borderWidth: 2
        }]
      };

      const chart: GeneratedChart = {
        id: `pie-${Date.now()}`,
        title,
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: true,
              position: 'right'
            }
          }
        }
      };

      return chart;
    } catch (error) {
      logger.error('Error creating pie chart:', error);
      return null;
    }
  }

  /**
   * Create line chart
   */
  private async createLineChart(
    data: any[],
    xColumnIndex: number,
    yColumnIndex: number,
    title: string
  ): Promise<GeneratedChart | null> {
    try {
      const [headers, ...rows] = data;
      
      // Sort by x column for line chart
      const sortedRows = [...rows].sort((a, b) => {
        const aVal = a[xColumnIndex];
        const bVal = b[xColumnIndex];
        
        // Try date comparison first
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return aDate.getTime() - bDate.getTime();
        }
        
        // Fallback to string comparison
        return String(aVal).localeCompare(String(bVal));
      });

      const labels = sortedRows.map(row => String(row[xColumnIndex]));
      const values = sortedRows.map(row => parseFloat(row[yColumnIndex]) || 0);

      const chartData: ChartData = {
        labels,
        datasets: [{
          label: headers[yColumnIndex],
          data: values,
          borderColor: '#366092',
          backgroundColor: 'rgba(54, 96, 146, 0.1)',
          borderWidth: 3
        }]
      };

      const chart: GeneratedChart = {
        id: `line-${Date.now()}`,
        title,
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: headers[xColumnIndex]
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: headers[yColumnIndex]
              }
            }
          }
        }
      };

      return chart;
    } catch (error) {
      logger.error('Error creating line chart:', error);
      return null;
    }
  }

  /**
   * Create scatter chart
   */
  private async createScatterChart(
    data: any[],
    xColumnIndex: number,
    yColumnIndex: number,
    title: string
  ): Promise<GeneratedChart | null> {
    try {
      const [headers, ...rows] = data;
      
      const scatterData = rows
        .map(row => ({
          x: parseFloat(row[xColumnIndex]) || 0,
          y: parseFloat(row[yColumnIndex]) || 0
        }))
        .filter(point => !isNaN(point.x) && !isNaN(point.y));

      const chartData: ChartData = {
        labels: [],
        datasets: [{
          label: `${headers[yColumnIndex]} vs ${headers[xColumnIndex]}`,
          data: scatterData,
          backgroundColor: 'rgba(54, 96, 146, 0.6)',
          borderColor: '#366092',
          borderWidth: 2
        }]
      };

      const chart: GeneratedChart = {
        id: `scatter-${Date.now()}`,
        title,
        type: 'scatter',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: headers[xColumnIndex]
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: headers[yColumnIndex]
              }
            }
          }
        }
      };

      return chart;
    } catch (error) {
      logger.error('Error creating scatter chart:', error);
      return null;
    }
  }

  /**
   * Save chart images to disk (generates chart configuration for frontend rendering)
   */
  private async saveChartImages(charts: GeneratedChart[]): Promise<void> {
    const outputDir = path.join(process.cwd(), 'output', 'charts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const chart of charts) {
      try {
        // Save chart configuration as JSON for frontend rendering
        const configPath = path.join(outputDir, `${chart.id}.json`);
        const chartConfig = {
          type: chart.type,
          data: chart.data,
          options: chart.options
        };
        
        fs.writeFileSync(configPath, JSON.stringify(chartConfig, null, 2));
        chart.imagePath = configPath;

        logger.info(`Saved chart configuration: ${chart.id}.json`);
      } catch (error) {
        logger.error(`Error saving chart configuration for ${chart.id}:`, error);
      }
    }
  }

  /**
   * Helper methods
   */
  private findNumericColumns(headers: string[], rows: any[]): number[] {
    return headers
      .map((_, index) => index)
      .filter(index => {
        const values = rows.slice(0, 10).map(row => row[index]); // Check first 10 rows
        const numericCount = values.filter(val => !isNaN(parseFloat(val))).length;
        return numericCount / values.length > 0.7;
      });
  }

  private findCategoricalColumns(headers: string[], rows: any[]): number[] {
    return headers
      .map((_, index) => index)
      .filter(index => {
        const values = rows.map(row => row[index]);
        const uniqueValues = new Set(values).size;
        return uniqueValues < values.length * 0.5 && uniqueValues < 20; // Less than 50% unique and max 20 categories
      });
  }

  private findDateColumns(headers: string[], rows: any[]): number[] {
    return headers
      .map((_, index) => index)
      .filter(index => {
        const values = rows.slice(0, 10).map(row => row[index]);
        const dateCount = values.filter(val => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && String(val).length > 6;
        }).length;
        return dateCount / values.length > 0.7;
      });
  }

  private aggregateData(rows: any[], xIndex: number, yIndex: number): Record<string, number> {
    const aggregated: Record<string, number> = {};
    
    rows.forEach(row => {
      const xVal = String(row[xIndex] || 'Unknown');
      const yVal = parseFloat(row[yIndex]) || 0;
      
      if (aggregated[xVal]) {
        aggregated[xVal] += yVal;
      } else {
        aggregated[xVal] = yVal;
      }
    });
    
    return aggregated;
  }

  private generateColors(count: number, alpha: number = 0.8): string[] {
    const colors = [
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
      `rgba(199, 199, 199, ${alpha})`,
      `rgba(83, 102, 255, ${alpha})`
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    
    return result;
  }
}
