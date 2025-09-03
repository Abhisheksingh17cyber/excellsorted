import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Upload, Analytics, Download, AutoAwesome } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Smart Data Organizer & Analyzer
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" mb={4}>
          Transform your raw data into organized, analyzed Excel files with natural language instructions
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          component={Link} 
          to="/upload"
          startIcon={<Upload />}
          sx={{ px: 4, py: 2 }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Upload color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload Files
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your CSV, Excel, or other data files easily
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AutoAwesome color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Natural Language
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tell us what you want in plain English
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Analytics color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Auto Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get charts, insights, and organized data automatically
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Download color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Download Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get your organized files and analysis reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Ready to organize your data?
        </Typography>
        <Typography variant="body1" mb={3}>
          Upload your files and let our AI-powered system do the work for you.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          component={Link} 
          to="/upload"
        >
          Start Now
        </Button>
      </Paper>
    </Container>
  );
};

export default HomePage;
