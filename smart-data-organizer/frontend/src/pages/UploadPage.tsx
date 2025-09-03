import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import { 
  CloudUpload, 
  InsertDriveFile, 
  Delete,
  CheckCircle 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // TODO: Implement actual upload API call
      console.log('Uploading files:', files);
      
      // Navigate to processing page after successful upload
      navigate('/processing', { state: { uploadedFiles: files } });
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Upload Your Data Files
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" mb={4}>
        Upload CSV, Excel, or other data files to get started with organization and analysis.
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,.json,.txt"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Click to select files or drag and drop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: CSV, Excel (.xlsx, .xls), JSON, TXT
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <InsertDriveFile color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${formatFileSize(file.size)} • ${file.type || 'Unknown type'}`}
                />
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Uploading files... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          startIcon={uploading ? <CheckCircle /> : <CloudUpload />}
          sx={{ px: 4, py: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Box>
    </Container>
  );
};

export default UploadPage;
