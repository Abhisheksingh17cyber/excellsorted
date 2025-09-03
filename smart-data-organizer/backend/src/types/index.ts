export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

export interface ProcessingInstruction {
  id: string;
  type: 'sort' | 'filter' | 'group' | 'calculate' | 'chart' | 'format' | 'custom';
  description: string;
  parameters: Record<string, any>;
  priority: number;
}

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  samples: any[];
  nullable: boolean;
  unique: boolean;
}

export interface DataSchema {
  columns: DataColumn[];
  rowCount: number;
  hasHeaders: boolean;
}

export interface ProcessingJob {
  id: string;
  userId?: string;
  files: UploadedFile[];
  instructions: string;
  parsedInstructions: ProcessingInstruction[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: ProcessingResult;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessingResult {
  files: GeneratedFile[];
  charts: GeneratedChart[];
  summary: string;
  downloadUrl: string;
  folderStructure: FolderItem[];
}

export interface GeneratedFile {
  name: string;
  path: string;
  type: 'excel' | 'csv' | 'pdf' | 'image';
  size: number;
  sheets?: SheetInfo[];
}

export interface SheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
  charts: string[];
}

export interface GeneratedChart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'histogram' | 'heatmap';
  data: ChartData;
  options: ChartOptions;
  imagePath?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[] | {x: number, y: number}[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartOptions {
  responsive: boolean;
  plugins: {
    title: {
      display: boolean;
      text: string;
    };
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

export interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  size?: number;
  children?: FolderItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse extends ApiResponse {
  data: {
    jobId: string;
    files: UploadedFile[];
    schemas: DataSchema[];
  };
}

export interface ProcessResponse extends ApiResponse {
  data: {
    jobId: string;
    estimatedTime: number;
    instructions: ProcessingInstruction[];
  };
}

export interface StatusResponse extends ApiResponse {
  data: {
    jobId: string;
    status: ProcessingJob['status'];
    progress: number;
    message: string;
    result?: ProcessingResult;
  };
}

export interface DownloadResponse extends ApiResponse {
  data: {
    downloadUrl: string;
    filename: string;
    size: number;
    expiresAt: Date;
  };
}

export interface DownloadInfoResponse extends ApiResponse {
  data: {
    jobId: string;
    files: Array<{
      name: string;
      size: number;
      type: string;
      extension: string;
      modifiedAt: Date;
    }>;
    totalSize: number;
    fileCount: number;
    folderCount: number;
    downloadUrl: string;
    expiresAt: Date;
  };
}
