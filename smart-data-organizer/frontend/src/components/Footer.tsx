import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid,
  IconButton 
} from '@mui/material';
import { 
  GitHub, 
  LinkedIn, 
  Email 
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Smart Data Organizer & Analyzer
            </Typography>
            <Typography variant="body2" color="inherit">
              Transform your raw data into organized, analyzed Excel files with natural language instructions.
              Powered by AI and built for efficiency.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="hover" display="block">
              Home
            </Link>
            <Link href="/upload" color="inherit" underline="hover" display="block">
              Upload
            </Link>
            <Link href="/processing" color="inherit" underline="hover" display="block">
              Processing
            </Link>
            <Link href="/results" color="inherit" underline="hover" display="block">
              Results
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Connect
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://github.com" target="_blank">
                <GitHub />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com" target="_blank">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" href="mailto:contact@smartdata.com">
                <Email />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} pt={2} borderTop={1} borderColor="rgba(255,255,255,0.12)">
          <Typography variant="body2" color="inherit" align="center">
            © 2025 Smart Data Organizer & Analyzer. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
