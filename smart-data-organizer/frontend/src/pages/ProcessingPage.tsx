import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  TextField,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  PlayArrow, 
  AutoAwesome, 
  Description,
  TrendingUp 
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const ProcessingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadedFiles = location.state?.uploadedFiles || [];

  const steps = [
    'Analyzing Data',
    'Processing Instructions',
    'Generating Charts',
    'Creating Reports',
    'Finalizing Results'
  ];

  const suggestionTemplates = [
    'Sort data by sales amount and create a monthly trend chart',
    'Group customers by region and highlight top performers',
    'Calculate quarterly totals and create comparison charts',
    'Identify outliers and create data quality report',
    'Create pivot tables for category analysis'
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInstructions(suggestion);
  };

  const handleProcess = async () => {
    if (!instructions.trim()) {
      setError('Please provide processing instructions');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);

    try {
      // Simulate processing steps
      for (let step = 0; step < steps.length; step++) {
        setCurrentStep(step);
        for (let i = 0; i <= 100; i += 5) {
          setProgress((step * 100 + i) / steps.length);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // TODO: Implement actual processing API call
      console.log('Processing with instructions:', instructions);
      console.log('Files:', uploadedFiles);
      
      // Navigate to results page after successful processing
      navigate('/results', { 
        state: { 
          instructions,
          processedFiles: uploadedFiles 
        } 
      });
    } catch (err) {
      setError('Processing failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Data Processing & Analysis
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" mb={4}>
        Provide natural language instructions for how you want your data organized and analyzed.
      </Typography>

      {uploadedFiles.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {uploadedFiles.map((file: any, index: number) => (
              <Chip
                key={index}
                icon={<Description />}
                label={file.name}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Processing Instructions
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Describe what you want to do with your data in plain English..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          disabled={processing}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Quick Suggestions:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {suggestionTemplates.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={processing}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        {processing && (
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Typography variant="body2" color="text.secondary" mb={1}>
              Processing... {Math.round(progress)}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
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
            onClick={handleProcess}
            disabled={!instructions.trim() || processing}
            startIcon={processing ? <AutoAwesome /> : <PlayArrow />}
            sx={{ px: 4, py: 2 }}
          >
            {processing ? 'Processing...' : 'Start Processing'}
          </Button>
        </Box>
      </Paper>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              What can you do?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            • Sort and filter data by any criteria<br />
            • Create charts and visualizations<br />
            • Calculate totals, averages, and statistics<br />
            • Group data by categories or time periods<br />
            • Generate summary reports and insights<br />
            • Organize data into multiple sheets or files
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProcessingPage;
