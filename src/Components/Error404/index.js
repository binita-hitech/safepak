import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, TextField, Container } from '@mui/material';

const Error404 = () => (
  <Container 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh', 
      animation: 'slideInUp 3s'
    }}
  >
    <Box 
      sx={{ 
        textAlign: 'center', 
        animation: 'zoomInDown 1s' 
      }}
    >
      <Typography variant="h2" sx={{ mb: 4 }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="h4" sx={{ mb: 4, animation: 'bounceIn 2s' }}>
        The page you are looking for might have been removed, had its name changed or is temporary unavailable.
      </Typography>
      <Box component="form" role="search" sx={{ mb: 4 }}>
        {/* <TextField
          placeholder="Search..."
          variant="outlined"
          fullWidth
          sx={{ animation: 'flipInX 2s' }}
        /> */}
      </Box>
      <Button 
        component={Link} 
        to="/" 
        variant="contained" 
        color="primary" 
        sx={{ animation: 'zoomIn 3s' }}
      >
        Go to Homepage
      </Button>
    </Box>
  </Container>
);

export default Error404;
