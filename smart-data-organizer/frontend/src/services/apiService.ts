// Mock API service for frontend-only deployment
export class ApiService {
  private static baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.smartdataorganizer.com' // Replace with your actual API URL
    : 'http://localhost:5000';

  static async uploadFiles(files: File[]): Promise<any> {
    // Mock implementation for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            jobId: 'demo-job-' + Date.now(),
            files: files.map(file => ({
              name: file.name,
              size: file.size,
              type: file.type
            })),
            schemas: files.map(() => ({
              columns: [
                { name: 'Date', type: 'date' },
                { name: 'Amount', type: 'number' },
                { name: 'Category', type: 'string' }
              ],
              rowCount: 100,
              hasHeaders: true
            }))
          }
        });
      }, 1500);
    });
  }

  static async processData(jobId: string, instructions: string): Promise<any> {
    // Mock implementation for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            jobId: 'processed-' + Date.now(),
            estimatedTime: 30,
            instructions: {
              id: 'inst-1',
              type: 'sort',
              description: instructions,
              parameters: {},
              priority: 1
            }
          }
        });
      }, 2000);
    });
  }

  static async getStatus(jobId: string): Promise<any> {
    // Mock implementation for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            jobId,
            status: 'completed',
            progress: 100,
            message: 'Processing completed successfully',
            steps: [
              { name: 'File Analysis', status: 'completed', progress: 100 },
              { name: 'Data Cleaning', status: 'completed', progress: 100 },
              { name: 'Transformations', status: 'completed', progress: 100 },
              { name: 'Chart Generation', status: 'completed', progress: 100 },
              { name: 'File Organization', status: 'completed', progress: 100 }
            ]
          }
        });
      }, 1000);
    });
  }

  static async downloadResults(jobId: string): Promise<any> {
    // Mock implementation for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            downloadUrl: `/api/download/${jobId}`,
            filename: `results-${jobId}.zip`,
            size: 2.4 * 1024 * 1024, // 2.4 MB
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });
      }, 500);
    });
  }
}

export default ApiService;
