import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { CloudUpload, Home, Assessment } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <Assessment />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Data Organizer
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              fontWeight: isActive('/') ? 600 : 400,
              textDecoration: isActive('/') ? 'underline' : 'none',
            }}
          >
            Home
          </Button>
          
          <Button
            color="inherit"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/upload')}
            sx={{
              fontWeight: isActive('/upload') ? 600 : 400,
              textDecoration: isActive('/upload') ? 'underline' : 'none',
            }}
          >
            Upload Data
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
