import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { 
  Download, 
  InsertDriveFile, 
  Assessment,
  CheckCircle,
  Folder,
  TableChart,
  BarChart
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const instructions = location.state?.instructions || 'No instructions provided';
  // const processedFiles = location.state?.processedFiles || [];

  // Mock data for demonstration
  const results = {
    files: [
      { name: 'Organized_Sales_Data.xlsx', size: '2.4 MB', type: 'Excel Workbook' },
      { name: 'Sales_Summary_Report.pdf', size: '1.1 MB', type: 'PDF Report' },
      { name: 'Monthly_Trends_Chart.png', size: '245 KB', type: 'Chart Image' },
    ],
    charts: [
      { name: 'Monthly Sales Trend', type: 'Line Chart' },
      { name: 'Regional Performance', type: 'Bar Chart' },
      { name: 'Product Category Analysis', type: 'Pie Chart' },
    ],
    insights: [
      'Sales increased by 15% compared to last quarter',
      'North region shows highest performance with 35% of total sales',
      'Product category A has the highest profit margin at 45%',
      'December shows peak sales period',
    ]
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDownload = async (fileName: string) => {
    setDownloading(true);
    try {
      // TODO: Implement actual download API call
      console.log('Downloading:', fileName);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate download
      alert(`Downloaded: ${fileName}`);
    } catch (error) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      // TODO: Implement actual download all API call
      console.log('Downloading all files as ZIP...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('All files downloaded as ZIP archive!');
    } catch (error) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Processing Results
      </Typography>
      
      <Alert severity="success" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ mr: 1 }} />
          Your data has been successfully processed and organized!
        </Box>
      </Alert>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Processing Instructions Used:
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          "{instructions}"
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Generated Files" />
          <Tab label="Charts & Visualizations" />
          <Tab label="Insights & Analysis" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {results.files.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InsertDriveFile color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {file.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Size: {file.size}
                  </Typography>
                  <Chip 
                    label={file.type} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Download />}
                    onClick={() => handleDownload(file.name)}
                    disabled={downloading}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<Folder />}
            onClick={handleDownloadAll}
            disabled={downloading}
            sx={{ px: 4, py: 2 }}
          >
            {downloading ? 'Downloading...' : 'Download All as ZIP'}
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {results.charts.map((chart, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BarChart color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {chart.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={chart.type} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 2,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chart Preview
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Download />}
                    onClick={() => handleDownload(`${chart.name}.png`)}
                    disabled={downloading}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Assessment color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Key Insights & Analysis
              </Typography>
            </Box>
            <List>
              {results.insights.map((insight, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TableChart color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={insight} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>
    </Container>
  );
};

export default ResultsPage;
